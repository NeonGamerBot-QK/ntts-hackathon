const { AuditLogEvent, Events } = require("discord.js");
module.exports = {
  name: Events.GuildAuditLogEntryCreate,
  async execute(auditLog, client) {
    console.log(auditLog.client, client);
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
