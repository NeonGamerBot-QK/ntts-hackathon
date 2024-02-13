const petPetGif = require("../../pet-pet");
const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("petpet")
    .setDescription("Pet, Pet an avatar!")
    .setDMPermission(false)
    .addUserOption((options) =>
      options
        .setName("user")
        .setDescription("People who want to get other users")
        .setRequired(false),
    ),
  async execute(interaction) {
    const user = interaction.options.getUser("user") || interaction.member.user;
    const avatar = user.displayAvatarURL();
    // console.debug(avatar);
    const gif = await petPetGif(avatar, {
      //   delay: 20,
      //   resolution: 128,
      //   background: "transparent",
    });
    await interaction.reply({ files: [gif] });
  },
};
