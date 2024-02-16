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
      .setDescription(`Here is your random hex color code: \n #${randomHex}`);

    await interaction.reply({ embeds: [embed], ephemeral: true });
    // const color =
    //   ((Math.random() * 0xffffff) << 0).toString(16).padStart(6, "0");
    // await interaction.reply({
    //   // content: color,
    //   ephemeral: true,
    //   embeds: [
    //     {
    //       title: "Random Color",
    //       color: color,
    //       description: color,
    //       image: {
    //         url: `https://www.colorhexa.com/${color.slice(1)}.png`,
    //       },
    //     },
    //   ],
    // });
  },
};
