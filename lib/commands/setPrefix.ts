import { guilds } from "../db/init";
import { Message } from "discord.js";

export default async function(
  reducer: string,
  value: string,
  msg: Message,
  globalPrefix: GPObject
) {
  try {
    if (!reducer || !value) {
      throw new Error("`Missing attribute. eg: >update prefix !`");
    }

    if (!reducer && !value) {
      msg.channel.send("`Missing attribute and value.`");
      throw new Error("`Missing attribute and value.`");
    }

    if (!value.match(/[$-/:-?{-~!"^_`\[\]]/g)) {
      throw new Error("`You can only set a symbol for the bot prefix`");
    }

    const prUpdate = await guilds.updateOne(
      { id: msg.guild.id },
      { $set: { prefix: value } }
    );
    if (prUpdate.result.nModified >= 1) {
      msg.channel.send(`Successfully set bot prefix to ${value}`);
      globalPrefix[msg.guild.id] = value;
    }
  } catch (e) {
    msg.channel.send(e.message);
  }
}
