const { Events, EmbedBuilder } = require("discord.js");

module.exports = {
  name: Events.GuildStickerUpdate,
  async execute(oldSticker, newSticker) {
    // console.log(`A sticker is updated in the guild: ${newSticker.guild.name}`);
    // make an embed and send it to the log channel

    const embed = new EmbedBuilder();
    embed.setTitle("Sticker Updated");
    embed.setDescription(
      `A sticker is updated in the guild: ${newSticker.guild.name}`,
    );
    embed.addFields(
      { name: "Old Sticker", value: oldSticker.name },
      { name: "New Sticker", value: newSticker.name },
    );
    embed.setTimestamp();
    // go thru all diff properties
    for (const prop in oldSticker) {
      if (oldSticker[prop] !== newSticker[prop]) {
        embed.addFields(
          { name: `Old ${prop}`, value: oldSticker[prop] },
          { name: `New ${prop}`, value: newSticker[prop] },
        );
      }
    }

    const channelId = newSticker.client.db.get(
      `logchannel_${newSticker.guild.id}_` +
        require("../src/static/logTypes.json")[13].value,
    );
    const channel = newSticker.guild.channels.cache.get(channelId);
    if (channel) {
      channel.send({ embeds: [embed] });
    }
  },
};
