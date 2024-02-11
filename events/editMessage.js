const { EmbedBuilder, Events } = require("discord.js");

module.exports = {
  name: Events.MessageUpdate,
  async execute(oldMessage, newMessage) {
    console.log("event");
    // console.log(`A message by ${oldMessage.author.tag} was edited in ${oldMessage.channel}`);
    const embed = new EmbedBuilder();
    embed.setTitle("Message Edited");
    embed.setDescription(
      `A message by ${oldMessage.author.tag} was edited in ${oldMessage.channel}`,
    );
    embed.addField("Old Message", oldMessage.content);
    embed.addField("New Message", newMessage.content);
    embed.setTimestamp();
    embed.setColor("RANDOM");
    // oldMessage.channel.send({ embeds: [embed] });
    const channelId = oldMessage.client.db.get(
      `logchannel_${oldMessage.guild.id}_` +
        require("../../src/static/logTypes.json")[31].value,
    );
    const channel = oldMessage.guild.channels.cache.get(channelId);
    if (channel) {
      channel.send({ embeds: [embed] });
    }
 else {
      console.debug("no channel");
    }
  },
};
