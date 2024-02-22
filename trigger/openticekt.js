const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require('@discordjs/builders');
const { TicketCategory, TicketChannel, TicketChannelMsgId, clientId } = require('../config.json');
const { OpenTicketBoard } = require('../lang.json')
const { editdata, check } = require('../function/check.js')
module.exports = {
    name: 'ready',
    async execute(interaction, client) {

        const channel = interaction.channels.cache.get(TicketChannel);

        const embed = new EmbedBuilder()
            .setColor(0x67c773)
            .setTitle(OpenTicketBoard.title)
            .setDescription(OpenTicketBoard.description)
            .setFooter({ text: OpenTicketBoard.footer });
        
        if(OpenTicketBoard.timestamps){
            embed.setTimestamp()
        }

        const row = new ActionRowBuilder()
        for(let i = 0; i < TicketCategory.length; i++){

            const button = new ButtonBuilder()
            .setCustomId(`@ticket-${i}`)
            .setLabel(TicketCategory[i].btnName) 
            .setEmoji({ name:`${TicketCategory[i].btnEmoji}` })
            .setStyle('Success');

            row.addComponents(button);
        }
        
        await check(client);
        const msg = await channel.messages.fetch();
        const msg_ = msg.find(m => m.id == TicketChannelMsgId);
        if(!TicketChannelMsgId || !msg_ || msg_.author.id != clientId){
            const message = await channel.send({ embeds: [embed], components: [row] });
            message.react('🔒');
            return editdata('TicketChannelMsgId', message.id)
        }else{
            const editmsg = await channel.messages.fetch(TicketChannelMsgId);
            editmsg.edit({ embeds: [embed], components: [row] });
        }
        
    }
}
