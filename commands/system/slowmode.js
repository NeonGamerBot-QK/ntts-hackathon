const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("slowmode")
    .setDescription("Set the slowmode for a channel")
    .addIntegerOption((option) =>
      option
        .setName("time")
        .setDescription("The time in seconds")
        .setRequired(true)
        .setMaxValue(21600)
        .setMinValue(1),
    ),
  async execute(interaction) {
    const time = interaction.options.getInteger("time");
    if (time > 21600) {
      return interaction.reply({
        content: "The time can't be more than 6 hours",
        ephemeral: true,
      });
    }
    await interaction.channel.setRateLimitPerUser(time);
    await interaction.reply({
      content: `The slowmode has been set to ${time} seconds`,
      ephemeral: true,
    });
  },
};
