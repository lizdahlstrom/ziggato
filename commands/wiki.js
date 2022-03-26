const fetch = require('node-fetch');
const api = 'https://en.wikipedia.org/w/api.php';
const embedBuilder = require('./helpers/embedBuilder.js');
const NOT_FOUND_MSG = `Nopes! Couldn't find that in da wiki 😿`;

const buildSearchString = async (searchStr) => {
  // first search, get the right capitalization, then query
  const apiSearch =
    api +
    `?action=opensearch&search=${searchStr}&limit=1&namespace=0&format=json`;

  let search = await fetch(apiSearch);
  search = await search.json();

  return search[1][0] ? search[1][0].replace(' ', '%20') : '';
};

const joinWithApiStrDelimiter = (arr) => {
  return arr.join('%20');
};

const fetchWikiPage = async (url) => {
  let result = await fetch(url);
  result = await result.json();
  if (!result.query) throw new Error(NOT_FOUND_MSG);

  result = Object.values(result.query.pages)[0];
  return result;
};

const fetchWikiImage = async (url, pageID) => {
  let img = await fetch(url);
  img = await img.json();

  return img.query.pages[pageID] && img.query.pages[pageID].thumbnail ?
      img.query.pages[pageID].thumbnail.source :
      null;
};

const callWiki = async (msg, args) => {
  const searchStr = await buildSearchString(joinWithApiStrDelimiter(args));

  const query = `${api}?format=json&action=query&titles=${searchStr}`;

  const {pageid, title, extract} = await
  fetchWikiPage(`${query}&prop=extracts&exintro&explaintext&redirects=1`);

  if (!pageid) throw new Error(NOT_FOUND_MSG);

  const img = await fetchWikiImage(
      `${query}&prop=pageimages&pithumbsize=100`,
      pageid);
  const maxLength = 880;

  const excerpt =
    extract.length >= maxLength ?
      extract.substring(0, (extract + '.').lastIndexOf('.', maxLength)) +
        '...' :
      extract;

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
      output = await callWiki(msg, args);
      output = _buildMessage(output, msg.channel.author);
    } catch (err) {
      output = err.message;
    }

    msg.channel.send(output);
  },
};
