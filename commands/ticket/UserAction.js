const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('@discordjs/builders');
const { PermissionsBitField } = require('discord.js');
const { CloseCategory } = require('../../config.json')
const { PermCheck, ChannelCheck } = require('../../function/check.js')
const { QuickDB } = require('quick.db')
const db = new QuickDB({ filePath: 'database.sqlite' });

module.exports = {
    data: new SlashCommandBuilder()
        .setName('user')
        .setDescription('do a user action!')
        .addSubcommand(subcommand =>
            subcommand
                .setName('list')
                .setDescription('see all user in the ticket!')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('add')
                .setDescription('add a user to the ticket!')
                .addUserOption(option => option.setName('user').setDescription('The user to be add of the ticket').setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('remove')
                .setDescription('remove a user from the ticket!')
        ),

    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();
        const user = interaction.options.getUser('user');

        const topic = await interaction.channel.topic;
        const ticketowner = await interaction.guild.members.fetch(topic)
        const userticket = await db.get(`ticket.${topic}.ticket`)
        const index = userticket.findIndex(user => user.channel === interaction.channel.id);

        switch (subcommand) {
            case 'list':
                return await list(interaction);
            case 'add':
                return await add(interaction);
            case 'remove':
                return await remove(interaction);
        }

        async function list(interaction) {
            await interaction.deferReply()

            const userarray = await db.get(`ticket.${topic}.ticket[${index}].user`).then(async ar => {
                return ar;
            })

            const embed = new EmbedBuilder()
                .setTitle('User List')
                .setDescription(`List of user in this ticket`)

            for (const user of userarray) {
                const member = await interaction.guild.members.fetch(user)
                embed.addFields(
                    { name: member.user.tag, value: `> <@${member.user.id}>`, inline: true }
                )
            }

            interaction.editReply({ embeds: [embed] })
        }

        async function add(interaction) {

            if (PermCheck(interaction) || ChannelCheck(interaction)) return;
            if (user.bot) return interaction.reply({ content: `## You can't add a bot to the ticket!`, ephemeral: true });

            const include = await db.get(`ticket.${ticketowner.id}.ticket[${index}].user`).then(ar => {
                if (ar.includes(user.id)) {
                    return true;
                }
            })

            if (include) return interaction.reply({ content: `## ${user} is already in the ticket!`, ephemeral: true });

            await interaction.channel.permissionOverwrites.set([
                { id: user.id, allow: PermissionsBitField.Flags.SendMessages },
                { id: user.id, allow: PermissionsBitField.Flags.ViewChannel },
            ])

            const userembed = new EmbedBuilder()
                .setColor(0x6eaadc)
                .setTitle(`You have been added to the ticket`)
                .setDescription(`Hey ${user} You have been added to the ticket \n${interaction.channel}!`)
                .setTimestamp();

            try {
                await user.send({ embeds: [userembed] })
            } catch (error) {
                interaction.channel.send({ content: `## Hey ${user}, Admin add you to this ticket!` })
            }

            const embed = new EmbedBuilder()
                .setColor(0x6eaadc)
                .setTitle('Ticket Add User')
                .setDescription(`Admin add ${user} to the ticket!`)
                .setTimestamp();

            interaction.reply({ embeds: [embed] });

            db.push(`ticket.${ticketowner.id}.ticket[${index}].user`, user.id);
        }

        async function remove(interaction) {
            if (PermCheck(interaction) || ChannelCheck(interaction)) return;

            const row = new ActionRowBuilder()
            const select = new StringSelectMenuBuilder()
                .setCustomId(`@ticket-remove_${ticketowner.id}`)
                .setPlaceholder('Select a user to remove')
                .setMinValues(1)

            const addcomponents = await db.get(`ticket.${ticketowner.id}.ticket[${index}].user`).then(async ar => {
                if (!ar.length) return true;

                for (const user of ar) {
                    await interaction.guild.members.fetch(user).then(member => {
                        select.addOptions(new StringSelectMenuOptionBuilder()
                            .setLabel(member.user.username)
                            .setValue(member.user.id)
                        )
                    })
                }
            })

            const nouserembed = new EmbedBuilder()
                .setTitle('No User Found')
                .setDescription(`There are ticketowner and admin in this ticket!`)
                .setColor(0xff0000);

            if (addcomponents) return await interaction.reply({ embeds: [nouserembed], ephemeral: true });
            row.addComponents(select)

            const embed = new EmbedBuilder()
                .setTitle('Remove User')
                .setDescription(`Chose the user you want to remove from the ticket!`)
                .setColor(0x6eaadc);

            await interaction.reply({ embeds: [embed], components: [row], ephemeral: true });
        }

    },
};