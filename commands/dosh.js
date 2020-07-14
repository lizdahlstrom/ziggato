const fetch = require('node-fetch');
const Discord = require('discord.js');
const { palette } = require('../config.json');

module.exports = {
  name: 'dosh',
  description: 'Dosh',
  async execute(msg, args) {
    if (args.length < 3) throw new Error('Missing arguments');

    const abbrReg = new RegExp('^[A-Za-z]{3}$');
    const numberReg = new RegExp('^\\d+$');
    const amount = Number(args[2]);
    const embed = new Discord.MessageEmbed();

    if (!abbrReg.test(args[0]) || !abbrReg.test(args[1]))
      throw new Error('Input can not be a currency');

    if (isNaN(amount))
      throw new Error(
        `Wrong number input: ${args[2]}, typeof: ${typeof args[2]}`
      );

    let result = null;

    try {
      const url = `https://api.exchangeratesapi.io/latest?symbols=${args[1].toUpperCase()}&base=${args[0].toUpperCase()}`;
      let res = await fetch(url);
      res = await res.json();

      let currency = res.rates[args[1].toUpperCase()];

      result = `${args[2]} ${args[0].toUpperCase()} = ${(
        Number(currency) * amount
      ).toFixed(2)} ${args[1].toUpperCase()} `;

      embed.setColor(palette.mid1);
      embed.setTitle(result);
      embed.setDescription('Dosh converter 🐈');
      embed.setFooter(`Requested by ${msg.author.username}`);
      embed.setTimestamp(new Date());
    } catch (err) {
      result += `: ${err}`;
    }

    msg.channel.send(result ? embed : 'Something went wrong');
  },
};
