const { Events } = require("discord.js");

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction) {
    // _client = interaction.client;
    if (!interaction.isButton()) return;
    if (interaction.customId === "adminResponse") {
      // await interaction.reply("Pong!");
      // create a model response
      // const message = interaction.message;
      // const channel = message.channel;
      // const guild = message.guild;
      await interaction.reply("Pong!");
    }
  },
};
