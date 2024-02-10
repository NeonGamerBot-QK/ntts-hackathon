const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { exec, execSync } = require("child_process");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("npmi")
    .setDescription("DEVS: install a package for this robot")
    .addStringOption((o) =>
      o
        .setName("pkgs")
        .setDescription("The NPM packages to install")
        .setRequired(true),
    ),
  async execute(interaction) {
    let pkgs = interaction.options.getString("pkgs");
    if (!pkgs) return interaction.reply("No packages provided");
    const m = await interaction.reply({
      content: `Installing ${pkgs}...`,
      fetchReply: true,
    });
    exec(`npm i ${pkgs}`, (err, stdout, stderr) => {
      if (err) return message.author.send(`Error: ${err.message}`);
      // use git add on package.json and yarn.lock using child process
      execSync("git add package.json yarn.lock", { stdio: "inherit" });
      execSync(`git commit -m "➕ dep: install ${pkgs}"`, { stdio: "inherit" });
      execSync("git push", { stdio: "inherit" });
      m.edit(`\`\`\`\n${stdout}\n\`\`\``);
      if (stderr) {
        m.reply(`\`\`\`\n${stderr}\n\`\`\``);
      }
    });
  },
};
