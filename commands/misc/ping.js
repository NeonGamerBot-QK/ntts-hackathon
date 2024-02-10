const {SlashCommandBuilder} = require('discord.js')
module.exports = {
	data: new SlashCommandBuilder ()
		.setName('ping')
		.setDescription('Replies with Pong!'),
	async execute(interaction) {
		await interaction.reply('Pinging..!');
		await interaction.editReply(`Pong: ${interaction.client.ws.ping}`)
	},
};