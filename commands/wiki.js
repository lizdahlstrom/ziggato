const fetch = require('node-fetch');
const Discord = require('discord.js');
const { palette } = require('../config.json');

const callWiki = async (msg, args) => {
  let searchStr = args.join('%20');
  const api = 'https://en.wikipedia.org/w/api.php';
  // first search, get the right capitalization, then query
  const apiSearch =
    api +
    `?action=opensearch&search=${searchStr}&limit=1&namespace=0&format=json`;
  // search
  let search = await fetch(apiSearch);
  search = await search.json();

  searchStr = search[1][0].replace(' ', '%20');

  const query = api + `?format=json&action=query&titles=${searchStr}`;
  const url = query + '&prop=extracts&exintro&explaintext&redirects=1';
  const imageURL = query + '&prop=pageimages&pithumbsize=100';

  const maxLength = 880;
  const embed = new Discord.MessageEmbed();

  // get excerpt
  let result = await fetch(url);
  result = await result.json();
  result = Object.values(result.query.pages)[0];

  const pageID = result.pageid;

  if (!pageID) throw new Error(`Nopes! Couldn't find that in da wiki 😿`);

  // get image
  let img = await fetch(imageURL);
  img = await img.json();
  img =
    img.query.pages[pageID] && img.query.pages[pageID].thumbnail
      ? img.query.pages[pageID].thumbnail.source
      : null;

  if (img) embed.setThumbnail(img);

  let title = result.title;
  let extract = result.extract;

  const excerpt =
    extract.substring(0, (extract + '.').lastIndexOf('.', maxLength)) + '...';

  embed.setColor(palette.dark);
  embed.setAuthor(
    'Wikipedia',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Wikipedia-logo-v2-en.svg/135px-Wikipedia-logo-v2-en.svg.png',
    'https://en.wikipedia.org'
  );

  embed.setTitle(title);
  embed.setURL(`https://en.wikipedia.org/?curid=${pageID}`);
  embed.setDescription(excerpt);
  embed.setFooter(
    `Requested by ${msg.author.username}`,
    msg.author.displayAvatarURL
  );
  embed.setTimestamp(new Date());

  return embed;
};

module.exports = {
  name: 'wiki',
  description: 'Wiki',
  async execute(msg, args) {
    let output = '';

    try {
      output = await callWiki(msg, args);
    } catch (err) {
      output = err.message;
    }

    msg.channel.send(output);
  },
};
