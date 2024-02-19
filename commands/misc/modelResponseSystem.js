const { ButtonBuilder } = require("@discordjs/builders");
const { SlashCommandBuilder, ActionRow, ChannelType } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("adminResponseSystem")
    .setDescription("Admin Response System")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("enable")
        .setDescription("Enable Admin Response System")
        .addChannelOption((option) =>
          option
            .setName("channel")
            .setDescription("The channel to send the response in")
            .setRequired(true)
            .addChannelTypes(ChannelType.GuildText),
        )
        .addStringOption((option) =>
          option
            .setName("message")
            .setDescription("The message to send")
            .setRequired(true),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("disable")
        .setDescription("Disable Admin Response System"),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("edit")
        .setDescription("Edit Admin Response System")
        .addChannelOption((option) =>
          option
            .setName("channel")
            .setDescription("The channel to edit the response in")
            .setRequired(true)
            .addChannelTypes(ChannelType.GuildText),
        )
        .addStringOption((option) =>
          option
            .setName("message")
            .setDescription("The message to edit")
            .setRequired(true),
        ),
    ),
  async execute(interaction) {
    const subCMD = interaction.options.getSubcommand();
    if (subCMD === "enable") {
      const channel = interaction.options.getChannel("channel");
      const message = interaction.options.getString("message");
      const row = new ActionRow();
      const btn = new ButtonBuilder();
      btn.setLabel("Admin Response");
      btn.setStyle("PRIMARY");
      btn.setCustomId("adminResponse");
      row.addComponent(btn);
      channel
        .send({
          content: message,
          allowedMentions: { repliedUser: false },
          components: [row],
        })
        .then((m) => {
          interaction.client.db.set(
            `adminResponseSystem_${interaction.guild.id}`,
            { channel: channel.id, message: message, messageId: m.id },
          );
          interaction.reply({
            content: `Admin Response System has been enabled in ${channel} with the message: ${message}`,
            empheral: true,
          });
        });
    }
 else if (subCMD === "disable") {
      const channel = interaction.options.getString("channel");
      interaction.client.db.delete(
        `adminResponseSystem_${interaction.guild.id}`,
      );
      interaction.reply(
        `Admin Response System has been disabled in ${channel}`,
      );
    }
 else if (subCMD === "edit") {
      const channel = interaction.options.getString("channel");
      const message = interaction.options.getString("message");
      interaction.client.db.set(`adminResponseSystem_${interaction.guild.id}`, {
        channel: channel,
        message: message,
      });
      interaction.reply(
        `Admin Response System has been edited in ${channel} with the message: ${message}`,
      );
    }
  },
};
