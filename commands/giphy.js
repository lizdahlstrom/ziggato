const fetch = require('node-fetch');
const Discord = require('discord.js');

const buildEmbed = (imgUrl) => {
  return new Discord.MessageEmbed()
      .setImage(imgUrl)
      .attachFiles(['./assets/img/giphy_attribution_logo.png'])
      .setThumbnail('attachment://giphy_attribution_logo.png');
};

const fetchGifUrl = async (url) => {
  let gif = await fetch(url);
  gif = await gif.json();
  return gif.data.url ? gif.data.url : gif.data[0].url;
};

module.exports = {
  name: 'gif',
  description: 'Giphy',
  async execute(msg, args) {
    if (!args || args.length === 0) return;
    const KEY = process.env.GIPHY_KEY;

    let gif;
    const command = args[0];
    const argStr = args.slice(1).join('+');

    if (args[0] === 'random') {
      gif = await fetchGifUrl(
          `https://api.giphy.com/v1/gifs/random?api_key=${KEY}&tag=${argStr}`,
      );
    } else if (args[0] === 'search') {
      gif = await fetchGifUrl(
          `https://api.giphy.com/v1/gifs/search?api_key=${KEY}&q=${argStr}&limit=1`,
      );
    } else {
      gif = await fetchGifUrl(
          `https://api.giphy.com/v1/gifs/translate?s=${
            command + '+' + argStr
          }&api_key=${KEY}`,
      );
    }

    const id = gif.split('-').pop();
    const imgUrl = `https://media.giphy.com/media/${id}/giphy.gif`;

    msg.channel.send(buildEmbed(imgUrl));
  },
};
