const { Events, AuditLogEvent, EmbedBuilder } = require("discord.js");

module.exports = {
  name: Events.GuildBanRemove,
  async execute(user, guild) {
    // check audit log for reason
    const embed = new EmbedBuilder();

    try {
      console.log(guild);
      const auditLogs = await guild.fetchAuditLogs({ type: AuditLogEvent.MemberBanRemove });
      const entry = auditLogs.entries.first();

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

      embed.setTitle("User Un-Banned");
      embed.setDescription(`${user.tag} was un-banned from the server`);
      embed.setTimestamp();

      const channelId = guild.client.db.get(
        `logchannel_${guild.id}_` +
          require("../src/static/logTypes.json")[9].value,
      );
      const channel = guild.channels.cache.get(channelId);
      if (channel) {
        // Uncomment the following line to send the embed
        // await channel.send({ embeds: [embed] });
      }
    } catch (error) {
      console.error('Error fetching audit logs or sending embed:', error);
    }
  },
};