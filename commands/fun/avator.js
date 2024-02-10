const { SlashCommandBuilder } = require("discord.js");
const { EmbedBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("avatar")
    .setDescription("Get user avatar")
    .setDMPermission(false)
    .addUserOption((options) =>
      options
        .setName("user")
        .setDescription("People who want to get other users")
        .setRequired(true),
    ),

  async execute(interaction) {
    const user = interaction.options.getUser("user");

    const avatar = user.avatarURL();

    const embed = new EmbedBuilder()
      .setTitle("User Sticket")
      .setDescription(
        `**This is **${user}**'s photo post**\nThis is the link:\n\`${avatar}\``,
      )
      .setThumbnail(avatar)
      .setTimestamp();

    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
