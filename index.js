require('dotenv').config();
const Discord = require('discord.js');
const bot = new Discord.Client();
bot.commands = new Discord.Collection();
const botCommands = require('./commands');
const gpuChecker = require('./commands/helpers/gpu-checker.js');
const puppeteer = require('puppeteer');

Object.keys(botCommands).map((key) => {
  bot.commands.set(botCommands[key].name, botCommands[key]);
});

const TOKEN = process.env.DISCORD_TOKEN;

bot.login(TOKEN);

bot.on('ready', async () => {
  console.info(`Logged in as ${bot.user.tag}!`);
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  setInterval(() => {
    // scrape for new gpus every 10th seconds

    gpuChecker.scrapeGPUs(page);
  }, 10000);
});

bot.on('message', (msg) => {
  const args = msg.content.split(/ +/);

  if (msg.author.bot || shiftFirstElement(args) !== 'gato') return;

  const command = shiftFirstElement(args);
  console.info(`Called command: ${command}`);

  if (!bot.commands.has(command)) return;

  try {
    bot.commands.get(command).execute(msg, args);
  } catch (error) {
    console.error(error);
    msg.reply('there was an error trying to execute that command!');
  }
});

const shiftFirstElement = (arr) => {
  return arr.shift().toLowerCase();
};
