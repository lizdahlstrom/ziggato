const fetch = require('node-fetch');

module.exports = {
  name: 'dosh',
  description: 'Dosh',
  async execute(msg, args) {
    if (args.length < 3) throw new Error('Missing arguments');

    const abbrReg = new RegExp('^[A-Za-z]{3}$');
    const numberReg = new RegExp('^\\d+$');
    const amount = Number(args[2]);

    if (!abbrReg.test(args[0]) || !abbrReg.test(args[1]))
      throw new Error('Input can not be a currency');

    if (isNaN(amount))
      throw new Error(
        `Wrong number input: ${args[2]}, typeof: ${typeof args[2]}`
      );

    let result = 'Something went wrong';

    try {
      const url = `https://api.exchangeratesapi.io/latest?symbols=${args[1].toUpperCase()}&base=${args[0].toUpperCase()}`;
      let res = await fetch(url);
      res = await res.json();

      let currency = res.rates[args[1].toUpperCase()];

      result = `${args[2]} ${args[0].toUpperCase()} = ${(
        Number(currency) * amount
      ).toFixed(2)} ${args[1].toUpperCase()} `;
    } catch (err) {
      result += `: ${err}`;
    }

    msg.channel.send(result);
  },
};
