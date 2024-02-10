const { SlashCommandBuilder } = require("@discordjs/builders");
const { PermissionsBitField, EmbedBuilder } = require("discord.js");
// const { Banlogchannel } = require('../../config.json')
// const { SystemMsg } = require('../../local.json')
const SystemMsg = {
  UnbanMsg: {
    Title: "User Unbanned",
    Message: "You have been unbanned from the server",
    LogMsg: "USER has been unbanned by ADMIN",
  },
};
module.exports = {
  data: new SlashCommandBuilder()
    .setName("unban")
    .setDescription("Unban a user")
    .setDMPermission(false)
    .addUserOption((options) =>
      options
        .setName("user")
        .setDescription("User you want to unban")
        .setRequired(true),
    ),

  async execute(interaction) {
    const Banlogchannel = null;
    const user = interaction.options.getUser("user");

    if (
      !interaction.member.permissions.has(
        PermissionsBitField.Flags.Administrator,
      )
    ) {
      return interaction.reply({
        content: "**You don't have the permission**",
        ephemeral: true,
      });
    }
 else if (!user) {
      return interaction.reply({
        content: "you didn't enter user",
        ephemeral: true,
      });
    }

    try {
      await interaction.guild.bans.fetch();
      interaction.guild.bans.remove(user);

      const embed = new EmbedBuilder()
        .setColor(0xffa600)
        .setTitle(SystemMsg.KickMsg.Title)
        .setDescription(
          SystemMsg.UnbanMsg.Message.replace("USER", `<@${user.id}>`),
        );

      const log = new EmbedBuilder()
        .setColor(0x34ebe5)
        .setTitle("User Unbanned")
        .setDescription(
          SystemMsg.UnbanMsg.LogMsg.replace("USER", `<@${user.id}>`).replace(
            "ADMIN",
            `<@${interaction.user.id}>`,
          ),
        );

      interaction.reply({ embeds: [embed] });

      const channel = interaction.guild.channels.cache.get(Banlogchannel);
      channel.send({ embeds: [log] });
    }
 catch (error) {
      const embed = new EmbedBuilder()
        .setColor(0xffa600)
        .setTitle("Error")
        .setDescription(
          "**Error message: **the user you want to unban is not in server\n(or not banned)",
        )
        .setTimestamp();

      interaction.reply({ embeds: [embed], ephemeral: true });
    }
  },
};
