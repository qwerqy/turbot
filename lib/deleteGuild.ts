import * as Amplify from "aws-amplify";
import * as Sentry from "@sentry/node";
import * as Discord from "discord.js";
import { listCommands, deleteCommand, deleteGuildBot } from "./graphql";

async function deleteGuild(guild: Discord.Guild | IGuildBot) {
  try {
    const allCommands = await Amplify.API.graphql(
      Amplify.graphqlOperation(listCommands)
    );
    allCommands.data.listCommands.items
      .filter((command: ICommand) => command.guildBot.id === guild.id)
      .map(async (command: ICommand) => {
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
    Sentry.captureException(err);
  }
}

export default deleteGuild;
