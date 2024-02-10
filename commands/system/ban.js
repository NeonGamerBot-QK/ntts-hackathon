const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionsBitField, EmbedBuilder } = require('discord.js')
// const { Banlogchannel } = require('../../config.json')
// const { SystemMsg } = require('../../local.json')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Ban a user')
        .setDMPermission(false)
        .addUserOption(options => options
            .setName('user')
            .setDescription('User you want to ban')
            .setRequired(true)
        ),

    async execute(interaction, client) {
        const user = interaction.options.getUser('user');

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return interaction.reply({ content: `**You don't have permission**`, ephemeral: true })
        } else if (!user) {
            return interaction.reply({ content: `You didn't enter user`, ephemeral: true })
        }

        try {

            const baner = await interaction.guild.members.fetch(user.id);

            const embed = new EmbedBuilder()
                .setColor(0xffa600)
                .setTitle(SystemMsg.BanMsg.Title)
                .setDescription(SystemMsg.BanMsg.Message.replace('USER', `<@${user.id}>`))
            
            const log = new EmbedBuilder()
                .setColor(0x34ebe5)
                .setTitle('User Banned')
                .setDescription(SystemMsg.BanMsg.LogMsg.replace('USER', `<@${user.id}>`).replace('ADMIN', `<@${interaction.user.id}>`))

            await baner.ban();
            interaction.reply({ embeds: [embed] });

            const channel = interaction.guild.channels.cache.get(Banlogchannel);
            channel.send({ embeds: [log] })

        } catch (error) {

            const embed = new EmbedBuilder()
                .setColor(0xffa600)
                .setTitle('Erorr')
                .setDescription(`**Error message：**the user you want to ban is not in the server\n(or banned)`)
                .setTimestamp()

            interaction.reply({ embeds: [embed], ephemeral: true })

        }


    },
};