const fetch = require('node-fetch');

module.exports = {
  name: 'wiki',
  description: 'Wiki',
  async execute(msg, args) {
    const searchStr = args.join('%20');
    const url = `https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro&explaintext&redirects=1&titles=${searchStr}`;

    let resultStr = '```';
    const maxLength = 900;

    try {
      let result = await fetch(url);
      result = await result.json();

      result = Object.values(result.query.pages)[0];
      const pageID = result.pageid;

      if (!pageID) throw new Error(`Nopes! Couldn't find that in da wiki 😿`);

      result = `${result.title} \n\n${result.extract}`;

      resultStr +=
        result.length > maxLength ? result.substr(0, maxLength) : result;

      resultStr += `... \n\nhttps://en.wikipedia.org/?curid=${pageID}\`\`\``;
    } catch (error) {
      console.log(error);
      resultStr = error.message;
    }

    msg.channel.send(resultStr);
  },
};
