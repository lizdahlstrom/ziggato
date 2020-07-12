const fetch = require('node-fetch')

module.exports = {
  name: '!gif',
  description: 'Giphy',
  async execute(msg, args) {
    const KEY = process.env.GIPHY_KEY

    let gif

    switch(args[0]) {
      case 'random':
        gif = await fetch(`https://api.giphy.com/v1/gifs/random?api_key=${KEY}`)
        break;
      default:
        const argStr = args.join('+')
        gif = await fetch(`https://api.giphy.com/v1/gifs/translate?s=${argStr}&api_key=${KEY}`)
        break;
    }

    gif = await gif.json()
    msg.channel.send(gif.data.url);
  },
};
