const KEY = process.env.STEAM_KEY;
const fetch = require('node-fetch');
const Discord = require('discord.js');
const {palette} = require('../config.json');

const getGames = async (userId) => {
  // regex if userId is a steamID or a .. other thing
  const steamIDRegex = RegExp('^\\d{17}$');
  const noWhitespaceRegex = RegExp('^\\S*$');
  let id = userId;

  if (!steamIDRegex.test(id) && noWhitespaceRegex.test(id)) {
    id = await getUserID(id);
  }

  if (id === null) throw new TypeError(`${userId} is not a valid Steam ID`);

  const url = `http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${KEY}&steamid=${await id}&format=json&include_appinfo=true&include_played_free_games=true`;

  let games = await fetch(url);
  games = await games.json();
  return games.response.games;
};

const getUserID = async (vanityURL) => {
  const url = `https://api.steampowered.com/ISteamUser/ResolveVanityURL/v1/?key=${KEY}&vanityurl=${vanityURL}`;
  let result;
  try {
    let res = await fetch(url);
    res = await res.json();
    result = res.response;
    result = result.success === 1 ? result.steamid : null;
  } catch (err) {
    result = null;
  }
  return result;
};

const getAppDetails = async (app) => {
  const url = `https://store.steampowered.com/api/appdetails?appids=${app.appid}`;
  let res = '';

  try {
    res = await fetch(url);
    res = await res.json();
    res = res[app.appid].data;
  } catch (err) {
    throw new Error(
        'Could not fetch details of ' +
        app.appid +
        ' from api. Because Steam API sucks. Yeah.',
    );
  }

  return res;
};

const getPrint = (games, category, msg) => {
  const embed = new Discord.MessageEmbed();
  const gamesCopy = games.map((a) => a.name);
  gamesCopy.sort();

  embed.setColor(palette.dark);
  embed.setAuthor(
      'Steam',
      'https://seeklogo.com/images/S/steam-logo-73274B19E3-seeklogo.com.png',
      'https://store.steampowered.com/',
  );
  embed.setTitle(
      `${gamesCopy.length} ${category ? category + ' ' : ''}games in common ${
      gamesCopy.length === 0 ? '😿' : '😸'
      }`,
  );
  embed.setDescription(`${gamesCopy.join('\n')}`);
  embed.setFooter(
      `Requested by ${msg.author.username}`,
      msg.author.displayAvatarURL,
  );
  embed.setTimestamp(new Date());

  return embed;
};

const getCountPrint = (count, msg, username) => {
  const embed = new Discord.MessageEmbed();

  embed.setColor(palette.dark);
  embed.setAuthor(
      'Steam',
      'https://seeklogo.com/images/S/steam-logo-73274B19E3-seeklogo.com.png',
      'https://store.steampowered.com/',
  );
  embed.setTitle(
      `${username} has ${count} games. ${count === 0 ? '😿' : '😸'}`,
  );
  embed.setFooter(
      `Requested by ${msg.author.username}`,
      msg.author.displayAvatarURL,
  );
  embed.setTimestamp(new Date());

  return embed;
};

const removeDuplicates = (arr) => {
  return [...new Set(arr)];
};

const getIncommonGames = async (args) => {
  const data = [];

  for (let i = 1; i < args.length; i++) {
    const userGames = await getGames(args[i]);
    data.push(userGames);
  }

  let gamesInCommon = await data[0];

  for (let i = 1; i < data.length; i++) {
    gamesInCommon = gamesInCommon.filter((g) =>
      data[i].some(({appid}) => g.appid === appid),
    );
  }

  return await gamesInCommon;
};

const inCommonWrapper = async (args, msg, func) => {
  let res = 'Errorz...';

  if (args.length < 3) {
    res = 'No dice. To compare, you need TWO steam IDs.';
  }

  const users = removeDuplicates(args);
  let gamesInCommon = null;

  try {
    gamesInCommon = await getIncommonGames(users);
  } catch (err) {
    res = `Invalid steam ID :3: (${err.message})`;
  }

  try {
    res = await func(gamesInCommon);
  } catch (err) {
    res = `Well, something went wrong: ${err.message}`;
  }

  msg.channel.send(res);
};

const getInCommonByCategory = async (args, msg, categoryID, categoryName) => {
  await inCommonWrapper(args, msg, async (games) => {
    let commonGames = [...games];
    commonGames = Promise.all(commonGames.map((g) => getAppDetails(g)));

    commonGames = (await commonGames).filter((game) => {
      const categories = game ? game.categories : null;
      let isCoop = false;
      if (categories) {
        isCoop = categories.some((c) => c.id === categoryID);
      }
      return isCoop;
    });

    const output = getPrint(await commonGames, categoryName, msg);
    return output;
  });
};

const getGameCount = async (args) => {
  const games = await getGames(args[1]);
  return games ? games.length : 0;
};

module.exports = {
  name: 'steam',
  description: 'Steam',
  async execute(msg, args) {
    switch (args[0]) {
      case 'incommon': {
        let res = 'Errorz...';

        if (args.length < 3) {
          res = 'No dice. To compare, you need TWO steam IDs.';
          return;
        }

        const users = removeDuplicates(args);

        try {
          const gamesInCommon = await getIncommonGames(users);
          res =
            getPrint(await gamesInCommon, null, msg) || 'uh-oh, some issue...';
        } catch (err) {
          res = `Invalid steam ID :3: (${err.message})`;
        }

        msg.channel.send(res);

        break;
      }
      case 'coop': {
        await getInCommonByCategory(args, msg, 9, 'co-op');
        break;
      }
      case 'mp': {
        await getInCommonByCategory(args, msg, 1, 'multi-player');
        break;
      }
      case 'count': {
        const count = await getGameCount(args);
        msg.channel.send(getCountPrint(count, msg, args[1]));
        break;
      }
    }
  },
};
