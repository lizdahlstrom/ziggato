const fetch = require('node-fetch');
const embedBuilder = require('./helpers/embedBuilder.js');
const api = 'https://api.datamuse.com/words';
const EMBED_MAX_LENGTH = 110;

const _fetchRes = async (queryType, word) => {
  const url = `${api}?rel_${queryType}=${word}`;
  let res = await fetch(url);
  res = await res.json();

  return res;
};

const _limitStrLength = (text, max) => {
  return text.substring(0, (text + '\n').lastIndexOf('\n', max));
};

const _formatWordArr =(arr) => {
  arr = arr.map((word) => `• ${word.word}`).join('\n');

  if (arr.length >= EMBED_MAX_LENGTH) {
    arr = _limitStrLength(arr, EMBED_MAX_LENGTH);
  }

  return arr;
};

const _buildMessage = (result, author, word) => {
  return embedBuilder.buildEmbed('Word-find 🐈', _formatWordArr(result),
      author, `From *"${word}"*`);
};

module.exports = {
  name: 'wordfind',
  description: 'Word-find',
  async execute(msg, args) {
    if (args.length < 1) return;

    const query = args.length === 2 ? args[0] : 'syn';
    if (query !== 'syn' && query !== 'rhy') return;

    const word = args.length === 2 ? args[1] : args[0];

    const res = await _fetchRes(query, word);

    msg.channel.send(
        _buildMessage(res, msg.author.username, word),
    );
  },
};
