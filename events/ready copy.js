const { Events } = require('discord.js');
const { clientId, guildId } = require('../config.json');
const { QuickDB } = require('quick.db');
const db = new QuickDB({ filePath: 'database.sqlite' });


module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client) {        
        client.user.setActivity({ name: 'dragoncode.dev', type: 3 });

        console.log(`\x1B[32mLogin : Bot \x1B[33m${client.user.tag}\n\x1B[32mBotID : \x1B[33m${clientId}\x1B[0m`);
        console.log(`\x1B[32mServerID : \x1B[33m${guildId}`);
        console.log('\x1B[0m-----------------------------')
        const guild = client.guilds.cache.get(guildId);
        const memberCount = guild.memberCount;
        console.log(`\x1B[32mServer have \x1B[33m${memberCount} \x1B[32mmembers\x1B[34m`);

        await db.init();

    },
};