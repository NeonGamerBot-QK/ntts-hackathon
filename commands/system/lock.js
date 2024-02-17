const { SlashCommandBuilder, ChannelType, PermissionsBitField } = require("discord.js");

const flags = [
	PermissionsBitField.Flags.SendMessages,
];

const permissions = new PermissionsBitField(flags);

module.exports = {
  data: new SlashCommandBuilder()
    .setName("lock")
    .setDescription("Lock a channel")
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("The channel to lock")
        .setRequired(true)
        .addChannelTypes(ChannelType.GuildText),
    ),
  async execute(interaction) {
    const channel = interaction.options.getChannel("channel");
    if (channel.type == ChannelType.GuildText) {
      channel.permissionOverwrites.edit(channel.guild.roles.everyone, {
        SendMessages: false
    }).catch((e) => { console.error(e) })

    if (permissions.has(channel.permissionsFor(channel.guild.roles.everyone))) {
      await interaction.reply({
        content: "I can't lock this channel",
        ephemeral: true,
      })
    }
      await interaction.reply({
        content: `Successfully locked ${channel}`,
        ephemeral: true,
      });

    channel.send({content: "This channel has been locked"});
    }
  },
};
