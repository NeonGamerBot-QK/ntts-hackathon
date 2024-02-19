const { Events, AuditLogEvent, EmbedBuilder } = require("discord.js");

module.exports = {
  name: Events.ChannelCreate,
  /**
   *
   * @param {GuildChannel} channel
   * @param {Client} client
   */
  async execute(channel, client) {
    if (!channel.guild) return;
    // get audit log enty
    const auditLog = await channel.guild.fetchAuditLogs({
      type: AuditLogEvent.ChannelCreate,
    });
    const entry = auditLog.entries.first();
    // entry.executorId
    const embed = new EmbedBuilder();
    if (entry && entry.executorId) {
      const executor = await client.users.fetch(entry.executorId);
      embed.addFields({ name: "Created by", value: executor.tag });
    }
    embed.setTitle("Channel Created");
    // hyperlink to channel
    embed.setURL(
      `https://discord.com/channels/${channel.guild.id}/${channel.id}`,
    );
    embed.setDescription(`Channel <#${channel.id}> was created.`);
    embed.setTimestamp();
    // TODO ASTHETICS SET EMBED COLOR
    // embed.setColor(0x00ff00)

    const channelId = client.db.get(
      `logchannel_${channel.guild.id}_` +
        require("../src/static/logTypes.json")[0].value,
    );
    const channell = channel.guild.channels.cache.get(channelId);
    if (channell) {
      channell.send({ embeds: [embed] });
    }
  },
};
