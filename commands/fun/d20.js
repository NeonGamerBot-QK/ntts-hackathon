const { SlashCommandBuilder, AttachmentBuilder } = require("discord.js");
const fs = require("fs");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("d20")
    .setDescription("Roll a 20-sided die"),
  async execute(interaction) {
    const roll = Math.floor(Math.random() * 20) + 1;
    await interaction.reply({
      content: `You rolled a ${roll}`,
      files: [
        new AttachmentBuilder()
          .setName(`${roll}.mp4`)
          .setFile(
            fs.readFileSync(
              require("path").resolve(`../../assets/dice/${roll}.mp4`),
            ),
          ),
      ],
    });
  },
};
