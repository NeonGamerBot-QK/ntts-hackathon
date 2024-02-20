// const { SlashCommandBuilder } = require("discord.js");

// module.exports = {
//   data: new SlashCommandBuilder()
//     .setName("mute")
//     .setDescription("Mute a user")
//     .addUserOption((option) =>
//       option
//         .setName("user")
//         .setDescription("The user to mute")
//         .setRequired(true),
//     )
//     .addStringOption((option) =>
//       option
//         .setName("reason")
//         .setDescription("The reason for the mute")
//         .setRequired(false),
//     ),
//   async execute(interaction) {
//     const user = interaction.options.getUser("user");
//     const member = interaction.guild.members.cache.get(user.id);
//     const reason =
//       interaction.options.getString("reason") || "No reason provided";
//     if (
//       member.roles.highest.position >= interaction.member.roles.highest.position
//     ) {
// return interaction.reply({
//         content: "You can't mute someone with a higher or equal role",
//         ephemeral: true,
//       });
// }
//     if (!member.manageable) {
// return interaction.reply({
//         content: "I can't mute that user",
//         ephemeral: true,
//       });
// }
//     const muteRole = interaction.guild.roles.cache.find(
//       (role) => role.name.toLowerCase() === "muted",
//     );
//     if (!muteRole) {
// return interaction.reply({
//         content: "There is no mute role in this server",
//         ephemeral: true,
//       });
// }
//     if (member.roles.cache.has(muteRole.id)) {
// return interaction.reply({
//         content: "The user is already muted",
//         ephemeral: true,
//       });
// }
//     await member.roles.add(muteRole, reason);
//     await interaction.reply({ content: `Muted ${user.tag} for \`${reason}\`` });
//   },
// };



const { Client, Interaction, ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');
const ms = require('ms');

module.exports = {
  /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */

  callback: async (client, interaction) => {
    const mentionable = interaction.options.get('target-user').value;
    const duration = interaction.options.get('duration').value; // 1d, 1 day, 1s 5s, 5m
    const reason = interaction.options.get('reason')?.value || 'No reason provided';

    await interaction.deferReply();

    const targetUser = await interaction.guild.members.fetch(mentionable);
    if (!targetUser) {
      await interaction.editReply("That user doesn't exist in this server.");
      return;
    }

    if (targetUser.user.bot) {
      await interaction.editReply("I can't timeout a bot.");
      return;
    }

    const msDuration = ms(duration);
    if (isNaN(msDuration)) {
      await interaction.editReply('Please provide a valid timeout duration.');
      return;
    }

    if (msDuration < 5000 || msDuration > 2.419e9) {
      await interaction.editReply('Timeout duration cannot be less than 5 seconds or more than 28 days.');
      return;
    }

    const targetUserRolePosition = targetUser.roles.highest.position; // Highest role of the target user
    const requestUserRolePosition = interaction.member.roles.highest.position; // Highest role of the user running the cmd
    const botRolePosition = interaction.guild.members.me.roles.highest.position; // Highest role of the bot

    if (targetUserRolePosition >= requestUserRolePosition) {
      await interaction.editReply("You can't timeout that user because they have the same/higher role than you.");
      return;
    }

    if (targetUserRolePosition >= botRolePosition) {
      await interaction.editReply("I can't timeout that user because they have the same/higher role than me.");
      return;
    }

    // Timeout the user
    try {
      const { default: prettyMs } = await import('pretty-ms');

      if (targetUser.isCommunicationDisabled()) {
        await targetUser.timeout(msDuration, reason);
        await interaction.editReply(`${targetUser}'s timeout has been updated to ${prettyMs(msDuration, { verbose: true })}\nReason: ${reason}`);
        return;
      }

      await targetUser.timeout(msDuration, reason);
      await interaction.editReply(`${targetUser} was timed out for ${prettyMs(msDuration, { verbose: true })}.\nReason: ${reason}`);
    } catch (error) {
      console.log(`There was an error when timing out: ${error}`);
    }
  },

  name: 'timeout',
  description: 'Timeout a user.',
  options: [
    {
      name: 'target-user',
      description: 'The user you want to timeout.',
      type: ApplicationCommandOptionType.Mentionable,
      required: true,
    },
    {
      name: 'duration',
      description: 'Timeout duration (30m, 1h, 1 day).',
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: 'reason',
      description: 'The reason for the timeout.',
      type: ApplicationCommandOptionType.String,
    },
  ],
  permissionsRequired: [PermissionFlagsBits.MuteMembers],
  botPermissions: [PermissionFlagsBits.MuteMembers],
};