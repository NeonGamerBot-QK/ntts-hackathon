const { Events, ThreadAutoArchiveDuration } = require("discord.js");

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction) {
    if (!interaction.isModalSubmit()) return;
    if (interaction.customId === "adminResponse") {
      const response = interaction.fields.getTextInputValue("response");
      console.log(response);
      const channel = interaction.client.channels.cache.get(
        interaction.client.db.get(`adminresponsesystem_${interaction.guild.id}`)
          .channel,
      );
      interaction.replyDefer({ ephemeral: true });
      // response
      if (channel) {
        channel.threads
          .create({
            name: `adminresponse-${interaction.user.username}`,
            autoArchiveDuration: ThreadAutoArchiveDuration.OneWeek,
            reason: "Admin response",
          })
          .then((thread) => {
            thread.send({ content: response || "None" });
            thread.send({
              content: `Any response will end up in the users DM's`,
            });
            interaction.client.db.set(
              `adminresponse_${interaction.user.id}_${interaction.guild.id}`,
              { response, threadId: thread.id },
            );
          });
      }
 else {
        interaction.client.db.set(
          `adminresponse_${interaction.user.id}_${interaction.guild.id}`,
          { response },
        );
      }
      await interaction.editReply({
        content: "Response sent",
        ephemeral: true,
      });
    }
  },
};
