const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");
const fs = require('fs')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('View the help menu')
    .addStringOption((option) =>
      option
        .setName('category')
        .setRequired(false)
        .setDescription('What command category do you want to view?')
        // Make sure the value of the choices are exactly equal to the folder names
        .addChoices(
          { name: 'Configuration', value: 'config' },
          { name: 'Developers', value: 'dev' },
          { name: 'Fun', value: 'fun' },
          { name: 'Miscellaneous', value: 'misc' },
          { name: 'System', value: 'system' }
        )
    ),

    async execute(interaction) {
      await interaction.deferReply()

      const category = interaction.options.getString('category')

      function getCategoryNameForMainMenu(choice) {
        // Make sure to update command categories
        if (choice === 'config') 
          return `> Configuration\n> `
        if (choice === 'dev') 
          return `> Developers\n> `
        if (choice === 'fun') 
          return `> Fun\n> `
        if (choice === 'misc')
          return `> Miscellaneous\n> `
        if (choice === 'system')
          return `> System `
      }

      function getCategoryTitle(choice) {
        // Make sure to update command categories
        if (choice === 'config') 
          return `Configuration`
        if (choice === 'dev') 
          return `Developers`
        if (choice === 'fun') 
          return `Fun`
        if (choice === 'misc')
          return `Miscellaneous`
        if (choice === 'system')
          return `System`
      }

      let configFields = []
      let devFields = []
      let funFields = []
      let miscFields = []
      let systemFields = []

      for (const [index, folder] of fs
        .readdirSync('commands')
        .entries()) {
        const files = fs
          .readdirSync(`commands/${folder}`)
          .filter((file) => file.endsWith('.js'))

        for (const file of files) {
          const command = require(`./../${folder}/${file}`)
          let name = `${command.data.name}`
          try {
            let commandId = await interaction.guild.commands
              .fetch()
              .then((commands) => commands.find((cmd) => cmd.name === name).id)

            // Make sure to update command categories
            if (folder === 'config') {
              configFields.push(`</${name}:${commandId}>`)
            }
            if (folder === 'dev') {
              devFields.push(`</${name}:${commandId}>`)
            }
            if (folder === 'fun') {
              funFields.push(`</${name}:${commandId}>`)
            }
            if (folder === 'misc') {
              miscFields.push(`</${name}:${commandId}>`)
            }
            if (folder === 'system') {
              systemFields.push(`</${name}:${commandId}>`)
            }
          } catch (error) {
            console.error(`Error fetching ID for ${name}: ${error.message}`)
            console.log(error)
          }
        }
      }

      const cmdListEmbed = new EmbedBuilder()
        .setColor("White")
        .setTitle('Command List')
        .setDescription(`\`/help [category] - View specific category\`\n(NOTE: The non-blue command links have subcommands because discord doesnt allow to add blue command links to them.)`)
        .setAuthor({
          name: 'MSOTD HelpDesk',
          iconURL: interaction.client.user.avatarURL(),
        })
        // Make sure to update command categories
        .addFields([
          { name: `Configuration`, value: `${configFields.join(', ')}` },
          { name: `Developers`, value: `${devFields.join(', ')}` },
          { name: `Fun`, value: `${funFields.join(', ')}`},
          { name: `Miscellaneous`, value: `${miscFields.join(', ')}`},
          { name: `System`, value: `${systemFields.join(', ')}`},
        ])

      if (category === null) {
        const mainMenuEmbed = new EmbedBuilder()
          .setColor("White")
          .setDescription('`/help [category] - View specific category`')
          .setAuthor({
            name: 'MSOTD HelpDesk',
            iconURL: interaction.client.user.avatarURL(),
          })
          .addFields([
            {
              name: `Categories`,
              value: `${fs
                .readdirSync('./commands')
                .map(getCategoryNameForMainMenu)
                .join('\n')}`,
            },
          ])
        const cmdListButton = new ButtonBuilder()
          .setLabel('Command List')
          .setStyle(ButtonStyle.Secondary)
          .setCustomId('cmdList')

        const mainMenuBtn = new ButtonBuilder()
          .setLabel('Home')
          .setStyle(ButtonStyle.Secondary)
          .setCustomId('home')

        const rowWithCmdBtn = new ActionRowBuilder().addComponents(
          cmdListButton
        )
        const rowWithHomeBtn = new ActionRowBuilder().addComponents(mainMenuBtn)
        const reply = await interaction.editReply({
          embeds: [mainMenuEmbed],
          components: [rowWithCmdBtn],
        })

        const collector = reply.createMessageComponentCollector({
          time: 60_000 * 5,
        })
        collector.on('collect', async (i) => {
          if (i.user.id === interaction.user.id) {
            if (i.customId === 'cmdList') {
              await i.update({
                embeds: [cmdListEmbed],
                components: [rowWithHomeBtn],
              })
            }
            if (i.customId === 'home') {
              await i.update({
                embeds: [mainMenuEmbed],
                components: [rowWithCmdBtn],
              })
            }
          } else {
            await i.reply({
              content: 'You should run the command to use this interaction',
              ephemeral: true,
            })
          }
        })
        collector.on('end', async (collected, reason) => {
          if (reason === 'time') {
            await reply.edit({ components: [] })
          }
        })
        return
      }

      let embedDescription = []

      const commandFiles = fs
        .readdirSync(`commands/${category}`)
        .filter((file) => file.endsWith('.js'))

      for (const file of commandFiles) {
        const command = require(`./../${category}/${file}`)
        let name = `${command.data.name}`
        let description = `${command.data.description}`

        // Handle errors when fetching the command ID in case the command is not registered
        try {
          let commandId = await interaction.guild.commands
            .fetch()
            .then((commands) => commands.find((cmd) => cmd.name === name).id)

            embedDescription.push(`</${name}:${commandId}> \n> ${description}`)
        } catch (error) {
          console.error(`Error fetching ID for ${name}: ${error.message}`)
          console.log(error)
        }
      }

      const categoryEmbed = new EmbedBuilder()
        .setColor("White")
        .setTitle(`${getCategoryTitle(category)}`)
        .setDescription(`${embedDescription.join('\n\n')}`)

      if (fs.readdirSync('commands').includes(category)) {
        return await interaction.editReply({ embeds: [categoryEmbed] })
      }
    }
}










































