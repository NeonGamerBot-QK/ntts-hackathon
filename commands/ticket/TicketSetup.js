const { SlashCommandBuilder } = require('@discordjs/builders');
const { CloseCategory } = require('../../config.json')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ticket')
        .setDescription('Close all closed ticket!')
        .addSubcommand(subcommand =>
            subcommand
                .setName('setup')
                .setDescription('Close all closed ticket!')
        ),

    async execute(interaction) {
        await interaction.reply({ content: 'Ticket Closing', ephemeral: true})

        const category_ = interaction.guild.channels.cache.get(CloseCategory);
        let i = 0;

        if (category_ && category_.type == 4) {
            const channelsInCategory = interaction.guild.channels.cache.filter(
                (channel) => channel.type === 0 && channel.parentId === category_.id
            );
            channelsInCategory.forEach(async (channel) => {
                i++;
                setTimeout(() => {
                    channel.delete();
                }, 5000);
            });
        } else {
            return interaction.editReply({ content: 'No ticket to close!' })
        }

        interaction.editReply({ content: `### Close all closed ticket!\n> Close total ${i} ticket` })
    },
};