import * as Amplify from "aws-amplify";
import * as Sentry from "@sentry/node";
import {
  createPlugin,
  createPluginCommand,
  createPluginSetting,
  listPlugins,
} from "./graphql";

async function updateGuild(guild) {
  const { data } = await Amplify.API.graphql(
    Amplify.graphqlOperation(listPlugins)
  );

  if (!data.listPlugins.items.find(plugin => plugin.guildBot.id === guild.id)) {
    try {
      const newPlugin = {
        name: "music",
        pluginGuildBotId: guild.id,
      };

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

      await Promise.all([
        newPluginCommandsList.map(async newPluginCommand => {
          await Amplify.API.graphql(
            Amplify.graphqlOperation(createPluginCommand, {
              input: newPluginCommand,
            })
          );
        }),
        newPluginSettingsList.map(async newPluginSetting => {
          await Amplify.API.graphql(
            Amplify.graphqlOperation(createPluginSetting, {
              input: newPluginSetting,
            })
          );
        }),
      ]);

      console.log(`Guild ${guild.id} updated with new plugins`);
    } catch (err) {
      console.log(`Error adding to guild ${guild.id}`, err);
      Sentry.captureException(err);
    }
  }
}

export default updateGuild;
