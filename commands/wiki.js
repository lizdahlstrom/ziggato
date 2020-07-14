const fetch = require('node-fetch');
const Discord = require('discord.js');
const { palette } = require('../config.json');

const callWiki = async (msg, args) => {
  const searchStr = args.join('%20');
  const url = `https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro&explaintext&redirects=1&titles=${searchStr}`;

  let resultStr = null;
  const maxLength = 880;
  const embed = new Discord.MessageEmbed();

  let result = await fetch(url);
  result = await result.json();

  result = Object.values(result.query.pages)[0];
  const pageID = result.pageid;

  if (!pageID) throw new Error(`Nopes! Couldn't find that in da wiki 😿`);

  let title = result.title;
  let extract = result.extract;

  resultStr =
    extract.substring(0, (extract + '.').lastIndexOf('.', maxLength)) + '.';

  embed.setColor(palette.dark);
  embed.setAuthor(
    'Wikipedia',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Wikipedia-logo-v2-en.svg/135px-Wikipedia-logo-v2-en.svg.png',
    'https://en.wikipedia.org'
  );
  embed.setTitle(title);
  embed.setURL(`https://en.wikipedia.org/?curid=${pageID}`);
  embed.setDescription(resultStr);
  embed.setFooter(
    `Requested by ${msg.author.username}`,
    msg.author.displayAvatarURL
  );
  embed.setTimestamp(new Date());

  return embed;
};

module.exports = {
  name: 'wiki',
  description: 'Wiki',
  async execute(msg, args) {
    let output = '';

    try {
      output = await callWiki(msg, args);
    } catch (err) {
      output = err.message;
    }

    msg.channel.send(output);
  },
};
