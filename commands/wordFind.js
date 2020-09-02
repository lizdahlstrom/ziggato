const fetch = require('node-fetch');
const Discord = require('discord.js');
const { palette } = require('../config.json');
const api = 'https://api.datamuse.com/words';

const buildEmbed = (msg, word, result) => {
  return new Discord.MessageEmbed()
    .setColor(palette.mid1)
    .setAuthor('Word-find 🐈')
    .setTitle(result)
    .setDescription(`From *"${word}"*`)
    .setFooter(`Requested by ${msg.author.username}`, msg.author.authorURL)
    .setTimestamp(new Date());
};

const getSynonyms = async (queryType, word) => {
  const url = `${api}?rel_${queryType}=${word}`;

  let res = await fetch(url);
  res = await res.json();

  return res;
};

module.exports = {
  name: 'wordfind',
  description: 'Word-find',
  async execute(msg, args) {
    if (args.length < 1) throw new Error('Missing arguments');

    const query = args.length === 2 ? args[0] : 'syn';
    const word = args.length === 2 ? args[1] : args[0];
    let result = '';
    const maxLength = 110;

    if (query === 'syn' || query === 'rhy') {
      const res = await getSynonyms(query, word);
      result = res.map((word) => `• ${word.word}`);
      result = result.join('\n');
    } else {
      throw new Error('Invalid query, must be "syn" or "rhy"');
    }

    result =
      result.length >= maxLength
        ? result.substring(0, (result + '\n').lastIndexOf('\n', maxLength))
        : result;

    if (result) msg.channel.send(buildEmbed(msg, word, result));
  },
};
