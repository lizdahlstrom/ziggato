const convert = require('convert-units');
const Discord = require('discord.js');
const {palette} = require('../config.json');

const buildEmbed = (output, userName) => {
  const embed = new Discord.MessageEmbed()
      .setColor(palette.mid1)
      .setAuthor('Unit converter 🐈')
      .setFooter(`Requested by ${userName}`)
      .setTimestamp(new Date());

  if (output.length >= 250) {
    embed.setTitle('Possible conversions');
    embed.setDescription(output);
  } else {
    embed.setTitle(output);
  }

  return embed;
};

module.exports = {
  name: 'units',
  description: 'Units converter',
  async execute(msg, args) {
    let output = '';

    if (args[0] === 'list') {
      if (args[1]) {
        try {
          output = `<${args[1]}> can be converted to: ${convert()
              .from(args[1])
              .possibilities()
              .join(', ')}`;
        } catch (err) {
          throw new Error('Invalid conversion');
        }
      } else {
        output = `${convert().possibilities().join(', ')}`;
      }
    } else if (args.length === 3) {
      const original = args[0];
      const target = args[1];
      const amount = args[2];

      try {
        const originalDescr = convert().describe(original);
        const targetDescr = convert().describe(target);
        const result = convert(amount).from(original).to(target);

        output = `${amount} ${
          amount > 1 ? originalDescr.plural : originalDescr.singular
        } =  ${result.toFixed(2)} ${
          result > 1 ? targetDescr.plural : targetDescr.singular
        }`;
      } catch (err) {
        throw new Error('Invalid output 😿');
      }
    } else {
      throw new Error('Missing arguments');
    }

    msg.channel.send(buildEmbed(output, msg.author.username));
  },
};
