const {SlashCommandBuilder, EmbedBuilder} = require('discord.js')
module.exports = {
	data: new SlashCommandBuilder ()
		.setName('ping')
		.setDescription('Replies with Pong!'),
	async execute(interaction) {
		const embed = new EmbedBuilder()
            .setTitle('Pinging...')
            .setColor('Blue')
            
        const sent = await interaction.reply({ embeds: [embed], fetchReply: true });

        const embed2 = new EmbedBuilder()
            .setTitle(`Roundtrip latency: ${sent.createdTimestamp - interaction.createdTimestamp}ms`)
            .setColor('Green')

        interaction.editReply({ embeds: [embed2], ephemeral: true });
	},
};