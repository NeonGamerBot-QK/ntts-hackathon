const { ActivityType } = require("discord.js");
module.exports = {
  name: "ready",
  once: true,
  async execute(client) {
    let sCount = client.guilds.cache.size;
    const ascii =
      "   ____        _                        _       \n  | __ )  ___ | |_   _ __ ___  __ _  __| |_   _ \n  |  _ \\ / _ \\| __| | '__/ _ \\/ _' |/ _' | | | |\n  | |_) | (_) | |_  | | |  __/ (_| | (_| | |_| |\n  |____/ \\___/ \\__| |_|  \\___|\\__,_|\\__,_|\\__, |\n                                          |___/ ";
    console.log(
      `Logged in as ${client.user.tag}\nThis bot is in ${sCount} servers\n${ascii}\n\n`,
    );
    client.user.setActivity(`${sCount} Servers`, {
      type: ActivityType.Watching,
    });
    setInterval(
      () => {
        sCount = client.guilds.cache.size;
        client.user.setActivity(`${sCount} Servers`, {
          type: ActivityType.Watching,
        });
      },
      5 * 1000 * 60,
    );
  },
};
