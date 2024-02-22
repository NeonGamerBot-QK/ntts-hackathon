const { ButtonBuilder } = require("discord-gamecord/utils/utils");
const {
  SlashCommandBuilder,
  RoleSelectMenuBuilder,
  ActionRowBuilder,
  ButtonStyle,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("buttonreactionroles")
    .setDescription("Button Reaction Roles")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("create")
        .setDescription("Create a Button Reaction Role")
        .addRoleOption((roption) =>
          roption
            .setName("role")
            .setDescription("The reaction role to be given"),
        )
        .addStringOption((nn) =>
          nn.setName("name").setDescription("the name for the reaction role"),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("delete")
        .setDescription("Delete a Button Reaction Role")
        .addStringOption((nn) =>
          nn
            .setName("name")
            .setDescription("the name for the reaction role")
            .setAutocomplete(true),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("edit")
        .setDescription("Edit a Button Reaction Role")
        .addRoleOption((roption) =>
          roption
            .setName("role")
            .setDescription("The reaction role to be given"),
        )
        .addStringOption((nn) =>
          nn
            .setName("name")
            .setDescription("the name for the reaction role")
            .setAutocomplete(true),
        ),
    ),
  async execute(interaction) {
    // await interaction.reply("Button Reaction Roles");
    const subcommand = interaction.options.getSubcommand();
    if (subcommand === "create") {
      const role = interaction.options.getRole("role");
      const name = interaction.options.getString("name");
      interaction.client.db.set(
        `reactionrole_${interaction.guild.id}_${name}`,
        role.id,
      );
      // awtait interaction.reply("Create Button Reaction Role");
      // const model = new ModalBuilder();
      // model.setTitle("Create Button Reaction Role");
      // model.setCustomId("buttonreactionroles");
      // const description = new TextInputBuilder();
      // description.setPlaceholder("Role ID");
      // description.setRequired(true);
      // description.setStyle(TextInputStyle.SingleLine);
      // description.setLabel("Role ID");
      // description.setMinLength(18);
      // description.setMaxLength(18);
      // description.setCustomId("roleid");
      // model.addComponents(new ActionRowBuilder().addComponents(description));
      // await interaction.showModal(model);
      await interaction.reply({
        content: "Button Reaction Role Created",
        empheral: true,
      });
    }
 else if (subcommand === "delete") {
      const name = interaction.options.getString("name");
      interaction.client.db.delete(
        `reactionrole_${interaction.guild.id}_${name}`,
      );
      // await interaction.reply("Delete Button Reaction Role");
      await interaction.reply({
        content: "Button Reaction Role Deleted",
        empheral: true,
      });
    }
 else if (subcommand === "edit") {
      // await interaction.reply("Edit Button Reaction Role");
      // let selectron
      // interaction.reply({
      //   content: "Edit Button Reaction Role",
      //   empheral: true,
      // });

      const name = interaction.options.getString("name");
      const role = interaction.options.getRole("role");
      interaction.client.db.set(
        `reactionrole_${interaction.guild.id}_${name}`,
        role.id,
      );
      await interaction.reply({
        content: "Button Reaction Role Edited",
        empheral: true,
      });
    }
 else if (subcommand === "list") {
      const reactionroles = interaction.client.db
        .all()
        .filter((x) => x.ID.startsWith(`reactionrole_${interaction.guild.id}`))
        .map((x) => x.ID.split("_")[2]);
      await interaction.reply({
        content: `Button Reaction Roles: ${reactionroles.join(", ")}`,
        empheral: true,
      });
    }
 else if (subcommand == "deploy_message") {
      const selectMenu = new RoleSelectMenuBuilder();
      selectMenu.setCustomId("roleselectmenu");
      selectMenu.setPlaceholder("Select a role");
      selectMenu.setMinValues(1);
      selectMenu.setMaxValues(25);
      // selectMenu.setMaxValues(1);
      selectMenu.setPlaceholder("Select a role");
      // selectMenu.setMaxValues

      const row = ActionRowBuilder().addComponents(selectMenu);
      await interaction
        .reply({
          content: "Which roles for this message?",
          components: [row],
          fetchReply: true,
        })
        .then((m) => {
          const comp = new Array(5)
            .join(",")
            .split(",")
            .map(() => new ActionRowBuilder());
          let i = 0;
          // create component collector
          const filter = (ii) => ii.customId === "roleselectmenu";
          const collector = m.createMessageComponentCollector({
            filter,
            time: 15000,
          });
          collector.on("collect", async (ii) => {
            //   const role = i.values[0];
            i.values.forEach((role) => {
              if (
                !interaction.client.db.get(
                  `reactionrole_${interaction.guild.id}_${role.id}`,
                )
              ) {
return ii.reply({
                  content: "Role not added to the reaction roles system",
                  ephemeral: true,
                });
}
              // const member = i.member;
              const guild = i.guild;
              //   const channel = i.channel;
              //   const message = i.message;
              const roleObj = guild.roles.cache.get(role);
              //   await member.roles.add(roleObj);
              // interaction.client.db.set(
              //     `reactionrole_${interaction.guild.id}_${roleObj.name}`,
              //     roleObj.id,
              // );
              comp[i].addComponents(
                new ButtonBuilder()
                  .setLabel(
                    interaction.client.db.get(
                      `reactionrole_${interaction.guild.id}_${role.id}`,
                    ).label || roleObj.name,
                  )
                  .setStyle(ButtonStyle.Primary)
                  .setCustomId(roleObj.id),
              );
              if (comp[i].data.components.length === 5) {
                // i.reply({ content: "Max roles reached", ephemeral: true })
                // return;
                i++;
              }
              //   comp.push()
              // await i.deferUpdate();
            });
            //   if(!)
          });
          collector.on("end", (collected, reason) => {
            if (reason === "time") {
              m.edit({
                content: "Time is up",
                components: [],
              });
            }
 else {
              m.edit({
                content: "Roles added",
                //   components: comp.map((c) => c.toJSON()),
              });
              interaction.channel.send({
                content: "Roles",
                components: comp,
              });
            }
          });
          // })
          // });
        });
    }
  },
};
