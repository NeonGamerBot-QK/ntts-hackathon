const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("tags")
    .setDescription("Manage tags")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("create")
        .setDescription("Create a new tag")
        .addStringOption((option) =>
          option
            .setName("name")
            .setDescription("The name of the tag")
            .setRequired(true),
        )
        .addStringOption((option) =>
          option
            .setName("content")
            .setDescription("The content of the tag")
            .setRequired(true),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("delete")
        .setDescription("Delete a tag")
        .addStringOption((option) =>
          option
            .setName("name")
            .setDescription("The name of the tag")
            .setRequired(true)
            .setAutocomplete(true),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("edit")
        .setDescription("Edit a tag")
        .addStringOption((option) =>
          option
            .setName("name")
            .setDescription("The name of the tag")
            .setRequired(true)
            .setAutocomplete(true),
        )
        .addStringOption((option) =>
          option
            .setName("content")
            .setDescription("The new content of the tag")
            .setRequired(true),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("info")
        .setDescription("Get info on a tag")
        .addStringOption((option) =>
          option
            .setName("name")
            .setDescription("The name of the tag")
            .setRequired(true)
            .setAutocomplete(true),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand.setName("list").setDescription("List all tags"),
    ),
  async autocomplete(interaction) {
    const subCMD = interaction.options.getSubcommand();
    if (subCMD === "delete" || subCMD === "edit" || subCMD === "info") {
      const tags =
        interaction.client.db.get(`tags-${interaction.user.id}`) || [];
      await interaction.respond(
        tags.map((tag) => {
          return { name: tag.name, value: tag.name };
        }),
      );
    }
  },
  async execute(interaction) {
    const subCMD = interaction.options.getSubcommand();
    if (subCMD === "create") {
      const tagName = interaction.options.getString("name");
      const tagContent = interaction.options.getString("content");
      interaction.client.db.set(`tags-${interaction.user.id}`, [
        ...(interaction.client.db.get(`tags-${interaction.user.id}`) || []),
        {
          name: tagName,
          description: tagContent,
        },
      ]);
      return await interaction.reply({
        content: `Tag ${tagName} added.`,
        emphemeral: true,
      });
    }
 else if (subCMD === "delete") {
      const tagName = interaction.options.getString("name");
      // const rowCount = await interaction.client.db.delete({ where: { name: tagName } });
      // if (!rowCount) return await interaction.reply("That tag did not exist.");
      const indexOfTag = interaction.client.db
        .get(`tags-${interaction.user.id}`)
        .findIndex((tag) => tag.name === tagName);
      // let tag
      const tags =
        interaction.client.db.get(`tags-${interaction.user.id}`) || [];
      if (indexOfTag < 0) {return await interaction.reply(`Tag ${tagName} could not be found.`);}
      tags.splice(indexOfTag, 1);
      interaction.client.db.set(`tags-${interaction.user.id}`, tags);
      return await interaction.reply("Tag deleted.");
    }
 else if (subCMD === "edit") {
      const tagName = interaction.options.getString("name");
      const newContent = interaction.options.getString("content");
      // const affectedRows = await interaction.client.db.set({ description: newContent }, { where: { name: tagName } });
      const indexOfTag = interaction.client.db
        .get(`tags-${interaction.user.id}`)
        .findIndex((tag) => tag.name === tagName);
      const tags =
        interaction.client.db.get(`tags-${interaction.user.id}`) || [];
      if (indexOfTag < 0) {return await interaction.reply(`Tag ${tagName} was edited.`);}
      tags[indexOfTag].description = newContent;
      interaction.client.db.set(`tags-${interaction.user.id}`, tags);
      return await interaction.reply(`Tag ${tagName} could not be found.`);
    }
 else if (subCMD === "info") {
      const tagName = interaction.options.getString("name");
      const tag = await interaction.client.db
        .get(`tags-${interaction.user.id}`)
        .find((t) => t.name === tagName);
      if (!tag) return await interaction.reply("That tag could not be found.");
      return await interaction.reply(tag.description);
    }
 else if (subCMD == "list") {
      const tags =
        interaction.client.db.get(`tags-${interaction.user.id}`) || [];
      return await interaction.reply(tags.map((tag) => tag.name).join(", "));
    }
 else {
      return await interaction.reply("Unknown subcommand.");
    }
  },
};
