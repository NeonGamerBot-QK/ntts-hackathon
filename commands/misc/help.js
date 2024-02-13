const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Get help with the bot")
    .addStringOption((option) =>
      option
        .setName("command")
        .setDescription("The command to get help with")
        .setRequired(false)
        .setAutocomplete(true),
    ),
  async autocomplete(interaction) {
    const focusedValue = interaction.options.getFocused();
    await interaction.respond(
      interaction.guild.commands.cache
        .filter((cmd) => {
          return (
            cmd.name.startsWith(focusedValue) ||
            cmd.description.includes(focusedValue)
          );
        })
        .map((cmd) => {
          return { name: cmd.name, value: cmd.id };
        }),
    );
  },
  async execute(interaction) {
    const command = interaction.options.getString("command");
    if (command) {
      const cmd = interaction.guild.commands.cache.get(command);
      if (!cmd) {
        return await interaction.reply({
          content: "That command does not exist",
          ephemeral: true,
        });
      }
      const data = [];
      data.push(`**Name:** ${cmd.name}`);
      data.push(`**Description:** ${cmd.description}`);
      if (cmd.options) {
        data.push("**Options:**");
        cmd.options.forEach((option) => {
          data.push(
            `**Name:** ${option.type == 1 ? `</${cmd.name} ${option.name}:${cmd.id}>` : option.name}`,
          );
          data.push(`**Description:** ${option.description}`);
          // if(option.type == 1) {
          //   // data.push(`**Type:** Sub-command`);
          // }
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
    await interaction.guild.commands.fetch();
    const embed = new EmbedBuilder().setTitle("Command List");
    const commands = interaction.guild.commands.cache.map((cmd) => {
      // console.log(cmd);
      const str = `</${cmd.name}:${cmd.id}> - ${cmd.description}\n`;
      const subCmds = null;
      // cmd.options
      //   .filter((e) => e.type == 1)
      //   .map((subCmd) => {
      //     return `> </${cmd.name} ${subCmd.name}:${cmd.id}> - ${subCmd.description}`;
      //   });
      // str += subCmds.join("\n");
      return subCmds ? { name: str, value: subCmds.join("\n") } : str;
    });
    // command
    let fstr = "";
    commands.forEach((cmd) => {
      if (typeof cmd === "string") {
        fstr += cmd;
      }
 else {
        // fstr += cmd.name + '\n' + cmd.value;
        embed.addFields({ name: cmd.name, value: cmd.value });
      }
    });
    embed.setDescription(fstr)
     .join("\n");

    // .setColor("RANDOM");
    return await interaction.reply({ embeds: [embed] });
  },
};
