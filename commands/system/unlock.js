const { ChannelType, SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("unlock")
    .setDescription("Unlock a channel")
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("The channel to unlock")
        .setRequired(true)
        .addChannelTypes(ChannelType.GuildText),
    ),
  async execute(interaction) {
    const channel = interaction.options.getChannel("channel");
    if (channel.type === "GUILD_CATEGORY") {
      return interaction.reply({
        content: "You can't unlock a category",
        ephemeral: true,
      });
    }
    if (channel.type === "GUILD_VOICE") {
      return interaction.reply({
        content: "You can't unlock a voice channel",
        ephemeral: true,
      });
    }
    if (!channel.permissionsFor(interaction.guild.me).has("MANAGE_CHANNELS")) {
      return interaction.reply({
        content: "I don't have permission to unlock that channel",
        ephemeral: true,
      });
    }
    if (!channel.permissionsFor(interaction.member).has("MANAGE_CHANNELS")) {
      return interaction.reply({
        content: "You don't have permission to unlock that channel",
        ephemeral: true,
      });
    }
    if (!channel.permissionOverwrites.cache.has(interaction.guild.id)) {
      return interaction.reply({
        content: "The channel is already unlocked",
        ephemeral: true,
      });
    }
    const permissions = channel.permissionOverwrites.cache.get(
      interaction.guild.id,
    );
    if (permissions.deny.bitfield === 0n) {
      return interaction.reply({
        content: "The channel is already unlocked",
        ephemeral: true,
      });
    }
    await permissions.update({ SEND_MESSAGES: null });
    await interaction.reply({
      content: "The channel has been unlocked",
      ephemeral: true,
    });
  },
};
