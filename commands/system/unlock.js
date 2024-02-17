const { SlashCommandBuilder, ChannelType } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("unlock")
    .setDescription("Unlocks a channel")
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("The channel to unlock")
        .setRequired(true)
        .addChannelTypes(ChannelType.GuildText),
    ),
  async execute(interaction) {
    const channel = interaction.options.getChannel("channel");
    if (channel.type == ChannelType.GuildText) {
      channel.permissionOverwrites.edit(channel.guild.roles.everyone, {
        SendMessages: true
    }).catch((e) => { console.error(e) })
      await interaction.reply({
        content: `Successfully unlocked ${channel}`,
        ephemeral: true,
      });
      channel.send({content: "This channel has been unlocked"});
    }
  },
};
