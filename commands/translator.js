const embedBuilder = require('./helpers/embedBuilder.js');
const {Translate} = require('@google-cloud/translate').v2;

// Creates a client
const translate = new Translate({projectId: 'ziggato'});

const determineTarget = async (config) => {
  let target = config.target;
  let text = config.text;

  if (target.length > 3 || target.length === 0) {
    text = target + (text ? ' ' + text : '');
    target = 'en';
  } else {
    let [languages] = await translate.getLanguages();
    languages = languages.map((lang) => lang.code);
    if (!languages.includes(target)) {
      text = target + ' ' + text;
      target = 'en';
    }
  }

  return {target, text};
};

const callTranslate = async (msg, target, text) => {
  let result = '';

  let [translations] = await translate.translate(text, target);

  translations = Array.isArray(translations) ? translations : [translations];
  translations.forEach((translation, i) => {
    result += translation;
  });

  return result;
};

module.exports = {
  name: 'translate',
  description: 'Translate',
  async execute(msg, args) {
    if (!args || args.length === 0) return;

    let output = 'no dice';
    const target = args.shift();
    let text = args.join(' ');

    try {
      const config = await determineTarget({target, text});
      text = config.text;
      output = await callTranslate(msg, config.target, config.text);
    } catch (err) {
      output = `Something is wrong with your command yo.`;
    }

    const embed = embedBuilder.buildEmbed('Translator 🐈', output,
        msg.author.username, `From: *"${text}"*`);

    msg.channel.send(embed);
  },
};
