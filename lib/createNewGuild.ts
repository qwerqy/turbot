import * as Discord from "discord.js";
import * as Amplify from "aws-amplify";
import * as Sentry from "@sentry/node";
import {
  createGuildBot,
  createCommand,
  listGuildBots,
  createPlugin,
  createPluginCommand,
  createPluginSetting,
} from "./graphql";

async function createNewGuild(guild: Discord.Guild, globalPrefix: GPObject) {
  try {
    const newGuildBot = {
      id: guild.id,
      prefix: ">",
    };

    const newCommand = {
      commandGuildBotId: guild.id,
      cmd: "ping",
      message: "Pong!",
    };

    const newPlugin = {
      name: "music",
      enabled: true,
      pluginGuildBotId: guild.id,
    };

    // Add new guild
    await Amplify.API.graphql(
      Amplify.graphqlOperation(createGuildBot, { input: newGuildBot })
    );
    // Add new command under guild
    await Amplify.API.graphql(
      Amplify.graphqlOperation(createCommand, { input: newCommand })
    );

    const { data: newPluginData } = await Amplify.API.graphql(
      Amplify.graphqlOperation(createPlugin, { input: newPlugin })
    );

    const newPluginCommandsList = [
      {
        name: "play",
        pluginCommandPluginId: newPluginData.createPlugin.id,
        cmd: "play",
      },
      {
        name: "search",
        pluginCommandPluginId: newPluginData.createPlugin.id,
        cmd: "search",
      },
      {
        name: "loop",
        pluginCommandPluginId: newPluginData.createPlugin.id,
        cmd: "loop",
      },
      {
        name: "skip",
        pluginCommandPluginId: newPluginData.createPlugin.id,
        cmd: "skip",
      },
      {
        name: "queue",
        pluginCommandPluginId: newPluginData.createPlugin.id,
        cmd: "queue",
      },
      {
        name: "pause",
        pluginCommandPluginId: newPluginData.createPlugin.id,
        cmd: "pause",
      },
      {
        name: "resume",
        pluginCommandPluginId: newPluginData.createPlugin.id,
        cmd: "resume",
      },
      {
        name: "volume",
        pluginCommandPluginId: newPluginData.createPlugin.id,
        cmd: "volume",
      },
      {
        name: "leave",
        pluginCommandPluginId: newPluginData.createPlugin.id,
        cmd: "leave",
      },
      {
        name: "clearqueue",
        pluginCommandPluginId: newPluginData.createPlugin.id,
        cmd: "clearqueue",
      },
      {
        name: "np",
        pluginCommandPluginId: newPluginData.createPlugin.id,
        cmd: "np",
      },
    ];

    const newPluginSettingsList = [
      {
        pluginSettingPluginId: newPluginData.createPlugin.id,
        name: "anyoneCanSkip",
        enabled: true,
      },
      {
        pluginSettingPluginId: newPluginData.createPlugin.id,
        name: "anyoneCanAdjust",
        enabled: true,
      },
      {
        pluginSettingPluginId: newPluginData.createPlugin.id,
        name: "ownerOverMember",
        enabled: true,
      },
    ];

    await Promise.all(
      newPluginCommandsList.map(async newPluginCommand => {
        await Amplify.API.graphql(
          Amplify.graphqlOperation(createPluginCommand, {
            input: newPluginCommand,
          })
        );
      })
    );

    await Promise.all(
      newPluginSettingsList.map(async newPluginSetting => {
        await Amplify.API.graphql(
          Amplify.graphqlOperation(createPluginSetting, {
            input: newPluginSetting,
          })
        );
      })
    );

    const { data } = await Amplify.API.graphql(
      Amplify.graphqlOperation(listGuildBots)
    );
    data.listGuildBots.items.map((guildBot: IGuildBot) => {
      // Set Global Prefix
      globalPrefix[guildBot.id] = guildBot.prefix;
    });
    console.log(`Initial command set for guild ${guild.id}`);
  } catch (err) {
    console.log(`Error adding to guild ${guild.id}`, err);
    Sentry.captureException(err);
  }
}

export default createNewGuild;
