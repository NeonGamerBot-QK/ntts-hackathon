const { Events, AuditLogEvent, EmbedBuilder } = require("discord.js");

module.exports = {
  name: Events.GuildEmojiDelete,
  execute: async (emoji) => {
    // use audit logs to get author
    const entry = await emoji.guild
      .fetchAuditLogs({ type: AuditLogEvent.EmojiDelete })
      .then((audit) => audit.entries.first());
    const embed = new EmbedBuilder();
    embed.setTitle("Emoji Deleted");
    embed.setDescription(
      `An emoji was deleted in ${emoji.guild.name} <a:${emoji.name}:${emoji.id}>`,
    );
    embed.setTimestamp();
    if (entry) {
      const executor = entry.executor;
      embed.addFields({ name: "deleted by", value: executor.tag });
    }
    const channelId = emoji.client.db.get(
      `logchannel_${emoji.guild.id}_` +
        require("../src/static/logTypes.json")[12].value,
    );
    const channel = emoji.guild.channels.cache.get(channelId);
    if (channel) {
      channel.send({ embeds: [embed] });
    }
  },
};
