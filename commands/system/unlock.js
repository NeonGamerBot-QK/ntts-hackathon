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
    try {
      let channel =
        interaction.options.getChannel('channel') || interaction.channel

      let {id} = interaction.guild.defaultRole, // get the ID of defaultRole
      ow = interaction.channel.permissionOverwrites.get(id); // get the permissionOverwrites fro that role
      // If the overwrites exist and SEND_MESSAGES is set to false, then it's already locked
      if (ow && ow.SEND_MESSAGES === true) interaction.channel.send("The channel is already unlocked.");
      else { // otherwise, lock it
        await interaction.deferReply()

        channel.permissionOverwrites.create(interaction.guild.id, {
          SendMessages: true,
        })

        const embed = new EmbedBuilder().setColor('Green').setFooter({
          text: `Done by: ${interaction.user.username}`,
          iconURL: `${interaction.user.avatarURL()}`,
        })

        await interaction.editReply({
          content: `${channel} has been unlocked`,
          embeds: [embed],
        })
      }
    } catch (error) {
      await interaction.editReply('Oops! There was an error.').then((msg) => {
        setTimeout(() => {
          msg.delete()
        }, 10000)
      })
      console.log(error)
    }
  },
}