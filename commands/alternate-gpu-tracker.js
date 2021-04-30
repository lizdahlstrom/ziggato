const fetch = require('node-fetch');
const Discord = require('discord.js');
const fs = require('fs');
const path = require('path');
const pathName = path.join(__dirname, 'alternateGPU.json');

const buildEmbed = (url) => {
  return new Discord.MessageEmbed();
};

module.exports = {
  name: 'gpu',
  description: 'Alternate.nl GPU release tracker',
  execute(msg, args) {
    try {
      // 1 ) add new gpu sub
      // 2 ) remove gpu sub
      options: if (args.length < 2) return;

      // add a new entry to json file
      const cmd = args[0];
      const gpuModel = args[1];
      const channelId = msg.channel;

      if (gpuModel !== '3070' || gpuModel !== '3080' || gpuModel !== '3090')
        return;

      if (cmd !== 'add' && cmd !== 'remove') return;

      const data = fs.readFileSync(pathName);
      let subs = JSON.parse(data) || [];

      const hasDuplicateEntry = subs.some(
        (sub) =>
          sub['channel_id'] === msg.channel.id && sub['card_name'] === gpuModel
      );

      if (cmd === 'add') {
        if (subs.length >= 1 && hasDuplicateEntry) return;

        // add entry
        subs.push({
          channel_id: msg.channel.id,
          card_name: gpuModel,
        });
      } else if (cmd === 'remove') {
        //remove entry
        subs = subs.filter(
          (sub) =>
            sub['card_name'] !== gpuModel &&
            sub['channel_id'] === msg.channel.id
        );
      }

      fs.writeFileSync(pathName, JSON.stringify(subs));

      msg.reply(
        `${cmd}${cmd === 'add' ? 'ed' : 'd'} your sub for ${gpuModel}.`
      );
    } catch (error) {
      msg.reply('Oops :(');
    }
  },
};
