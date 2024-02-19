const {
  Events,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
} = require("discord.js");

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction) {
    // _client = interaction.client;
    if (!interaction.isButton()) return;
    if (interaction.customId === "adminResponse") {
      // await interaction.reply("Pong!");
      // create a model response
      // const message = interaction.message;
      // const channel = message.channel;
      // const guild = message.guild;
      //   await interaction.reply("Pong!");
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
    }
  },
};
