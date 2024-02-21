const { SlashCommandBuilder } = require("discord.js");
const ms = require("ms");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("mute")
    .setDescription("Mute a user")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to mute")
        .setRequired(true),
    )
    .addStringOption((option) =>
      option
        .setName("duration")
        .setDescription("The duration of the mute, ex- 1d 2hrs 3 minutes 4 days")
        .setRequired(true),
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("The reason for the mute")
        .setRequired(false),
    ),
  async execute(interaction) {
    const user = interaction.options.getUser("user");
    const member = interaction.guild.members.cache.get(user.id);
    const duration = interaction.options.getInteger("duration");
    const reason =
      interaction.options.getString("reason") || "No reason provided";
    if (
      member.roles.highest.position >= interaction.member.roles.highest.position
    ) {
return interaction.reply({
        content: "You can't mute someone with a higher or equal role",
        ephemeral: true,
      });
}
    if (!member.manageable) {
return interaction.reply({
        content: "I can't mute that user",
        ephemeral: true,
      });
}
    const muteRole = interaction.guild.roles.cache.find(
      (role) => role.name.toLowerCase() === "muted",
    );
    if (!muteRole) {
return interaction.reply({
        content: "There is no mute role in this server",
        ephemeral: true,
      });
}
    if (member.roles.cache.has(muteRole.id)) {
return interaction.reply({
        content: "The user is already muted",
        ephemeral: true,
      });
}
    await member.roles.add(muteRole, reason);
    await member.timeout(duration*1000);
    console.log(ms(duration))
    setTimeout(() => member.roles.remove(muteRole), duration*1000)
    await interaction.reply({ content: `Muted ${user.tag} for \`<t:${duration}:R>\`\nReason: ${reason}` });
  },
};
