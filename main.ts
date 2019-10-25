import {
  createGuildBot,
  getGuildBot,
  listGuildBots,
  deleteGuildBot,
  createCommand,
  onCreateCommand,
  onUpdateCommand,
  onDeleteCommand,
  onUpdateGuildBot,
  onDeleteGuildBot,
  deleteCommand,
  listCommands,
} from "./lib/graphql";
// import Cleverbot = require("cleverbot.io");
import Amplify = require("aws-amplify");
import Discord = require("discord.js");
import {
  createHelpEmbed,
  createMemeEmbed,
  createStatusEmbed,
} from "./lib/commands";
// @ts-ignore
global.WebSocket = require("ws");
require("dotenv").config();

Amplify.default.configure({
  aws_appsync_graphqlEndpoint: process.env.AWS_APPSYNC_GRAPHQLENDPOINT,
  aws_appsync_region: process.env.AWS_APPSYNC_REGION,
  aws_appsync_authenticationType: "AWS_IAM",
});

const isDevMode: boolean = process.env.NODE_ENV !== "production";
// const botId: number = isDevMode ? 546301684192641024 : 546239335238860827;

const globalPrefix: GPObject = {};

// creates Client instance
const client: any = new Discord.Client();
// const cleverClient: any = new Cleverbot(
//   process.env.CLEVERBOT_USER,
//   process.env.CLEVERBOT_KEY
// );

let customCommands = [];

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

  const { data } = await Amplify.API.graphql(
    Amplify.graphqlOperation(listGuildBots)
  );

  data.listGuildBots.items.map(guildBot => {
    globalPrefix[guildBot.id] = guildBot.prefix;
  });

  console.log("Setting global prefix");
  console.log(globalPrefix);
});

// When Cheese gets invited into a new Guild
client.on("guildCreate", async guild => {
  try {
    // Add initial command to database
    const newGuildBot = {
      id: guild.id,
      prefix: ">",
    };

    const newCommand = {
      commandGuildBotId: guild.id,
      cmd: "ping",
      message: "Pong!",
    };

    // Add new guild
    await Amplify.API.graphql(
      Amplify.graphqlOperation(createGuildBot, { input: newGuildBot })
    );

    // Add new command under guild
    await Amplify.API.graphql(
      Amplify.graphqlOperation(createCommand, { input: newCommand })
    );

    const { data } = await Amplify.API.graphql(
      Amplify.graphqlOperation(listGuildBots)
    );

    data.listGuildBots.items.map(guildBot => {
      // Set Global Prefix
      globalPrefix[guildBot.id] = guildBot.prefix;
    });

    console.log(`Initial command set for guild ${guild.id}`);
  } catch (err) {
    console.log(`Error adding to guild ${guild.id}`, err);
  }
});

client.on("guildDelete", async guild => {
  try {
    const allCommands = await Amplify.API.graphql(
      Amplify.graphqlOperation(listCommands)
    );

    allCommands.data.listCommands.items
      .filter(command => command.guildBot.id === guild.id)
      .map(async command => {
        await Amplify.API.graphql(
          Amplify.graphqlOperation(deleteCommand, {
            input: { id: command.id },
          })
        );
      });

    await Amplify.API.graphql(
      Amplify.graphqlOperation(deleteGuildBot, { input: { id: guild.id } })
    );
    console.log(`Guild ${guild.id} removed from database.`);
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

    Amplify.API.graphql(Amplify.graphqlOperation(onUpdateGuildBot)).subscribe({
      next: guildBotData => {
        globalPrefix[msg.guild.id] =
          guildBotData.value.data.onUpdateGuildBot.prefix;
      },
    });

    Amplify.API.graphql(Amplify.graphqlOperation(onDeleteGuildBot)).subscribe({
      next: guildBotData => {
        delete globalPrefix[msg.guild.id];

        guildBotData.value.data.onDeleteGuildBot.commands.items.map(command => {
          customCommands.filter(c => c.id !== command.id);
        });
      },
    });

    const symbol: string = globalPrefix[msg.guild.id] || ">";

    if (msg.content.substring(0, 1) === symbol) {
      const args: string[] = msg.content.substring(1).split(" ");
      const cmd: string = args[0];
      const suffix: string = args.splice(1).join(" ");

      const { data } = await Amplify.API.graphql(
        Amplify.graphqlOperation(getGuildBot, {
          id: msg.guild.id,
        })
      );

      customCommands = [...data.getGuildBot.commands.items];

      Amplify.API.graphql(Amplify.graphqlOperation(onCreateCommand)).subscribe({
        next: commandData => {
          customCommands = [
            ...customCommands,
            commandData.value.data.onCreateCommand,
          ];
          console.log(
            `New custom command added ${commandData.value.data.onCreateCommand.id}`
          );
        },
      });

      Amplify.API.graphql(Amplify.graphqlOperation(onUpdateCommand)).subscribe({
        next: commandData => {
          customCommands = [
            ...customCommands,
            commandData.value.data.onUpdateCommand,
          ];
          console.log(
            `Custom command updated ${commandData.value.data.onUpdateCommand.id}`
          );
        },
      });

      Amplify.API.graphql(Amplify.graphqlOperation(onDeleteCommand)).subscribe({
        next: commandData => {
          customCommands = [
            ...customCommands,
            commandData.value.data.onDeleteCommand,
          ];
          console.log(
            `Custom command deleted ${commandData.value.data.onDeleteCommand.id}`
          );
        },
      });

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
          if (data) {
            customCommands.map(command => {
              if (command.cmd === cmd) {
                msg.reply(command.message);
              }
            });
          }
        }
      }
    }
  } catch (err) {
    console.log(`Error on message for guild ${msg.guild.id}`, err);
  }
});

client.login(process.env.DISCORD_BOT_TOKEN);
