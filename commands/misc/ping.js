const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Fr it's a ping, what do you expect")
    .setDMPermission(true),
  async execute(interaction) {
    const client = interaction.client;
    try {
      interaction.message = await interaction.reply("pinging...");
      // Uptime
      const uptime = process.uptime();
      const uptimeString = formatUptime(uptime);
      console.log(interaction.message);
      await interaction.editReply({
        content: "",
        embeds: [
          new EmbedBuilder()
            .setTitle("Bot Info")
            .setDescription("API - Ping - Uptime")
            .setColor("DarkBlue")
            .setTimestamp(Date.now())
            .setFooter({
              iconURL: interaction.user.displayAvatarURL(),
              text: interaction.user.tag,
            })
            .addFields([
              {
                name: "• API Latency",
                value: `> \`🟢 ${client.ws.ping}ms\``,
                inline: true,
              },
              {
                name: "• Ping",
                value: `> \`🟠 ${interaction.message.createdTimestamp - interaction.createdTimestamp}ms\``,
                inline: true,
              },
              {
                name: "• Uptime",
                value: `> \`🟢 ${uptimeString}\` <t:${Math.round(Date.now() / 1000 - process.uptime())}:R>`,
                inline: false,
              },
            ]),
        ],
      });
    }
 catch (err) {
      console.error(err);
      interaction.editReply({
        content: "An error came while executing this command.",
      });
    }
  },
};

// Uptime Function
function formatUptime(uptime) {
  const seconds = Math.floor(uptime % 60);
  const minutes = Math.floor((uptime / 60) % 60);
  const hours = Math.floor((uptime / (60 * 60)) % 24);
  const days = Math.floor(uptime / (60 * 60 * 24));

  return `${days}d ${hours}h ${minutes}m ${seconds}s`;
}
