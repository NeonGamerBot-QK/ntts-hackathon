const { SlashCommandBuilder } = require("discord.js");
const types = [
  {
    name: "ban",
    value: "0",
  },
  {
    name: "kick",
    value: "1",
  },
];
module.exports = {
  data: new SlashCommandBuilder()
    .setName("setLogChannel")
    .setDescription("Fr it's a ping, what do you expect")
    .addStringOption((o) => {
      return o
        .setName("type")
        .setDescription("The Type of logs for the channel")
        .setRequired(true)
        .addChoices(types);
    })
    .addChannelOption((o) => {
      return o
        .setName("channel")
        .setDescription("The channel to set as log channel")
        .setRequired(true);
    })
    .setDMPermission(true),
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
};
