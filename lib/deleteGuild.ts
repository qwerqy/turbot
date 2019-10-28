import * as Amplify from "aws-amplify";
import * as Sentry from "@sentry/node";
import * as Discord from "discord.js";
import {
  listCommands,
  deleteCommand,
  deleteGuildBot,
  listPluginSettings,
  listPluginCommands,
  listPlugins,
  deletePluginSetting,
  deletePluginCommand,
  deletePlugin,
} from "./graphql";

async function deleteGuild(guild: Discord.Guild | IGuildBot) {
  try {
    const [
      allCommands,
      allPlugins,
      allPluginCommands,
      allPluginSettings,
    ] = await Promise.all([
      await Amplify.API.graphql(
        Amplify.graphqlOperation(listCommands, { limit: 1000 })
      ),
      await Amplify.API.graphql(
        Amplify.graphqlOperation(listPlugins, { limit: 1000 })
      ),
      await Amplify.API.graphql(
        Amplify.graphqlOperation(listPluginCommands, { limit: 1000 })
      ),
      await Amplify.API.graphql(
        Amplify.graphqlOperation(listPluginSettings, { limit: 1000 })
      ),
    ]);

    const selectedPlugins = allPlugins.data.listPlugins.items.filter(
      plugin => plugin.guildBot.id === guild.id
    );

    const [deletePlugins, deleteCommands] = await Promise.all([
      // Delete all plugins related to GuildBot
      selectedPlugins.map(async plugin => {
        const selectedPluginCommands = allPluginCommands.data.listPluginCommands.items.filter(
          pCommand => pCommand.plugin.id === plugin.id
        );

        const selectedPluginSettings = allPluginSettings.data.listPluginSettings.items.filter(
          setting => setting.plugin.id === plugin.id
        );

        const [
          pluginCommandsDeleted,
          pluginSettingsDeleted,
        ] = await Promise.all([
          // Delete all plugin commands
          selectedPluginCommands.map(async pCommand => {
            await Amplify.API.graphql(
              Amplify.graphqlOperation(deletePluginCommand, {
                input: { id: pCommand.id },
              })
            );
          }),
          // Delete all plugin settings
          selectedPluginSettings.map(async pSetting => {
            await Amplify.API.graphql(
              Amplify.graphqlOperation(deletePluginSetting, {
                input: { id: pSetting.id },
              })
            );
          }),
        ]);

        if (pluginCommandsDeleted && pluginSettingsDeleted) {
          // Lastly, delete the plugin
          await Amplify.API.graphql(
            Amplify.graphqlOperation(deletePlugin, {
              input: { id: plugin.id },
            })
          );
        }
      }),
      // Delete all commands related to GuildBot
      allCommands.data.listCommands.items
        .filter((command: ICommand) => command.guildBot.id === guild.id)
        .map(async (command: ICommand) => {
          await Amplify.API.graphql(
            Amplify.graphqlOperation(deleteCommand, {
              input: { id: command.id },
            })
          );
        }),
    ]);

    if (deletePlugins && deleteCommands) {
      // Lastly, delete GuildBot
      await Amplify.API.graphql(
        Amplify.graphqlOperation(deleteGuildBot, { input: { id: guild.id } })
      );
      console.log(`Guild ${guild.id} removed from database.`);
    }
  } catch (err) {
    console.log("Error deleting guild: ", err);
    Sentry.captureException(err);
  }
}

export default deleteGuild;
