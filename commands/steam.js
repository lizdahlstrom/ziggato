const KEY = process.env.STEAM_KEY
const fetch = require('node-fetch')

const getGames = async (userId) => {
  const url =  `http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${KEY}&steamid=${userId}&format=json&include_appinfo=true&include_played_free_games=true`;

  let games = await fetch(url);
  games = await games.json();
  return games.response.games;
};


const getPrint = (games) => {
  let str = '```Games in common: \n';

  games.forEach(game => {
    str += game.name + '\n';
  });

  str += '```';

  return str;
};

module.exports = {
  name: '!steam',
  description: 'Steam',
  async execute(msg, args) {
    let res = '';

    switch(args[0]) {
      case 'incommon':
        
        if (args.length < 3) {
          msg.channel.send('No dice. To compare, you need TWO steam IDs.');
          return;
        }
        
        const user1Games = await getGames(args[1]);
        const user2Games = await getGames(args[2]);

        const gamesInCommon = await user1Games.filter(g => user2Games.some(({appid}) => g.appid === appid));

        res = getPrint(gamesInCommon);

        break;
    }

    msg.channel.send(res);
  },

}