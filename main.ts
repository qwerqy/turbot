import {
  createStatusEmbed,
  createHelpEmbed,
  createMemeEmbed
} from "./lib/commands";
import Cleverbot = require("cleverbot.io");
import Discord = require("discord.js");
require("dotenv").config();
import fetch from "node-fetch"
const isDevMode: boolean = process.env.NODE_ENV !== "production";
const botId: number = isDevMode ? 546301684192641024 : 546239335238860827;
const socket = require('socket.io-client')('http://localhost:3001');
declare module "discord.js" {
  interface Client {
    music: any;
  }
}

socket.on('connect', () => {
  console.log('Socket connected!')
})

socket.on('updateNickname', async function (data, done) {
  const guild = client.guilds.find(guild => guild.id === data.gid)
  try {
    await guild.me.setNickname(data.nickname)
    done({ status: 1 })
  } catch (err) {
    console.log(`Error updating nickname for guild ${data.gid}: ${err}`)
    done({ status: 0 })
  }
});

socket.on('disconnect', () => {
  console.log('Socket disconnected!')
})

// creates Client instance
const client: any = new Discord.Client();
const cleverClient: any = new Cleverbot(
  process.env.CLEVERBOT_USER,
  process.env.CLEVERBOT_KEY
);

// Music Player logic
client.music = require("discord.js-musicbot-addon");

client.on("ready", () => {
  console.log(`
  Bot is in ${process.env.NODE_ENV} mode.
  Logged in as ${client.user.tag}!
  `);
  cleverClient.setNick(`${client.user.tag}`);
  client.user.setActivity(
    isDevMode
      ? `>[DEV MODE] | ${[...client.guilds].length} servers`
      : `>help for commands. | Beta Build | ${
          [...client.guilds].length
        } servers`
  );
});

client.music.start(client, {
  youtubeKey: process.env.YOUTUBE_API,
  play: {
    usage: "{{prefix}}play some tunes",
    exclude: false
  },
  anyoneCanSkip: true,
  ownerOverMember: true,
  ownerID: process.env.OWNER_ID,
  cooldown: {
    enabled: false
  }
});

// When Cheese gets invited into a new Guild
client.on("guildCreate", guild => {
  fetch('http://localhost:3001/api/v1/bots/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      gid: guild.id,
      joinDate: guild.joinedAt,
      ownerID: guild.ownerID
    })
  })
  .then(res => res.status === 200 ? console.log(`Bot successfully joined guild ${guild.id}`) : console.log(`Internal Server Error`))
  .catch(err => console.log('Error inserting bot: ', err))
})

client.on("guildDelete", guild => {
  fetch('http://localhost:3001/api/v1/bots/delete', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      gid: guild.id
    })
  })
  .then(res => res.status === 200 ? console.log(`Bot successfully deleted from guild ${guild.id}`) : console.log(`Internal Server Error`))
  .catch(err => console.log('Error deleting bot: ', err))
})

client.setInterval(()=> {
  // Stuff to update the bot go here. override settings, nickname etc.

}, 500)

client.on("message", async msg => {
  // Disable communications with other bots.
  if (msg.author.bot) return;
  // Disable access to DevMode bot in other servers.
  if (
    isDevMode &&
    msg.guild.id !== "541382645670608906" &&
    msg.author.id !== "533610248142061579"
  )
    return;
  if (
    msg.content.toLowerCase().includes("cheese") ||
    msg.content.toLowerCase().includes("<@546239335238860827>")
  ) {
    const _msg: string = msg.content
      .replace("cheese", "")
      .replace(`<@${botId}>`, "");
    msg.channel.startTyping();
    cleverClient.create(function(err, session) {
      if (err) {
        console.log(err);
        msg.channel.stopTyping();
      }
      cleverClient.ask(_msg, function(err, response) {
        if (err) {
          console.log(err);
          msg.channel.stopTyping();
        }
        console.log(session);
        if (response) {
          msg.channel.stopTyping();
          msg.reply(response);
        }
      });
    });
  }

  const symbol: string = process.env.NODE_ENV !== "production" ? "<" : ">";

  // Sets commands that start with '>'
  if (msg.content.substring(0, 1) === symbol) {
    const musicBot: any = client.music.bot;
    const args: Array<string> = msg.content.substring(1).split(" ");
    const cmd: string = args[0];
    const suffix: string = args.splice(1).join(" ");
    const user: string = msg.author.username;

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
      case "queue":
      case "q":
        musicBot.queueFunction(msg, suffix);
        break;
      case "np":
        musicBot.npFunction(msg, suffix);
        break;
      case "loop":
      case "repeat":
        musicBot.loopFunction(msg, suffix);
        break;
      case "skip":
        musicBot.skipFunction(msg, suffix);
        break;
      case "pause":
        musicBot.pauseFunction(msg, suffix);
        break;
      case "resume":
        musicBot.resumeFunction(msg, suffix);
        break;
      case "clear":
        musicBot.clearFunction(msg, suffix);
        break;
      case "leave":
      case "bye":
        musicBot.leaveFunction(msg, suffix);
        break;
      case "p":
      case "play":
        try {
          if (suffix.includes("http") && suffix.includes("com")) {
            musicBot.playFunction(msg, suffix);
          } else {
            musicBot.searchFunction(msg, suffix);
          }
        } catch (err) {}
        break;
      case "v":
      case "volume":
        musicBot.volumeFunction(msg, suffix);
        break;
      case "rm":
      case "remove":
        musicBot.removeFunction(msg, suffix);
        break;
    }
  }
});

client.login(
  isDevMode ? process.env.DISCORD_DEV_SECRET : process.env.DISCORD_SECRET
);
