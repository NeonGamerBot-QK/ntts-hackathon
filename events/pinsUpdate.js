const { Events, AuditLogEvent, EmbedBuilder } = require("discord.js");

module.exports = {
  name: Events.ChannelPinsUpdate,
  /**
   *
   * @param {GuildChannel} channel
   * @param {Client} client
   */
  async execute(channel, time, client) {
    if (!channel.guild) return;
    // get channel pins
    const pins = await channel.messages.fetchPinned();
    // pins.forEach((msg) => {

    // check audiot log
    const auditLog = await channel.guild.fetchAuditLogs({
      type: AuditLogEvent.ChannelPinsUpdate,
    });
    const entry = auditLog.entries.first();
    // entry.executorId
    if (entry && entry.executorId) {
      const executor = await client.users.fetch(entry.executorId);
      console.log(`Pins were updated in ${channel.name} by ${executor.tag}`);
    }
    const embed = new EmbedBuilder();
    embed.setTitle("Channel Pins Updated");
    embed.setURL(
      `https://discord.com/channels/${channel.guild.id}/${channel.id}`,
    );
    // todo try to get pin message url by running diff in message ids
    embed.setDescription(
      `Pins were updated in <#${channel.id}> (${channel.name}). there are now \`${pins.size}\` pins`,
    );
    embed.setTimestamp();
    const channelId = client.db.get(
      `logchannel_${channel.guild.id}_` +
        require("../src/static/logTypes.json")[3].value,
    );
    const channell = channel.guild.channels.cache.get(channelId);
    if (channell) {
      channell.send({ embeds: [embed] });
    }
  },
};
