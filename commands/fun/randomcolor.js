const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("randomcolor")
    .setDescription("Get a random color"),
  async execute(interaction) {
    const color =
      "#" + ((Math.random() * 0xffffff) << 0).toString(16).padStart(6, "0");
    await interaction.reply({
      // content: color,
      ephemeral: true,
      embeds: [
        {
          title: "Random Color",
          color: color,
          description: color,
          image: {
            url: `https://www.colorhexa.com/${color.slice(1)}.png`,
          },
        },
      ],
    });
  },
};
