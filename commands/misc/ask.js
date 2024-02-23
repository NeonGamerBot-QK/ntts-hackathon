const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { HarmBlockThreshold, HarmCategory } = require("@google/generative-ai");
require('dotenv').config();

const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
    },
];

// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// For text-only input, use the gemini-pro model
const model = genAI.getGenerativeModel({ model: "gemini-pro", safetySettings});

module.exports = {
    data: new SlashCommandBuilder()
    .setName('ask')
    .setDescription('Ask a question to the AI')
    .addStringOption(option => option.setName('prompt').setDescription('The prompt to generate from').setRequired(true)),
    async execute(interaction) {
        await interaction.deferReply({ fetchReply: true })
        // const prompt = interaction.options.getString('prompt');
        // const result = await model.generateContent(prompt);
        // const response = await result.response.text();
        // const responseChunks = splitResponse(response);
        // for (const chunk of responseChunks) {
        //     const embed = new EmbedBuilder().setDescription(chunk)
        //     await interaction.followUp({embeds: [embed]});
        // }
        const prompt = interaction.options.getString('prompt');
        const parts = [
            {
              text: `input: ${prompt}`,
            },
          ];
      
          const result = await model.generateContent({
            contents: [{ role: "user", parts }],
          });
      
          const reply = await result.response.text();
          // due to Discord limitations, we can only send 2000 characters at a time, so we need to split the message
          if (reply.length > 2000) {
            const replyArray = reply.match(/[\s\S]{1,2000}/g);
            replyArray.forEach(async (msg) => {
                const embed = new EmbedBuilder().setDescription(msg)
              await interaction.followUp({ embeds: [embed] });;
            });
            return;
          }
      
          interaction.followUp({embeds: [new EmbedBuilder().setDescription(reply)]});
    },
};

// function splitResponse(response){
//     const maxChunkLength = 2000;
//     let chunks = [];
  
//     for (let i = 0; i < response.length; i += maxChunkLength) {
//         chunks.push(response.substring(i, i + maxChunkLength));
//     }
//     return chunks;
// }
