const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Get help with the bot")
    .addStringOption((option) =>
      option
        .setName("command")
        .setDescription("The command to get help with")
        .setRequired(false),
    ),
  async execute(interaction) {
    const command = interaction.options.getString("command");
    if (command) {
      const cmd = interaction.client.commands.get(command);
      if (!cmd) {
        return await interaction.reply({
          content: "That command does not exist",
          ephemeral: true,
        });
      }
      const data = [];
      data.push(`**Name:** ${cmd.data.name}`);
      data.push(`**Description:** ${cmd.data.description}`);
      if (cmd.data.options) {
        data.push("**Options:**");
        cmd.data.options.forEach((option) => {
          data.push(`**Name:** ${option.name}`);
          data.push(`**Description:** ${option.description}`);
          if (option.choices) {
            data.push("**Choices:**");
            option.choices.forEach((choice) => {
              data.push(`**Name:** ${choice.name}`);
              data.push(`**Value:** ${choice.value}`);
            });
          }
          if (option.options) {
            data.push("**Sub-options:**");
            option.options.forEach((suboption) => {
              data.push(`**Name:** ${suboption.name}`);
              data.push(`**Description:** ${suboption.description}`);
              if (suboption.choices) {
                data.push("**Choices:**");
                suboption.choices.forEach((choice) => {
                  data.push(`**Name:** ${choice.name}`);
                  data.push(`**Value:** ${choice.value}`);
                });
              }
            });
          }
        });
      }
      const embed = new EmbedBuilder()
        .setTitle("Command Help")
        .setDescription(data.join("\n"));
      // .setColor();
      return await interaction.reply({ embeds: [embed] });
    }
    const commands = interaction.client.commands
      .map((cmd) => cmd.data.name)
      .join("\n");
    const embed = new EmbedBuilder()
      .setTitle("Command List")
      .setDescription(commands);
    // .setColor("RANDOM");
    return await interaction.reply({ embeds: [embed] });
  },
};
