// const { SlashCommandBuilder, ChannelType } = require("discord.js");

// module.exports = {
//   data: new SlashCommandBuilder()
//     .setName("lock")
//     .setDescription("Lock a channel")
//     .addChannelOption((option) =>
//       option
//         .setName("channel")
//         .setDescription("The channel to lock")
//         .setRequired(true)
//         .addChannelTypes(ChannelType.GuildText),
//     ),
//   async execute(interaction) {
//     const channel = interaction.options.getChannel("channel");
//     if (channel.type === "GUILD_CATEGORY") {
//       return interaction.reply({
//         content: "You can't lock a category",
//         ephemeral: true,
//       });
//     }
//     if (channel.type === "GUILD_VOICE") {
//       return interaction.reply({
//         content: "You can't lock a voice channel",
//         ephemeral: true,
//       });
//     }
//     if (!channel.permissionsFor(interaction.guild.me).has("MANAGE_CHANNELS")) {
//       return interaction.reply({
//         content: "I don't have permission to lock that channel",
//         ephemeral: true,
//       });
//     }
//     if (!channel.permissionsFor(interaction.member).has("MANAGE_CHANNELS")) {
//       return interaction.reply({
//         content: "You don't have permission to lock that channel",
//         ephemeral: true,
//       });
//     }
//     if (channel.permissionOverwrites.cache.has(interaction.guild.id)) {
//       const permissions = channel.permissionOverwrites.cache.get(
//         interaction.guild.id,
//       );
//       if (permissions.deny.bitfield === 0n) {
//         return interaction.reply({
//           content: "The channel is already locked",
//           ephemeral: true,
//         });
//       }
//       await permissions.update({ SEND_MESSAGES: null });
//     }
//  else {
//       await channel.permissionOverwrites.create(interaction.guild.id, {
//         SEND_MESSAGES: null,
//       });
//       await channel.send({ content: ":lock: This channel has been locked" });
//     }
//     await interaction.reply({ content: `Locked ${channel}`, ephemeral: true });
//   },
// };
const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');

// Define command
module.exports = {
  data: new SlashCommandBuilder()
    .setName('lockchannel')
    .setDescription('Locks a text channel, preventing others from sending messages.')
    .addChannelOption(channel =>
      channel.setName('target_channel')
        .setDescription('Select the channel to lock.')
        .setRequired(true)
    ),

  async execute(interaction) {
  // Check permissions
  if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
    await interaction.reply({
      content: 'You don\'t have permission to lock channels!',
      ephemeral: true, // Only visible to user
    });
    return;
  }

  // Get target channel
  const targetChannel = interaction.options.getChannel('target_channel');

  // Check if channel is a text channel
  if (!targetChannel.type === 'GUILD_TEXT') {
    await interaction.reply({
      content: 'You can only lock text channels!',
      ephemeral: true,
    });
    return;
  }

  try {
    // Overwrite permissions for everyone to deny sending messages
    await targetChannel.permissionOverwrites.edit(
      interaction.guild.everyone.id,
      { SEND_MESSAGES: false }
    );

    await interaction.reply({
      content: `Channel **${targetChannel.name}** has been locked!`,
    });
  } catch (error) {
    console.error('Error locking channel:', error);
    await interaction.reply({
      content: 'An error occurred while locking the channel. Please check the logs.',
      ephemeral: true,
    });
  }
},
}