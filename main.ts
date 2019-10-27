import {
  getGuildBot,
  listGuildBots,
  onCreateCommand,
  onUpdateCommand,
  onDeleteCommand,
  onUpdateGuildBot,
  onDeleteGuildBot,
} from "./lib/graphql";
import * as Amplify from "aws-amplify";
import * as Discord from "discord.js";
import {
  createHelpEmbed,
  createMemeEmbed,
  createStatusEmbed,
} from "./lib/commands";
import config from "./amplify-config";
import { isDevMode } from "./lib/utilities";
import * as Sentry from "@sentry/node";
import createNewGuild from "./lib/createNewGuild";
import deleteGuild from "./lib/deleteGuild";
import WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 8080 });

wss.on("connection", function connection(ws) {
  // @ts-ignore
  console.log(`Connected to client ${ws._socket.remoteAddress}`);
  ws.on("message", function incoming(message) {
    console.log("received: %s", message);
  });

  ws.on("close", () => console.log("Connection closed"));

  ws.on("error", err => {
    // @ts-ignore
    switch (err.code) {
      case "ECONNRESET": {
        break;
      }
      default:
        console.log(err);
    }
  });
});

wss.on("error", error => console.log("WSS Error: ", error));

wss.on("close", () => {
  console.log("close");
});

Amplify.default.configure(config);

// creates Client instance
const client: any = new Discord.Client();

// Guild prefix list state
const globalPrefix: GPObject = {};
// Custom commands list state
let customCommands = [];

client.on("ready", async () => {
  try {
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

    // Checks if there is any missing guildBot document in database by comparing with client's guilds.
    client.guilds.map(async guild => {
      const { data: guildData } = await Amplify.API.graphql(
        Amplify.graphqlOperation(getGuildBot, { id: guild.id })
      );
      // If there is a mising guild, it will be added into database
      if (!guildData.getGuildBot) {
        await createNewGuild(guild, globalPrefix);
        console.log(`Guild ${guild.id} not found in database, creating now.`);
      }
    });

    const { data } = await Amplify.API.graphql(
      Amplify.graphqlOperation(listGuildBots)
    );

    // Checks if there is any guilds in database that is not in client's guilds
    data.listGuildBots.items.map(async (guildBot: IGuildBot) => {
      const botExistsInClient = client.guilds.find(
        guild => guild.id === guildBot.id
      );
      // If there is, continue to delete
      if (!botExistsInClient) {
        await deleteGuild(guildBot);
        console.log(
          `Unknown guild document detected. Deleting guild ${guildBot.id} from database`
        );
      }
      globalPrefix[guildBot.id] = guildBot.prefix;
    });

    console.log(`Setting global prefix\n
    ${JSON.stringify(globalPrefix)}
    `);
  } catch (err) {
    console.log("Error on client ready", err);
    Sentry.captureException(err);
  }
});

// When Cheese gets invited into a new Guild
client.on("guildCreate", async (guild: Discord.Guild) => {
  await createNewGuild(guild, globalPrefix);
});

client.on("guildDelete", async (guild: Discord.Guild) => {
  await deleteGuild(guild);
});

client.on("message", async (msg: Discord.Message) => {
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
        guildBotData.value.data.onDeleteGuildBot.commands.items.map(
          (command: ICommand) => {
            customCommands.filter((c: ICustomCommand) => c.id !== command.id);
          }
        );
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
            customCommands.map((command: ICustomCommand) => {
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
    Sentry.captureException(err);
  }
});

client.login(process.env.DISCORD_BOT_TOKEN);
