const fetch = require('node-fetch');
const embedBuilder = require('./helpers/embedBuilder.js');

const createRoom = async (url) => {
  const res = await fetch('https://w2g.tv/rooms/create.json', {
    method: 'post',
    body: JSON.stringify({
      'w2g_api_key': process.env.WATCH2GETHER_KEY,
      'share': url,
    }),
    headers: {'Content-Type': 'application/json'},
  });

  const resJson = await res.json();

  return `https://w2g.tv/rooms/${resJson.streamkey}`;
};

module.exports = {
  name: 'watch',
  description: 'Watch videos together',
  async execute(msg, args) {
    const [url] = args;
    const roomUrl = await createRoom(url);
    const embed = embedBuilder.buildEmbed('Watch2Gether 🐈', roomUrl,
        msg.author.username);

    msg.channel.send(embed);
  },
};
