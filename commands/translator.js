const fetch = require('node-fetch');
const Discord = require('discord.js');
const { palette } = require('../config.json');
const { Translate } = require('@google-cloud/translate').v2;

// Creates a client
const translate = new Translate({ projectId: 'ziggato' });

const determineTarget = async (config) => {
  let target = config.target;
  let text = config.text;

  if (target.length > 3 || target.length === 0) {
    text = target + ' ' + text;
    console.log('text is', text);
    target = 'en';
  } else {
    let [languages] = await translate.getLanguages();
    languages = languages.map((lang) => lang.code);
    if (!languages.includes(target)) {
      text = target + ' ' + text;
      console.log('text is', text);
      target = 'en';
    }
  }

  return { target, text };
};

const callTranslate = async (msg, target, text) => {
  let result = '';

  let [translations] = await translate.translate(text, target);

  translations = Array.isArray(translations) ? translations : [translations];
  console.log('Translations:');
  translations.forEach((translation, i) => {
    console.log(`${text[i]} => (${target}) ${translation}`);
    result += translation;
  });

  return result;
};

module.exports = {
  name: 'translate',
  description: 'Translate',
  async execute(msg, args) {
    let output = 'no dice';
    const target = args.shift();
    const text = args.join(' ');

    try {
      let config = await determineTarget({ target, text });
      output = await callTranslate(msg, config.target, config.text);
    } catch (err) {
      output = `Something is wrong with your command yo.`;
      console.log(err.message);
    }

    const embed = new Discord.MessageEmbed()
      .setColor(palette.mid1)
      .setAuthor('Translator 🐈')
      .setTitle(output)
      .setDescription(`From: *"${text}"*`)
      .setFooter(`Requested by ${msg.author.username}`, msg.author.authorURL)
      .setTimestamp(new Date());

    msg.channel.send(embed);
  },
};
