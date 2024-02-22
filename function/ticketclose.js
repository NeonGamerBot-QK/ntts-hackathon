const { EmbedBuilder } = require('@discordjs/builders')
const dt = require('discord-html-transcripts');
const fs = require('fs');
const request = require('request');


const { TicketCreate } = require('../lang.json');

function time() {
    const currentDate = new Date();

    const month = currentDate.getMonth() + 1;
    const day = currentDate.getDate();
    const hours = currentDate.getHours();
    const minutes = currentDate.getMinutes();
    const seconds = currentDate.getSeconds();

    return `${month}-${day}_${hours}-${minutes}-${seconds}`;
}

async function transcript(interaction) {
    return new Promise(async (resolve, reject) => {
        const msg = await interaction.channel.send("Creating transcript...")

        const tsfile = await dt.createTranscript(interaction.channel, {
            returnType: 'string',
            poweredBy: false,
            footerText: 'There are total {number} of message{s} sent'
        });

        const localFilePath = `./function/tmp/${interaction.user.tag}_${time()}.html`;
        fs.writeFileSync(localFilePath, tsfile);

        const options = {
            url: 'http://ticket.dragoncode.dev/api/upload',
            method: 'POST',
            formData: {
                file: fs.createReadStream(localFilePath)
            }
        };

        request(options, (error, response, body) => {
            if (error) {
                console.log('Error:', error);
                console.log('Response:', response);
                fs.unlinkSync(localFilePath);
                reject(error); // Reject Promise with error
                return;
            }
            const responseBody = JSON.parse(body);
            fs.unlinkSync(localFilePath);

            const embed = new EmbedBuilder()
                .setColor(0x6eaadc)
                .setTitle('Transcript Created!')
                .addFields(
                    { name: 'Transcript Link', value: `[View Online!](<${responseBody.link.normallink}>)`, inline: true },
                    { name: 'Transcript Download', value: `[Download here](<${responseBody.link.downloadlink}>)`, inline: true }
                )
                .setTimestamp();

            msg.edit({ content: "", embeds: [embed] });
            resolve(responseBody); // Resolve Promise with responseBody
        });
    });
}


module.exports = {
    transcript,
}