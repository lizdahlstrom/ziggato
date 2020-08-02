const fetch = require('node-fetch');
const Discord = require('discord.js');
const { palette } = require('../config.json');
const api = 'https://api.datamuse.com/words';

const getSynonyms = async (word) => {
  const url = `${api}?rel_syn=${word}`;

  let res = await fetch(url);
  res = await res.json();

  return res;
};

module.exports = {
  name: 'wordfind',
  description: 'Word-find',
  async execute(msg, args) {
    if (args.length < 2) throw new Error('Missing arguments');

    let result = '';
    const maxLength = 110;

    if (args[0] === 'syn') {
      const res = await getSynonyms(args[1]);
      result = res.map((word) => `• ${word.word}`);
      result = result.join('\n');
    }

    result =
      result.length >= maxLength
        ? result.substring(0, (result + '\n').lastIndexOf('\n', maxLength))
        : result;

    const embed = new Discord.MessageEmbed()
      .setColor(palette.mid1)
      .setAuthor('Word-find 🐈')
      .setTitle(result)
      .setDescription(`From *"${args[1]}"*`)
      .setFooter(`Requested by ${msg.author.username}`, msg.author.authorURL)
      .setTimestamp(new Date());

    if (result) msg.channel.send(embed);
  },
};
