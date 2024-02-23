/* eslint-disable no-shadow */
const {
  SlashCommandBuilder,
  ChannelType,
  // PermissionFlagsBits,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  StringSelectMenuOptionBuilder,
  StringSelectMenuBuilder,
  AttachmentBuilder,
} = require("discord.js");
const discordHtmlTranscripts = require("discord-html-transcripts");
// const fetch = require("node-fetch");
// const FormData = require("form-data");
const yaml = require("yaml");
const fs = require("fs");
const configFile = fs.readFileSync("./config.yml", "utf8");
const config = yaml.parse(configFile);
const defaultticketCategories = [
  {
    id: 1,
    name: "Open Ticket",
    categoryID: "GUILD_CAT_ID",
    closedCategoryID: "GUILD_CAT_ID",
    buttonEmoji: "🎫",
    buttonLabel: "Open Ticket",
    buttonStyle: "Primary",
    menuEmoji: "🎫",
    menuLabel: "Open Ticket",
    menuDescription: "Open a ticket",
    embedTitle: "Open a Ticket",
    color: 0x6eaadc,
    description: "Open a ticket",
    ticketName: "GUILD_CHOICE", // Can be USERNAME or TICKETCOUNT, will be called name-ticketName such as "report-12348"
    modalTitle: "Open a Ticket",
    questions: [
      {
        label: "What is your issue?",
        placeholder: "Issue",
        style: "Paragraph",
        required: true,
        minLength: 5,
      },
    ],
  },
];
// config.TicketCategories.forEach((category) => {
//   const {
//     id,
//     name,
//     categoryID,
//     closedCategoryID,
//     support_role_ids,
//     pingRoles,
//     ping_role_ids,
//     creatorRoles,
//     buttonEmoji,
//     buttonLabel,
//     buttonStyle,
//     menuEmoji,
//     menuLabel,
//     menuDescription,
//     embedTitle,
//     color,
//     description,
//     ticketName,
//     modalTitle,
//     questions,
//   } = category;

//   const extractedQuestions = questions.map((question) => {
//     const { label, placeholder, style, required, minLength } = question;

//     return {
//       label,
//       placeholder,
//       style,
//       required,
//       minLength,
//     };
//   });

//   ticketCategories[id] = {
//     name,
//     categoryID,
//     closedCategoryID,
//     support_role_ids,
//     pingRoles,
//     ping_role_ids,
//     creatorRoles,
//     buttonEmoji,
//     buttonLabel,
//     buttonStyle,
//     menuEmoji,
//     menuLabel,
//     menuDescription,
//     embedTitle,
//     color,
//     description,
//     ticketName,
//     modalTitle,
//     questions: extractedQuestions,
//   };
// });
const customIds = Object.keys(defaultticketCategories);
const choices = customIds.map((customId) => {
  const category = defaultticketCategories[customId];
  return category.name;
});
async function saveTranscript(interaction, message, saveImages = false) {
  const createTranscriptOptions = {
    limit: -1,
    saveImages,
    returnType: "buffer",
    poweredBy: false,
  };

  let channel;
  if (interaction) {
    channel = interaction.channel;
  }
 else if (message) {
    channel = message.channel;
  }

  if (channel) {
    const fileName = `${channel.name}-transcript.html`;
    const attachmentBuffer = await discordHtmlTranscripts.createTranscript(
      channel,
      {
        ...createTranscriptOptions,
        fileName,
      },
    );
    return new AttachmentBuilder(Buffer.from(attachmentBuffer), {
      name: fileName,
    });
  }

  return null;
}

