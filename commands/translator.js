const embedBuilder = require('./helpers/embedBuilder.js');
const {Translate} = require('@google-cloud/translate').v2;

// Creates a client
const translate = new Translate({
  projectId: process.env.GOOGLE_PROJECT_ID,
  keyFilename: process.env.GOOGLE_KEYFILENAME,
});

const determineTarget = async (targetLang, text ='') => {
  // handles case of first param not being target Language
  if (targetLang.length > 3 || targetLang.length === 0) {
    return {
      targetLang: 'en',
      text: targetLang + text,
    };
  }

  let [languages] = await translate.getLanguages();
  languages = languages.map((lang) => lang.code);
  // default target language is english
  if (!languages.includes(targetLang)) targetLang = 'en';

  return {targetLang};
};

const callTranslate = async (target, text) => {
  let [translations] = await translate.translate(text, target);
  translations = Array.isArray(translations) ? translations : [translations];

  return translations.join('');
};

const buildMessage = (translation, author, inputText)=> {
  return embedBuilder.buildEmbed('Translator 🐈', translation,
      author, `From: *"${inputText}"*`);
};

module.exports = {
  name: 'translate',
  description: 'Translate',
  async execute(msg, args) {
    if (!args || args.length === 0) return;

    const target = args.shift();
    const textStr = args.join(' ');

    const {
      targetLang,
      text = (`${target} ${textStr}`),
    } = await determineTarget(target, textStr);

    const translation = await callTranslate(targetLang, text);

    msg.channel.send(buildMessage(translation, msg.author.username, text));
  },
};
