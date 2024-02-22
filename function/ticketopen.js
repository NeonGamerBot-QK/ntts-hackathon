const { PermissionsBitField, ChannelType, ButtonStyle, TextInputStyle } = require('discord.js')
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ModalBuilder, TextInputBuilder } = require('@discordjs/builders')
const { QuickDB } = require('quick.db');

const db = new QuickDB({ filePath: 'database.sqlite' });
const { loginfo } = require('./ticketuser.js')
const { TicketAdmin, TicketCategory } = require('../config.json')
const { TicketCreate } = require('../lang.json')


function isNumeric(str) {
    if (typeof str != "string") return false
    return !isNaN(str) && !isNaN(parseFloat(str));
}

async function OpenMsgSend(type, channel, inter, request) {
    const embed = new EmbedBuilder()
        .setColor(0xffd966)
        .setTitle(TicketCategory[type].category)
        .setDescription(TicketCategory[type].openTicketDescription.description)

    if (request) {
        embed.addFields({ name: 'Request', value: `\`${request}\`` })
    }

    const closebtn = new ButtonBuilder()
        .setCustomId('ticket-close')
        .setLabel('Close')
        .setStyle(ButtonStyle.Danger)

    const row = new ActionRowBuilder()
        .addComponents(closebtn)

    const ping = TicketCategory[type].openTicketDescription.pingadmin == true ? `${inter.user}<@&${TicketAdmin}>` : `${inter.user}`;
    await channel.send({ content: ping, embeds: [embed], components: [row] })
}

function openmodal(interaction, value) {
    const ticketcategory = TicketCategory[value];
    const modal = new ModalBuilder()
        .setTitle(ticketcategory.openTicketDescription.modal.title)
        .setCustomId(`@ticket-modal_${value}`);

    const code = new TextInputBuilder()
        .setCustomId('input')
        .setRequired(true)
        .setLabel("Please provide your some information")
        .setPlaceholder(ticketcategory.openTicketDescription.modal.placeholder)
        .setStyle(TextInputStyle.Short)
        .setMaxLength(100)
        .setMinLength(10)

    const actionone = new ActionRowBuilder().addComponents(code)
    modal.addComponents(actionone)
    interaction.showModal(modal)

}

async function openticket(Categorytype, interaction, client, request) {

    const ticketcategory = TicketCategory[Categorytype];
    const category = interaction.guild.channels.cache.get(ticketcategory.categoryId);
    if (!category) return interaction.reply({ content: "Category not found", ephemeral: true });

    const channel = await interaction.guild.channels.create({
        name: `${interaction.user.tag}-${ticketcategory.category}`,
        type: ChannelType.GuildText,
        parent: ticketcategory.categoryId,
        topic: interaction.user.id,
        permissionOverwrites: [
            {
                id: interaction.guild.id,
                deny: [PermissionsBitField.Flags.ViewChannel],
            },
            {
                id: interaction.user.id,
                allow: [PermissionsBitField.Flags.ViewChannel],
            },
            {
                id: TicketAdmin,
                allow: [PermissionsBitField.Flags.ManageChannels],
            },
        ],
    });
    if(!request){
        request = "No request provided"
    }

    const time_ = Math.floor(Date.now() / 1000).toString();
    console.log(time_);

    const json = {
        channel: channel.id,
        category: channel.parentId,
        type: TicketCategory[Categorytype].category,
        request: request,
        time: time_,
        status: true,
        user:[]
    }

    const userid = interaction.user.id;
    await db.init()
    await db.add(`ticket.${userid}.ticketopen`, 1)
    await db.push(`ticket.${userid}.ticket`, json)

    client.log("open", loginfo(interaction, json), interaction)

    const embed = new EmbedBuilder()
        .setTitle(TicketCreate.title)
        .setDescription(TicketCreate.description.replace('{channel}', channel));

    interaction.reply({ embeds: [embed], ephemeral: true })

    OpenMsgSend(Categorytype, channel, interaction, request)

}

function ticketreopen(interaction){
    const modal = new ModalBuilder()
        .setTitle('Reopen Ticket')
        .setCustomId('@ticket-reopenModal');
    
    const code = new TextInputBuilder()
        .setCustomId('input')
        .setRequired(true)
        .setLabel("Reason for reopening the ticket")
        .setPlaceholder('I forgot to ask something!')
        .setStyle(TextInputStyle.Short)
        .setMaxLength(250)
    
    const actionone = new ActionRowBuilder().addComponents(code)
    modal.addComponents(actionone)
    interaction.showModal(modal)
}


module.exports = {
    openticket,
    openmodal,
    ticketreopen,
    isNumeric
}