function sanitizeInput(input) {
  const formattingCharacters = ["_", "*", "`", "~", "|", "-"];
  const escapedInput = input.replace(
    new RegExp(`[${formattingCharacters.join("")}]`, "g"),
    "\\$&",
  );
  return escapedInput;
}
const logMessage = (message) => console.log(`[TICKETS] ${message}`);
async function checkSupportRole(interaction) {
  const customIds = Object.keys(defaultticketCategories);
  let foundId;
  const ticketType = await interaction.client.db.get(
    `${interaction.channel.id}`,
  ).ticketType;
  for (const id of customIds) {
    if (defaultticketCategories[id].name === ticketType) {
      foundId = id;
      break;
    }
  }
  const allowedRoles = defaultticketCategories[foundId].support_role_ids;
  return interaction.member.roles.cache.some((role) =>
    allowedRoles.includes(role.id),
  );
}
module.exports = {
  data: new SlashCommandBuilder()
    .setName("tickets")
    .setDescription("Create a ticket")
    .setDMPermission(false)
    .addSubcommand((subcommand) =>
      subcommand.setName("create").setDescription("Create a ticket"),
    )
    .addSubcommand((subcommand) =>
      subcommand.setName("close").setDescription("Close a ticket"),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("enable")
        .setDescription("Enable ticket system")
        .addChannelOption((option) =>
          option
            .setName("category")
            .setDescription("The category to create tickets in")
            .setRequired(true)
            .addChannelTypes(ChannelType.GuildCategory),
        ),
    )
    .addSubcommand((subcommand) => {
      return subcommand
        .setName("transcript")
        .setDescription("Get a transcript of the ticket");
    })
    .addSubcommand((subcommand) => {
      return subcommand
        .setName("add")
        .setDescription("Add a user or role to a ticket channel.")
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("Select a user")
            .setRequired(false),
        )
        .addRoleOption((option) =>
          option
            .setName("role")
            .setDescription("Select a role")
            .setRequired(false),
        );
    })
    .addSubcommand((subcommand) => {
      return subcommand
        .setName("alert")
        .setDescription("Alert the ticket creator.");
    })
    .addSubcommand((subcommand) => {
      return subcommand.setName("claim").setDescription("Claim a ticket");
    })
    .addSubcommand((subcommand) => {
      return subcommand.setName("delete").setDescription("Delete a ticket.");
    })
    .addSubcommand((subcommand) => {
      return subcommand
        .setName("move")
        .setDescription("Move a ticket channel from one category to another.")
        .addStringOption((option) =>
          option
            .setName("category")
            .setDescription("Input a Category Name")
            .setRequired(true),
        );
    })
    .addSubcommand((subcommand) => {
      return subcommand
        .setName("panel")
        .setDescription("Send the ticket panel in the channel.");
    })
    .addSubcommand((subcommand) => {
      return subcommand
        .setName("pin")
        .setDescription("Pin the ticket channel in the category.");
    })
    .addSubcommand((subcommand) => {
      return subcommand
        .setName("rename")
        .setDescription("Rename a ticket.")
        .addStringOption((option) =>
          option.setName("name").setDescription("name").setRequired(true),
        );
    })
    .addSubcommand((subcommand) => {
      return subcommand
        .setName("reopen")
        .setDescription("Re-Open a closed ticket.");
    })
    .addSubcommand((subcommand) => {
      return subcommand
        .setName("transfer")
        .setDescription("Transfer the ownership of a ticket to another user.")
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("Select a user")
            .setRequired(true),
        );
    })
    .addSubcommand((subcommand) => {
      return subcommand.setName("unclaim").setDescription("Unclaim a ticket");
    }),
  // last subcommand statemendt CTRL+F shortcut
  async execute(interaction) {
    const client = interaction.client;
    const ticketsDB = client.tdb;
    const mainDB = client.db;
    const ticketCategories = Object.freeze(defaultticketCategories);
    ticketCategories[0].categoryID = ticketsDB.get(
      "ticketCategory_" + interaction.guild.id,
    );
    ticketCategories[0].closedCategoryID = ticketsDB.get(
      "closedTicketCategory_" + interaction.guild.id,
    );
    ticketCategories[0].ticketName =
      ticketsDB.get("ticketName_" + interaction.guild.id) || "TICKETCOUNT";
    ticketsDB.has = (...args) => Boolean(ticketsDB.get(...args));
    ticketsDB.pull = (key, value) => {
      const data = ticketsDB.get(key);
      if (Array.isArray(data)) {
        const index = data.indexOf(value);
        if (index > -1) {
          data.splice(index, 1);
          ticketsDB.set(key, data);
        }
      }
    };

    const subCMD = interaction.options.getSubcommand();
    if (
      !ticketsDB.get("enabled_" + interaction.guild.id) &&
      subCMD !== "enable" &&
      subCMD !== "disable"
    ) {
      return await interaction.reply({
        content: "Ticket system is not enabled",
        empheral: true,
      });
    }
    if (subCMD === "create") {
      // await interaction.reply("This command is not yet implemented");
      // if (!interaction.client.db.get(`ticketsys_${interaction.guild.id}`)) {
      //   return await interaction.reply({
      //     content: "Ticket system is not enabled",
      //     empheral: true,
      //   });
      // }
      // if (
      //   interaction.client.db.get(
      //     `ticket_${interaction.user.id}_${interaction.guild.id}`,
      //   )
      // ) {
      //   return await interaction.reply({
      //     content: "You already have a ticket",
      //     empheral: true,
      //   });
      // }
      // const channel = await interaction.guild.channels.create({
      //   type: ChannelType.GuildText,
      //   name: `ticket-${interaction.user.username}`,
      //   parent: interaction.client.db.get(
      //     `ticketcategory_${interaction.guild.id}`,
      //   ),
      //   permissionOverwrites: [
      //     {
      //       id: interaction.guild.id,
      //       deny: [PermissionFlagsBits.ViewChannel],
      //     },
      //     {
      //       id: interaction.user.id,
      //       allow: [PermissionFlagsBits.ViewChannel],
      //     },
      //     {
      //       id: interaction.client.user.id,
      //       allow: [PermissionFlagsBits.ViewChannel],
      //     },
      //   ],
      // });
      // //   await channel.permissionOverwrites.edit(interaction.guild.id, {
      // //     VIEW_CHANNEL: false,
      // //   });
      // //   await channel.permissionOverwrites.edit(interaction.user.id, {
      // //     VIEW_CHANNEL: true,
      // //   });
      // //   await channel.permissionOverwrites.edit(interaction.client.user.id, {
      // //     VIEW_CHANNEL: true,
      // //   });
      // await channel.send({
      //   content: `Welcome ${interaction.user}!`,
      //   embeds: [],
      // });
      // await interaction.reply({
      //   content: `Ticket has been created at <#${channel.id}>`,
      //   ephemeral: true,
      // });
      // interaction.client.db.set(`ticket_${channel.id}`, interaction.user.id);
      // interaction.client.db.set(`ticketopentime_${channel.id}`, Date.now());
      // interaction.client.db.set(
      //   `ticketcount_${interaction.guild.id}`,
      //   (interaction.client.db.get(`ticketcount_${interaction.guild.id}`) ||
      //     0) + 1,
      // );
      // interaction.client.db.set(
      //   `ticket_${interaction.user.id}_${interaction.guild.id}`,
      //   channel.id,
      // );
    }
 else if (subCMD === "close") {
      if (!(await ticketsDB.get(interaction.channel.id))) {
        return interaction.reply({
          content: config.errors.not_in_a_ticket,
          ephemeral: true,
        });
      }

      if (
        (await ticketsDB.get(`${interaction.channel.id}`).status) === "Closed"
      ) {
        return interaction.reply({
          content: "This ticket is already closed!",
          ephemeral: true,
        });
      }

      const hasSupportRole = await checkSupportRole(interaction);
      if (!hasSupportRole) {
        return interaction.reply({
          content: config.errors.not_allowed,
          ephemeral: true,
        });
      }

      const ticketButton = await ticketsDB.get(`${interaction.channel.id}`)
        .button;
      const ticketUserID = interaction.client.users.cache.get(
        await ticketsDB.get(`${interaction.channel.id}`).userID,
      );
      const claimUser = interaction.client.users.cache.get(
        await ticketsDB.get(`${interaction.channel.id}`).claimUser,
      );
      const ticketType = await ticketsDB.get(`${interaction.channel.id}`)
        .ticketType;

      const logEmbed = new EmbedBuilder()
        .setColor(config.commands.close.LogEmbed.color)
        .setTitle(config.commands.close.LogEmbed.title)
        .addFields([
          {
            name: config.commands.close.LogEmbed.field_staff,
            value: `> <@!${interaction.user.id}>\n> ${sanitizeInput(interaction.user.tag)}`,
          },
          {
            name: config.commands.close.LogEmbed.field_user,
            value: `> <@!${ticketUserID.id}>\n> ${sanitizeInput(ticketUserID.tag)}`,
          },
          {
            name: config.commands.close.LogEmbed.field_ticket,
            value: `> #${sanitizeInput(interaction.channel.name)}\n> ${ticketType}`,
          },
        ])
        .setTimestamp()
        .setThumbnail(
          interaction.user.displayAvatarURL({
            format: "png",
            dynamic: true,
            size: 1024,
          }),
        )
        .setFooter({
          text: `${interaction.user.tag}`,
          iconURL: `${interaction.user.displayAvatarURL({ format: "png", dynamic: true, size: 1024 })}`,
        });

      if (claimUser) {
        logEmbed.addFields({
          name: "• Claimed By",
          value: `> <@!${claimUser.id}>\n> ${sanitizeInput(claimUser.tag)}`,
        });
      }

      const logChannelId = config.logs.ticketClose || config.logs.default;
      const logsChannel = interaction.guild.channels.cache.get(logChannelId);
      await logsChannel.send({ embeds: [logEmbed] });
      logMessage(
        `${interaction.user.tag} closed the ticket #${interaction.channel.name} which was created by ${ticketUserID.tag}`,
      );

      const reOpenButton = new ButtonBuilder()
        .setCustomId("reOpen")
        .setLabel(config.reOpenButton.label)
        .setEmoji(config.reOpenButton.emoji)
        .setStyle(ButtonStyle[config.reOpenButton.style]);

      const transcriptButton = new ButtonBuilder()
        .setCustomId("createTranscript")
        .setLabel(config.transcriptButton.label)
        .setEmoji(config.transcriptButton.emoji)
        .setStyle(ButtonStyle[config.transcriptButton.style]);

      const deleteButton = new ButtonBuilder()
        .setCustomId("deleteTicket")
        .setLabel(config.deleteButton.label)
        .setEmoji(config.deleteButton.emoji)
        .setStyle(ButtonStyle[config.deleteButton.style]);

      const row = new ActionRowBuilder().addComponents(
        reOpenButton,
        transcriptButton,
        deleteButton,
      );

      const embed = new EmbedBuilder()
        .setColor(config.commands.close.embed.color)
        .setTitle(config.commands.close.embed.title)
        .setDescription(
          `${config.commands.close.embed.description}`
            .replace(/\{user\}/g, `${interaction.user}`)
            .replace(/\{user\.tag\}/g, sanitizeInput(interaction.user.tag)),
        )
        .setFooter({
          text: `${interaction.user.tag}`,
          iconURL: `${interaction.user.displayAvatarURL({ dynamic: true })}`,
        })
        .setTimestamp();

      await interaction.channel.members.forEach((member) => {
        if (member.id !== interaction.client.user.id) {
          interaction.channel.permissionOverwrites
            .edit(member, {
              SendMessages: false,
              ViewChannel: true,
            })
            .catch(console.error);
        }
      });

      let messageID;
      await interaction
        .reply({ embeds: [embed], components: [row], fetchReply: true })
        .then(async function(message) {
          messageID = message.id;
        });
      // await ticketsDB.set(`${interaction.channel.id}.closeMsgID`, messageID);
      // await ticketsDB.set(`${interaction.channel.id}.status`, "Closed");
      ticketsDB.set(`${interaction.channel.id}`, {
        ...ticketsDB.get(`${interaction.channel.id}`),
        closeMsgID: messageID,
        status: "Closed",
      });
      // await mainDB.pull("openTickets", interaction.channel.id);
      mainDB.set(
        "openTickets",
        mainDB.get("openTickets").filter((id) => id !== interaction.channel.id),
      );
      if (config.closeRemoveUser) {
        interaction.channel.permissionOverwrites.delete(ticketUserID);
      }
      if (config.closeDM.enabled && interaction.user.id !== ticketUserID.id) {
        const closeDMEmbed = new EmbedBuilder()
          .setColor(config.closeDM.embed.color)
          .setTitle(config.closeDM.embed.title)
          .setDescription(
            `${config.closeDM.embed.description}`
              .replace(/\{ticketName\}/g, `${interaction.channel.name}`)
              .replace(/\{user\}/g, `<@!${interaction.user.id}>`)
              .replace(/\{server\}/g, `${interaction.guild.name}`),
          );

        try {
          await ticketUserID.send({ embeds: [closeDMEmbed] });
        }
 catch (error) {
          const DMErrorEmbed = new EmbedBuilder()
            .setColor(config.DMErrors.embed.color)
            .setTitle(config.DMErrors.embed.title)
            .setDescription(`${config.DMErrors.embed.description}`);
          const logChannelId = config.logs.DMErrors || config.logs.default;
          const logChannel =
            interaction.client.channels.cache.get(logChannelId);
          await logChannel.send({ embeds: [DMErrorEmbed] });
          logMessage(
            `The bot could not DM ${ticketUserID.tag} because their DMs were closed`,
          );
        }
      }

      Object.keys(ticketCategories).forEach(async (id) => {
        if (ticketButton === id) {
          const category = ticketCategories[id];
          await interaction.channel.setParent(category.closedCategoryID, {
            lockPermissions: false,
          });

          category.support_role_ids.forEach(async (roleId) => {
            await interaction.channel.permissionOverwrites
              .edit(roleId, {
                SendMessages: false,
                ViewChannel: true,
              })
              .catch((error) => {
                console.error(
                  `Error updating permissions of support roles:`,
                  error,
                );
              });
          });
        }
      });
    }
 else if (subCMD === "transcript") {
      // const channel = interaction.guild.channels.cache.get(
      //   interaction.client.db.get(
      //     `ticket_${interaction.user.id}_${interaction.guild.id}`,
      //   ),
      // );
      // if (!channel) {
      //   return await interaction.reply({
      //     content: "You don't have a ticket",
      //     empheral: true,
      //   });
      // }
      // const transcript = await discordHtmlTranscripts.createTranscript(channel, {
      //   fileName: "transcript.html",
      //   returnType: "buffer",
      //   limit: -1,
      //   poweredBy: false,
      // });
      // const formData = new FormData();
      // formData.append(
      //   "file",
      //   transcript,
      //   `transcript-${interaction.user.id}-${interaction.guild.id}-${Math.random().toString().split(".")[1].slice(0, 4)}.html`,
      // );
      // const jsonData = await fetch("http://ticket.dragoncode.dev/api/upload", {
      //   method: "POST",
      //   body: formData,
      // }).then((r) => r.json());
      // // console.log(jsonData);
      // const embed = new EmbedBuilder()
      //   .setColor(0x6eaadc)
      //   .setTitle("Transcript Created!")
      //   .addFields(
      //     {
      //       name: "Transcript Link",
      //       value: `[View Online!](<${jsonData.link.normallink}>)`,
      //       inline: true,
      //     },
      //     {
      //       name: "Transcript Download",
      //       value: `[Download here](<${jsonData.link.downloadlink}>)`,
      //       inline: true,
      //     },
      //   )
      //   .setTimestamp();
      // await interaction.reply({ embeds: [embed] });
      if (!(await ticketsDB.has(interaction.channel.id))) {
        return interaction.reply({
          content: config.errors.not_in_a_ticket,
          ephemeral: true,
        });
      }

      // const hasSupportRole = await checkSupportRole(interaction);
      // if (!hasSupportRole) {
      //   return interaction.reply({
      //     content: config.errors.not_allowed,
      //     ephemeral: true,
      //   });
      // }

      const ticketUserID = client.users.cache.get(
        await ticketsDB.get(`${interaction.channel.id}`).userID,
      );

      const attachment = await saveTranscript(interaction, null, true);
      //       if (config.transcriptType === "HTML") {
      //         attachment =
      //       }
      //  else if (config.transcriptType === "TXT") {
      //         attachment = await saveTranscript(interaction);
      //       }

      const embed = new EmbedBuilder()
        .setColor(config.default_embed_color)
        .setTitle("Ticket Transcript")
        .setDescription(`Saved by <@!${interaction.user.id}>`)
        .addFields([
          {
            name: "Ticket Creator",
            value: `<@!${ticketUserID.id}>\n${sanitizeInput(ticketUserID.tag)}`,
            inline: true,
          },
          {
            name: "Ticket Name",
            value: `<#${interaction.channel.id}>\n${sanitizeInput(interaction.channel.name)}`,
            inline: true,
          },
          {
            name: "Category",
            value: `${await ticketsDB.get(`${interaction.channel.id}`).ticketType}`,
            inline: true,
          },
        ])
        .setFooter({
          text: `${ticketUserID.tag}`,
          iconURL: `${ticketUserID.displayAvatarURL({ dynamic: true })}`,
        })
        .setTimestamp();

      const logChannelId = config.logs.transcripts || config.logs.default;
      const logChannel = interaction.guild.channels.cache.get(logChannelId);
      await logChannel.send({ embeds: [embed], files: [attachment] });
      interaction.reply({
        content: `Transcript saved to <#${logChannel.id}>`,
        ephemeral: true,
      });
      logMessage(
        `${interaction.user.tag} manually saved the transcript of ticket #${interaction.channel.name} which was created by ${ticketUserID.tag}`,
      );
      // await interaction.reply
    }
    //  else if (subCMD === "delete") {
    //       if (!interaction.client.db.get(`ticketsys_${interaction.guild.id}`)) {
    //         return await interaction.reply({
    //           content: "Ticket system is not enabled",
    //           empheral: true,
    //         });
    //       }
    //       const channel = interaction.guild.channels.cache.get(
    //         interaction.client.db.get(
    //           `ticket_${interaction.user.id}_${interaction.guild.id}`,
    //         ),
    //       );
    //       if (!channel) {
    //         return await interaction.reply({
    //           content: "You don't have a ticket",
    //           empheral: true,
    //         });
    //       }

    //       await channel.delete();
    //       interaction.client.db.delete(
    //         `ticket_${interaction.user.id}_${interaction.guild.id}`,
    //       );
    //       interaction.client.db.delete(`ticket_${channel.id}`);
    //       interaction.client.db.delete(`ticketopentime_${channel.id}`);
    //       // await interaction.reply("This command is not yet implemented");
    //     }
    else if (subCMD === "enable") {
      const catagory = interaction.options.getChannel("category");
      if (ticketsDB.get(`enabled_${interaction.guild.id}`)) {
        return await interaction.reply({
          content: "Ticket system is already enabled",
          empheral: true,
        });
      }
      // check perms
      //   if (!interaction.guild.me.permissions.has("MANAGE_CHANNELS")) {
      //     return await interaction.reply({
      //       content: "I don't have permission to manage channels",
      //       empheral: true,
      //     });
      //   }
      //   if (!interaction.guild.me.permissions.has("MANAGE_ROLES")) {
      //     return await interaction.reply({
      //       content: "I don't have permission to manage roles",
      //       empheral: true,
      //     });
      //   }
      //   if (!interaction.guild.me.permissions.has("VIEW_CHANNEL")) {
      //     return await interaction.reply({
      //       content: "I don't have permission to view channels",
      //       empheral: true,
      //     });
      //   }
      //   if (!interaction.guild.me.permissions.has("SEND_MESSAGES")) {
      //     return await interaction.reply({
      //       content: "I don't have permission to send messages",
      //       empheral: true,
      //     });
      //   }
      // check USERS perms
      if (!interaction.member.permissions.has("MANAGE_SERVER")) {
        return await interaction.reply({
          content: "You don't have permission to manage server",
          empheral: true,
        });
      }

      // interaction.client.db.set(`ticketsys_${interaction.guild.id}`, true);
      ticketsDB.set(`enabled_${interaction.guild.id}`, true);
      // interaction.client.db.set(
      //   `ticketcategory_${interaction.guild.id}`,
      //   catagory.id,
      // );
      ticketsDB.set("ticketCategory_" + interaction.guild.id, catagory.id);
      await interaction.reply({
        content: "Ticket system has been enabled",
        empheral: true,
      });
    }
 else if (subCMD == "disable") {
      if (!interaction.client.db.get(`ticketsys_${interaction.guild.id}`)) {
        return await interaction.reply({
          content: "Ticket system is not enabled",
          empheral: true,
        });
      }
      if (!interaction.member.permissions.has("MANAGE_SERVER")) {
        return await interaction.reply({
          content: "You don't have permission to manage server",
          empheral: true,
        });
      }
      interaction.client.db.delete(`ticketsys_${interaction.guild.id}`);
      interaction.client.db.delete(`ticketcategory_${interaction.guild.id}`);
      await interaction.reply({
        content: "Ticket system has been disabled",
        empheral: true,
      });
    }
 else if (subCMD == "add") {
      if (!(await ticketsDB.get(interaction.channel.id))) {
        return interaction.reply({
          content: config.errors.not_in_a_ticket,
          ephemeral: true,
        });
      }

      // const hasSupportRole = await checkSupportRole(interaction);
      // if (!hasSupportRole) {
      //   return interaction.reply({
      //     content: config.errors.not_allowed,
      //     ephemeral: true,
      //   });
      // }

      const user = interaction.options.getUser("user");
      const role = interaction.options.getRole("role");
      const logChannelId = interaction.client.db.get(
        `logchannel_${interaction.guild.id}_${require("../../src/static/logTypes.json")[43].value}`,
      );
      const logChannel = interaction.guild.channels.cache.get(logChannelId);

      if ((!user && !role) || (user && role)) {
        return interaction.reply({
          content: "Please provide either a user or a role, but not both.",
          ephemeral: true,
        });
      }

      if (user) {
        // Check that the user is already in the ticket channel
        if (interaction.channel.members.has(user.id)) {
          return interaction.reply({
            content: "That user is already in this ticket.",
            ephemeral: true,
          });
        }

        interaction.channel.permissionOverwrites.create(user, {
          ViewChannel: true,
          SendMessages: true,
          ReadMessageHistory: true,
          AttachFiles: true,
          EmbedLinks: true,
        });

        const logEmbed = new EmbedBuilder()
          .setColor(config.commands.add.LogEmbed.color)
          .setTitle(config.commands.add.LogEmbed.title)
          .addFields([
            {
              name: config.commands.add.LogEmbed.field_staff,
              value: `> ${interaction.user}\n> ${sanitizeInput(interaction.user.tag)}`,
            },
            {
              name: config.commands.add.LogEmbed.field_target,
              value: `> ${user}\n> ${sanitizeInput(user.tag)}`,
            },
            {
              name: config.commands.add.LogEmbed.field_ticket,
              value: `> ${interaction.channel}\n> #${sanitizeInput(interaction.channel.name)}`,
            },
          ])
          .setTimestamp()
          .setThumbnail(
            interaction.user.displayAvatarURL({
              format: "png",
              dynamic: true,
              size: 1024,
            }),
          )
          .setFooter({
            text: `${interaction.user.tag}`,
            iconURL: `${interaction.user.displayAvatarURL({ format: "png", dynamic: true, size: 1024 })}`,
          });

        const embed = new EmbedBuilder()
          .setColor(config.commands.add.embed.color)
          .setDescription(
            `${config.commands.add.embed.description}`
              .replace(/\{target\}/g, user)
              .replace(/\{target\.tag\}/g, sanitizeInput(user.tag)),
          );
        interaction.reply({ embeds: [embed] });
        logChannel.send({ embeds: [logEmbed] });
        logMessage(
          `${interaction.user.tag} added ${user.tag} to the ticket #${interaction.channel.name}`,
        );
      }

      if (role) {
        // Check that the role is already in the ticket channel
        if (interaction.channel.permissionsFor(role.id).has("ViewChannel")) {
          return interaction.reply({
            content: "That role is already in this ticket.",
            ephemeral: true,
          });
        }

        interaction.channel.permissionOverwrites.create(role, {
          ViewChannel: true,
          SendMessages: true,
          ReadMessageHistory: true,
          AttachFiles: true,
          EmbedLinks: true,
        });

        const logEmbed = new EmbedBuilder()
          .setColor(config.commands.add.LogEmbed.color)
          .setTitle(config.commands.add.LogEmbed.title)
          .addFields([
            {
              name: config.commands.add.LogEmbed.field_staff,
              value: `> ${interaction.user}\n> ${sanitizeInput(interaction.user.tag)}`,
            },
            {
              name: config.commands.add.LogEmbed.field_target,
              value: `> ${role}\n> ${sanitizeInput(role.name)}`,
            },
            {
              name: config.commands.add.LogEmbed.field_ticket,
              value: `> ${interaction.channel}\n> #${sanitizeInput(interaction.channel.name)}`,
            },
          ])
          .setTimestamp()
          .setThumbnail(
            interaction.user.displayAvatarURL({
              format: "png",
              dynamic: true,
              size: 1024,
            }),
          )
          .setFooter({
            text: `${interaction.user.tag}`,
            iconURL: `${interaction.user.displayAvatarURL({ format: "png", dynamic: true, size: 1024 })}`,
          });

        const embed = new EmbedBuilder()
          .setColor(config.commands.add.embed.color)
          .setDescription(
            `${config.commands.add.embed.description}`
              .replace(/\{target\}/g, role)
              .replace(/\{target\.tag\}/g, sanitizeInput(role.name)),
          );
        interaction.reply({ embeds: [embed] });
        logChannel.send({ embeds: [logEmbed] });
        logMessage(
          `${interaction.user.tag} added ${role.name} to the ticket #${interaction.channel.name}`,
        );
      }
 else if (subCMD === "alert") {
        // next cmd
        if (!(await ticketsDB.get(interaction.channel.id))) {
          return interaction.reply({
            content: config.errors.not_in_a_ticket,
            ephemeral: true,
          });
        }

        // const hasSupportRole = await checkSupportRole(interaction);
        // if (!hasSupportRole) {
        //   return interaction.reply({
        //     content: config.errors.not_allowed,
        //     ephemeral: true,
        //   });
        // }

        const user = interaction.client.users.cache.get(
          await ticketsDB.get(`${interaction.channel.id}`).userID,
        );

        const closeButton = new ButtonBuilder()
          .setCustomId("closeTicket")
          .setLabel(config.closeButton.label)
          .setEmoji(config.closeButton.emoji)
          .setStyle(ButtonStyle[config.closeButton.style]);

        const ticketAlertRow = new ActionRowBuilder().addComponents(
          closeButton,
        );

        const embed = new EmbedBuilder()
          .setColor(config.commands.alert.embed.color)
          .setTitle(config.commands.alert.embed.title)
          .setDescription(config.commands.alert.embed.description)
          .setTimestamp();

        interaction.reply({
          content: `<@${user.id}>`,
          embeds: [embed],
          components: [ticketAlertRow],
        });
        if (config.alertDM.enabled) {
          const alertDMEmbed = new EmbedBuilder()
            .setColor(config.alertDM.embed.color)
            .setTitle(config.alertDM.embed.title)
            .setDescription(
              `${config.alertDM.embed.description}`
                .replace(/\{ticketName\}/g, `${interaction.channel.name}`)
                .replace(/\{server\}/g, `${interaction.guild.name}`),
            );

          try {
            await user.send({ embeds: [alertDMEmbed] });
          }
 catch (error) {
            const DMErrorEmbed = new EmbedBuilder()
              .setColor(config.DMErrors.embed.color)
              .setTitle(config.DMErrors.embed.title)
              .setDescription(`${config.DMErrors.embed.description}`);
            const logChannelId = config.logs.DMErrors || config.logs.default;
            const logChannel =
              interaction.client.channels.cache.get(logChannelId);
            await logChannel.send({ embeds: [DMErrorEmbed] });
            logMessage(
              `The bot could not DM ${user.tag} because their DMs were closed`,
            );
          }
        }
        logMessage(
          `${interaction.user.tag} sent an alert to ${user.tag} in the ticket #${interaction.channel.name}`,
        );
      }
 else if (subCMD == "claim") {
        if (!(await ticketsDB.get(`ticket_` + interaction.channel.id))) {
          return interaction.reply({
            content: config.errors.not_in_a_ticket,
            ephemeral: true,
          });
        }

        const hasSupportRole = await checkSupportRole(interaction);
        if (!hasSupportRole) {
          return interaction.reply({
            content: config.errors.not_allowed,
            ephemeral: true,
          });
        }

        if (config.claimFeature === false) {
          return interaction.reply({
            content: "The claim feature is currently disabled.",
            ephemeral: true,
          });
        }

        const claimStatus = await ticketsDB.get(`${interaction.channel.id}`)
          .claimed;
        const claimUser = await ticketsDB.get(`${interaction.channel.id}`)
          .claimUser;

        if (claimStatus) {
          return interaction.reply({
            content: `This ticket has already been claimed by <@!${claimUser}>`,
            ephemeral: true,
          });
        }

        await interaction.deferReply({ ephemeral: true });
        const totalClaims = await mainDB.get("totalClaims");

        const embed = new EmbedBuilder()
          .setTitle("Ticket Claimed")
          .setColor(config.default_embed_color)
          .setDescription(
            `This ticket has been claimed by <@!${interaction.user.id}>\nThey will be assisting you shortly!`,
          )
          .setTimestamp()
          .setFooter({
            text: `Claimed by ${interaction.user.tag}`,
            iconURL: `${interaction.user.displayAvatarURL({ dynamic: true })}`,
          });
        interaction.editReply({
          content: "You successfully claimed this ticket!",
          ephemeral: true,
        });
        interaction.channel.send({ embeds: [embed], ephemeral: false });

        interaction.channel.messages
          .fetch(await ticketsDB.get(`${interaction.channel.id}`).msgID)
          .then(async (message) => {
            const embed = message.embeds[0];
            const claimedByField = {
              name: "Claimed by",
              value: `> <@!${interaction.user.id}> (${sanitizeInput(interaction.user.tag)})`,
            };
            embed.fields.push(claimedByField);

            const closeButton = new ButtonBuilder()
              .setCustomId("closeTicket")
              .setLabel(config.closeButton.label)
              .setEmoji(config.closeButton.emoji)
              .setStyle(ButtonStyle[config.closeButton.style]);

            const claimButton = new ButtonBuilder()
              .setCustomId("ticketclaim")
              .setLabel(config.claimButton.label)
              .setEmoji(config.claimButton.emoji)
              .setStyle(ButtonStyle[config.claimButton.style])
              .setDisabled(true);

            const unClaimButton = new ButtonBuilder()
              .setCustomId("ticketunclaim")
              .setLabel(config.unclaimButton.label)
              .setEmoji(config.unclaimButton.emoji)
              .setStyle(ButtonStyle[config.unclaimButton.style]);

            const actionRow2 = new ActionRowBuilder().addComponents(
              closeButton,
              claimButton,
              unClaimButton,
            );
            message.edit({ embeds: [embed], components: [actionRow2] });

            if (config.claim1on1) {
              const ticketButton = await ticketsDB.get(
                `${interaction.channel.id}`,
              ).button;

              Object.keys(ticketCategories).forEach(async (id) => {
                if (ticketButton === id) {
                  ticketCategories[id].support_role_ids.forEach(
                    async (roleId) => {
                      await interaction.channel.permissionOverwrites
                        .edit(roleId, {
                          SendMessages: false,
                          ViewChannel: true,
                        })
                        .catch((error) => {
                          console.error(`Error updating permissions:`, error);
                        });
                    },
                  );
                }
              });
            }

            await interaction.channel.permissionOverwrites.edit(
              interaction.user,
              {
                SendMessages: true,
                ViewChannel: true,
                AttachFiles: true,
                EmbedLinks: true,
                ReadMessageHistory: true,
              },
            );

            // await interaction.client.db.set(`${interaction.channel.id}.claimed`, true);
            // await interaction.client.db.set(
            //   `${interaction.channel.id}.claimUser`,
            //   interaction.user.id,
            // );
            ticketsDB.set(`${interaction.channel.id}`, {
              ...ticketsDB.get(`${interaction.channel.id}`),
              claimed: true,
              claimUser: interaction.user.id,
            });
            const logChannelId = interaction.client.db.get(
              `logchannel_${interaction.guild.id}_${require("../../src/static/logTypes.json")[43].value}`,
            );
            const logsChannel =
              interaction.guild.channels.cache.get(logChannelId);

            const logEmbed = new EmbedBuilder()
              .setColor(config.default_embed_color)
              .setTitle("Ticket Logs | Ticket Claimed")
              .addFields([
                {
                  name: "• Executor",
                  value: `> <@!${interaction.user.id}>\n> ${sanitizeInput(interaction.user.tag)}`,
                },
                {
                  name: "• Ticket",
                  value: `> <#${interaction.channel.id}>\n> #${sanitizeInput(interaction.channel.name)}\n> ${await interaction.client.db.get(`${interaction.channel.id}`).ticketType}`,
                },
              ])
              .setTimestamp()
              .setThumbnail(
                interaction.user.displayAvatarURL({
                  format: "png",
                  dynamic: true,
                  size: 1024,
                }),
              )
              .setFooter({
                text: `${interaction.user.tag}`,
                iconURL: `${interaction.user.displayAvatarURL({ format: "png", dynamic: true, size: 1024 })}`,
              });
            if (logsChannel) logsChannel.send({ embeds: [logEmbed] });
            await interaction.client.db.set("totalClaims", totalClaims + 1);
            logMessage(
              `${interaction.user.tag} claimed the ticket #${interaction.channel.name}`,
            );
          });
      }
    }
 else if (subCMD == "delete") {
      if (!(await ticketsDB.has(interaction.channel.id))) {
        return interaction.reply({
          content: config.errors.not_in_a_ticket,
          ephemeral: true,
        });
      }

      // const hasSupportRole = await checkSupportRole(interaction);
      // if (!hasSupportRole) {
      //   return interaction.reply({
      //     content: config.errors.not_allowed,
      //     ephemeral: true,
      //   });
      // }

      const ticketUserID = client.users.cache.get(
        await ticketsDB.get(`${interaction.channel.id}`).userID,
      );
      const claimUser = client.users.cache.get(
        await ticketsDB.get(`${interaction.channel.id}`).claimUser,
      );
      const ticketType = await ticketsDB.get(`${interaction.channel.id}`)
        .ticketType;

      const logEmbed = new EmbedBuilder()
        .setColor(config.commands.delete.LogEmbed.color)
        .setTitle(config.commands.delete.LogEmbed.title)
        .addFields([
          {
            name: config.commands.delete.LogEmbed.field_staff,
            value: `> <@!${interaction.user.id}>\n> ${sanitizeInput(interaction.user.tag)}`,
          },
          {
            name: config.commands.delete.LogEmbed.field_user,
            value: `> <@!${ticketUserID.id}>\n> ${sanitizeInput(ticketUserID.tag)}`,
          },
          {
            name: config.commands.delete.LogEmbed.field_ticket,
            value: `> #${sanitizeInput(interaction.channel.name)}\n> ${ticketType}`,
          },
        ])
        .setTimestamp()
        .setThumbnail(
          interaction.user.displayAvatarURL({
            format: "png",
            dynamic: true,
            size: 1024,
          }),
        )
        .setFooter({
          text: `${interaction.user.tag}`,
          iconURL: `${interaction.user.displayAvatarURL({ format: "png", dynamic: true, size: 1024 })}`,
        });

      if (claimUser) {
        logEmbed.addFields({
          name: "• Claimed By",
          value: `> <@!${claimUser.id}>\n> ${sanitizeInput(claimUser.tag)}`,
        });
      }

      const attachment = await saveTranscript(interaction);
      // if (config.transcriptType === "HTML") {
      // attachment =
      //   }
      //  else if (config.transcriptType === "TXT") {
      //     attachment = await saveTranscriptTxt(interaction);
      //   }

      const logChannelId = interaction.client.db.get(
        `logchannel_${interaction.guild.id}_${require("../../src/static/logTypes.json")[44].value}`,
      );
      const logsChannel = interaction.guild.channels.cache.get(logChannelId);
      await logsChannel.send({ embeds: [logEmbed], files: [attachment] });
      logMessage(
        `${interaction.user.tag} deleted the ticket #${interaction.channel.name} which was created by ${ticketUserID.tag}`,
      );

      const deleteTicketTime = config.deleteTicketTime;
      const deleteTime = deleteTicketTime * 1000;

      const deleteEmbed = new EmbedBuilder()
        .setColor(config.commands.delete.embed.color)
        .setDescription(
          `${config.commands.delete.embed.description}`.replace(
            /\{time\}/g,
            `${deleteTicketTime}`,
          ),
        );

      // DM the user with an embed and the transcript of the ticket if the option is enabled
      if (config.DMUserSettings.enabled) {
        const dmEmbed = new EmbedBuilder()
          .setColor(config.DMUserSettings.embed.color)
          .setTitle(config.DMUserSettings.embed.title)
          .setThumbnail(interaction.guild.iconURL())
          .setDescription(config.DMUserSettings.embed.description)
          .addFields(
            {
              name: "Server",
              value: `> ${interaction.guild.name}`,
              inline: true,
            },
            {
              name: "Ticket",
              value: `> #${sanitizeInput(interaction.channel.name)}`,
              inline: true,
            },
            {
              name: "Category",
              value: `> ${ticketType}`,
              inline: true,
            },
          )
          .addFields(
            {
              name: "Ticket Author",
              value: `> ${sanitizeInput(ticketUserID.tag)}`,
              inline: true,
            },
            {
              name: "Deleted By",
              value: `> ${sanitizeInput(interaction.user.tag)}`,
              inline: true,
            },
            {
              name: "Claimed By",
              value: `> ${claimUser ? sanitizeInput(claimUser.tag) : "None"}`,
              inline: true,
            },
          );

        const options = [];
        for (let i = 1; i <= 5; i++) {
          const option = new StringSelectMenuOptionBuilder()
            .setLabel(`${i} ${i > 1 ? "stars" : "star"}`)
            .setEmoji(config.DMUserSettings.ratingSystem.menu.emoji)
            .setValue(`${i}-star`);

          options.push(option);
        }

        const selectMenu = new StringSelectMenuBuilder()
          .setCustomId("ratingMenu")
          .setPlaceholder(config.DMUserSettings.ratingSystem.menu.placeholder)
          .setMinValues(1)
          .setMaxValues(1)
          .addOptions(options);

        const actionRowMenu = new ActionRowBuilder().addComponents(selectMenu);

        const ratingEmbed = new EmbedBuilder()
          .setColor(config.DMUserSettings.ratingSystem.embed.color)
          .setTitle(config.DMUserSettings.ratingSystem.embed.title)
          .setDescription(config.DMUserSettings.ratingSystem.embed.description)
          .setFooter({
            text: `Ticket: #${interaction.channel.name} | Category: ${await ticketsDB.get(`${interaction.channel.id}`).ticketType}`,
          });

        try {
          if (config.DMUserSettings.ratingSystem.enabled === false) {
            await ticketUserID.send({ embeds: [dmEmbed], files: [attachment] });
          }
          if (config.DMUserSettings.ratingSystem.enabled === true) {
            await mainDB.set(`ratingMenuOptions`, options);
            await ticketUserID.send({
              embeds: [dmEmbed],
              files: [attachment],
            });
            await ticketUserID.send({
              embeds: [ratingEmbed],
              components: [actionRowMenu],
            });
          }
        }
 catch (error) {
          const DMErrorEmbed = new EmbedBuilder()
            .setColor(config.DMErrors.embed.color)
            .setTitle(config.DMErrors.embed.title)
            .setDescription(`${config.DMErrors.embed.description}`);
          const logChannelId = config.logs.DMErrors || config.logs.default;
          const logChannel = client.channels.cache.get(logChannelId);
          await logChannel.send({ embeds: [DMErrorEmbed] });
          logMessage(
            `The bot could not DM ${ticketUserID.tag} because their DMs were closed`,
          );
        }
      }

      await interaction.reply({ embeds: [deleteEmbed] });

      setTimeout(async () => {
        await ticketsDB.delete(interaction.channel.id);
        await mainDB.set(
          "openTickets",
          mainDB
            .get("openTickets")
            .filter((id) => id !== interaction.channel.id),
        );
        await interaction.channel.delete();
      }, deleteTime);
    }
 else if (subCMD == "move") {
      if (!(await ticketsDB.has(interaction.channel.id))) {
        return interaction.reply({
          content: config.errors.not_in_a_ticket,
          ephemeral: true,
        });
      }

      // const hasSupportRole = await checkSupportRole(interaction);
      // if (!hasSupportRole) {
      //   return interaction.reply({
      //     content: config.errors.not_allowed,
      //     ephemeral: true,
      //   });
      // }

      const option = interaction.options.getString("category").toLowerCase();
      const ticketType = await ticketsDB.get(`${interaction.channel.id}`)
        .ticketType;

      if (!choices.includes(option)) {
        return interaction.reply({
          content: `Invalid option. Available options are: ${choices.join(", ")}`,
          ephemeral: true,
        });
      }

      if (option === ticketType) {
        return interaction.reply({
          content: "This ticket is already in that category.",
          ephemeral: true,
        });
      }

      // Find the categoryID based on the name
      const category = Object.values(ticketCategories).find(
        (category) => category.name === option,
      );
      const categoryID = category.categoryID;

      // await ticketsDB.set(`${interaction.channel.id}.ticketType`, option);
      ticketsDB.set(`${interaction.channel.id}`, {
        ...ticketsDB.get(`${interaction.channel.id}`),
        ticketType: option,
      });
      await interaction.channel.setParent(categoryID, {
        lockPermissions: false,
      });

      const logChannelId = config.logs.ticketMove || config.logs.default;
      const logChannel = interaction.guild.channels.cache.get(logChannelId);

      const logEmbed = new EmbedBuilder()
        .setColor(config.commands.move.LogEmbed.color)
        .setTitle(config.commands.move.LogEmbed.title)
        .addFields([
          {
            name: config.commands.move.LogEmbed.field_staff,
            value: `> ${interaction.user}\n> ${sanitizeInput(interaction.user.tag)}`,
          },
          {
            name: config.commands.move.LogEmbed.field_ticket,
            value: `> ${interaction.channel}\n> #${sanitizeInput(interaction.channel.name)}`,
          },
        ])
        .setTimestamp()
        .setThumbnail(
          interaction.user.displayAvatarURL({
            format: "png",
            dynamic: true,
            size: 1024,
          }),
        )
        .setFooter({
          text: `${interaction.user.tag}`,
          iconURL: `${interaction.user.displayAvatarURL({ format: "png", dynamic: true, size: 1024 })}`,
        });
      logChannel.send({ embeds: [logEmbed] });

      const embed = new EmbedBuilder()
        .setColor(config.commands.move.embed.color)
        .setDescription(
          `${config.commands.move.embed.description}`.replace(
            /\{category\}/g,
            option,
          ),
        );
      interaction.reply({ embeds: [embed] });
      logMessage(
        `${interaction.user.tag} moved the ticket #${interaction.channel.name} to the category ${option}.`,
      );
    }
 else if (subCMD == "panel") {
      // if (
      //   config.commands.panel.support_role_ids.length > 0 &&
      //   !interaction.member.roles.cache.some((role) =>
      //     config.commands.panel.support_role_ids.includes(role.id),
      //   )
      // ) {
      //   return interaction.reply({
      //     content: config.errors.not_allowed,
      //     ephemeral: true,
      //   });
      // }

      const panelEmbed = new EmbedBuilder()
        .setColor(config.commands.panel.embed.color)
        .setTitle(config.commands.panel.embed.title)
        .setDescription(config.commands.panel.embed.description)
        .setFooter({
          text: config.commands.panel.embed.footer_msg || null,
          iconURL: config.commands.panel.embed.footer_icon_url || null,
        });

      if (config.commands.panel.embed.imageURL) {
        panelEmbed.setImage(config.commands.panel.embed.imageURL);
      }

      if (config.commands.panel.embed.thumbnailURL) {
        panelEmbed.setThumbnail(config.commands.panel.embed.thumbnailURL);
      }

      if (config.panelMethod === "Buttons") {
        // Creating the buttons, action rows and more
        const buttons = [];

        // Get the custom IDs from the `ticketCategories` object using `Object.keys()`
        const customIds = Object.keys(ticketCategories);

        // Iterate over the custom IDs
        for (const customId of customIds) {
          const category = ticketCategories[customId];
          // Create a button for each category using the properties from `ticketCategories`
          const button = new ButtonBuilder()
            .setCustomId(customId)
            .setLabel(category.buttonLabel)
            .setStyle(ButtonStyle[category.buttonStyle])
            .setEmoji(category.buttonEmoji);

          // Add the button to the array
          buttons.push(button);
        }

        // Create an array to store the action rows
        const actionRows = [];

        // Divide the buttons into groups of 5 and create a new action row for each group
        for (let i = 0; i < buttons.length; i += 5) {
          const buttonsGroup = buttons.slice(i, i + 5);
          const actionRow = new ActionRowBuilder().addComponents(
            ...buttonsGroup,
          );
          actionRows.push(actionRow);
        }

        // Send an initial response to acknowledge receipt of the command
        await interaction.reply({
          content: "Sending the panel in this channel...",
          ephemeral: true,
        });
        // Send the panel embed and action rows
        await interaction.channel.send({
          embeds: [panelEmbed],
          components: actionRows,
        });
        logMessage(
          `${interaction.user.tag} sent the ticket panel in the channel #${interaction.channel.name}`,
        );
      }
 else if (config.panelMethod === "Menu") {
        // Create an array to hold select menu options
        const options = [];

        // Get the custom IDs from the `ticketCategories` object using `Object.keys()`
        const customIds = Object.keys(ticketCategories);

        // Iterate over the custom IDs
        for (const customId of customIds) {
          const category = ticketCategories[customId];
          // Create an option for each category using the properties from `ticketCategories`
          const option = new StringSelectMenuOptionBuilder()
            .setLabel(category.menuLabel)
            .setDescription(category.menuDescription)
            .setEmoji(category.menuEmoji)
            .setValue(customId);

          // Add the option to the array
          options.push(option);
        }

        // Creating the select menu with the options
        const selectMenu = new StringSelectMenuBuilder()
          .setCustomId("categoryMenu")
          .setPlaceholder(config.menuPlaceholder)
          .setMinValues(1)
          .setMaxValues(1)
          .addOptions(options);

        // Create an action row to store the select menu
        const actionRowsMenus = new ActionRowBuilder().addComponents(
          selectMenu,
        );

        // Send an initial response to acknowledge receipt of the command
        await interaction.reply({
          content: "Sending the panel in this channel...",
          ephemeral: true,
        });
        // Send the panel embed and action row
        await interaction.channel
          .send({ embeds: [panelEmbed], components: [actionRowsMenus] })
          .then(async function() {
            await mainDB.set(`selectMenuOptions`, options);
          });
        logMessage(
          `${interaction.user.tag} sent the ticket panel in the channel #${interaction.channel.name}`,
        );
      }
    }
 else if (subCMD == "pin") {
      if (!(await ticketsDB.has(interaction.channel.id))) {
        return interaction.reply({
          content: config.errors.not_in_a_ticket,
          ephemeral: true,
        });
      }

      // const hasSupportRole = await checkSupportRole(interaction);
      // if (!hasSupportRole) {
      //   return interaction.reply({
      //     content: config.errors.not_allowed,
      //     ephemeral: true,
      //   });
      // }

      if (interaction.channel.name.includes(config.commands.pin.emoji)) {
        return interaction.reply({
          content: config.commands.pin.alreadyPinned,
          ephemeral: true,
        });
      }

      interaction.channel
        .setPosition(0)
        .then(() => {
          return new Promise((resolve) => setTimeout(resolve, 1000));
        })
        .then(() => {
          interaction.channel.setName(
            `${config.commands.pin.emoji}${interaction.channel.name}`,
          );
        });

      const embed = new EmbedBuilder()
        .setColor(config.commands.pin.embed.color)
        .setDescription(`${config.commands.pin.embed.description}`);
      interaction.reply({ embeds: [embed] });
      logMessage(
        `${interaction.user.tag} pinned the ticket #${interaction.channel.name}`,
      );
    }
 else if (subCMD == "rename") {
      if (!(await ticketsDB.has(interaction.channel.id))) {
        return interaction.reply({
          content: config.errors.not_in_a_ticket,
          ephemeral: true,
        });
      }

      // const hasSupportRole = await checkSupportRole(interaction);
      // if (!hasSupportRole) {
      //   return interaction.reply({
      //     content: config.errors.not_allowed,
      //     ephemeral: true,
      //   });
      // }

      const newName = interaction.options.getString("name");
      interaction.channel.setName(`${newName}`);
      const logChannelId = interaction.client.db.get(
        `logchannel_${interaction.guild.id}_${require("../../src/static/logTypes.json")[43].value}`,
      );
      const logChannel = interaction.guild.channels.cache.get(logChannelId);

      const log = new EmbedBuilder()
        .setColor(config.commands.rename.LogEmbed.color)
        .setTitle(config.commands.rename.LogEmbed.title)
        .addFields([
          {
            name: config.commands.rename.LogEmbed.field_staff,
            value: `> ${interaction.user}\n> ${sanitizeInput(interaction.user.tag)}`,
          },
          {
            name: config.commands.rename.LogEmbed.field_oldname,
            value: `> #${sanitizeInput(interaction.channel.name)}`,
          },
          {
            name: config.commands.rename.LogEmbed.field_newname,
            value: `> ${interaction.channel}\n> #${sanitizeInput(newName)}`,
          },
        ])
        .setTimestamp()
        .setThumbnail(
          interaction.user.displayAvatarURL({
            format: "png",
            dynamic: true,
            size: 1024,
          }),
        )
        .setFooter({
          text: `${interaction.user.tag}`,
          iconURL: `${interaction.user.displayAvatarURL({ format: "png", dynamic: true, size: 1024 })}`,
        });

      const embed = new EmbedBuilder()
        .setColor(config.commands.rename.embed.color)
        .setDescription(
          `${config.commands.rename.embed.description}`.replace(
            /\{name\}/g,
            sanitizeInput(newName),
          ),
        );

      interaction.reply({ embeds: [embed] });
      logChannel.send({ embeds: [log] });
      logMessage(
        `${interaction.user.tag} renamed the ticket #${interaction.channel.name} to #${newName}`,
      );
    }
 else if (subCMD == "reopen") {
      if (!(await ticketsDB.has(interaction.channel.id))) {
        return interaction.reply({
          content: config.errors.not_in_a_ticket,
          ephemeral: true,
        });
      }

      if (
        (await ticketsDB.get(`${interaction.channel.id}`).status) === "Open"
      ) {
        return interaction.reply({
          content: "This ticket is already open!",
          ephemeral: true,
        });
      }

      // const hasSupportRole = await checkSupportRole(interaction);
      // if (!hasSupportRole) {
      //   return interaction.reply({
      //     content: config.errors.not_allowed,
      //     ephemeral: true,
      //   });
      // }

      const ticketUserID = client.users.cache.get(
        await ticketsDB.get(`${interaction.channel.id}`).userID,
      );
      const ticketChannel = interaction.guild.channels.cache.get(
        interaction.channel.id,
      );
      const ticketButton = await ticketsDB.get(`${interaction.channel.id}`)
        .button;

      const logEmbed = new EmbedBuilder()
        .setColor(config.commands.reopen.LogEmbed.color)
        .setTitle(config.commands.reopen.LogEmbed.title)
        .addFields([
          {
            name: config.commands.reopen.LogEmbed.field_staff,
            value: `> <@!${interaction.user.id}>\n> ${sanitizeInput(interaction.user.tag)}`,
          },
          {
            name: config.commands.reopen.LogEmbed.field_user,
            value: `> <@!${ticketUserID.id}>\n> ${sanitizeInput(ticketUserID.tag)}`,
          },
          {
            name: config.commands.reopen.LogEmbed.field_ticket,
            value: `> #${sanitizeInput(interaction.channel.name)}\n> ${await ticketsDB.get(`${interaction.channel.id}.ticketType`)}`,
          },
        ])
        .setTimestamp()
        .setThumbnail(
          interaction.user.displayAvatarURL({
            format: "png",
            dynamic: true,
            size: 1024,
          }),
        )
        .setFooter({
          text: `${interaction.user.tag}`,
          iconURL: `${interaction.user.displayAvatarURL({ format: "png", dynamic: true, size: 1024 })}`,
        });

      const logChannelId = interaction.client.db.get(
        `logchannel_${interaction.guild.id}_${require("../../src/static/logTypes.json")[43].value}`,
      );
      const logsChannel = interaction.guild.channels.cache.get(logChannelId);
      if (logsChannel) await logsChannel.send({ embeds: [logEmbed] });

      const embed = new EmbedBuilder()
        .setColor(config.commands.reopen.embed.color)
        .setTitle(config.commands.reopen.embed.title)
        .setDescription(
          `${config.commands.reopen.embed.description}`
            .replace(/\{user\}/g, `${interaction.user}`)
            .replace(/\{user\.tag\}/g, sanitizeInput(interaction.user.tag)),
        )
        .setFooter({
          text: `${interaction.user.tag}`,
          iconURL: `${interaction.user.displayAvatarURL({ dynamic: true })}`,
        })
        .setTimestamp();

      Object.keys(ticketCategories).forEach(async (id) => {
        if (ticketButton === id) {
          const category = ticketCategories[id];

          if (
            category.closedCategoryID &&
            ticketChannel.parentId !== category.categoryID
          ) {
            await ticketChannel.setParent(category.categoryID, {
              lockPermissions: false,
            });
          }

          category.support_role_ids.forEach(async (roleId) => {
            await interaction.channel.permissionOverwrites.create(roleId, {
              ViewChannel: true,
              SendMessages: true,
              AttachFiles: true,
              EmbedLinks: true,
              ReadMessageHistory: true,
            });
          });
        }
      });

      const claimUser = client.users.cache.get(
        await ticketsDB.get(`${interaction.channel.id}`).claimUser,
      );
      await interaction.channel.permissionOverwrites.create(ticketUserID.id, {
        ViewChannel: true,
        SendMessages: true,
        AttachFiles: true,
        EmbedLinks: true,
        ReadMessageHistory: true,
      });
      if (claimUser) {
        await interaction.channel.permissionOverwrites.create(claimUser.id, {
          ViewChannel: true,
          SendMessages: true,
          AttachFiles: true,
          EmbedLinks: true,
          ReadMessageHistory: true,
        });
      }

      await interaction.channel.messages
        .fetch(await ticketsDB.get(`${interaction.channel.id}`).closeMsgID)
        .then((msg) => msg.delete());
      await ticketsDB.set(`${interaction.channel.id}.status`, "Open");
      await mainDB.push("openTickets", interaction.channel.id);
      await interaction.reply({ embeds: [embed] });
      if (config.reopenDM.enabled && interaction.user.id !== ticketUserID.id) {
        const reopenDMEmbed = new EmbedBuilder()
          .setColor(config.reopenDM.embed.color)
          .setTitle(config.reopenDM.embed.title)
          .setDescription(
            `${config.reopenDM.embed.description}`
              .replace(/\{ticketName\}/g, `${interaction.channel.name}`)
              .replace(/\{user\}/g, `<@!${interaction.user.id}>`)
              .replace(/\{server\}/g, `${interaction.guild.name}`),
          );

        try {
          await ticketUserID.send({ embeds: [reopenDMEmbed] });
        }
 catch (error) {
          const DMErrorEmbed = new EmbedBuilder()
            .setColor(config.DMErrors.embed.color)
            .setTitle(config.DMErrors.embed.title)
            .setDescription(`${config.DMErrors.embed.description}`);
          const logChannelId = config.logs.DMErrors || config.logs.default;
          const logChannel = client.channels.cache.get(logChannelId);
          await logChannel.send({ embeds: [DMErrorEmbed] });
          logMessage(
            `The bot could not DM ${ticketUserID.tag} because their DMs were closed`,
          );
        }
      }
      logMessage(
        `${interaction.user.tag} re-opened the ticket #${interaction.channel.name} which was created by ${ticketUserID.tag}`,
      );
    }
 else if (subCMD == "transfer") {
      if (!(await ticketsDB.has(interaction.channel.id))) {
        return interaction.reply({
          content: config.errors.not_in_a_ticket,
          ephemeral: true,
        });
      }

      // const hasSupportRole = await checkSupportRole(interaction);
      // if (!hasSupportRole) {
      //   return interaction.reply({
      //     content: config.errors.not_allowed,
      //     ephemeral: true,
      //   });
      // }

      const optionUser = interaction.options.getUser("user");
      const ticketType = await ticketsDB.get(`${interaction.channel.id}`)
        .ticketType;
      const currentUser = client.users.cache.get(
        await ticketsDB.get(`${interaction.channel.id}`).userID,
      );

      if (optionUser === currentUser) {
        return interaction.reply({
          content: "This user is already the creator of this ticket.",
          ephemeral: true,
        });
      }

      interaction.channel.permissionOverwrites.delete(currentUser);
      // await ticketsDB.set(`${interaction.channel.id}.userID`, optionUser.id);
      ticketsDB.set(`${interaction.channel.id}`, {
        ...ticketsDB.get(`${interaction.channel.id}`),
        userID: optionUser.id,
      });
      interaction.channel.permissionOverwrites.create(optionUser, {
        ViewChannel: true,
        SendMessages: true,
        ReadMessageHistory: true,
        AttachFiles: true,
        EmbedLinks: true,
      });
      const newTopic = `Ticket Creator: ${sanitizeInput(optionUser.tag)} | Ticket Type: ${ticketType}`;
      await interaction.channel.setTopic(newTopic);
      if (interaction.channel.name.includes(currentUser.username)) {
        await interaction.channel.setName(
          `${ticketType}-${optionUser.username}`,
        );
      }

      const logChannelId = interaction.client.db.get(
        `logchannel_${interaction.guild.id}_${require("../../src/static/logTypes.json")[43].value}`,
      );
      const logChannel = interaction.guild.channels.cache.get(logChannelId);

      const logEmbed = new EmbedBuilder()
        .setColor(config.commands.transfer.LogEmbed.color)
        .setTitle(config.commands.transfer.LogEmbed.title)
        .addFields([
          {
            name: config.commands.transfer.LogEmbed.field_staff,
            value: `> ${interaction.user}\n> ${sanitizeInput(interaction.user.tag)}`,
          },
          {
            name: config.commands.transfer.LogEmbed.field_ticket,
            value: `> ${interaction.channel}\n> #${sanitizeInput(interaction.channel.name)}`,
          },
          {
            name: config.commands.transfer.LogEmbed.field_transfer,
            value: `> ${currentUser} (${sanitizeInput(currentUser.tag)}) -> ${optionUser} (${sanitizeInput(optionUser.tag)})`,
          },
        ])
        .setTimestamp()
        .setThumbnail(
          interaction.user.displayAvatarURL({
            format: "png",
            dynamic: true,
            size: 1024,
          }),
        )
        .setFooter({
          text: `${interaction.user.tag}`,
          iconURL: `${interaction.user.displayAvatarURL({ format: "png", dynamic: true, size: 1024 })}`,
        });
      logChannel.send({ embeds: [logEmbed] });

      const embed = new EmbedBuilder()
        .setColor(config.commands.transfer.embed.color)
        .setDescription(
          `${config.commands.transfer.embed.description}`
            .replace(/\{user\}/g, optionUser)
            .replace(/\{user\.tag\}/g, sanitizeInput(optionUser.tag)),
        );
      interaction.reply({ embeds: [embed] });
      logMessage(
        `${interaction.user.tag} transferred the ownership of the ticket #${interaction.channel.name} to the user ${optionUser.tag}.`,
      );
    }
 else if (subCMD === "unclaim") {
      if (!(await ticketsDB.has(interaction.channel.id))) {
        return interaction.reply({
          content: config.errors.not_in_a_ticket,
          ephemeral: true,
        });
      }

      // const hasSupportRole = await checkSupportRole(interaction);
      // if (!hasSupportRole) {
      //   return interaction.reply({
      //     content: config.errors.not_allowed,
      //     ephemeral: true,
      //   });
      // }

      if (config.claimFeature === false) {
        return interaction.reply({
          content: "The claim feature is currently disabled.",
          ephemeral: true,
        });
      }

      if (
        (await ticketsDB.get(`${interaction.channel.id}`).claimed) === false
      ) {
        return interaction.reply({
          content: "This ticket has not been claimed!",
          ephemeral: true,
        });
      }

      if (
        (await ticketsDB.get(`${interaction.channel.id}`).claimUser) !==
        interaction.user.id
      ) {
        return interaction.reply({
          content: `You did not claim this ticket, only the user that claimed this ticket can unclaim it! (<@!${await ticketsDB.get(`${interaction.channel.id}`).claimUser}>)`,
          ephemeral: true,
        });
      }

      await interaction.deferReply({ ephemeral: true });
      const totalClaims = await mainDB.get("totalClaims");

      const ticketButton = await ticketsDB.get(`${interaction.channel.id}`)
        .button;

      Object.keys(ticketCategories).forEach(async (id) => {
        if (ticketButton === id) {
          ticketCategories[id].support_role_ids.forEach(async (roleId) => {
            await interaction.channel.permissionOverwrites
              .edit(roleId, {
                SendMessages: true,
                ViewChannel: true,
              })
              .catch((error) => {
                console.error(`Error updating permissions:`, error);
              });
          });
        }
      });

      const embed = new EmbedBuilder()
        .setTitle("Ticket Unclaimed")
        .setColor("#FF2400")
        .setDescription(
          `This ticket has been unclaimed by <@!${interaction.user.id}>`,
        )
        .setTimestamp()
        .setFooter({
          text: `Unclaimed by ${interaction.user.tag}`,
          iconURL: `${interaction.user.displayAvatarURL({ dynamic: true })}`,
        });
      interaction.editReply({
        content: "You successfully unclaimed this ticket!",
        ephemeral: true,
      });
      interaction.channel.permissionOverwrites.delete(interaction.user);
      interaction.channel.send({ embeds: [embed] });

      interaction.channel.messages
        .fetch(await ticketsDB.get(`${interaction.channel.id}`).msgID)
        .then(async (message) => {
          const embed = message.embeds[0];
          embed.fields.pop();

          const closeButton = new ButtonBuilder()
            .setCustomId("closeTicket")
            .setLabel(config.closeButton.label)
            .setEmoji(config.closeButton.emoji)
            .setStyle(ButtonStyle[config.closeButton.style]);

          const claimButton = new ButtonBuilder()
            .setCustomId("ticketclaim")
            .setLabel(config.claimButton.label)
            .setEmoji(config.claimButton.emoji)
            .setStyle(ButtonStyle[config.claimButton.style]);

          const actionRow3 = new ActionRowBuilder().addComponents(
            closeButton,
            claimButton,
          );

          message.edit({ embeds: [embed], components: [actionRow3] });

          // await ticketsDB.set(`${interaction.channel.id}.claimed`, false);
          // await ticketsDB.set(`${interaction.channel.id}.claimUser`, "");
          ticketsDB.set(`${interaction.channel.id}`, {
            ...ticketsDB.get(`${interaction.channel.id}`),
            claimed: false,
            claimUser: "",
          });

          const logChannelId = interaction.client.db.get(
            `logchannel_${interaction.guild.id}_${require("../../src/static/logTypes.json")[43].value}`,
          );
          const logsChannel =
            interaction.guild.channels.cache.get(logChannelId);

          const logEmbed = new EmbedBuilder()
            .setColor("#FF2400")
            .setTitle("Ticket Logs | Ticket Unclaimed")
            .addFields([
              {
                name: "• Executor",
                value: `> <@!${interaction.user.id}>\n> ${sanitizeInput(interaction.user.tag)}`,
              },
              {
                name: "• Ticket",
                value: `> <#${interaction.channel.id}>\n> #${sanitizeInput(interaction.channel.name)}\n> ${await ticketsDB.get(`${interaction.channel.id}`).ticketType}`,
              },
            ])
            .setTimestamp()
            .setThumbnail(
              interaction.user.displayAvatarURL({
                format: "png",
                dynamic: true,
                size: 1024,
              }),
            )
            .setFooter({
              text: `${interaction.user.tag}`,
              iconURL: `${interaction.user.displayAvatarURL({ format: "png", dynamic: true, size: 1024 })}`,
            });
          logsChannel.send({ embeds: [logEmbed] });
          await mainDB.set("totalClaims", totalClaims - 1);
          logMessage(
            `${interaction.user.tag} unclaimed the ticket #${interaction.channel.name}`,
          );
        });
    }
    // last elif statemntCTRL+F shortcut
    // await interaction.reply("This command is not yet implemented");
  },
};
