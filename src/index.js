require('dotenv').config()
const discord = require('discord.js')
const client = new discord.Client({
    intents: Object.values(discord.GatewayIntentBits),
})
client.on('ready', () => {
    console.log(`Ready on ${client.user.tag}`)
    setInterval(() => {
        const cap = function (str, length) {
          if(str == null || str?.length <= length) return str;
      
          return str.substr(0, length) + "**\u2026**";
      }
      const bcommitMessage = require('child_process').execSync('git log -1 --pretty=%B').toString()
      const bhash = fs.readFileSync('.git/refs/heads/master').toString()
        require('child_process').exec(`git pull -v`, (error, stdout) => {
            let response = (error ? error.message : error)|| stdout;
            if (!error) {
                if (!response.includes("Already up to date.")) {
                  console.log(`New Files!!`)
                  console.log(response)
                  const commitMessage = require('child_process').execSync('git log -1 --pretty=%B').toString()
                  const hash = fs.readFileSync('.git/refs/heads/master').toString()
                  const compareStr = response.split("Updating ")[1].split('\n')[0].trim() || `${bhash}...${hash}`
                  const content = `<t:${Date.now().toString().slice(0, -3)}:f> Automatic update from GitHub, pulling files. [\`${compareStr}\`](https://github.com/NeonGamerBot-QK/ntts-hackathon/compare/${compareStr})\n\`\`\`${cap(response, 1700)}\`\`\`\n## Current Branch \n[\`View Changes\`](https://github.com/NeonGamerBot-QK/ntts-hackathon/commit/${bhash})     [\`Branch\`](https://github.com/NeonGamerBot-QK/ntts-hackathon/tree/${bhash})       **Commit Message**: \`${bcommitMessage.replace('\n', '')}\`\n## Latest Branch\n[\`View Changes\`](https://github.com/NeonGamerBot-QK/ntts-hackathon/commit/${hash})     [\`Branch\`](https://github.com/NeonGamerBot-QK/ntts-hackathon/tree/${hash})       **Commit Message**: \`${commitMessage}\``
                  client.users.cache.get("566766267046821888").send(content)
                  client.channels.cache
                        .get("1205883972807172186")
                        .send(content).then(() => {
                      console.log('ALL MESSAGES SENT!!')
                      exiting = true;
                          setTimeout(() => {
                            console.log('Bye Bye!')
                            process.exit()
                        }, 3_000);
                        });
                       
                    
                }
                // if its already exiting then it is really this error
            } else if (error.message.includes('error: Your local changes to the following files would be overwritten by merge:') && !exiting) {
              const files = error.message.split('error: Your local changes to the following files would be overwritten by merge:')[1].split('Please commit your changes or stash them before you merge.')[0].split('\n').map(e=>e.trim()).filter(Boolean)
              console.log('removing files', files)
              const stashPath = `.merge-conflict/${new Date().toISOString()}/`
              fs.mkdirSync(stashPath)
              files.forEach((f) => {
               if(fs.existsSync(f)) {
                fs.copyFileSync(f, `${stashPath}${f}`)
                fs.rmSync(f)
               }
              })
              console.log('stashed && removed files')
              client.users.cache.get("566766267046821888").send(`<t:${Date.now().toString().slice(0, -3)}:f> Merge Conflict!! \n\`\`\`${cap(response, 1900)}\`\`\``)
                  client.channels.cache
                        .get("1205883972807172186")
                        .send(`<t:${Date.now().toString().slice(0, -3)}:f> Merge Conflict!!!\n\`\`\`${cap(response, 1900)}\`\`\``)
            }
        });
    }, 15_000);
})

client.login(process.env.DISCORD_TOKEN)