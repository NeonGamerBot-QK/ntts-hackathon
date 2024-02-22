const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("randomcolor")
    .setDescription("Get a random color"),
  async execute(interaction) {
    const randomHex = Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');

    // Build embed message
    const embed = new EmbedBuilder()
      .setColor(`#${randomHex}`)
      .setTitle('Random Color!')
      .setDescription(`Here is your random hex color code: \n #${randomHex}`)
      .setThumbnail(`https://www.colorhexa.com/${randomHex}.png`);

    await interaction.reply(' ');
    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
