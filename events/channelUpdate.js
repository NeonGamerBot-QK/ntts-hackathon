const { Events, AuditLogEvent, EmbedBuilder } = require("discord.js");

module.exports = {
  name: Events.ChannelUpdate,
  /**
   *
   * @param {GuildChannel} channel
   * @param {Client} client
   */
  async execute(channel, nchannel, client) {
    if (!channel.guild) return;
    // get audit log enty
    const auditLog = await channel.guild.fetchAuditLogs({
      type: AuditLogEvent.ChannelUpdate,
    });
    const entry = auditLog.entries.first();
    // entry.executorId
    const embed = new EmbedBuilder();
    if (entry && entry.executorId) {
      const executor = await client.users.fetch(entry.executorId);
      embed.addFields({ name: "Updated by", value: executor.tag });
    }
    embed.setTitle("Channel Updated");
    // hyperlink to channel
    embed.setURL(
      `https://discord.com/channels/${channel.guild.id}/${channel.id}`,
    );
    embed.setDescription(`Channel <#${channel.id}> was updated.`);
    const fields = [];
    if (channel.name !== nchannel.name) {
      fields.push({ name: "Old Name", value: channel.name });
      fields.push({ name: "New Name", value: nchannel.name });
    }
    if (channel.type !== nchannel.type) {
      fields.push({ name: "Old Type", value: channel.type });
      fields.push({ name: "New Type", value: nchannel.type });
    }
    if (channel.parentId !== nchannel.parentId) {
      fields.push({ name: "Old Parent", value: `<#${channel.parentId}` });
      fields.push({ name: "New Parent", value: `${nchannel.parentId}` });
    }
    if (channel.topic !== nchannel.topic) {
      fields.push({ name: "Old Topic", value: channel.topic });
      fields.push({ name: "New Topic", value: nchannel.topic });
    }
    if (channel.nsfw !== nchannel.nsfw) {
      fields.push({ name: "Old NSFW", value: channel.nsfw });
      fields.push({ name: "New NSFW", value: nchannel.nsfw });
    }
    if (channel.rateLimitPerUser !== nchannel.rateLimitPerUser) {
      fields.push({ name: "Old Slowmode", value: channel.rateLimitPerUser });
      fields.push({ name: "New Slowmode", value: nchannel.rateLimitPerUser });
    }
    if (channel.bitrate !== nchannel.bitrate) {
      fields.push({ name: "Old Bitrate", value: channel.bitrate.toString() });
      fields.push({ name: "New Bitrate", value: nchannel.bitrate.toString() });
    }
    if (channel.userLimit !== nchannel.userLimit) {
      fields.push({
        name: "Old User Limit",
        value: channel.userLimit.toString(),
      });
      fields.push({
        name: "New User Limit",
        value: nchannel.userLimit.toString(),
      });
    }
    // if (channel.permissionOverwrites !== nchannel.permissionOverwrites) {
    //     fields.push({ name: "Old Permission Overwrites", value: channel.permissionOverwrites });
    //     fields.push({ name: "New Permission Overwrites", value: nchannel.permissionOverwrites });
    // }
    if (fields.length > 0) {
      embed.addFields(fields);
    }
    // embed.addFields(
    //     { name: "Channel", value: channel.name },
    // );
    embed.setTimestamp();
    // TODO ASTHETICS SET EMBED COLOR
    // embed.setColor(0x00ff00)

    const channelId = client.db.get(
      `logchannel_${channel.guild.id}_` +
        require("../src/static/logTypes.json")[1].value,
    );
    const channell = channel.guild.channels.cache.get(channelId);
    if (channell) {
      channell.send({ embeds: [embed] });
    }
  },
};
