const { PermissionsBitField, ChannelType, ButtonStyle, TextInputStyle } = require('discord.js')
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ModalBuilder, TextInputBuilder } = require('@discordjs/builders')
const { QuickDB } = require('quick.db')
const db = new QuickDB({ filePath: 'database.sqlite' });

async function removeuser(interaction, user) {

    const ticketowner = await interaction.guild.members.fetch(user)
    const userticket = await db.get(`ticket.${ticketowner.id}.ticket`)
    const index = userticket.findIndex(user => user.channel === interaction.channel.id);

    const vaule = interaction.values[0]
    const option = await interaction.guild.members.fetch(vaule)
    
    await db.pull(`ticket.${ticketowner.id}.ticket[${index}].user`, vaule)

    await interaction.channel.permissionOverwrites.set([
        { id: vaule, deny: PermissionsBitField.Flags.ViewChannel },
    ])

    const embed = new EmbedBuilder()
        .setTitle('User Removed')
        .setDescription(`${option} has been removed from the ticket!`)
        .setColor(0x6eaadc);

    await interaction.reply({ embeds: [embed], ephemeral: true });
}

async function loginfo(interaction, json){
    const responce = {
        user: {
            id: interaction.user.id,
            tag: interaction.user.tag
        },
        guild: interaction.guild.name,
        main: json
    }

    return responce
}


module.exports = { 
    removeuser,
    loginfo
}