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
