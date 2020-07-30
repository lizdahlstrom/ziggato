const fetch = require('node-fetch');
const Discord = require('discord.js');
const { palette } = require('../config.json');

const buildEmbed = (output, userName, track, artist) => {
  const maxLength = 2048;
  return new Discord.MessageEmbed()
    .setColor(palette.mid1)
    .setAuthor('Lyrics 🐈')
    .setFooter(`Requested by ${userName}`)
    .setTimestamp(new Date())
    .setDescription(
      output.length < 2048
        ? output
        : output.substring(0, (output + '.').lastIndexOf('\n', maxLength)) +
            '...'
    )
    .setTitle(
      `${firstLetterUpperCase(track.join(' '))} by ${firstLetterUpperCase(
        artist.join(' ')
      )}`
    );
};

const firstLetterUpperCase = (str) => {
  return str[0].toUpperCase() + str.slice(1);
};

const fetchLyrics = async (artist, track) => {
  const url = `https://api.lyrics.ovh/v1/${artist.join('%20')}/${track.join(
    '%20'
  )}`;

  let apiRes = await fetch(url);
  apiRes = await apiRes.json();
  return apiRes;
};

module.exports = {
  name: 'lyrics',
  description: 'Lyrics',
  async execute(msg, args) {
    if (!args || !args.includes('/')) throw new Error('Missing parameters');
    const delimiterIndex = args.findIndex((e) => e === '/');

    const artist = args.slice(0, delimiterIndex);
    const track = args.slice(delimiterIndex + 1, args.length);

    let apiRes = await fetchLyrics(artist, track);

    if (!apiRes.lyrics) return;

    let lyrics = apiRes.lyrics;
    // fix excessive linebreaks
    lyrics = lyrics.split('\n\n\n\n').join('\n\n');
    lyrics = lyrics.split('\n\n\n').join('\n');
    lyrics = lyrics.split(',\n\n').join('\n');

    const embed = buildEmbed(lyrics, msg.author.username, track, artist);

    msg.channel.send(embed);
  },
};
