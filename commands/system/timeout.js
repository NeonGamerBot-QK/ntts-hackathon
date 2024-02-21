const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const ms = require("ms");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("timeout")
    .setDescription("Timeout a user")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to timeout")
        .setRequired(true),
    )
    .addStringOption((option) =>
      option
        .setName("duration")
        .setDescription("The duration of the timeout, ex- 1d 2hrs 3 minutes 4 days")
        .setRequired(true),
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("The reason for the timeout")
        .setRequired(false),
    ),
  async execute(interaction) {
    const user = interaction.options.getUser("user");
    const member = interaction.guild.members.cache.get(user.id);
    const duration = interaction.options.getString("duration");
    const reason = interaction.options.getString("reason") || "No reason provided";

    const errorArrays = [];

    const errorsEmbed = new EmbedBuilder()
      .setAuthor({ name: 'Could not timeout user due to: '})
      .setColor('Red')
      .setTimestamp()

    const successEmbed = new EmbedBuilder()
      .setAuthor({ name: `${user.tag} has been timed out `})
      .setDescription(`Duration: ${duration}\nReason: ${reason}`)
      .setColor('Green')
      .setTimestamp()

    if (!member) {
      return interaction.reply({
        embeds: [errorsEmbed.setDescription("Selected member is not in the server")],
        ephemeral: true,
      })
    }

    if (!ms(duration) || ms(duration) > ms("28d")) {
      return errorArrays.push("Invalid duration or duration must be less than 28 days");
    }

    if (!member.manageable || !member.moderable) {
      return errorArrays.push("You do not have permissions to timeout this user");
    }

    if (member.roles.highest.position > interaction.member.roles.highest.position) {
      return errorArrays.push("You cannot timeout a user with a higher role than you");
    }

    if (member.isCommunicationDisabled() === true) {
      return errorArrays.push("User is already timed out");
    }
    
    if (errorArrays.length) {
      return interaction.reply({
        embeds: [errorsEmbed.setDescription(errorArrays.join("\n"))],
        ephemeral: true,
      })
    }

    const durationms = ms(duration);
    await member.timeout(durationms, reason).catch((err) => {
      interaction.reply({
        embeds: [errorsEmbed.setDescription("Could not timeout user due to an unknown error")],
        ephemeral: true,
      })
      return console.log(err);
    })

    await interaction.reply({ embeds: [successEmbed] });
  },
};
