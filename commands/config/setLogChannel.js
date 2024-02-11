const { SlashCommandBuilder, ChannelType } = require("discord.js");
const types = require("../../src/static/logTypes.json");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("setlogchannel")
    .setDescription("set the log channel for the server")
    .addStringOption((o) => {
      return o
        .setName("type")
        .setDescription("The Type of logs for the channel")
        .setRequired(true)
        .setAutocomplete(true);
      //    .addChoices(...types);
    })
    .addChannelOption((o) => {
      return o
        .setName("channel")
        .setDescription("The channel to set as log channel")
        .setRequired(true)
        .addChannelTypes(ChannelType.GuildText);
    })
    .setDMPermission(false),
  async execute(interaction) {
    const channel = interaction.options.getChannel("channel");
    const type = interaction.options.getString("type");
    interaction.client.db.set(
      `logchannel_${interaction.guild.id}_${type}`,
      channel.id,
    );
    interaction.reply(
      `Log channel for \`${types.find((t) => t.value === type).name}\` has been set to ${channel}`,
    );
  },
  async autocomplete(interaction) {
    const focusedValue = interaction.options.getFocused();
    // const choices = [
    //   "Popular Topics: Threads",
    //   "Sharding: Getting started",
    //   "Library: Voice Connections",
    //   "Interactions: Replying to slash commands",
    //   "Popular Topics: Embed preview",
    // ];
    const filtered = types.filter((choice) =>
      choice.name.startsWith(focusedValue),
    );
    await interaction.respond(filtered);
  },
};
