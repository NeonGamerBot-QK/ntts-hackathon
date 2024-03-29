require("dotenv").config();
const fs = require("fs");
const path = require("path");
const JSONDb = require("simple-json-db");
const discord = require("discord.js");
const { Events } = require("discord.js");
const client = new discord.Client({
  intents: Object.values(discord.GatewayIntentBits),
});
const db = new JSONDb(path.join(__dirname, "..", "db.json"));
client.db = db;
// tickets database cuz tickets are a lot of space
client.tdb = new JSONDb(path.join(__dirname, "..", "tdb.json"));
// this is just incase i paste code and forget to change stuff
// eslint-disable-next-line no-unused-vars
const discord_c = client;

client.on("ready", () => {
  console.log(`Ready on ${client.user.tag}`);
  client.user.setStatus("dnd");
  // client.user.setActivity("⚡Comming Soon");
  console.log("damon ready event"); // configured to set state to starting
  let exiting = false;
  setInterval(() => {
    const cap = function(str, length) {
      if (str == null || str?.length <= length) return str;

      return str.substr(0, length) + "**\u2026**";
    };
    const bcommitMessage = require("child_process")
      .execSync("git log -1 --pretty=%B")
      .toString();
    const bhash = fs.readFileSync(".git/refs/heads/main").toString();
    require("child_process").exec("git pull -v", (error, stdout) => {
      const response = (error ? error.message : error) || stdout;
      if (!error) {
        if (!response.includes("Already up to date.")) {
          console.log("New Files!!");
          console.log(response);
          const commitMessage = require("child_process")
            .execSync("git log -1 --pretty=%B")
            .toString();
          const hash = fs.readFileSync(".git/refs/heads/main").toString();
          const compareStr =
            response.split("Updating ")[1].split("\n")[0].trim() ||
            `${bhash}...${hash}`;
          const content = `<t:${Date.now().toString().slice(0, -3)}:f> Automatic update from GitHub, pulling files. [\`${compareStr}\`](<https://github.com/NeonGamerBot-QK/ntts-hackathon/compare/${compareStr}>)
          \`\`\`${cap(response, 1700)}\`\`\`
## Current Branch 
          [\`View Changes\`](https://github.com/NeonGamerBot-QK/ntts-hackathon/commit/${bhash})     [\`Branch\`](https://github.com/NeonGamerBot-QK/ntts-hackathon/tree/${bhash})       **Commit Message**: \`${bcommitMessage.replace("\n", "")}\`
## Latest Branch
          [\`View Changes\`](https://github.com/NeonGamerBot-QK/ntts-hackathon/commit/${hash})     [\`Branch\`](https://github.com/NeonGamerBot-QK/ntts-hackathon/tree/${hash})       **Commit Message**: \`${commitMessage}\``;
          client.users.cache
            .get("566766267046821888")
            .send(content)
            .then((e) => e.suppressEmbeds(true));
          client.channels.cache
            .get("1205883972807172186")
            .send(content)
            .then((m) => {
              m.suppressEmbeds(true);
              console.log("ALL MESSAGES SENT!!");
              exiting = true;
              setTimeout(() => {
                console.log("Bye Bye!");
                process.exit();
              }, 5_000);
            });
        }
        // if its already exiting then it is really this error
      }
 else if (
        error.message.includes(
          "error: Your local changes to the following files would be overwritten by merge:",
        ) &&
        !exiting
      ) {
        const files = error.message
          .split(
            "error: Your local changes to the following files would be overwritten by merge:",
          )[1]
          .split(
            "Please commit your changes or stash them before you merge.",
          )[0]
          .split("\n")
          .map((e) => e.trim())
          .filter(Boolean);
        console.log("removing files", files);
        const stashPath = `.merge-conflict/${new Date().toISOString()}/`;
        fs.mkdirSync(stashPath);
        files.forEach((f) => {
          if (fs.existsSync(f)) {
            fs.copyFileSync(f, `${stashPath}${f}`);
            fs.rmSync(f);
          }
        });
        console.log("stashed && removed files");
        client.users.cache
          .get("566766267046821888")
          .send(
            `<t:${Date.now().toString().slice(0, -3)}:f> Merge Conflict!! \n\`\`\`${cap(response, 1900)}\`\`\``,
          )
          .then((e) => e.suppressEmbeds(true));
        client.channels.cache
          .get("1205883972807172186")
          .send(
            `<t:${Date.now().toString().slice(0, -3)}:f> Merge Conflict!!!\n\`\`\`${cap(response, 1900)}\`\`\``,
          )
          .then((e) => e.suppressEmbeds(true));
      }
    });
  }, 15_000);
});
client.commands = new discord.Collection();
// client.server = require("./server")();
const foldersPath = path.join(__dirname, "..", "commands");
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".js"));
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    try {
      const command = require(filePath);
      // Set a new item in the Collection with the key as the command name and the value as the exported module
      if ("data" in command && "execute" in command) {
        client.commands.set(command.data.name, command);
      }
 else {
        console.log(
          `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`,
        );
      }
    }
 catch (e) {
      // welp no command
      console.log("[ERROR] ", e);
    }
  }
}

client.on(Events.InteractionCreate, async (interaction) => {
  if (interaction.isAutocomplete()) {
    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
      console.error(
        `No command matching ${interaction.commandName} was found.`,
      );
      return;
    }

    try {
      await command.autocomplete(interaction);
    }
 catch (error) {
      console.error(error);
    }
    //  return;
  }
  if (!interaction.isChatInputCommand()) return;

  const command = interaction.client.commands.get(interaction.commandName);

  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }

  try {
    await command.execute(interaction);
  }
 catch (error) {
    console.error(error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    }
 else {
      await interaction.reply({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    }
  }
});

const eventsPath = path.join(__dirname, "..", "events");
const eventFiles = fs
  .readdirSync(eventsPath)
  .filter((file) => file.endsWith(".js"));

for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file);
  const event = require(filePath);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...[...args, client]));
  }
 else {
    client.on(event.name, (...args) => event.execute(...[...args, client]));
  }
}
process.on("uncaughtException", (err) => {
  console.error(err);
});
client.login(process.env.DISCORD_TOKEN);