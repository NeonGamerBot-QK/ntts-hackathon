const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionsBitField, EmbedBuilder } = require('discord.js')
// const { Banlogchannel } = require('../../config.json')
// const { SystemMsg } = require('../../local.json')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Kick a user')
        .setDMPermission(false)
        .addUserOption(options => options
            .setName('user')
            .setDescription('User you want to kick')
            .setRequired(true)
        ),

    async execute(interaction, client) {
        const user = interaction.options.getUser('user');

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return interaction.reply({ content: `**You don't have permission**`, ephemeral: true })
        } else if (!user) {
            return interaction.reply({ content: `you didn't enter user`, ephemeral: true })
        }

        try {

            const kicker = await interaction.guild.members.fetch(user.id);

            const embed = new EmbedBuilder()
                .setColor(0xffa600)
                .setTitle(SystemMsg.KickMsg.Title)
                .setDescription(SystemMsg.BanMsg.Message.replace('USER', `<@${user.id}>`))
            
            const log = new EmbedBuilder()
                .setColor(0x34ebe5)
                .setTitle('User Kicked')
                .setDescription(SystemMsg.KickMsg.LogMsg.replace('USER', `<@${user.id}>`).replace('ADMIN', `<@${interaction.user.id}>`))

            await kicker.kick();
            interaction.reply({ embeds: [embed] });

            const channel = interaction.guild.channels.cache.get(Banlogchannel);
            channel.send({ embeds: [log] })

        } catch (error) {

            const embed = new EmbedBuilder()
                .setColor(0xffa600)
                .setTitle('Error')
                .setDescription(`**Error message: **the user you want to kick is not in server\n(or banned)`)
                .setTimestamp()

            interaction.reply({ embeds: [embed], ephemeral: true })
        }

    },
};