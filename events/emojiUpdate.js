const { Events, EmbedBuilder } = require("discord.js");

module.exports = {
  name: Events.GuildEmojiUpdate,
  async execute(oldEmoji, newEmoji) {
    const embed = new EmbedBuilder();
    embed.setTitle("Emoji Updated");
    // put emoji in description
    embed.setDescription(
      `An emoji was updated in ${oldEmoji.guild.name} <a:${oldEmoji.name}:${oldEmoji.id}> to <a:${newEmoji.name}:${newEmoji.id}>`,
    );
    // embed.addFields(
    //     { name: "Old Emoji", value: oldEmoji.name },
    //     { name: "New Emoji", value: newEmoji.name },
    // );
    // run diff in fields
    if (oldEmoji.name !== newEmoji.name) {
      embed.addFields(
        { name: "Old Name", value: oldEmoji.name },
        { name: "New Name", value: newEmoji.name },
      );
    }
    if (oldEmoji.animated !== newEmoji.animated) {
      embed.addFields(
        { name: "Old Animated", value: oldEmoji.animated },
        { name: "New Animated", value: newEmoji.animated },
      );
    }
    if (oldEmoji.id !== newEmoji.id) {
      embed.addFields(
        { name: "Old ID", value: oldEmoji.id },
        { name: "New ID", value: newEmoji.id },
      );
    }
    if (oldEmoji.url !== newEmoji.url) {
      embed.addFields(
        { name: "Old URL", value: oldEmoji.url },
        { name: "New URL", value: newEmoji.url },
      );
    }

    embed.setTimestamp();
    const channelId = oldEmoji.client.db.get(
      `logchannel_${oldEmoji.guild.id}_` +
        require("../src/static/logTypes.json")[10].value,
    );
    const channel = oldEmoji.guild.channels.cache.get(channelId);
    if (channel) {
      channel.send({ embeds: [embed] });
    }
  },
};
