const { Events, EmbedBuilder, AuditLogEvent } = require("discord.js");

module.exports = {
  name: Events.MessageDelete,
  execute: async (message) => {
    if (message.author.bot && message.author.id == message.client.user.id) {return;}
    // console.log(`A message by ${message.author.tag} was deleted in ${message.channel}`);
    // check audit log
    const entry = await message.guild
      .fetchAuditLogs({ type: AuditLogEvent.MessageDelete })
      .then((audit) => audit.entries.first());
    // if(!entry) return;
    if (entry.target.id === message.author.id) return;

    const embed = new EmbedBuilder();
    if (entry && entry.executor.id) {
      embed.addFields({
        name: "Executor",
        value: `${entry.executor.tag} (${entry.executor.id})`,
      });
    }

    embed.setTitle("Message Deleted");
    embed.setDescription(
      `A message by ${message.author.tag} was deleted in ${message.channel}`,
    );
    embed.addFields(
      { name: "Message Content", value: message.content },
      {
        name: "Message Author",
        value: `${message.author.tag} (${message.author.id})`,
      },
      {
        name: "Message Channel",
        value: `${message.channel.name} (${message.channel.id})`,
      },
    );
    embed.setTimestamp();

    if (message.attachments.size > 0) {
      embed.setImage(message.attachments.first().url);
    }

    // const logChannel = message.guild.channels.cache.find(c => c.name === "logs");
    const channell = message.guild.channels.cache.get(
      message.client.db.get(
        `logchannel_${message.guild.id}_` +
          require("../src/static/logTypes.json")[20].value,
      ),
    );
    if (channell) {
      channell.send({ embeds: [embed] });
    }
  },
};
