const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
  ChannelType,
} = require('discord.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unlock')
    .setDescription('Unlock a channel')
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
    .addChannelOption((option) =>
      option
        .setName('channel')
        .setDescription('The channel you want to unlock')
        .addChannelTypes(ChannelType.GuildText, ChannelType.GuildAnnouncement)
        .setRequired(false)
    ),
  async execute(interaction) {
      const channel = interaction.options.getChannel('channel') || interaction.channel
      await interaction.deferReply()
      channel.permissionOverwrites.create(interaction.guild.id, {
        SendMessages: true,
      })
      const embed = new EmbedBuilder().setTitle(`${channel} has been unlocked`).setColor('Green').setFooter({
        text: `Done by: ${interaction.user.username}`,
        iconURL: `${interaction.user.avatarURL()}`,
      })
      await interaction.editReply({
        embeds: [embed],
      })
      await channel.send("Unlocked the text channel.")
  },
}