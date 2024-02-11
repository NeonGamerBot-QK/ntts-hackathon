const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { version } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('info')
        .setDescription('Get info about a user or a server!')
        .addStringOption(option => option
            .setName('about')
            .setDescription('Choose what to get info about')
            .setRequired(true)
            .addChoices(
                { name: 'Server', value: 'server' },
                { name: 'Bot', value: 'bot' },
            )),
    async execute(interaction) {
        const textChosen = interaction.options.getString('about');

        if (textChosen === 'server') {
            const guildTextChannelCount = interaction.guild.channels.cache.filter((c) => c.type === 0).toJSON().length;
            const guildVoiceChannelCount = interaction.guild.channels.cache.filter((c) => c.type === 2).toJSON().length;
            const guildCategoryChannelCount = interaction.guild.channels.cache.filter((c) => c.type === 4).toJSON().length;
            const guildThreadsChannelCount = interaction.guild.channels.cache.filter((c) => c.type === 5).toJSON().length;

            const serverEmbed = new EmbedBuilder()
                .setTitle(`Server Information`)
                .setThumbnail(interaction.guild.iconURL())
                .setDescription(`
                    <a:server:1174372626475528226> **Server name:** ${interaction.guild.name}
                    <:role_owner:1174372151181185136> **Owner:** ${(await interaction.guild.fetchOwner()).user}
                    <:Time:1174372631282208858> **Created at:** <t:${parseInt(interaction.guild.createdTimestamp / 1000)}:F>
                    <:arrow_right:1174373165737189386> **Total Channels:** \`${guildTextChannelCount + guildVoiceChannelCount + guildThreadsChannelCount}\`
                    <:list_bottom:1174365033225011270> <:blurple_text_channel:1174371323154268191> **Text Channels:** \`${guildTextChannelCount}\`
                    <:list_bottom:1174365033225011270> <:4321voiceg:1174216686510022656> **Voice Channels:** \`${guildVoiceChannelCount}\`
                    <:list_bottom:1174365033225011270> <:n_category:1174371675601633400> **Category Channels:** \`${guildCategoryChannelCount}\`
                    <:list_bottom:1174365033225011270> <:M_thread:1174371879197347921> **Threads Channels:** \`${guildThreadsChannelCount}\`
                    <:member_white_black:1174215881098801252> **Total members:** \`${interaction.guild.memberCount}\`
                    <:roles:1174372156252102658> **Roles:** \`${interaction.guild.roles.cache.size}\`
                    <:3161boost:1174216675760025600> **Total boosts:** \`${interaction.guild.premiumSubscriptionCount}\`
                `);

            await interaction.reply({ embeds: [serverEmbed] });
		}
        else if (textChosen === 'bot') {
            try {
                const sent = await interaction.deferReply({ fetchReply: true })
                const uptime = formatUptime(interaction.client.uptime)
          
                const description = `\`\`\`fix\nDeveloper:   kio2gamer\nStatus:      Under Development\nLanguage:    JavaScript\nCreated on:  ${interaction.client.user.createdAt.toUTCString()}\`\`\``
                const pingField = `\`\`\`fix\nPing:   ${sent.createdTimestamp - interaction.createdTimestamp} ms\nWS:     ${interaction.client.ws.ping} ms\nUptime: ${uptime}\nNode:   ${process.version}\nDJS:    v${version}\`\`\``
                const statsField = `\`\`\`fix\nBot ID: ${interaction.client.user.id}\nType: Private\nCommands: 15\nCommands Type: Slash Commands\`\`\``
          
                const embed = new EmbedBuilder()
                    .setTitle('Bot Info')
                    .setColor('Purple')
                    .setDescription(description)
                    .addFields(
                    { name: 'Ping', value: pingField, inline: true },
                    { name: 'Stats', value: statsField, inline: true }
                )

                await interaction.editReply({ embeds: [embed] })
              } catch (error) {
                await interaction.editReply('Oops! There was an error.').then((msg) => {setTimeout(() => {msg.delete()}, 10000)})
                console.log(error)
              }
        }
	},
}

function formatUptime(uptimeMilliseconds) {
    const seconds = Math.floor(uptimeMilliseconds / 1000)
    const days = Math.floor(seconds / 86400)
    const hours = Math.floor((seconds % 86400) / 3600)
    const minutes = Math.floor(((seconds % 86400) % 3600) / 60)
    const secondsLeft = ((seconds % 86400) % 3600) % 60
  
    return `${days}d ${hours}h ${minutes}m ${secondsLeft}s`
}
