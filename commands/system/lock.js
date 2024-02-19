const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
  PermissionsBitField,
  ChannelType,
} = require('discord.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('lock')
    .setDescription('Lock a channel')
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
    .addChannelOption((option) =>
      option
        .setName('channel')
        .setDescription('The channel you want to lock')
        .addChannelTypes(ChannelType.GuildText, ChannelType.GuildAnnouncement)
        .setRequired(false)
    ),
  async execute(interaction) {
      await interaction.deferReply()
      let channel = interaction.options.getChannel('channel') || interaction.channel
      ow = channel.permissionOverwrites.cache.get(channel.guildId);
      console.log(ow);
      console.log(ow.SEND_MESSAGES === true);
      console.log(channel.permissions.serialize());
      if (ow && ow.SEND_MESSAGES === true) 
      {
        interaction.editReply({ content: "The channel is already locked." , ephemeral: true });
      }
      else 
      {
        channel.permissionOverwrites.create(interaction.guild.id, { SendMessages: false })
        const embed = new EmbedBuilder()
          .setColor('Red')
          .setFooter({ text: `Done by: ${interaction.user.username}`, iconURL: `${interaction.user.avatarURL()}` })
        await interaction.editReply({ content: `${channel} has been locked`, embeds: [embed] })
      }
  },
}