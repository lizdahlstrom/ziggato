const Discord = require('discord.js');
const {palette} = require('../config.json');
const fetch = require('node-fetch');

const buildEmbed = (output, userName) => {
  const embed = new Discord.MessageEmbed()
      .setColor(palette.mid1)
      .setAuthor('Watch2Gether 🐈')
      .setFooter(`Requested by ${userName}`)
      .setTimestamp(new Date());

  embed.setTitle(output);

  return embed;
};

const createRoom = async (url) => {
  const KEY = process.env.WATCH2GETHER_KEY;

  const body = {
    'w2g_api_key': KEY,
    'share': url,
  };

  const res = await fetch('https://w2g.tv/rooms/create.json', {
    method: 'post',
    body: JSON.stringify(body),
    headers: {'Content-Type': 'application/json'},
  });

  const resJson = await res.json();

  return `https://w2g.tv/rooms/${resJson.streamkey}`;
};

module.exports = {
  name: 'watch',
  description: 'Watch videos together',
  async execute(msg, args) {
    const isValidURL = true;

    if (!isValidURL) throw new Error('not valid url');

    const url = args[0];
    const roomUrl = await createRoom(url);
    const embed = buildEmbed(roomUrl, msg.author.username);

    msg.channel.send(embed);
  },
};
