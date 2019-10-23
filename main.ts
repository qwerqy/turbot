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

client.on("ready", async () => {
  console.log(`
  Bot is in ${process.env.NODE_ENV} mode.
  Logged in as ${client.user.tag}!
  `);

  client.user.setActivity(
    isDevMode
      ? `>[DEV MODE] | ${[...client.guilds].length} servers`
      : `>help for commands. | Beta Build | ${
          [...client.guilds].length
        } servers`
  );

  console.log("Setting global prefix");
  console.log(globalPrefix);
});

// When Cheese gets invited into a new Guild
client.on("guildCreate", async guild => {
  try {
  } catch (err) {
    console.log(`Error adding to guild ${guild.id}`, err);
  }
});

client.on("guildDelete", async guild => {
  try {
  } catch (err) {
    console.log("Error deleting guild: ", err);
  }
});

client.on("message", async msg => {
  try {
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
        default: {
          return;
        }
      }
    }
  } catch (err) {
    console.log(`Error on message for guild ${msg.guild.id}`, err);
  }
});

client.login(process.env.DISCORD_BOT_TOKEN);
