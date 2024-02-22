module.exports = {
  name: "messageCreate",
  execute: (message) => {
    if (!message.content.startsWith("!") || message.author.bot) return;

    const args = message.content.slice(1).split(/ +/);
    const cmd = args.shift();
    if (cmd == "deploy" && message.guild.id === process.env.GUILD_ID) {
      require("../deploy")().then((data) => {
        if (data.type == "error") {
          message.channel.send(
            "```xml\n" + require("util").inspect(data.error) + "```",
          );
        }
 else {
          message.channel.send("```\n" + data.logs.join("\n") + "```");
        }
      });
    }
  },
};
