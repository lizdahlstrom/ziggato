const fetch = require('node-fetch');
const embedBuilder = require('./helpers/embedBuilder.js');
const api = 'https://api.datamuse.com/words';

const getSynonyms = async (queryType, word) => {
  const url = `${api}?rel_${queryType}=${word}`;

  let res = await fetch(url);
  res = await res.json();

  return res;
};

module.exports = {
  name: 'wordfind',
  description: 'Word-find',
  async execute(msg, args) {
    if (args.length < 1) throw new Error('Missing arguments');

    const query = args.length === 2 ? args[0] : 'syn';
    const word = args.length === 2 ? args[1] : args[0];
    let result = '';
    const maxLength = 110;

    if (query === 'syn' || query === 'rhy') {
      const res = await getSynonyms(query, word);
      result = res.map((word) => `• ${word.word}`);
      result = result.join('\n');
    } else {
      throw new Error('Invalid query, must be "syn" or "rhy"');
    }

    result =
      result.length >= maxLength ?
        result.substring(0, (result + '\n').lastIndexOf('\n', maxLength)) :
        result;

    if (result) {
      msg.channel.send(
          embedBuilder.buildEmbed('Word-find 🐈', result,
              msg.author.username, `From *"${word}"*`),
      );
    }
  },
};
