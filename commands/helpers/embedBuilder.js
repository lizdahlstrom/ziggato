const Discord = require('discord.js');
const palette = require('../../config.json');

/**
 * Build Discord embed
 * @param {string} authorTitle
 * @param {string} title
 * @param {string} username
 * @param {string} [description='']
 * @param {string} [url='']
 * @param {string} [authorIconURL='']
 * @param {string} [authorURL='']
 *  @return {Discord.MessageEmbed}
 */
const buildEmbed = (authorTitle, title, username, description = '',
    url = '', authorIconURL = null, authorURL = null) => {
  return new Discord.MessageEmbed()
      .setColor(palette.dark)
      .setAuthor(
          authorTitle,
          authorIconURL,
          authorURL,
      )
      .setTitle(title)
      .setURL(url)
      .setDescription(description)
      .setFooter(
          `Requested by ${username}`,
      )
      .setTimestamp(new Date());
};

module.exports = {
  buildEmbed,
};
