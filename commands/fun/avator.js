const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('@discordjs/builders')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('avatar')
        .setDescription('取得使用者投向')
        .setDMPermission(false)
        .addUserOption(options => options
            .setName('user')
            .setDescription('想要獲取頭貼的人')
            .setRequired(true)
        ),

    async execute(interaction) {
        const user = interaction.options.getUser('user');

        const avatar = user.avatarURL();

        const embed = new EmbedBuilder()
            .setTitle('使用者頭貼')
            .setDescription(`**這個是**${user}**的大頭貼**\n這是連結：\n\`${avatar}\``)
            .setThumbnail(avatar)
            .setTimestamp()

        await interaction.reply({ embeds: [embed], ephemeral: true })

    },
};