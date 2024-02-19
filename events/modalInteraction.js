const { Events } = require("discord.js");

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction) {
    if (!interaction.isModalSubmit()) return;
    if (interaction.customId === "adminResponse") {
      // const response = interaction.getValues("response");
      // response
      await interaction.reply({ content: "Response sent", emphemeral: true });
    }
  },
};
