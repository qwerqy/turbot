// import Cleverbot = require("cleverbot.io");
import Discord = require("discord.js");
import {
  createHelpEmbed,
  createMemeEmbed,
  createStatusEmbed,
} from "./lib/commands";
require("dotenv").config();
const isDevMode: boolean = process.env.NODE_ENV !== "production";
// const botId: number = isDevMode ? 546301684192641024 : 546239335238860827;

const globalPrefix: GPObject = {};

// creates Client instance
const client: any = new Discord.Client();
// const cleverClient: any = new Cleverbot(
//   process.env.CLEVERBOT_USER,
//   process.env.CLEVERBOT_KEY
// );

client.on("ready", async () => {
  console.log(`
  Bot is in ${process.env.NODE_ENV} mode.
  Logged in as ${client.user.tag}!
  `);
  // cleverClient.setNick(`${client.user.tag}`);
  client.user.setActivity(
    isDevMode
      ? `>[DEV MODE] | ${[...client.guilds].length} servers`
      : `>help for commands. | Beta Build | ${
          [...client.guilds].length
        } servers`
  );
});

// When Cheese gets invited into a new Guild
client.on("guildCreate", guild => {});

client.on("guildDelete", guild => {});

client.on("message", async msg => {
  // Disable communications with other bots.
  if (msg.author.bot) {
    return;
  }

  const symbol: string = globalPrefix[msg.guild.id] || ">";

  if (msg.content.substring(0, 1) === symbol) {
    const args: string[] = msg.content.substring(1).split(" ");
    const cmd: string = args[0];
    const suffix: string = args.splice(1).join(" ");

    switch (cmd) {
      case "status":
        msg.channel.send(createStatusEmbed(client));
        break;
      case "help":
        msg.channel.send(createHelpEmbed());
        break;
      case "meme": {
        if (suffix !== "") {
          const memeEmbed = await createMemeEmbed(suffix, msg);
          msg.channel.send(memeEmbed);
        } else {
          msg.reply("Key in your search query sir.");
        }
        break;
      }
    }
  }
});

client.login(process.env.DISCORD_BOT_TOKEN);
