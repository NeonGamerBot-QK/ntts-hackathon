const { SlashCommandBuilder } = require("@discordjs/builders");
const { CloseCategory } = require("../../config.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("delete")
    .setDescription("Close all closed ticket!")
    .addSubcommand((subcommand) =>
      subcommand.setName("closed").setDescription("Close all closed ticket!"),
    )
    .addSubcommand(
      (subcommand) =>
        subcommand
          .setName("category")
          .setDescription("close all ticket in category!"),
      // .addStringOption(option => {
      //     option
      //         .setName('category')
      //         .setDescription('The category to be close')
      //         .setRequired(true)
      //     const length = TicketCategory.length
      //     for (let i = 0; i < length; i++) {
      //         option.addChoices({ name: TicketCategory[i].category, value: TicketCategory[i].categoryId })
      //     }
      //     return option
      // })
    ),

  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();
    await interaction.reply({ content: "Ticket Closing", ephemeral: true });

    switch (subcommand) {
      case "closed":
        return await closed(interaction);
      case "category":
        return await category(interaction);
    }

    function closed() {
      const category_ = interaction.guild.channels.cache.get(CloseCategory);
      let i = 0;

      if (category_ && category_.type == 4) {
        const channelsInCategory = interaction.guild.channels.cache.filter(
          (channel) => channel.type === 0 && channel.parentId === category_.id,
        );
        channelsInCategory.forEach(async (channel) => {
          i++;
          setTimeout(() => {
            channel.delete();
          }, 1000);
        });
      }
 else {
        return interaction.editReply({ content: "No ticket to close!" });
      }

      interaction.editReply({
        content: `### Close all closed ticket!\n> Close total ${i} ticket`,
      });
    }

    function category() {
      const category_ = interaction.options.getString("category");
      // eslint-disable-next-line no-shadow
      const category = interaction.guild.channels.cache.get(category_);

      let i = 0;

      if (category && category.type == 4) {
        const channelsInCategory = interaction.guild.channels.cache.filter(
          (channel) => channel.type === 0 && channel.parentId === category.id,
        );
        channelsInCategory.forEach(async (channel) => {
          i++;
          setTimeout(() => {
            channel.delete();
          }, 1000);
        });
      }
 else {
        return interaction.editReply({ content: "No ticket to close!" });
      }

      interaction.editReply({
        content: `### Close all closed ticket!\n> Close total ${i} ticket`,
      });
    }
  },
};
