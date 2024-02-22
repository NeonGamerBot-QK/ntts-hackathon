const { Webhook } = require('discord.js');
const { EmbedBuilder } = require('@discordjs/builders')
const { TicketLogChannel } = require('../config.json')

module.exports = {
    async log(type ,info, interaction){
        const channel = interaction.guild.channels.cache.get(TicketLogChannel);

        switch (type){
            case "open":
                info.then(jsoninfo => {

                    console.log(jsoninfo)

                    const openembed = new EmbedBuilder()
                        .setTitle('Ticket Opened')
                        .setDescription(`Ticket has been opened by <@${jsoninfo.user.id}> in \`${jsoninfo.main.type}\` category`)
                        .addFields(
                            { name: 'request', value: jsoninfo.main.request, inline: true },
                            { name: 'time', value: `<t:${jsoninfo.main.time}:R>`, inline: true },
                            { name: 'channel', value: `<#${jsoninfo.main.channel}>` }
                        )
                        .setColor(0x6eaadc);

                    channel.send({ embeds: [openembed] });
                });break;
        }

    }
}