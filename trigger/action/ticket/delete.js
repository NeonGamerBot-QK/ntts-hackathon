const { ButtonStyle } = require('discord.js')
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, channelLink } = require('@discordjs/builders')

const { closeCategory } = require('../../../config.json')
const { create } = require('discord-timestamps')
const f = require('../../../function/ticketclose.js')

module.exports = {
    customId: 'ticket-delete',
    async execute(interaction, client) {

        let time = await create(10, 'Relative')
        await interaction.reply(`## This ticket will be close in ${time}`)

        setTimeout(() => {
            interaction.channel.delete();
        }, 10000);
        
    }
};