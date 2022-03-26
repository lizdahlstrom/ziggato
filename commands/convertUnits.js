const convert = require('convert-units');
const embedBuilder = require('./helpers/embedBuilder.js');

const _listUnits = (unit) => {
  if (!unit) return `${convert().possibilities().join(', ')}`;

  try {
    return `<${unit}> can be converted to: ${convert()
        .from(unit)
        .possibilities()
        .join(', ')}`;
  } catch (err) {
    throw new Error('Invalid conversion');
  }
};

const _convert = (original, target, amount) => {
  const originalDescr = convert().describe(original);
  const targetDescr = convert().describe(target);
  const result = convert(amount).from(original).to(target);

  return `${amount} ${
      amount > 1 ? originalDescr.plural : originalDescr.singular
  } =  ${result.toFixed(2)} ${
      result > 1 ? targetDescr.plural : targetDescr.singular
  }`;
};

const _buildMessage = (author, conversion) => {
  const isMaxLength = conversion.length >= 250;

  return embedBuilder.buildEmbed(
      'Unit converter 🐈',
      isMaxLength ? 'Possible conversions': conversion,
      author,
      isMaxLength? conversion : '');
};

module.exports = {
  name: 'units',
  description: 'Units converter',
  async execute(msg, args) {
    if (args.length > 3 && args[0] !== 'list') {
      throw new Error('Invalid arguments');
    }

    let output = '';

    try {
      if (args[0] === 'list') {
        output = _listUnits(args[1]);
      } else if (args.length === 3) {
        const [original, target, amount] = args;

        output = _convert(original, target, amount);
      }
    } catch (err) {
      output = err.message;
    }

    msg.channel.send(_buildMessage(msg.author.username, output));
  },
};
