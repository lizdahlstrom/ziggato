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
        'Use ``gato`` as prefix for all commands. ``[]`` indicate with or without space inbetween. ``<>`` indicate a singular value.',
      fields: [
        {
          name: 'Giphy',
          value:
            '``gif [phrase/word]`` - translate text into gif\n``gif search [text]``\n``gif random``\n``gif random [text]``',
          inline: false,
        },
        {
          name: 'Dosh - currency converter',
          value: '``dosh <currency abbr> <target currency abbr> <amount>``',
          inline: false,
        },
        {
          name: 'Jokes',
          value:
            '``jokes`` - random joke\n``jokes dark`` - dark joke\n``jokes misc`` - miscellaneous joke\n``jokes prog`` - programming joke',
          inline: false,
        },
        {
          name: 'Steam - games in common between users',
          value:
            '``steam incommon [steamIDs]`` -all\n``steam coop [steamIDs]`` - all co-op\n``steam mp [steamIDs]`` -all multi-player',
          inline: false,
        },
        {
          name: 'Translate',
          value:
            '``translate [text]`` - default target language is english\n``translate <language-code> [text]``',
          inline: false,
        },
        {
          name: 'Unit converter',
          value:
            '``units <unit-abbr> <target unit abbr> <amount>``\n``units list`` - lists all possible units\n``units list <unit abbr>`` - lists all possible units to convert to from given unit',
          inline: false,
        },
        {
          name: 'Wiki',
          value: '``wiki [string]``',
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
