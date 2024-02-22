const { PermissionsBitField, ChannelType } = require('discord.js');
const readline = require('readline');
const fs = require('node:fs');
const path = require('node:path');
const { TicketChannel, TicketLogChannel, CloseCategory, TicketCategory, memberrole, TicketAdmin, TicketBlacklist, clientId, guildId } = require('../config.json');

const configpath = path.join(__dirname, '../config.json');
const configdata = fs.readFileSync(configpath);
const jsondata = JSON.parse(configdata);
function execute() {
    fs.writeFileSync(configpath, JSON.stringify(jsondata, null, 2));
};

function editdata(option, newdata) {
    if (jsondata.hasOwnProperty(option)) {
        jsondata[option] = newdata;
        execute();
        return true;
    } else {
        console.log(`Property '${option}' does not exist in jsondata.`);
        return false;
    }
}

function editcategorydata(newdata, index) {
    const category = jsondata.TicketCategory[index];
    if (category) {
        jsondata.TicketCategory[index].categoryId = newdata;
        execute();
        return true;
    } else {
        console.log(`Property 'TicketCategory' does not exist in jsondata.`);
        return false;
    }
}


function readlineSync(question) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    return new Promise((resolve, reject) => {
        rl.question(question, (answer) => {
            rl.close();
            resolve(answer);
        });
    });
}

async function creatchannel(guild, name) {
    const channel = await guild.channels.create({
        name: name,
        type: ChannelType.GuildText,
        permissionOverwrites: [
            {
                id: guild.roles.everyone,
                deny: [PermissionsBitField.Flags.ViewChannel],
            },
            {
                id: memberrole,
                deny: [PermissionsBitField.Flags.ViewChannel],
            },
            {
                id: TicketAdmin,
                allow: [PermissionsBitField.Flags.ManageChannels],
            },
        ],
    });

    return channel;
}

async function creatcategory(guild, name) {
    const channel = await guild.channels.create({
        name: name,
        type: ChannelType.GuildCategory,
        permissionOverwrites: [
            {
                id: guild.roles.everyone,
                deny: [PermissionsBitField.Flags.ViewChannel],
            },
            {
                id: memberrole,
                deny: [PermissionsBitField.Flags.ViewChannel],
            },
            {
                id: TicketAdmin,
                allow: [PermissionsBitField.Flags.ManageChannels],
            },
        ],
    });

    return channel;
}

async function rolecheck(client) {
    const guild = await client.guilds.fetch(guildId);
    let sucess = true;

    if (!memberrole || guild.roles.cache.get(memberrole) == undefined) {
        console.log('Member Role not found');
        sucess = false;
    }
    if (!TicketAdmin || guild.roles.cache.get(TicketAdmin) == undefined) {
        console.log('Ticket Admin Role not found');
        sucess = false;
    }
    if (!TicketBlacklist || guild.roles.cache.get(TicketBlacklist) == undefined) {
        console.log('Ticket Blacklist Role not found');
        sucess = false;
    }

    return sucess;
}

async function channelcheck(client) {
    const guild = await client.guilds.fetch(guildId);
    let sucess = true;

    if (guild.channels.cache.get(TicketChannel) == undefined) {
        console.log('Ticket Channel not found');
        if (!TicketChannel) {
            if (await readlineSync('Create one for you? (y/n): ') == 'y') {
                const name = await readlineSync('Enter the name of the channel: ');
                const newchannel = await creatchannel(guild, name);
                editdata('TicketChannel', newchannel.id)
                console.log("successfully create channel " + newchannel.name, "\n-----------------------------");
            } else {
                sucess = false;
            }
        }
    }
    if (guild.channels.cache.get(TicketLogChannel) == undefined) {
        console.log('Ticket Log Channel not found');
        if (!TicketLogChannel) {
            if (await readlineSync('Create one for you? (y/n): ') == 'y') {
                const name = await readlineSync('Enter the name of the channel: ');
                const newchannel = await creatchannel(guild, name);
                editdata('TicketLogChannel', newchannel.id)
                console.log("successfully create channel " + newchannel.name, "\n-----------------------------");
            } else {
                sucess = false;
            }
        }
    }
    for (let i = 0; i < TicketCategory.length; i++) {
        if (guild.channels.cache.get(TicketCategory[i].categoryId) == undefined) {
            console.log('Ticket Category not found');
            if (!TicketCategory[i].categoryId) {
                if (await readlineSync('Create one for you? (y/n): ') == 'y') {
                    const name = await readlineSync('Enter the name of the category: ');
                    const newcategory = await creatcategory(guild, name);
                    editcategorydata(newcategory.id, i);
                    console.log("successfully create category " + newcategory.name, "\n-----------------------------");
                } else {
                    sucess = false;
                }
            }
        }
    }
    if (guild.channels.cache.get(CloseCategory) == undefined) {
        console.log('Close Category not found, you might fill a channel id instead of category id in config.json');
        if (!CloseCategory) {
            if (await readlineSync('Create one for you? (y/n): ') == 'y') {
                const name = await readlineSync('Enter the name of the category: ');
                const newcategory = await creatcategory(guild, name);
                editdata('CloseCategory', newcategory.id)
                console.log("successfully create category " + newcategory.name, "\n-----------------------------");
            } else {
                sucess = false;
            }
        }
        sucess = false;
    }
    return sucess;
}

async function check(client) {

    await rolecheck(client).then((res) => {
        if (!res) {
            console.log('! Please check your role in config.json !')
            return process.exit(1);
        }
    });

    await channelcheck(client).then((res) => {
        if (!res) {
            console.log('! Please check your channel in config.json !')
            return process.exit(1);
        }
    });

}

function PermCheck(interaction) {
    if (!interaction.member.roles.cache.has(TicketAdmin) ) {
        interaction.reply({ content: `## You do not have the permission to use this command`, ephemeral: true });
        return true;
    }
}

function ChannelCheck(interaction) {
    for(const category of TicketCategory){
        if (interaction.channel.parentId == category.categoryId) {
            return false;
        }
    }

    return interaction.reply({ content: `## You can only use this command in ticket channel`, ephemeral: true });
}

module.exports = {
    check,
    editdata,
    PermCheck,
    ChannelCheck
}