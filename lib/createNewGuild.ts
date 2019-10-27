import * as Discord from "discord.js";
import * as Amplify from "aws-amplify";
import * as Sentry from "@sentry/node";
import { createGuildBot, createCommand, listGuildBots } from "./graphql";

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