// module.exports = {
//   data: new SlashCommandBuilder()
//     .setName("help")
//     .setDescription("Get help with the bot")
//     .addStringOption((option) =>
//       option
//         .setName("command")
//         .setDescription("The command to get help with")
//         .setRequired(false)
//         .setAutocomplete(true),
//     ),
//   async autocomplete(interaction) {
//     const focusedValue = interaction.options.getFocused();
//     await interaction.respond(
//       interaction.guild.commands.cache
//         .filter((cmd) => {
//           return (
//             cmd.name.startsWith(focusedValue) ||
//             cmd.description.includes(focusedValue)
//           );
//         })
//         .map((cmd) => {
//           return { name: cmd.name, value: cmd.id };
//         }),
//     );
//   },
//   async execute(interaction) {
//     const command = interaction.options.getString("command");
//     if (command) {
//       const cmd = interaction.guild.commands.cache.get(command);
//       if (!cmd) {
//         return await interaction.reply({
//           content: "That command does not exist",
//           ephemeral: true,
//         });
//       }
//       const data = [];
//       data.push(`**Name:** ${cmd.name}`);
//       data.push(`**Description:** ${cmd.description}`);
//       if (cmd.options) {
//         data.push("**Options:**");
//         cmd.options.forEach((option) => {
//           data.push(
//             `**Name:** ${option.type == 1 ? `</${cmd.name} ${option.name}:${cmd.id}>` : option.name}`,
//           );
//           data.push(`**Description:** ${option.description}`);
//           // if(option.type == 1) {
//           //   // data.push(`**Type:** Sub-command`);
//           // }
//           if (option.choices) {
//             data.push("**Choices:**");
//             option.choices.forEach((choice) => {
//               data.push(`**Name:** ${choice.name}`);
//               data.push(`**Value:** ${choice.value}`);
//             });
//           }
//           if (option.options) {
//             data.push("**Sub-options:**");
//             option.options.forEach((suboption) => {
//               data.push(`**Name:** ${suboption.name}`);
//               data.push(`**Description:** ${suboption.description}`);
//               if (suboption.choices) {
//                 data.push("**Choices:**");
//                 suboption.choices.forEach((choice) => {
//                   data.push(`**Name:** ${choice.name}`);
//                   data.push(`**Value:** ${choice.value}`);
//                 });
//               }
//             });
//           }
//         });
//       }
//       const embed = new EmbedBuilder()
//         .setTitle("Command Help")
//         .setDescription(data.join("\n"));
//       // .setColor();
//       return await interaction.reply({ embeds: [embed] });
//     }
//     await interaction.guild.commands.fetch();
//     const embed = new EmbedBuilder().setTitle("Command List");
//     const commands = interaction.guild.commands.cache.map((cmd) => {
//       // console.log(cmd);
//       const str = `</${cmd.name}:${cmd.id}> - ${cmd.description}\n`;
//       const subCmds = null;
//       // cmd.options
//       //   .filter((e) => e.type == 1)
//       //   .map((subCmd) => {
//       //     return `> </${cmd.name} ${subCmd.name}:${cmd.id}> - ${subCmd.description}`;
//       //   });
//       // str += subCmds.join("\n");
//       return subCmds ? { name: str, value: subCmds.join("\n") } : str;
//     });
//     // command
//     let fstr = "";
//     commands.forEach((cmd) => {
//       if (typeof cmd === "string") {
//         fstr += cmd;
//       }
//  else {
//         // fstr += cmd.name + '\n' + cmd.value;
//         embed.addFields({ name: cmd.name, value: cmd.value });
//       }
//     });
//     embed.setDescription(fstr);
//     // .join("\n");

//     // .setColor("RANDOM");
//     return await interaction.reply({ embeds: [embed] });
//   },
// };
