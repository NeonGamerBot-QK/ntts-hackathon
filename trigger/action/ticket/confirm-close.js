const { ButtonStyle, permissionOverwrites } = require('discord.js')
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, channelLink } = require('@discordjs/builders')
const { create } = require('discord-timestamps')
const { QuickDB } = require('quick.db')

const { CloseCategory, CreateTranscript, AutoDeleteTicket } = require('../../../config.json')
const { transcript } = require('../../../function/ticketclose.js')
const db = new QuickDB({ filePath: 'database.sqlite' });

module.exports = {
    customId: 'ticket-confirm-close',
    async execute(interaction, client) {

        const disabledButton = new ButtonBuilder()
            .setCustomId('disabled_button')
            .setLabel('Ticket Close')
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(true);

        const row = new ActionRowBuilder()
            .addComponents(disabledButton)

        await interaction.update({ components: [row] });

        const topic = await interaction.channel.topic;
        const ticketowner = await interaction.guild.members.fetch(topic)

        const userrow = new ActionRowBuilder()

        const userembed = new EmbedBuilder()
            .setColor(0x6eaadc)
            .setTitle('Ticket Close!')
            .setDescription(`Your ticket has been closed in ${interaction.guild.name}`)
            .setTimestamp();

        if (CreateTranscript) {
            try {
                await transcript(interaction).then(responseBody => {
                    const view = new ButtonBuilder()
                        .setStyle(ButtonStyle.Link)
                        .setLabel('View Transcript')
                        .setURL(responseBody.link.normallink)
                        .setEmoji({ name: '📜' })
                    const download = new ButtonBuilder()
                        .setStyle(ButtonStyle.Link)
                        .setLabel('Download Transcript')
                        .setURL(responseBody.link.downloadlink)
                        .setEmoji({ name: '📥' });
                    userrow.addComponents(view, download)
                    ticketowner.send({ embeds: [userembed], components: [userrow] });
                })
            } catch (error) {
                console.error('Error:', error);
                // 处理可能出现的错误
            }
        } else {
            ticketowner.send({ embeds: [userembed] });
        }

        const targetCategory = interaction.guild.channels.cache.get(CloseCategory);
        await interaction.channel.setParent(targetCategory);

        const ticketopen = await db.get(`ticket.${ticketowner.id}.ticketopen`);
        if (!ticketopen) {
            await db.set(`ticket.${ticketowner.id}.ticketopen`, 0)
        } else {
            await db.sub(`ticket.${ticketowner.id}.ticketopen`, 1);
        }

        const userticket = await db.get(`ticket.${ticketowner.id}.ticket`)
        const index = userticket.findIndex(user => user.channel === interaction.channel.id);
        await db.set(`ticket.${ticketowner.id}.ticket[${index}].status`, false)        

        const reopenbtn = new ButtonBuilder()
            .setCustomId('@ticket-reopen')
            .setStyle(ButtonStyle.Primary)
            .setLabel('Reopen Ticket')

        const row2 = new ActionRowBuilder()
            .addComponents(reopenbtn)

        if (AutoDeleteTicket) {
            let time = await create(10, 'Relative')
            await interaction.channel.send(`##This ticket will be close in ${time}\nIf this is a mistake, please click the button below to reopen the ticket.`, { components: [row2] })
            return setTimeout(() => {
                interaction.channel.delete();
            }, 10000);
        }

        const embed = new EmbedBuilder()
            .setTitle('Ticket Close')
            .setDescription('This ticket is close, click Button below to delete this ticket')
            .setTimestamp()

        const deletebtn = new ButtonBuilder()
            .setCustomId('ticket-delete')
            .setStyle(ButtonStyle.Danger)
            .setLabel('Delete Ticket')

        row2.setComponents(deletebtn, reopenbtn)

        interaction.channel.send({ embeds: [embed], components: [row2] })

    }
}