const {
  SlashCommandBuilder,
  EmbedBuilder,
  AttachmentBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("eval")
    .setDescription("Evaluate a code")
    .addStringOption((option) =>
      option
        .setName("code")
        .setDescription("The code to evaluate")
        .setRequired(true),
    ),
  async execute(interaction) {
    const clean = async (text) => {
      // If our input is a promise, await it before continuing
      if (text && text.constructor?.name == "Promise") text = await text;

      // If the response isn't a string, `util.inspect()`
      // is used to 'stringify' the code in a safe way that
      // won't error out on objects with circular references
      // (like Collections, for example)
      if (typeof text !== "string") {
        text = require("util").inspect(text, { depth: 1 });
      }

      // Replace symbols with character code alternatives
      text = text
        .replace(/`/g, "`" + String.fromCharCode(8203))
        .replace(/@/g, "@" + String.fromCharCode(8203))
        .replaceAll(interaction.client.token, "[TOKEN]");

      // Send off the cleaned up result
      return text;
    };
    const attName = "eval_output.js";
    // const attSpoiler = true;
    const respondWithOutput = true;
    const sendAtt = true;
    // message before eval
    const msg = await interaction.reply({
      content: "Evaluating...",
      fetchReply: true,
    });
    const embed = new EmbedBuilder();
    const attachment = new AttachmentBuilder();
    attachment.setName("eval_output.txt");
    attachment.setSpoiler(true);
    embed.setTitle("eval output");
    embed.addFields([
      {
        name: "Timestamp",
        value: `<t:${Math.round(Date.now() / 1000)}:f> (<t:${Math.round(Date.now() / 1000)}:R>)`,
      },
    ]);
    embed.setTimestamp();
    // embed.setColor("RANDOM");
    try {
      // Evaluate (execute) our input
      // eslint-disable-next-line no-async-promise-executor
      const evaled = await new Promise(async (_res, rej) => {
        let resolved = false;
        const res = (...args) => {
          resolved = true;
          _res(...args);
        };
        try {
          const exec = await eval(interaction.options.getString("code"));
          if (!resolved) res(exec);
        }
 catch (e) {
          rej(e);
        }
      });

      // Put our eval result through the function
      // we defined above
      const cleaned = await clean(evaled);
      attachment.setFile(Buffer.from(cleaned), attName);

      // Reply in the channel with our result
      embed.setDescription(
        `\`\`\`js\n${cleaned.slice(0, 2000)}${cleaned.length > 2000 ? "..." : ""}\n\`\`\``,
      );
    }
 catch (err) {
      const cleaned = await clean(err);
      embed.setColor("RED");
      embed.setTitle("eval error");
      attachment.setFile(Buffer.from(cleaned), "error.log");

      // Reply in the channel with our error
      embed.setDescription(
        `\`ERROR\` \`\`\`xl\n${cleaned.slice(0, 2000)}\n\`\`\``,
      );
    }
    if (respondWithOutput) {
      msg.edit({ embeds: [embed], files: sendAtt ? [attachment] : [] });
    }
    if (!respondWithOutput) msg.delete();
  },
};
