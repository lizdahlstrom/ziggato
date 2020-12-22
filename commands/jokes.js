const fetch = require('node-fetch');
const embedBuilder = require('./helpers/embedBuilder.js');

module.exports = {
  name: 'jokes',
  description: 'Commands',
  async execute(msg, args) {
    let url = `https://sv443.net/jokeapi/v2/joke`;
    let init = '';

    if (args && args.length > 0) {
      const category = args[0].toLowerCase();
      if (category === 'dark') {
        url += '/Dark';
      } else if (category === 'misc') {
        url += '/Miscellaneous';
      } else if (category === 'prog') {
        url += '/Programming';
      } else if (category === 'dad') {
        url = `https://icanhazdadjoke.com/`;
        init = {headers: {Accept: 'application/json'}};
      } else {
        url += `/Any?contains=${category}`;
      }
    } else {
      url += '/Any';
    }

    let apiRes = init === '' ? await fetch(url) : await fetch(url, init);
    apiRes = await apiRes.json();

    if (apiRes.error || apiRes.status > 200) {
      throw new Error('Error getting joke');
    }

    let embed;
    if (apiRes.setup) {
      embed = embedBuilder.buildEmbed('Jokez 🐈', apiRes.setup,
          msg.author.username, apiRes.delivery);
    } else if (apiRes.joke) {
      embed = embedBuilder.buildEmbed('Jokez 🐈', apiRes.joke,
          msg.author.username);
    } else {
      throw new Error('error fetching joke from API');
    }

    msg.channel.send(embed);
  },
};
