const { Events, EmbedBuilder } = require("discord.js");

module.exports = {
  name: Events.MessageReactionAdd,
  async execute(reaction) {
    // Your code here
    // get channel id
    // const
    const channelId = reaction.client.db.get(
      `starboard_${reaction.message.guild.id}`,
    );
    const channel = reaction.message.guild.channels.cache.get(channelId);
    if (!channel) return;

    const messageId = reaction.client.db.get(
      `starboard_${reaction.message.guild.id}_${reaction.message.id}`,
    );
    const message = await channel.messages.fetch(messageId).catch(() => null);
    if (message) {
      const starboardMessage = await message.embeds[0];
      if (starboardMessage) {
        const starboardMessageId = starboardMessage.footer.text.split(" ")[2];
        const starboardMessageFetch = await channel.messages
          .fetch(starboardMessageId)
          .catch(() => null);
        if (starboardMessageFetch) {
          starboardMessageFetch.edit({
            embeds: [starboardMessage.setFooter(`⭐ ${reaction.count}`)],
          });
        }
      }
    }
 else {
      // make an embed
      const embed = EmbedBuilder();
      embed.setAuthor(
        reaction.message.author.tag,
        reaction.message.author.displayAvatarURL(),
      );
      embed.setDescription(reaction.message.content);
      embed.setFooter(`⭐ ${reaction.count}`);
      embed.setTimestamp();
      embed.setColor("YELLOW");
      if (reaction.message.attachments.size > 0) {
        embed.setImage(reaction.message.attachments.first().url);
      }

      const starboardMessage = await channel.send({ embeds: [embed] });
      reaction.client.db.set(
        `starboard_${reaction.message.guild.id}_${reaction.message.id}`,
        starboardMessage.id,
      );
    }
  },
};
