import { guilds } from "./lib/db/init";
import Discord = require("discord.js");
import {
  createHelpEmbed,
  createMemeEmbed,
  createStatusEmbed,
} from "./lib/commands";
import setPrefix from "./lib/commands/setPrefix";
// tslint:disable-next-line: no-var-requires
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

  const array = await guilds.find().toArray();
  array.map((guild: IGuildObject) => {
    globalPrefix[guild.id] = guild.prefix;
  });

  console.log("Setting global prefix");
  console.log(globalPrefix);
});

client.on("guildCreate", async (guild: Discord.Guild) => {
  try {
    const guildTemplate = {
      id: guild.id,
      prefix: ">",
    };
    await guilds.insertOne(guildTemplate);
  } catch (err) {
    console.log(`Error adding to guild ${guild.id}`, err);
  }
});

client.on("guildDelete", async (guild: Discord.Guild) => {
  try {
    await guilds.deleteOne({ id: guild.id });
  } catch (err) {
    console.log("Error deleting guild: ", err);
  }
});

client.on("message", async (msg: Discord.Message) => {
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
        case "set": {
          const update = suffix.split(" ");
          const [reducer, value] = update;

          switch (reducer) {
            case "prefix":
              await setPrefix(reducer, value, msg, globalPrefix);
              break;
            default:
              msg.channel.send("`Type set -h for more information.`");
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
