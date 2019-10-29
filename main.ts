import {
  getGuildBot,
  listGuildBots,
  onCreateCommand,
  onUpdateCommand,
  onDeleteCommand,
  onUpdateGuildBot,
  onDeleteGuildBot,
  onUpdatePlugin,
  onCreatePlugin,
  onDeletePlugin,
  onCreatePluginCommand,
  onUpdatePluginCommand,
  onDeletePluginCommand,
  getGuildBotTree,
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
import updateGuild from "./lib/updateGuild";

Amplify.default.configure(config);

// creates Client instance
const client: any = new Discord.Client();

// Integrate music to Client instance
client.music = require("discord.js-musicbot-addon");

// Guild prefix list state
const globalPrefix: GPObject = {};
// Custom commands list state
let customCommands = [];
// Plugins list state
let plugins = [];

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

      await updateGuild(guildData.getGuildBot);
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

    updateListener();
  } catch (err) {
    console.log("Error on client ready", err);
    Sentry.captureException(err);
  }
});

client.music.start(client, {
  // Set the api key used for YouTube.
  // This is required to run the bot.
  youtubeKey: process.env.YOUTUBE_API_KEY,
  help: {
    exclude: true,
  },
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

    const symbol: string = globalPrefix[msg.guild.id];

    if (msg.content.substring(0, 1) === symbol) {
      const args: string[] = msg.content.substring(1).split(" ");
      const cmd: string = args[0];
      const suffix: string = args.splice(1).join(" ");

      const { data } = await Amplify.API.graphql(
        Amplify.graphqlOperation(getGuildBotTree, {
          id: msg.guild.id,
        })
      );

      customCommands = [...data.getGuildBot.commands.items];

      plugins = [...data.getGuildBot.plugins.items];

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
              return;
            });

            const musicPlugin = plugins.find(
              pluginC => pluginC.name === "music"
            );

            const action = musicPlugin.commands.items.find(
              command => command.cmd === cmd
            );

            if (action) {
              client.music.bot.commands.set(action.name, {
                ...client.music.bot.commands.get(action.name),
                enabled: musicPlugin.enabled,
              });
            }

            if (musicPlugin && musicPlugin.enabled) {
              if (action) {
                switch (action.name) {
                  case "play":
                    client.music.bot.playFunction(msg, suffix); // PLAY command.
                    break;
                  case "queue":
                    client.music.bot.queueFunction(msg, suffix); // QUEUE command.
                    break;
                  case "np":
                    client.music.bot.npFunction(msg, suffix); // NOWPLAYING command.
                    break;
                  case "loop":
                    client.music.bot.loopFunction(msg, suffix); // LOOP command.
                    break;
                  case "skip":
                    client.music.bot.skipFunction(msg, suffix); // SKIP command.
                    break;
                  case "pause":
                    client.music.bot.pauseFunction(msg, suffix); // PAUSE command.
                    break;
                  case "resume":
                    client.music.bot.resumeFunction(msg, suffix); // RESUME command.
                    break;
                  case "clear":
                    client.music.bot.clearFunction(msg, suffix); // CLEARQUEUE command.
                    break;
                  case "leave":
                    client.music.bot.leaveFunction(msg, suffix); // LEAVE command.
                    break;
                  case "search":
                    client.music.bot.searchFunction(msg, suffix); // SEARCH command.
                    break;
                  case "volume":
                    client.music.bot.volumeFunction(msg, suffix); // VOLUME command.
                    break;
                  case "remove":
                    client.music.bot.removeFunction(msg, suffix); // REMOVE command.
                    break;
                  default:
                    msg.reply(
                      `Sorry! Can't understand what you are trying to do..`
                    );
                }
                return;
              }
            } else {
              msg.reply("Music feature is disabled.");
              return;
            }
          }
          return;
        }
      }
    }
    return;
  } catch (err) {
    console.log(`Error on message for guild ${msg.guild.id}`, err);
    Sentry.captureException(err);
  }
});

client.login(process.env.DISCORD_BOT_TOKEN);

function updateListener() {
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
  // =======
  // PLUGINS
  // =======
  Amplify.API.graphql(Amplify.graphqlOperation(onCreatePlugin)).subscribe({
    next: pluginData => {
      plugins = [...plugins, pluginData.value.data.onCreatePlugin];
      console.log(
        `New plugin added ${pluginData.value.data.onCreatePlugin.id}`
      );
    },
  });
  Amplify.API.graphql(Amplify.graphqlOperation(onUpdatePlugin)).subscribe({
    next: pluginData => {
      plugins = [...plugins, pluginData.value.data.onUpdatePlugin];
      console.log(`Plugin updated ${pluginData.value.data.onUpdatePlugin.id}`);
    },
  });
  Amplify.API.graphql(Amplify.graphqlOperation(onDeletePlugin)).subscribe({
    next: pluginData => {
      plugins = [...plugins, pluginData.value.data.onDeletePlugin];
      console.log(`Plugin deleted ${pluginData.value.data.onDeletePlugin.id}`);
    },
  });
  // =======
  // PLUGINSCOMMAND
  // =======
  Amplify.API.graphql(
    Amplify.graphqlOperation(onCreatePluginCommand)
  ).subscribe({
    next: pluginData => {
      plugins = [
        ...plugins,
        pluginData.value.data.onCreatePluginCommand.plugin,
      ];
      console.log(
        `New plugin command added ${pluginData.value.data.onCreatePluginCommand.id}`
      );
    },
  });
  Amplify.API.graphql(
    Amplify.graphqlOperation(onUpdatePluginCommand)
  ).subscribe({
    next: pluginData => {
      plugins = [
        ...plugins,
        pluginData.value.data.onUpdatePluginCommand.plugin,
      ];
      console.log(
        `Plugin command updated ${pluginData.value.data.onUpdatePluginCommand.id}`
      );
    },
  });
  Amplify.API.graphql(
    Amplify.graphqlOperation(onDeletePluginCommand)
  ).subscribe({
    next: pluginData => {
      plugins = [
        ...plugins,
        pluginData.value.data.onDeletePluginCommand.plugin,
      ];
      console.log(
        `Plugin command deleted ${pluginData.value.data.onDeletePluginCommand.id}`
      );
    },
  });
}
