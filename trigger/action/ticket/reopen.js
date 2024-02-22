const { ButtonStyle, PermissionsBitField } = require('discord.js')
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, channelLink } = require('@discordjs/builders')
const { QuickDB } = require('quick.db')

const { ReopenPing, clientId } = require('../../../config.json')
const db = new QuickDB({ filePath: 'database.sqlite' });

module.exports = {
    customId: '@ticket-reopen',
    async execute(interaction, client, reasone) {

        const topic = await interaction.channel.topic;
        const ticketowner = await interaction.guild.members.fetch(topic)

        const userticket = await db.get(`ticket.${ticketowner.id}.ticket`)
        const index = userticket.findIndex(user => user.channel === interaction.channel.id);
        const ticketindex = await db.get(`ticket.${ticketowner.id}.ticket[${index}]`)

        if (ticketindex.status) return await interaction.reply({ content: '## Ticket already open!', ephemeral: true });

        await interaction.reply({ content: '## Ticket reopen!', ephemeral: true });
        await interaction.channel.setParent(ticketindex.category);

        const embed = new EmbedBuilder()
            .setColor(0x6eaadc)
            .setTitle('Ticket Reopen!')
            .setDescription(`Hey your ticket has been reopened`)
            .setTimestamp();

        if (ReopenPing) {
            const userembed = new EmbedBuilder()
                .setColor(0x6eaadc)
                .setTitle('Ticket Reopen!')
                .setDescription(`Hey your ticket has been reopened in below\n${interaction.channel}`)
                .addFields({ name: 'Here is the reason', value: `\`${reasone}\`` })
                .setTimestamp();
            ticketowner.send({ embeds: [userembed] });
        }

        await interaction.channel.messages.fetch(interaction.message.id).then(msg => {
            msg.delete();
            interaction.channel.messages.fetch({ before: msg.id, limit: 1 }).then(msg => {
                msg.first().edit({ embeds: [embed] });
            })
        })

        await interaction.channel.permissionOverwrites.set([
            { id: ticketowner.id, allow: PermissionsBitField.Flags.SendMessages },
            { id: ticketowner.id, allow: PermissionsBitField.Flags.ViewChannel },
        ])

        db.set(`ticket.${ticketowner.id}.ticket[${index}].status`, true)
    }
};