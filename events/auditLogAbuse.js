const { AuditLogEvent, Events, EmbedBuilder } = require("discord.js");
module.exports = {
  name: Events.GuildAuditLogEntryCreate,
  // the _ is the guild for SOME reason.
  async execute(auditLog, _, client) {
    // console.log(auditLog.client, client);
    // const client = auditLog.client;
    // Define your variables.
    // The extra information here will be the channel.
    const { action, extra: channel, executorId, targetId } = auditLog;

    // Check only for deleted messages.
    if (action == AuditLogEvent.MessageDelete) {
      // Ensure the executor is cached.

      const executor = await client.users.fetch(executorId);

      // Ensure the author whose message was deleted is cached.
      const target = await client.users.fetch(targetId);

      // Log the output.
      console.log(
        `A message by ${target.tag} was deleted by ${executor.tag} in ${channel}.`,
      );
      const embed = new EmbedBuilder();
      embed.setTitle("Message Deleted");
      embed.setDescription(
        `A message by ${target.tag} was deleted by ${executor.tag} in ${channel}`,
      );
      embed.setAuthor(target.tag, target.displayAvatarURL());
      embed.addFields(
        { name: "Channel", value: channel },
        { name: "Executor", value: executor.tag },
      );
      embed.setTimestamp();
      const channelId = client.db.get(
        `logchannel_${auditLog.guild.id}_` +
          require("../src/static/logTypes.json")[20].value,
      );
      const channell = auditLog.guild.channels.cache.get(channelId);
      if (channell) {
        channell.send({ embeds: [embed] });
      }
    }
 else if (action == AuditLogEvent.MemberKick) {
      // Ensure the executor is cached.
      const executor = await client.users.fetch(executorId);

      // Ensure the kicked guild member is cached.
      const kickedUser = await client.users.fetch(targetId);

      // Now you can log the output!
      console.log(`${kickedUser.tag} was kicked by ${executor.tag}.`);
    }
 else if (action == AuditLogEvent.MemberBanAdd) {
      // Ensure the executor is cached.
      const executor = await client.users.fetch(executorId);

      // Ensure the banned guild member is cached.
      const bannedUser = await client.users.fetch(targetId);

      // Now you can log the output!
      console.log(`${bannedUser.tag} was banned by ${executor.tag}.`);
    }
  },
};
