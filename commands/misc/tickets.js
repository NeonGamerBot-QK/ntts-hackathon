const { SlashCommandBuilder } = require("discord.js");

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
      subcommand.setName("delete").setDescription("Delete a ticket"),
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
            .addChannelTypes("GUILD_CATEGORY"),
        ),
    ),
  async execute(interaction) {
    const subCMD = interaction.options.getSubcommand();
    if (subCMD === "create") {
      // await interaction.reply("This command is not yet implemented");
      if (!interaction.client.db.get(`ticketsys_${interaction.guild.id}`)) {
        return await interaction.reply({
          content: "Ticket system is not enabled",
          empheral: true,
        });
      }
      if (
        interaction.client.db.get(
          `ticket_${interaction.user.id}_${interaction.guild.id}`,
        )
      ) {
        return await interaction.reply({
          content: "You already have a ticket",
          empheral: true,
        });
      }
      const channel = await interaction.guild.channels.create(
        `ticket-${interaction.user.username}`,
        {
          type: "text",
          parent: interaction.client.db.get(
            `ticketcategory_${interaction.guild.id}`,
          ),
        },
      );
      await channel.permissionOverwrites.edit(interaction.guild.id, {
        VIEW_CHANNEL: false,
      });
      await channel.permissionOverwrites.edit(interaction.user.id, {
        VIEW_CHANNEL: true,
      });
      await channel.permissionOverwrites.edit(interaction.client.user.id, {
        VIEW_CHANNEL: true,
      });
      await channel.send({
        content: `Welcome ${interaction.user}!`,
        embeds: [],
      });
      await interaction.reply({
        content: `Ticket has been created at <#${channel.id}>`,
        ephemeral: true,
      });
      interaction.client.db.set(`ticket_${channel.id}`, interaction.user.id);
      interaction.client.db.set(`ticketopentime_${channel.id}`, Date.now());
      // interaction.client.db.set(`ticketcount_${interaction.guild.id}`, 1);
      interaction.client.db.set(
        `ticket_${interaction.user.id}_${interaction.guild.id}`,
        channel.id,
      );
    }
 else if (subCMD === "close") {
      await interaction.reply("This command is not yet implemented");
      if (!interaction.client.db.get(`ticketsys_${interaction.guild.id}`)) {
        return await interaction.reply({
          content: "Ticket system is not enabled",
          empheral: true,
        });
      }
      const channel = interaction.guild.channels.cache.get(
        interaction.client.db.get(
          `ticket_${interaction.user.id}_${interaction.guild.id}`,
        ),
      );
      if (!channel) {
        return await interaction.reply({
          content: "You don't have a ticket",
          empheral: true,
        });
      }
      await channel.delete();
      interaction.client.db.delete(
        `ticket_${interaction.user.id}_${interaction.guild.id}`,
      );
      interaction.client.db.delete(`ticket_${channel.id}`);
      interaction.client.db.delete(`ticketopentime_${channel.id}`);
      // interaction.client.db.delete(`ticketcount_${interaction.guild.id}`);
    }
 else if (subCMD === "delete") {
      await interaction.reply("This command is not yet implemented");
    }
 else if (subCMD === "enable") {
      const catagory = interaction.options.getChannel("category");
      if (interaction.client.db.get(`ticketsys_${interaction.guild.id}`)) {
        return await interaction.reply({
          content: "Ticket system is already enabled",
          empheral: true,
        });
      }
      // check perms
      if (!interaction.guild.me.permissions.has("MANAGE_CHANNELS")) {
        return await interaction.reply({
          content: "I don't have permission to manage channels",
          empheral: true,
        });
      }
      if (!interaction.guild.me.permissions.has("MANAGE_ROLES")) {
        return await interaction.reply({
          content: "I don't have permission to manage roles",
          empheral: true,
        });
      }
      if (!interaction.guild.me.permissions.has("VIEW_CHANNEL")) {
        return await interaction.reply({
          content: "I don't have permission to view channels",
          empheral: true,
        });
      }
      if (!interaction.guild.me.permissions.has("SEND_MESSAGES")) {
        return await interaction.reply({
          content: "I don't have permission to send messages",
          empheral: true,
        });
      }
      // check USERS perms
      if (!interaction.member.permissions.has("MANAGE_SERVER")) {
        return await interaction.reply({
          content: "You don't have permission to manage server",
          empheral: true,
        });
      }

      interaction.client.db.set(`ticketsys_${interaction.guild.id}`, true);
      interaction.client.db.set(
        `ticketcategory_${interaction.guild.id}`,
        catagory.id,
      );
      await interaction.reply({
        content: "Ticket system has been enabled",
        empheral: true,
      });
    }
    // await interaction.reply("This command is not yet implemented");
  },
};
