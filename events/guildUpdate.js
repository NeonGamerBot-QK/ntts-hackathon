const { Events, EmbedBuilder } = require("discord.js");

module.exports = {
  name: Events.GuildUpdate,
  execute: async (guild, newGuild) => {
    // console.log(`A guild was updated`);
    const embed = new EmbedBuilder();
    embed.setTitle("Guild Updated");
    // check for changes
    const fields = [];
    if (guild.name !== newGuild.name) {
      fields.push({ name: "Old Name", value: guild.name });
      fields.push({ name: "New Name", value: newGuild.name });
    }
    if (guild.icon !== newGuild.icon) {
      fields.push({ name: "Old Icon", value: guild.icon });
      fields.push({ name: "New Icon", value: newGuild.icon });
    }
    if (guild.banner !== newGuild.banner) {
      fields.push({ name: "Old Banner", value: guild.banner });
      fields.push({ name: "New Banner", value: newGuild.banner });
    }
    if (guild.description !== newGuild.description) {
      fields.push({ name: "Old Description", value: guild.description });
      fields.push({ name: "New Description", value: newGuild.description });
    }
    if (guild.discoverySplash !== newGuild.discoverySplash) {
      fields.push({
        name: "Old Discovery Splash",
        value: guild.discoverySplash,
      });
      fields.push({
        name: "New Discovery Splash",
        value: newGuild.discoverySplash,
      });
    }
    if (guild.features !== newGuild.features) {
      fields.push({ name: "Old Features", value: guild.features });
      fields.push({ name: "New Features", value: newGuild.features });
    }

    if (fields.length > 0) {
      embed.addFields(fields);
    }
    embed.setTimestamp();
    const channelId = guild.client.db.get(
      `logchannel_${guild.id}_` +
        require("../src/static/logTypes.json")[7].value,
    );
    const channel = guild.channels.cache.get(channelId);
    if (channel) {
      channel.send({ embeds: [embed] });
    }
  },
};
