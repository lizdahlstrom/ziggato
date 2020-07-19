const fetch = require('node-fetch');
const Discord = require('discord.js');
const { palette } = require('../config.json');

const buildEmbed = (output, userName) => {
  const maxLength = 2048;
  const embed = new Discord.MessageEmbed()
    .setColor(palette.mid1)
    .setAuthor('Lyrics 🐈')
    .setFooter(`Requested by ${userName}`)
    .setTimestamp(new Date())
    .setDescription(
      output.length < 2048
        ? output
        : output.substring(0, (output + '.').lastIndexOf('\n', maxLength)) +
            '...'
    );
  return embed;
};

const firstLetterUpperCase = (str) => {
  return str[0].toUpperCase() + str.slice(1);
};

module.exports = {
  name: 'lyrics',
  description: 'Lyrics',
  async execute(msg, args) {
    if (!args || !args.includes('/')) throw new Error('Missing parameters');
    const delimiterIndex = args.findIndex((e) => e === '/');

    const artist = args.slice(0, delimiterIndex);
    const track = args.slice(delimiterIndex + 1, args.length);
    const url = `https://api.lyrics.ovh/v1/${artist.join('%20')}/${track.join(
      '%20'
    )}`;

    let apiRes = await fetch(url);
    apiRes = await apiRes.json();

    if (!apiRes.lyrics) return;

    let lyrics = apiRes.lyrics;
    lyrics = lyrics.split('\n\n\n\n').join('\n\n');
    lyrics = lyrics.split('\n\n\n').join('\n');

    const embed = buildEmbed(lyrics, msg.author.username);
    embed.setTitle(
      `${firstLetterUpperCase(track.join(' '))} by ${firstLetterUpperCase(
        artist.join(' ')
      )}`
    );

    msg.channel.send(embed);
  },
};
