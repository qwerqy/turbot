import Discord = require("discord.js");
import fetch from "node-fetch";
import helpCommands from "../assets/help";
import { getRandom } from "./utilities";
import moment from "moment";

export const createStatusEmbed = (client: any) => {
  return new Discord.RichEmbed({
    color: 0xffff00,
    fields: [
      {
        name: "Status:",
        value: client.status === 0 ? "Online" : "Internal Error",
      },
      {
        name: "Version:",
        value: `${process.env.TURBOT_VERSION}`,
      },
      {
        name: "Presence:",
        value: `Turbot is in ${[...client.guilds].length} server${
          [...client.guilds].length <= 1 ? "" : "s"
        }`,
      },
    ],
  });
};

export const createHelpEmbed = () => {
  return new Discord.RichEmbed({
    title: "Hello I am Turbot, a Discord bot created by Qwerqy",
    color: 0x00ff000,
    description: "Commands:",
    fields: helpCommands,
  });
};

export const createMemeEmbed = async (suffix: string, msg: any) => {
  const fetchMeme = async () => {
    const res = await fetch(
      `https://api.tenor.com/v1/search?key=${process.env.TENOR_API_KEY}&q=${suffix}&locale=en_US`
    );
    const list = await res.json();
    const media = list.results[getRandom(list.results.length)].media;
    const gif = media[0].tinygif.url;
    return gif;
  };

  return new Discord.RichEmbed({
    image: {
      url: await fetchMeme(),
    },
    footer: {
      text: `Requested by ${msg.author.username}`,
    },
  });
};
