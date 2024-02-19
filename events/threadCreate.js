const { Events, AuditLogEvent, EmbedBuilder } = require("discord.js");

module.exports = {
  name: Events.ThreadCreate,
  /**
   *
   * @param {GuildChannel} channel
   * @param {Client} client
   */
  async execute(channel, _, client) {
    if (!channel.guild) return;
    // get audit log enty
    const auditLog = await channel.guild.fetchAuditLogs({
      type: AuditLogEvent.ThreadCreate,
    });
    const entry = auditLog.entries.first();
    // entry.executorId
    const embed = new EmbedBuilder();
    if (entry && entry.executorId) {
      const executor = await client.users.fetch(entry.executorId);
      embed.addFields({
        name: "Created by",
        value: `<@${executor.executorId}>`,
      });
    }
    embed.setTitle("Thread Created");
    embed.setURL(
      `https://discord.com/channels/${channel.guild.id}/${channel.parentId}/threads/${channel.id}`,
    );
    embed.setDescription(
      `Thread <#${channel.id}> was created in channel <#${channel.parentId}>.`,
    );
    embed.setTimestamp();
    // TODO ASTHETICS SET EMBED COLOR
    // embed.setColor(0x00ff00)

    const channelId = client.db.get(
      `logchannel_${channel.guild.id}_` +
        require("../src/static/logTypes.json")[4].value,
    );
    const channell = channel.guild.channels.cache.get(channelId);
    if (channell) {
      channell.send({ embeds: [embed] });
    }
  },
};
