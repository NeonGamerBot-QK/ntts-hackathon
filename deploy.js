const { REST, Routes } = require("discord.js");
require("dotenv").config();
// const { clientId, guildId, token } = require('./config.json');
const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID;
const token = process.env.DISCORD_TOKEN;
const fs = require("node:fs");
const path = require("node:path");

// Grab all the command folders from the commands directory you created earlier
const foldersPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(foldersPath);

module.exports = async () => {
  const logs = [];
const commands = [];

  for (const folder of commandFolders) {
    // Grab all the command files from the commands directory you created earlier
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs
      .readdirSync(commandsPath)
      .filter((file) => file.endsWith(".js"));
    // Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
    for (const file of commandFiles) {
      const filePath = path.join(commandsPath, file);
      console.log(filePath);
      let command;
      try {
        command = require(filePath);
      }
 catch (e) {
        console.error(e);
        logs.push(`[ERROR] ${e}`);
        continue;
      }
      if ("data" in command && "execute" in command) {
        console.log(command.data.name);
        commands.push(command.data.toJSON());
        logs.push(`[INFO] ${command.data.name} added to commands list`);
      }
 else {
        console.log(
          `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`,
        );
        logs.push(
          `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`,
        );
      }
    }
  }

  // Construct and prepare an instance of the REST module
  const rest = new REST().setToken(token);
  // and deploy your commands!
  // (async () => {
  try {
    console.log(
      `Started refreshing ${commands.length} application (/) commands.`,
    );
    console.log(commands);
    // The put method is used to fully refresh all commands in the guild with the current set
    const data = await rest.put(
      Routes.applicationGuildCommands(clientId, guildId),
      { body: commands },
    );

    console.log(
      `Successfully reloaded ${data.length} application (/) commands.`,
    );
    return {
      type: "success",
      message: `Successfully reloaded ${data.length} application (/) commands.`,
      logs,
    };
  }
 catch (error) {
    // And of course, make sure you catch and log any errors!
    console.error(error);
    return { type: "error", message: error };
  }
  // })();
};
