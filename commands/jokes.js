const Discord = require('discord.js');
const { palette } = require('../config.json');
const fetch = require('node-fetch');

const buildEmbed = (output, userName, delivery = '') => {
  const embed = new Discord.MessageEmbed()
    .setColor(palette.mid1)
    .setAuthor('Jokez 🐈')
    .setFooter(`Requested by ${userName}`)
    .setTimestamp(new Date());

  if (delivery === '') {
    embed.setTitle(output);
  } else {
    embed.setTitle(output);
    embed.setDescription(delivery);
  }

  return embed;
};

module.exports = {
  name: 'jokes',
  description: 'Commands',
  async execute(msg, args) {
    let url = `https://sv443.net/jokeapi/v2/joke`;

    if (args && args.length > 0) {
      const category = args[0].toLowerCase();
      if (category === 'dark') {
        url += '/Dark';
      } else if (category === 'misc') {
        url += '/Miscellaneous';
      } else if (category === 'prog') {
        url += '/Programming';
      } else {
        url += '/Any';
      }
    } else {
      url += '/Any';
    }

    let apiRes = await fetch(url);
    apiRes = await apiRes.json();

    if (apiRes.error) throw new Error('Error getting joke');

    let embed;
    if (apiRes.setup) {
      embed = buildEmbed(apiRes.setup, msg.author.username, apiRes.delivery);
    } else {
      embed = buildEmbed(apiRes.joke);
    }

    msg.channel.send(embed);
  },
};
