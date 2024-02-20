const { ButtonBuilder } = require("@discordjs/builders");
const {
  SlashCommandBuilder,
  ChannelType,
  ActionRowBuilder,
  ButtonStyle,
  ModalBuilder,
  TextInputStyle,
  TextInputBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("adminresponsesystem")
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
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("buttonmessage")
        .setDescription("Send a button message for Admin Response System"),
    ),

  async execute(interaction) {
    const subCMD = interaction.options.getSubcommand();
    if (subCMD === "enable") {
      const channel = interaction.options.getChannel("channel");
      const message = interaction.options.getString("message");

      // then((m) => {
      interaction.client.db.set(`adminResponseSystem_${interaction.guild.id}`, {
        channel: channel.id,
        message: message,
        messageId: null,
      });
      interaction.reply({
        content: `Admin Response System has been enabled in ${channel} with the message: ${message}`,
        empheral: true,
      });
      // });
    }
 else if (subCMD === "buttonmessage") {
      if (
        !interaction.client.db.get(
          `adminResponseSystem_${interaction.guild.id}`,
        )
      ) {
        return interaction.reply({
          content: "Admin Response System is not enabled",
          empheral: true,
        });
      }
      const channel = interaction.guild.channels.cache.get(
        interaction.client.db.get(`adminResponseSystem_${interaction.guild.id}`)
          .channel,
      );
      const message = interaction.client.db.get(
        `adminResponseSystem_${interaction.guild.id}`,
      ).message;

      const row = new ActionRowBuilder();
      const btn = new ButtonBuilder();
      btn.setLabel("Admin Response");
      btn.setStyle(ButtonStyle.Primary);
      btn.setCustomId("adminResponse");
      row.addComponents(btn);
      interaction.channel
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
            content: `Admin Response System button message in ${channel} with the message: ${message}`,
            empheral: true,
          });
        });
    }
 else if (subCMD === "disable") {
      // const channel = interaction.options.getString("channel");
      interaction.client.db.delete(
        `adminResponseSystem_${interaction.guild.id}`,
      );
      interaction.reply(
        `Admin Response System has been disabled. You can enable it again by using the command /adminresponsesystem enable`,
      );
    }
 else if (subCMD === "respond") {
      if (
        !interaction.client.db.get(
          `adminResponseSystem_${interaction.guild.id}`,
        )
      ) {
        return interaction.reply({
          content: "Admin Response System is not enabled",
          empheral: true,
        });
      }
      const model = new ModalBuilder();
      model.setTitle("Admin Response");
      model.setCustomId("adminResponse");
      const description = new TextInputBuilder();
      // description.setName("response")
      description.setPlaceholder("Time what you want to yap about here...");
      description.setRequired(true);
      description.setStyle(TextInputStyle.Paragraph);
      description.setLabel("Response");
      description.setMinLength(1);
      description.setMaxLength(2000);
      description.setCustomId("response");
      model.addComponents(new ActionRowBuilder().addComponents(description));
      await interaction.showModal(model);

      // const channel = interaction.client.db.get(
      //   `adminResponseSystem_${interaction.guild.id}`,
      // ).channel;
      // const message = interaction.client.db.get(
      //   `adminResponseSystem_${interaction.guild.id}`,
      // ).message;
      // interaction.guild.channels.cache
      //   .get(channel)
      //   .send({ content: message, allowedMentions: { repliedUser: false } });
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
