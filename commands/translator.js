const embedBuilder = require('./helpers/embedBuilder.js');
const {Translate} = require('@google-cloud/translate').v2;

// Creates a client
const translate = new Translate({
  projectId: process.env.GOOGLE_PROJECT_ID,
  keyFilename: process.env.GOOGLE_KEYFILENAME,
});

const determineTarget = async (targetLang, text) => {
  if (targetLang.length > 3 || targetLang.length === 0) {
    text = targetLang + (text ? ' ' + text : '');
    targetLang = 'en';

    return {targetLang, text};
  }

  let [languages] = await translate.getLanguages();
  languages = languages.map((lang) => lang.code);

  if (!languages.includes(targetLang)) {
    text = targetLang + ' ' + text;
    targetLang = 'en';
  }

  return {targetLang, text};
};

const callTranslate = async (target, text) => {
  let [translations] = await translate.translate(text, target);
  translations = Array.isArray(translations) ? translations : [translations];

  let result = '';

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
    const targetLang = args.shift();
    let text = args.join(' ');

    try {
      const config = await determineTarget(targetLang, text);
      text = config.text;
      output = await callTranslate(config.targetLang, config.text);
    } catch (err) {
      output = `Something is wrong with your command yo.`;
    }

    const embed = embedBuilder.buildEmbed('Translator 🐈', output,
        msg.author.username, `From: *"${text}"*`);

    msg.channel.send(embed);
  },
};
