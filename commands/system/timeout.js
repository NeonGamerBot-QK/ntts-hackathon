// const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
// const ms = require("ms");

// module.exports = {
//   data: new SlashCommandBuilder()
//     .setName("timeout")
//     .setDescription("Timeout a user")
//     .addUserOption((option) =>
//       option
//         .setName("user")
//         .setDescription("The user to timeout")
//         .setRequired(true),
//     )
//     .addStringOption((option) =>
//       option
//         .setName("duration")
//         .setDescription(
//           "The duration of the timeout, ex- 1d 2hrs 3 minutes 4 days",
//         )
//         .setRequired(true),
//     )
//     .addStringOption((option) =>
//       option
//         .setName("reason")
//         .setDescription("The reason for the timeout")
//         .setRequired(false),
//     ),
//   async execute(interaction) {
//     const user = interaction.options.getUser("user");
//     const member = interaction.guild.members.cache.get(user.id);
//     const duration = interaction.options.getString("duration");
//     const reason =
//       interaction.options.getString("reason") || "No reason provided";

//     const errorArrays = [];

//     const errorsEmbed = new EmbedBuilder()
//       .setAuthor({ name: "Could not timeout user due to: " })
//       .setColor("Red")
//       .setTimestamp();

//     const successEmbed = new EmbedBuilder()
//       .setAuthor({ name: `${user.tag} has been timed out ` })
//       .setDescription(`Duration: ${duration}\nReason: ${reason}`)
//       .setColor("Green")
//       .setTimestamp();

//     if (!member) {
//       return interaction.reply({
//         embeds: [
//           errorsEmbed.setDescription("Selected member is not in the server"),
//         ],
//         ephemeral: true,
//       });
//     }

//     if (!ms(duration) || ms(duration) > ms("28d")) {
//       errorArrays.push(
//         "Invalid duration or duration must be less than 28 days",
//       );
//     }

//     if (!member.manageable) {
//       errorArrays.push("You do not have permissions to timeout this user");
//     }

//     if (
//       member.roles.highest.position > interaction.member.roles.highest.position
//     ) {
//       errorArrays.push("You cannot timeout a user with a higher role than you");
//     }

//     if (member.isCommunicationDisabled() === true) {
//       errorArrays.push("User is already timed out");
//     }

//     if (errorArrays.length) {
//       return interaction.reply({
//         embeds: [errorsEmbed.setDescription(errorArrays.join("\n"))],
//         ephemeral: true,
//       });
//     }

//     const durationms = ms(duration);
//     await member.timeout(durationms, reason).catch((err) => {
//       interaction.reply({
//         embeds: [
//           errorsEmbed.setDescription(
//             "Could not timeout user due to an unknown error",
//           ),
//         ],
//         ephemeral: true,
//       });
//       return console.log(err);
//     });

//     await interaction.reply({ embeds: [successEmbed] });
//   },
// };

const { PermissionFlagsBits } = require('discord.js')
const { EmbedBuilder, SlashCommandBuilder } = require('@discordjs/builders')
const ms = require('ms')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('timeout')
    .setDMPermission(false)
    .setDescription('Timeout a user')
    .addUserOption((option) =>
      option
        .setName('user')
        .setDescription('The user you want to timeout')
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName('duration')
        .setDescription('Duration of the timeout')
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName('reason')
        .setDescription('Reason for the timeout')
        .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction) {
    try {
      await interaction.deferReply()

      const targetUserID = interaction.options.getUser('user')
      const targetUser = await interaction.guild.members.fetch(targetUserID)
      const duration = interaction.options.getString('duration')
      const reason =
        interaction.options.getString('reason') || 'No reason provided.'

      const errEmbed = new EmbedBuilder().setColor(colors.red)

      if (!targetUser) {
        errEmbed.setDescription(`Looks like that user isn't in this server`)
        await interaction.editReply({
          embeds: [errEmbed],
        })
        return
      }

      if (targetUser.bot) {
        errEmbed.setDescription(`You cannot timeout a bot`)
        await interaction.editReply({
          embeds: [errEmbed],
        })
        return
      }

      if (targetUser.id == interaction.member.id) {
        errEmbed.setDescription(`You cannot timeout yourself`)
        await interaction.editReply({
          embeds: [errEmbed],
        })
        return
      }

      if (targetUser.id === interaction.guild.ownerId) {
        errEmbed.setDescription(
          `You are not allowed to timeout that user. They are the server owner`
        )
        await interaction.editReply({
          embeds: [errEmbed],
        })
        return
      }

      const msDuration = ms(duration)
      if (isNaN(msDuration)) {
        errEmbed.setDescription(`Please provide a valid time duration`)
        await interaction.editReply({ embeds: [errEmbed] })
        return
      }

      if (msDuration < 5000 || msDuration > 2419200000) {
        errEmbed.setDescription(
          `The timeout duration must be between 5 seconds and 28 days`
        )
        await interaction.editReply({ embeds: [errEmbed] })
        return
      }

      const targetUserRolePosition = targetUser.roles.highest.position
      const requestUserRolePosition = interaction.member.roles.highest.position
      const botRolePosition =
        interaction.guild.members.me.roles.highest.position

      if (targetUserRolePosition >= requestUserRolePosition) {
        errEmbed.setDescription(
          'You cannot timeout someone higher than or equal to you'
        )
        await interaction.editReply({
          embeds: [errEmbed],
        })
        return
      }

      if (targetUserRolePosition >= botRolePosition) {
        errEmbed.setDescription(
          'I cannot timeout someone higher than or equal to me'
        )
        await interaction.editReply({
          embeds: [errEmbed],
        })
        return
      }

      const { default: prettyMs } = await import('pretty-ms')
      const embed = new EmbedBuilder().setColor("Red").setFooter({
        text: `Reason: ${reason}\nModerator: ${
          interaction.user.username
        }\nDuration: ${prettyMs(msDuration)}`,
      })

      const dmEmbed = new EmbedBuilder()
        .setColor("Red")
        .setTitle(`You have been timed out!`)
        .setDescription(
          `Reason: ${reason}\nServer: ${
            interaction.guild.name
          }\nDuration: ${prettyMs(msDuration)}`
        )

      if (!targetUser.dmChannel) await targetUser.createDM()

      await targetUser.dmChannel.send({
        embeds: [dmEmbed],
      })

      if (targetUser.isCommunicationDisabled()) {
        await targetUser.timeout(msDuration, reason)
        await interaction.editReply({
          content: `**${targetUser}'s timeout has been updated!**`,
          embeds: [embed],
        })
        return
      }

      await targetUser.timeout(msDuration, reason)
      await interaction.editReply({
        content: `**${targetUser} has been timed out!**`,
        embeds: [embed],
      })
    } catch (error) {
      await interaction.editReply('Oops! There was an error.').then((msg) => {
        setTimeout(() => {
          msg.delete()
        }, 10000)
      })
      console.log(error)
    }
  },
}