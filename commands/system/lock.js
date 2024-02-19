const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
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
      let channel = interaction.options.getChannel('channel') || interaction.channel
      let {id} = interaction.guild.id;
      ow = interaction.channel.permissionOverwrites.cache.get(id); 
      if (ow && ow.SEND_MESSAGES === false) 
      {
        interaction.editReply({ content: "The channel is already locked." , ephemeral: true });
      }
      else 
      {
        await interaction.deferReply()
        channel.permissionOverwrites.create(interaction.guild.id, { SendMessages: false })
        const embed = new EmbedBuilder()
          .setColor('Red')
          .setFooter({ text: `Done by: ${interaction.user.username}`, iconURL: `${interaction.user.avatarURL()}` })
        await interaction.editReply({ content: `${channel} has been locked`, embeds: [embed] })
      }
  },
}