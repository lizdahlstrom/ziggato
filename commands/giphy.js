const fetch = require('node-fetch');

module.exports = {
  name: 'gif',
  description: 'Giphy',
  async execute(msg, args) {
    const KEY = process.env.GIPHY_KEY;

    let gif;
    const command = args[0];
    const argStr = args.slice(1).join('+');

    switch (args[0]) {
      case 'random': {
        console.log(argStr);
        gif = await fetch(
          `https://api.giphy.com/v1/gifs/random?api_key=${KEY}&tag=${argStr}`
        );
        gif = await gif.json();
        gif = gif.data.url;
        break;
      }
      case 'search': {
        console.log(argStr);
        gif = await fetch(
          `https://api.giphy.com/v1/gifs/search?api_key=${KEY}&q=${argStr}&limit=1`
        );
        gif = await gif.json();
        gif = gif.data[0].url;
        break;
      }
      default: {
        gif = await fetch(
          `https://api.giphy.com/v1/gifs/translate?s=${
            command + '+' + argStr
          }&api_key=${KEY}`
        );
        gif = await gif.json();
        git = gif.data.url;
        break;
      }
    }

    msg.channel.send(gif);
  },
};
