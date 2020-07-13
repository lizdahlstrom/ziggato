const KEY = process.env.STEAM_KEY;
const fetch = require('node-fetch');

const getGames = async (userId) => {
  const url = `http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${KEY}&steamid=${userId}&format=json&include_appinfo=true&include_played_free_games=true`;

  let games = await fetch(url);
  games = await games.json();
  return games.response.games;
};

const getPrint = (games) => {
  games = games.map((a) => a.name);
  games.sort();

  return `\`\`\`Games in common: \n \n${games.join('\n')} \`\`\``;
};

const getIncommonGames = async (args) => {
  const data = [];

  for (let i = 1; i < args.length; i++) {
    const userGames = await getGames(args[i]);
    data.push(userGames);
  }

  let gamesInCommon = data[0];

  for (let i = 1; i < data.length; i++) {
    gamesInCommon = gamesInCommon.filter((g) =>
      data[i].some(({ appid }) => g.appid === appid)
    );
  }

  console.log('length of gamesInCommon common is', await gamesInCommon.length);

  return await gamesInCommon;
};

module.exports = {
  name: 'steam',
  description: 'Steam',
  async execute(msg, args) {
    let res = '';

    switch (args[0]) {
      case 'incommon':
        if (args.length < 3) {
          msg.channel.send('No dice. To compare, you need TWO steam IDs.');
          return;
        }

        try {
          let gamesInCommon = await getIncommonGames(args);
          res = getPrint(await gamesInCommon);
        } catch (err) {
          msg.channel.send('Invalid steam ID :3');
        }

        break;
    }

    msg.channel.send(res);
  },
};
