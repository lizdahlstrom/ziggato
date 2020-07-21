const Discord = require('discord.js');
const { palette } = require('../config.json');

module.exports = {
  name: 'commands',
  description: 'Commands',
  execute(msg, args) {
    let embed = {
      color: palette.light,
      title: 'Commands',
      author: {
        name: 'ziggato 🐈',
      },
      description:
        'Use ``gato`` as prefix for all commands. ``[]`` indicate optional values.\nExample: ``[ value1 | value2]`` indicates either ``value1`` or ``value2`` (but not both), or nothing.\n``<>`` indicate a mandatory value. ``<...>`` indicate optionally multiple values (but at least one).',
      fields: [
        {
          name: 'Giphy',
          value: '``gif [random | search] <text...>``',
          inline: false,
        },
        {
          name: 'Dosh - currency converter',
          value: '``dosh <currency abbr> <target currency abbr> <amount>``',
          inline: false,
        },
        {
          name: 'Jokes',
          value: '``jokes [random | dark | misc | prog | dad]``',
          inline: false,
        },
        {
          name: 'Lyrics',
          value:
            '``lyrics <artist> / <track title>`` - displays lyrics if found',
          inline: false,
        },
        {
          name: 'Steam - games in common between users',
          value: '``steam [incommon | coop | mp] <steamIDs...>``',
          inline: false,
        },
        {
          name: 'Translate',
          value:
            '``translate [language-code] <text...>`` - default target language is english (en)',
          inline: false,
        },
        {
          name: 'Unit converter',
          value:
            '``units <unit-abbr> <target unit abbr> <amount>``\n``units list`` - lists all possible units\n``units list [unit abbr]`` - lists all possible units to convert to from given unit',
          inline: false,
        },
        {
          name: 'Wiki',
          value: '``wiki <text...>``',
          inline: false,
        },
      ],
      footer: {
        text: `Requested by ${msg.author.username}`,
      },
      timestamp: new Date(),
    };

    msg.channel.send({ embed });
  },
};
