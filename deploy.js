const { REST, Routes } = require("discord.js");
const { clientId, guildId } = require("./config.json");
const fs = require("node:fs");
const path = require("node:path");
// const { QuickDB } = require('quick.db');
// const db = new QuickDB({ filePath: 'database.sqlite' });
require("dotenv").config();

const commands = [];
const foldersPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(foldersPath);

// async function test() {
// 	await db.init();
// 	// await db.push('testuser.ticket', "hello")
// 	// await db.push('testuser.ticket', "world")
// 	// await db.pull('testuser.ticket', "world")
// 	await db.set('testuser', { ticket: [] });
// 	// await db.get('testuser').then(r => console.log(r))
// 	console.log(await db.get('testuser'));
// }
// test();

for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".js"));

  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);

    if ("data" in command && "execute" in command) {
      commands.push(command.data.toJSON());
    }
 else {
      console.log(
        `[WARNING] The command at "${filePath}" is missing a required "data" or "execute" property.`,
      );
    }
  }
}

const rest = new REST({ version: 9 }).setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    console.log(
      `Started refreshing ${commands.length} application (/) commands.`,
    );

    const data = await rest.put(
      Routes.applicationGuildCommands(clientId, guildId),
      { body: commands },
    );

    console.log(
      `Successfully reloaded ${data.length} application (/) commands.`,
    );
  }
 catch (error) {
    console.error(error);
  }
})();
