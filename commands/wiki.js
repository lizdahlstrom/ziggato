const fetch = require('node-fetch');
const api = 'https://en.wikipedia.org/w/api.php';
const embedBuilder = require('./helpers/embedBuilder.js');
const NOT_FOUND_MSG = `Couldn't find that in the wiki 😿`;

const _fetchSearchString = async (searchStr) => {
  let search = await fetch(`${api}?${new URLSearchParams({
    action: 'opensearch',
    limit: '1',
    namespace: '0',
    format: 'json',
  })}&search=${searchStr}`);

  search = await search.json();

  return search[1][0] || '';
};

const _fetchPage = async (searchStr) => {
  let result = await fetch(`${api}?${new URLSearchParams({
    format: 'json',
    action: 'query',
    titles: searchStr,
    prop: 'extracts',
    redirects: 1,
    exintro: true,
    explaintext: true,
  })}`);

  result = await result.json();
  if (!result.query) throw new Error(NOT_FOUND_MSG);

  result = Object.values(result.query.pages)[0];

  if (!result.pageid) throw new Error(NOT_FOUND_MSG);

  return result;
};

const _fetchImg = async (searchStr, pageID) => {
  let img = await fetch(`${api}?${new URLSearchParams({
    format: 'json',
    action: 'query',
    titles: searchStr,
    prop: 'pageimages',
    pithumbsize: 100,
  })}`);

  img = await img.json();

  return img.query.pages[pageID] && img.query.pages[pageID].thumbnail ?
      img.query.pages[pageID].thumbnail.source :
      null;
};

const _formatExcerpt = (text) => {
  const maxLength = 880;

  return text.length >= maxLength ?
  text.substring(0, (text + '.').lastIndexOf('.', maxLength)) +
    '...' : text;
};

const _getWiki = async (msg, args) => {
  const searchStr = await _fetchSearchString(args.join('%20'));

  const {pageid, title, extract} = await _fetchPage(searchStr);

  const img = await _fetchImg(searchStr, pageid);

  const excerpt = _formatExcerpt(extract);

  return {title, excerpt, pageid, img};
};

const _buildMessage = ({title, excerpt, pageid, img}, author) => {
  const embed = embedBuilder.buildEmbed('Wikipedia', title,
      author, excerpt, `https://en.wikipedia.org/?curid=${pageid}`,
      'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Wikipedia-logo-v2-en.svg/135px-Wikipedia-logo-v2-en.svg.png',
      'https://en.wikipedia.org');

  if (img) embed.setThumbnail(img);

  return embed;
};

module.exports = {
  name: 'wiki',
  description: 'Wiki',
  async execute(msg, args) {
    if (!args || args.length === 0) return;

    let output = '';

    try {
      const wiki = await _getWiki(msg, args);
      output = _buildMessage(wiki, msg.author.username);
    } catch (err) {
      output = err;
    }

    msg.channel.send(output);
  },
};
