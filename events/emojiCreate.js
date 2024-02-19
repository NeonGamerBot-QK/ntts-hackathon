const { Events, AuditLogEvent, EmbedBuilder } = require("discord.js");

module.exports = {
  name: Events.GuildEmojiCreate,
  execute: async (emoji) => {
    // use audit logs to get author
    const entry = await emoji.guild
      .fetchAuditLogs({ type: AuditLogEvent.EmojiCreate })
      .then((audit) => audit.entries.first());
    const embed = new EmbedBuilder();
    embed.setTitle("Emoji Created");
    embed.setDescription(
      `An emoji was created in ${emoji.guild.name} <a:${emoji.name}:${emoji.id}>`,
    );
    embed.setTimestamp();
    if (entry) {
      const executor = entry.executor;
      embed.addFields({ name: "Created by", value: executor.tag });
    }
    const channelId = emoji.client.db.get(
      `logchannel_${emoji.guild.id}_` +
        require("../src/static/logTypes.json")[11].value,
    );
    const channel = emoji.guild.channels.cache.get(channelId);
    if (channel) {
      channel.send({ embeds: [embed] });
    }
  },
};
