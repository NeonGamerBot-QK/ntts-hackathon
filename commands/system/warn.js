const {
  PermissionsBitField,
  SlashCommandBuilder,
  EmbedBuilder,
} = require("discord.js");

module.exports = {
  // name: '
  data: new SlashCommandBuilder()
    .setName("warn")
    .setDescription("Warn a user")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("create")
        .setDescription("Create a warning")
        .addUserOption((option) =>
          option
            .setName("target")
            .setDescription("The user to warn")
            .setRequired(true),
        )
        .addStringOption((option) =>
          option
            .setName("reason")
            .setDescription("The reason for warning the user"),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("remove")
        .setDescription("Remove a warning")
        .addUserOption((option) =>
          option
            .setName("target")
            .setDescription("The user to warn")
            .setRequired(true),
        )
        .addIntegerOption((option) =>
          option
            .setName("index")
            .setDescription("The index of the warning")
            .setRequired(true),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("clear")
        .setDescription("Clear all warnings")
        .addUserOption((option) =>
          option
            .setName("target")
            .setDescription("The user to warn")
            .setRequired(true),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("list")
        .setDescription("List all warnings")
        .addUserOption((option) =>
          option
            .setName("target")
            .setDescription("The user to warn")
            .setRequired(true),
        ),
    ),
  async execute(interaction) {
    // code here
    const subCMD = interaction.options.getSubcommand();

    if (subCMD === "create") {
      const target = interaction.options.getUser("target");
      let reason = interaction.options.getString("reason");
      if (!reason) {
        reason = "No reason provided";
      }

      if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
        return await interaction.reply({
          content: "You don't have permission",
          empheral: true,
        });
      }

      const currentWarnings = await interaction.client.db.get(`warnings_${interaction.guild.id}_${target.id}`) || []
      currentWarnings.push({
        moderator: interaction.user.id,
        reason,
        timestamp: Date.now(),
      });

      await interaction.client.db.set(`warnings_${interaction.guild.id}_${target.id}`, currentWarnings)
      await interaction.followUp({
        content: `Warned ${target.tag} for ${reason}`,
        empheral: true,
      });
    }












//     if (subCMD === "create") {
//       const target = interaction.options.getUser("target");
//       let reason = interaction.options.getString("reason");
//       if (!reason) {
//         reason = "No reason provided";
//       }

//       if (
//         !interaction.member.permissions.has(
//           PermissionsBitField.Flags.Administrator,
//         )
//       ) {
//         return await interaction.reply({
//           content: "You don't have permission",
//           empheral: true,
//         });
//       }

//       const currentWarnings =
//         interaction.client.db.get(
//           `warnings_${interaction.guild.id}_${target.id}`,
//         ) || [];
//       currentWarnings.push({
//         moderator: interaction.user.id,
//         reason,
//         timestamp: Date.now(),
//       });
//       interaction.client.db.set(
//         `warnings_${interaction.guild.id}_${target.id}`,
//         currentWarnings,
//       );
//       target.send(
//         `You have been warned in ${interaction.guild.name} for ${reason}`,
//       );
//       return await interaction.reply({
//         content: `Warned \`${target.tag} for ${reason}`,
//         empheral: true,
//       });
//     }
//  else if (subCMD === "remove") {
//       const target = interaction.options.getUser("target");
//       const warnings =
//         interaction.client.db.get(
//           `warnings_${interaction.guild.id}_${target.id}`,
//         ) || [];
//       const index = interaction.options.getInteger("index") - 1;
//       if (index < 0 || index >= warnings.length) {
//         return await interaction.reply({
//           content: "Invalid index",
//           empheral: true,
//         });
//       }
//       warnings.splice(index, 1);
//       interaction.client.db.set(
//         `warnings_${interaction.guild.id}_${target.id}`,
//         warnings,
//       );
//       return await interaction.reply({
//         content: `Removed warning ${index + 1} for ${target.tag}`,
//         empheral: true,
//       });
//     }
//  else if (subCMD === "clear") {
//       const target = interaction.options.getUser("target");
//       interaction.client.db.delete(
//         `warnings_${interaction.guild.id}_${target.id}`,
//       );
//       return await interaction.reply({
//         content: `Cleared warnings for ${target.tag}`,
//         empheral: true,
//       });
//     }
//  else if (subCMD === "list") {
//       const target = interaction.options.getUser("target");
//       const warnings =
//         interaction.client.db.get(
//           `warnings_${interaction.guild.id}_${target.id}`,
//         ) || [];
//       const embed = new EmbedBuilder()
//         .setColor(0xffa600)
//         .setTitle(`Warnings for ${target.tag}`)
//         .setDescription(
//           (warnings.map((w, i) => `${i + 1}. ${w.reason} - <@${w.moderator}>`)).join("\n") ||
//           "No warnings",
//         );
      
      
//       await interaction.reply({ embeds: [embed] });
//     }
//  else {
//       return await interaction.reply({
//         content: "Invalid subcommand",
//         empheral: true,
//       });
//     }
  },
};
