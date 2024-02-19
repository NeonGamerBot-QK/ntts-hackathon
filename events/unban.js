const { Events, AuditLogEvent, EmbedBuilder } = require("discord.js");

module.exports = {
  name: Events.GuildBanRemove,
  async execute(guild, user) {
    // check audit log for reason
    const embed = new EmbedBuilder();

    const entry = await guild
      .fetchAuditLogs({ type: AuditLogEvent.MemberBanRemove })
      .then((audit) => audit.entries.first());
    if (entry) {
      // get the executor
      const executor = entry.executor;
      // get the reason
      const reason = entry.reason;

      // create a pretty embed

      embed.addFields(
        { name: "UnBanned by", value: executor.tag },
        { name: "Reason", value: reason },
      );
    }
    // create a pretty embed
    embed.setTitle("User Un-Banned");
    embed.setDescription(`${user.tag} was un-banned from the server`);
    embed.setTimestamp();

    const channelId = guild.client.db.get(
      `logchannel_${guild.id}_` +
        require("../src/static/logTypes.json")[9].value,
    );
    const channel = guild.channels.cache.get(channelId);
    if (channel) {
      // channel.send(`:no_entry: ${user.tag} was banned from the server`);
    }
  },
};
