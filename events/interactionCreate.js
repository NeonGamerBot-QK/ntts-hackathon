const { Events, Client, GatewayIntentBits } = require('discord.js');
const { EmbedBuilder } = require('@discordjs/builders')
const fs = require('node:fs');
const path = require('node:path');
const { QuickDB } = require('quick.db');
const db = new QuickDB({ filePath: 'database.sqlite' });

const f = require('../function/ticketopen.js');
const t = require('../function/ticketuser.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const { TicketCategory, TicketBlacklist, ReopenAsking } = require('../config.json');


module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction, client) {

		if (!interaction.isChatInputCommand() && !interaction.isButton() && !interaction.isModalSubmit() && !interaction.isStringSelectMenu()) return;
		const Action = {};
		const command = interaction.client.commands.get(interaction.commandName);
		const ActionFolderPath = path.join(__dirname, '..', 'trigger', 'action');
		const actionFolders = fs.readdirSync(ActionFolderPath);

		if (command) {
			try {
				if (interaction.isAutocomplete()) {
					await command.autocomplete(interaction);
				} else {
					await command.execute(interaction);
				}
			} catch (error) {
				console.error(`Error executing ${interaction.commandName}`);
				console.error(error);
			}
			return;
		}

		for (const folder of actionFolders) {
			const actionPath = path.join(ActionFolderPath, folder);
			const actionFiles = fs.readdirSync(actionPath).filter(file => file.endsWith('.js'));
			for (const file of actionFiles) {
				const filePath = path.join(actionPath, file);
				const action = require(filePath);
				Action[action.customId] = action;
			}
		}

		const action = Action[interaction.customId];
		const ticket = interaction.customId.match(/@ticket-(\w+)/)

		if (ticket) {
			if (interaction.member.roles.cache.has(TicketBlacklist)) {
				const embed = new EmbedBuilder()
					.setTitle('Blacklisted')
					.setDescription('You are blacklisted from opening tickets.')
					.setColor(0xff0000);
				return await interaction.reply({ embeds: [embed], ephemeral: true });
			}

			const userticketopen = await db.get(`ticket.${interaction.user.id}.ticketopen`)
			const value = ticket[1]
			const modal = value.match(/modal_(\d+)/)
			const remove = value.match(/remove_(\w+)/)

			if (userticketopen !== null && userticketopen >= 3) {
				const embed = new EmbedBuilder()
					.setTitle('Ticket Limit Reached')
					.setDescription('You have reached the maximum number of tickets you can open at once.')
					.setColor(0xff0000);
				return await interaction.reply({ embeds: [embed], ephemeral: true });
			}
			if (f.isNumeric(value)) {
				if (TicketCategory[value].openTicketDescription.openasking) {
					return f.openmodal(interaction, value)
				} else {
					return f.openticket(parseInt(value, 10), interaction, client)
				}
			}
			if (value.startsWith('modal_')) {
				const request = interaction.fields.getTextInputValue('input');
				// client.log("open", t.loginfo(interaction, parseInt(value, 10)), request)
				return f.openticket(parseInt(modal[1], 10), interaction, client, request)
			}
			if (ReopenAsking && value == 'reopen') {
				return f.ticketreopen(interaction)
			}
			if (value == 'reopenModal') {
				const reasone = interaction.fields.getTextInputValue('input');
				const action = Action['@ticket-reopen'];
				return action.execute(interaction, client, reasone)
			}
			if (value.startsWith('remove_')) {
				const index = remove[1]
				return t.removeuser(interaction, index)
			}
		}

		if (action) {
			try {

				await action.execute(interaction, client);
			} catch (error) {
				console.error(error);
				const embed = new EmbedBuilder()
					.setTitle('An error occurred')
					.setDescription('An error occurred while handling this interaction.')
					.setColor(0xff0000);
				await interaction.reply({ embeds: [embed], ephemeral: true });
				console.log(error)
			}
		}
	},
};