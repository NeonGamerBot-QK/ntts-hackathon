const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
  ChannelType,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("lock")
    .setDescription("Lock a channel")
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("The channel you want to lock")
        .addChannelTypes(ChannelType.GuildText, ChannelType.GuildAnnouncement)
        .setRequired(false),
    ),
  async execute(interaction) {
    const channel =
      interaction.options.getChannel("channel") || interaction.channel;
    await interaction.deferReply();

    if (
      channel.permissionOverwrites.cache
        .get(interaction.guild.id)
        .deny.has(PermissionFlagsBits.SendMessages)
    ) {
      return interaction.editReply({
        content: "Channel is already locked",
        ephemeral: true,
      });
    }

    channel.permissionOverwrites.create(interaction.guild.id, {
      SendMessages: false,
    });

    const embed = new EmbedBuilder()
      .setTitle(`${channel} has been locked`)
      .setColor("Red")
      .setFooter({
        text: `Done by: ${interaction.user.username}`,
        iconURL: `${interaction.user.avatarURL()}`,
      });

    await interaction.editReply({
      embeds: [embed],
    });

    await channel.send("Locked the text channel.");
  },
};
