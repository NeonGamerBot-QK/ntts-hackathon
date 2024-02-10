// https://www.npmjs.com/package/discord-image-generation
const {
  SlashCommandBuilder,
  SlashCommandSubcommandBuilder,
} = require("discord.js");
const { EmbedBuilder } = require("@discordjs/builders");
const DIG = require("discord-image-generation");
const imageGenCmds = [];
// const multiParams = [];
Object.keys(DIG).forEach((key) => {
  const func = DIG[key];
  if (key === "Blur") {
    imageGenCmds.push({
      data: new SlashCommandSubcommandBuilder()
        .setName(key.toLocaleLowerCase())
        .setDescription(`Generate a ${key} image`)
        .addUserOption((options) =>
          options
            .setName("user")
            .setDescription("Avatar for the image")
            .setRequired(false),
        )
        .addNumberOption((options) =>
          options
            .setName("radius")
            .setDescription("Radius of the blur")
            .setRequired(false),
        ),
      exec: (interaction) => {
        const user = interaction.options.getUser("user") || interaction.user;
        const blurRadius = interaction.options.getNumber("radius") || 5;
        const avatar = user.displayAvatarURL({ format: "png" });
        const img = new func().getImage(avatar, blurRadius);
        const embed = new EmbedBuilder()
          .setTitle("Image Generation")
          .setDescription(
            `**This is **${user}**'s photo post**\nThis is the link:\n\`${avatar}\``,
          )
          .setTimestamp();
        interaction.reply({ embeds: [embed], files: [img] });
      },
    });
  }
 else if (key == "Blink") {
    imageGenCmds.push({
      data: new SlashCommandSubcommandBuilder()
        .setName(key.toLocaleLowerCase())
        .setDescription(`Generate a ${key} image`)
        .addUserOption((options) =>
          options
            .setName("user")
            .setDescription("Avatar for the image")
            .setRequired(false),
        ),
      exec: (interaction) => {
        const user = interaction.options.getUser("user") || interaction.user;
        const avatar = user.displayAvatarURL({ format: "png" });
        const img = new func().getImage(avatar);
        const embed = new EmbedBuilder()
          .setTitle("Image Generation")
          .setDescription(
            `**This is **${user}**'s photo post**\nThis is the link:\n\`${avatar}\``,
          )
          .setTimestamp();
        interaction.reply({ embeds: [embed], files: [img] });
      },
    });
  }
 else if (key == "Batslap") {
    imageGenCmds.push({
      data: new SlashCommandSubcommandBuilder()
        .setName(key.toLocaleLowerCase())
        .setDescription(`Generate a ${key} image`)
        .addUserOption((options) =>
          options
            .setName("user")
            .setDescription("Avatar for the persons getting slapped")
            .setRequired(false),
        ),
      exec: (interaction) => {
        const user = interaction.options.getUser("user") || interaction.user;
        const avatar = user.displayAvatarURL({ format: "png" });
        const img = new func().getImage(
          interaction.user.displayAvatarURL({ format: "png" }),
          avatar,
        );
        const embed = new EmbedBuilder()
          .setTitle("Image Generation")
          .setDescription(
            `**This is **${user}**'s photo post**\nThis is the link:\n\`${avatar}\``,
          )
          .setTimestamp();
        interaction.reply({ embeds: [embed], files: [img] });
      },
    });
  }
 else if (key === "Bed") {
    imageGenCmds.push({
      data: new SlashCommandSubcommandBuilder()
        .setName(key.toLocaleLowerCase())
        .setDescription(`Generate a ${key} image`)
        .addUserOption((options) =>
          options
            .setName("user")
            .setDescription("Avatar for the persons under bed")
            .setRequired(false),
        ),
      exec: (interaction) => {
        const user = interaction.options.getUser("user") || interaction.user;
        const avatar = user.displayAvatarURL({ format: "png" });
        const img = new func().getImage(
          interaction.user.displayAvatarURL({ format: "png" }),
          avatar,
        );
        const embed = new EmbedBuilder()
          .setTitle("Image Generation")
          .setDescription(
            `**This is **${user}**'s photo post**\nThis is the link:\n\`${avatar}\``,
          )
          .setTimestamp();
        interaction.reply({ embeds: [embed], files: [img] });
      },
    });
  }
 else if (key == "DoubleStonk") {
    imageGenCmds.push({
      data: new SlashCommandSubcommandBuilder()
        .setName(key.toLocaleLowerCase())
        .setDescription(`Generate a ${key} image`)
        .addUserOption((options) =>
          options
            .setName("user")
            .setDescription("Avatar for the persons w/ stonks")
            .setRequired(false),
        ),
      exec: (interaction) => {
        const user = interaction.options.getUser("user") || interaction.user;
        const avatar = user.displayAvatarURL({ format: "png" });
        const img = new func().getImage(
          interaction.user.displayAvatarURL({ format: "png" }),
          avatar,
        );
        const embed = new EmbedBuilder()
          .setTitle("Image Generation")
          .setDescription(
            `**This is **${user}**'s photo post**\nThis is the link:\n\`${avatar}\``,
          )
          .setTimestamp();
        interaction.reply({ embeds: [embed], files: [img] });
      },
    });
  }
 else if (key == "Kiss") {
    imageGenCmds.push({
      data: new SlashCommandSubcommandBuilder()
        .setName(key.toLocaleLowerCase())
        .setDescription(`Generate a ${key} image`)
        .addUserOption((options) =>
          options
            .setName("user")
            .setDescription("Avatar for the persons kiss")
            .setRequired(false),
        ),
      exec: (interaction) => {
        const user = interaction.options.getUser("user") || interaction.user;
        const avatar = user.displayAvatarURL({ format: "png" });
        const img = new func().getImage(
          interaction.user.displayAvatarURL({ format: "png" }),
          avatar,
        );
        const embed = new EmbedBuilder()
          .setTitle("Image Generation")
          .setDescription(
            `**This is **${user}**'s photo post**\nThis is the link:\n\`${avatar}\``,
          )
          .setTimestamp();
        interaction.reply({ embeds: [embed], files: [img] });
      },
    });
  }
 else if (key == "LisaPresentation") {
    imageGenCmds.push({
      data: new SlashCommandSubcommandBuilder()
        .setName(key.toLocaleLowerCase())
        .setDescription(`Generate a ${key} image`)
        .addStringOption((op) =>
          op
            .setName("text")
            .setDescription("Text for the presentation")
            .setRequired(true),
        ),
      exec: (interaction) => {
        // const user = interaction.options.getUser("user") || interaction.user;
        // const avatar = user.displayAvatarURL({ format: "png" });
        let text = interaction.options.getString("text");
        if (text.length > 300) text = text.slice(0, 297) + "...";
        const img = new func().getImage(text);
        const embed = new EmbedBuilder()
          .setTitle("Image Generation")
          .setDescription(`Text:\n`)
          .setTimestamp();
        interaction.reply({ embeds: [embed], files: [img] });
      },
    });
  }
 else if (key == "Podium") {
    imageGenCmds.push({
      data: new SlashCommandSubcommandBuilder()
        .setName(key.toLocaleLowerCase())
        .setDescription(`Generate a ${key} image`)
        .addUserOption((op) =>
          op
            .setName("user")
            .setDescription("Avatar for the persons on podium")
            .setRequired(false),
        )
        .addUserOption((op) =>
          op
            .setName("user1")
            .setDescription("Avatar for the persons on podium")
            .setRequired(false),
        )
        .addUserOption((op) =>
          op
            .setName("user2")
            .setDescription("Avatar for the persons on podium")
            .setRequired(false),
        )
        .addStringOption((op) =>
          op
            .setName("name")
            .setDescription("Name for the user")
            .setRequired(false),
        )
        .addStringOption((op) =>
          op
            .setName("name1")
            .setDescription("Name for the user")
            .setRequired(false),
        )
        .addStringOption((op) =>
          op
            .setName("name2")
            .setDescription("Name for the user")
            .setRequired(false),
        ),
      exec: (interaction) => {
        // const user = interaction.options.getUser("user") || interaction.user;
        // const avatar = user.displayAvatarURL({ format: "png" });
        const user = interaction.options.getUser("user") || interaction.user;
        const user1 = interaction.options.getUser("user1") || interaction.user;
        const user2 = interaction.options.getUser("user2") || interaction.user;
        const name = interaction.options.getString("name") || user.username;
        const name1 = interaction.options.getString("name1") || user1.username;
        const name2 = interaction.options.getString("name2") || user2.username;
        // if()
        const img = new func().getImage(
          user.displayAvatarURL({ format: "png" }),
          user1.displayAvatarURL({ format: "png" }),
          user2.displayAvatarURL({ format: "png" }),
          name,
          name1,
          name2,
        );
        // const img = new func().getImage(text);
        const embed = new EmbedBuilder()
          .setTitle("Image Generation")
          .setDescription(`**This is **${user}**'s photo post**\n`)
          .setTimestamp();
        interaction.reply({ embeds: [embed], files: [img] });
      },
    });
  }
 else if (key == "Spank") {
    imageGenCmds.push({
      data: new SlashCommandSubcommandBuilder()
        .setName(key.toLocaleLowerCase())
        .setDescription(`Generate a ${key} image`)
        .addUserOption((options) =>
          options
            .setName("user")
            .setDescription("Avatar for the persons spank")
            .setRequired(false),
        ),
      exec: (interaction) => {
        const user = interaction.options.getUser("user") || interaction.user;
        const avatar = user.displayAvatarURL({ format: "png" });
        const img = new func().getImage(
          interaction.user.displayAvatarURL({ format: "png" }),
          avatar,
        );
        const embed = new EmbedBuilder()
          .setTitle("Image Generation")
          .setDescription(
            `**This is **${user}**'s photo post**\nThis is the link:\n\`${avatar}\``,
          )
          .setTimestamp();
        interaction.reply({ embeds: [embed], files: [img] });
      },
    });
  }
 else if (key == "Color") {
    imageGenCmds.push({
      data: new SlashCommandSubcommandBuilder()
        .setName(key.toLocaleLowerCase())
        .setDescription(`Generate a ${key} image`)
        .addStringOption((options) =>
          options
            .setName("color")
            .setDescription("Color for the image")
            .setRequired(true),
        ),
      exec: (interaction) => {
        const color = interaction.options.getString("color");
        const img = new func().getImage(color);
        const embed = new EmbedBuilder()
          .setTitle("Image Generation")
          .setDescription(
            `**This is **${color}**'s photo post**\nThis is the link:\n\`${color}\``,
          )
          .setTimestamp();
        interaction.reply({ embeds: [embed], files: [img] });
      },
    });
  }
 else if (key === "Mirror" || key == "Denoise") {
    // do nothing have not been implemented
  }
 else {
    imageGenCmds.push({
      data: new SlashCommandSubcommandBuilder()
        .setName(key.toLocaleLowerCase())
        .setDescription(`Generate a ${key} image`)
        .addUserOption((options) =>
          options
            .setName("user")
            .setDescription("Avatar for the image")
            .setRequired(false),
        ),
      exec: (interaction) => {
        const user = interaction.options.getUser("user") || interaction.user;
        const avatar = user.displayAvatarURL({ format: "png" });
        console.log(avatar);
        const img = new func().getImage(avatar);
        const embed = new EmbedBuilder()
          .setTitle("Image Generation")
          .setDescription(
            `**This is **${user}**'s photo post**\nThis is the link:\n\`${avatar}\``,
          )
          .setTimestamp();
        interaction.reply({ embeds: [embed], files: [img] });
      },
    });
  }
});
module.exports = {
  data: new SlashCommandBuilder()
    .setName("image")
    .setDescription("Image Generation affects"),
  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();
    const cmd = imageGenCmds.find((c) => c.data.name === subcommand);
    if (cmd) {
      cmd.exec(interaction);
    }
 else {
      interaction.reply("This command is not implemented yet");
    }
  },
};
imageGenCmds.slice(0, 25).forEach((cmd) => {
  module.exports.data.addSubcommand(cmd.data);
  // module.exports[cmd.data.name] = cmd.exec;
});
