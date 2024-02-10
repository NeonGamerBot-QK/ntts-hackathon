module.exports = {
    name: 'messageCreate',
    execute: (message) => {
        if(!message.content.startsWith('!') || message.author.bot) return;

        const args = message.content.slice(1).split(/ +/)
        const cmd = args.shift()
        if(cmd == 'deploy' && message.guild.id === process.env.GUILD_ID) {
            require('../deploy-commands')
            message.reply(`Check Console!`)
        }
    }
}