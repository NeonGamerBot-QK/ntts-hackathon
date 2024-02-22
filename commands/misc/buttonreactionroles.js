const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("buttonreactionroles")
    .setDescription("Button Reaction Roles")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("create")
        .setDescription("Create a Button Reaction Role")
        .addRoleOption((roption) =>
          roption
            .setName("role")
            .setDescription("The reaction role to be given"),
        )
        .addStringOption((nn) =>
          nn.setName("name").setDescription("the name for the reaction role"),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("delete")
        .setDescription("Delete a Button Reaction Role")
        .addStringOption((nn) =>
          nn
            .setName("name")
            .setDescription("the name for the reaction role")
            .setAutocomplete(true),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("edit")
        .setDescription("Edit a Button Reaction Role")
        .addRoleOption((roption) =>
          roption
            .setName("role")
            .setDescription("The reaction role to be given"),
        )
        .addStringOption((nn) =>
          nn
            .setName("name")
            .setDescription("the name for the reaction role")
            .setAutocomplete(true),
        ),
    ),
  async execute(interaction) {
    // await interaction.reply("Button Reaction Roles");
    const subcommand = interaction.options.getSubcommand();
    if (subcommand === "create") {
      const role = interaction.options.getRole("role");
      const name = interaction.options.getString("name");
      interaction.client.db.set(
        `reactionrole_${interaction.guild.id}_${name}`,
        role.id,
      );
      // awtait interaction.reply("Create Button Reaction Role");
      // const model = new ModalBuilder();
      // model.setTitle("Create Button Reaction Role");
      // model.setCustomId("buttonreactionroles");
      // const description = new TextInputBuilder();
      // description.setPlaceholder("Role ID");
      // description.setRequired(true);
      // description.setStyle(TextInputStyle.SingleLine);
      // description.setLabel("Role ID");
      // description.setMinLength(18);
      // description.setMaxLength(18);
      // description.setCustomId("roleid");
      // model.addComponents(new ActionRowBuilder().addComponents(description));
      // await interaction.showModal(model);
      await interaction.reply({
        content: "Button Reaction Role Created",
        empheral: true,
      });
    }
 else if (subcommand === "delete") {
      const name = interaction.options.getString("name");
      interaction.client.db.delete(
        `reactionrole_${interaction.guild.id}_${name}`,
      );
      // await interaction.reply("Delete Button Reaction Role");
      await interaction.reply({
        content: "Button Reaction Role Deleted",
        empheral: true,
      });
    }
 else if (subcommand === "edit") {
      // await interaction.reply("Edit Button Reaction Role");
      // let selectron
      // interaction.reply({
      //   content: "Edit Button Reaction Role",
      //   empheral: true,
      // });

      const name = interaction.options.getString("name");
      const role = interaction.options.getRole("role");
      interaction.client.db.set(
        `reactionrole_${interaction.guild.id}_${name}`,
        role.id,
      );
      await interaction.reply({
        content: "Button Reaction Role Edited",
        empheral: true,
      });
    }
  },
};
