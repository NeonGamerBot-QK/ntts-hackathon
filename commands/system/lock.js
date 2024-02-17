const { SlashCommandBuilder, ChannelType } = require("discord.js");

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

    if (!channel.permissionOverwrites.cache.get(channel.guildId).has("SEND_MESSAGES")) {
      await interaction.reply({
        content: `Already locked ${channel}`,
        ephemeral: true,
      });
    }

      await interaction.reply({
        content: `Successfully locked ${channel}`,
        ephemeral: true,
      });

    channel.send({content: "This channel has been locked"});
    }
  },
};
