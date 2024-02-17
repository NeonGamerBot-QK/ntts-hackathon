const { 
  SlashCommandBuilder, 
  ChannelType,
  PermissionFlagsBits 
} = require('discord.js');

const MANAGE_CHANNELS = PermissionFlagsBits.ManageChannels;
const SEND_MESSAGES = PermissionFlagsBits.SendMessages;

module.exports = {
  data: new SlashCommandBuilder()
    .setName('lock')
    .setDescription('Lock a channel')
    .addChannelOption((option) =>
      option
        .setName('channel')
        .setDescription('The channel to lock')
        .setRequired(true)
        .addChannelTypes([ChannelType.GuildText]),
    ),

  async execute(interaction) {

    const channel = interaction.options.getChannel('channel');

    if (!canLockChannel(channel)) {
      return interaction.reply({ content: 'Invalid channel', ephemeral: true});
    }

    if (!hasPermission(channel, interaction.member)) {
      return interaction.reply({ content: 'You do not have permission', ephemeral: true}); 
    }

    if (isLocked(channel)) {
      return interaction.reply({ content: 'Channel already locked', ephemeral: true });
    }

    await lockChannel(channel, interaction.guildId);
    
    await interaction.reply({ content: `Locked ${channel.name}`, ephemeral: true });
  } 
}

function canLockChannel(channel) {
  return channel.type !== ChannelType.GuildCategory 
    && channel.type !== ChannelType.GuildVoice;
}

function hasPermission(channel, member) {
  return channel.permissionsFor(member).has(MANAGE_CHANNELS); 
}

function isLocked(channel) {
  const overwrite = channel.permissionOverwrites.cache.get(channel.guild.id);
  return overwrite?.deny.has(SEND_MESSAGES);
}

async function lockChannel(channel, guildId) {

  if (channel.permissionsFor(interaction.guild.me).has(MANAGE_CHANNELS)) {
    await channel.permissionOverwrites.create(guildId, {
      [SEND_MESSAGES]: false
    });
    await channel.send('This channel has been locked');
  }

}