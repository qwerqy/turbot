import { getRandom } from './lib/utilities'
import fetch from 'node-fetch'
import Cleverbot = require('cleverbot.io')
import Discord = require('discord.js')
import helpCommands from './assets/help'
require('dotenv').config()
const isDevMode = process.env.NODE_ENV !== 'production'
const botId = isDevMode ? 546301684192641024 : 546239335238860827

declare module 'discord.js' {
  interface Client {
    music: any
  }
}

// creates Client instance
const client = new Discord.Client()
const cleverClient = new Cleverbot(
  process.env.CLEVERBOT_USER,
  process.env.CLEVERBOT_KEY
)

// Music Player logic
client.music = require('discord.js-musicbot-addon')

client.on('ready', () => {
  console.log(`
  Bot is in ${process.env.NODE_ENV} mode.
  Logged in as ${client.user.tag}!
  `)
  client.user.setActivity(
    isDevMode
      ? `>[DEV MODE] | ${[...client.guilds].length} servers`
      : `>help for commands. | Beta Build | ${
          [...client.guilds].length
        } servers`
  )
})

client.music.start(client, {
  youtubeKey: process.env.YOUTUBE_API,
  play: {
    usage: '{{prefix}}play some tunes',
    exclude: false
  },
  anyoneCanSkip: true,
  ownerOverMember: true,
  ownerID: process.env.OWNER_ID,
  cooldown: {
    enabled: false
  }
})

client.on('message', async msg => {
  if (msg.author.bot) return
  if (
    isDevMode &&
    msg.guild.id !== '541382645670608906' &&
    msg.author.id !== '533610248142061579'
  )
    return
  cleverClient.setNick(`${msg.guild.id}`)

  if (
    msg.content.toLowerCase().includes('cheese') ||
    msg.content.toLowerCase().includes('<@546239335238860827>')
  ) {
    const _msg = msg.content.replace('cheese', '').replace(`<@${botId}>`, '')
    console.log(_msg)
    msg.channel.startTyping()
    cleverClient.create(function(err, session) {
      if (err) throw new Error(err)
      cleverClient.ask(_msg, function(err, response) {
        if (err) throw new Error(err)
        if (response) {
          msg.channel.stopTyping()
          msg.reply(response)
        }
      })
    })
  }

  const symbol = process.env.NODE_ENV !== 'production' ? '<' : '>'

  // Sets commands that start with '>'
  if (msg.content.substring(0, 1) === symbol) {
    const musicBot = client.music.bot
    const args = msg.content.substring(1).split(' ')
    const cmd = args[0]
    const suffix = args.splice(1).join(' ')
    const user = msg.author.username

    switch (cmd) {
      case 'status':
        const helpEmbed = new Discord.RichEmbed({
          color: 0xffff00,
          fields: [
            {
              name: 'Status:',
              value: client.status === 0 ? 'Online' : 'Internal Error'
            },
            {
              name: 'Uptime:',
              value: `${client.uptime}`
            },
            {
              name: 'Presence:',
              value: `Cheese is in ${[...client.guilds].length} server${
                [...client.guilds].length <= 1 ? '' : 's'
              }`
            }
          ]
        })
        msg.channel.send(helpEmbed)
        break
      case 'help':
        const embed = new Discord.RichEmbed({
          title: 'Need Help?',
          color: 0x00ff000,
          description: 'Commands:',
          fields: helpCommands
        })
        console.log(`${user} help`)
        msg.channel.send(embed)
        break
      case 'meme': {
        if (suffix !== '') {
          const res = await fetch(
            `https://api.tenor.com/v1/search?key=${
              process.env.TENOR_API
            }&q=${suffix}&locale=en_US`
          )
          const list = await res.json()
          const media = list.results[getRandom(list.results.length)].media
          const gif = media[0].tinygif.url
          msg.channel.send(
            new Discord.RichEmbed({
              image: {
                url: gif
              },
              footer: {
                text: `Requested by ${msg.author.username}`
              }
            })
          )
        } else {
          msg.reply('Key in your search query sir.')
        }
        break
      }
      // case 'imgur':
      //   const query = args.join('-')
      //   // Fetch image from Imgur API
      //   const options = {
      //     method: 'GET',
      //     headers: {
      //       'Postman-Token': process.env.POSTMAN_TOKEN,
      //       'cache-control': 'no-cache',
      //       Authorization: `Client-ID ${process.env.IMGUR_CLIENT_ID}`
      //     }
      //   }

      //   try {
      //     const req = await fetch(
      //       `https://api.imgur.com/3/gallery/search/?q=${query}`,
      //       options
      //     )
      //     const res = await req.json()

      //     const _data = res.data[getRandom(res.data.length)]
      //     const _gif = _data.images[getRandom(_data.images.length)].link
      //     const parsedGif = new Discord.Attachment(_gif)
      //     console.log(`${user} imgur: `, suffix)
      //     msg.reply(parsedGif)
      //   } catch (err) {
      //     console.log('Error occured: ', err)
      //     msg.channel.send(
      //       new Discord.RichEmbed({
      //         title: 'Your search returned empty!',
      //         description: 'eg. !imgur <your search>'
      //       })
      //     )
      //   }
      //   break
      case 'queue':
      case 'q':
        musicBot.queueFunction(msg, suffix)
        console.log(`${user} queue: `, suffix)
        break
      case 'np':
        musicBot.npFunction(msg, suffix)
        console.log(`${user} now playing: `, suffix)
        break
      case 'loop':
      case 'repeat':
        musicBot.loopFunction(msg, suffix)
        console.log(`${user} loop/repeat: `, suffix)
        break
      case 'skip':
        musicBot.skipFunction(msg, suffix)
        console.log(`${user} skip: `, suffix)
        break
      case 'pause':
        musicBot.pauseFunction(msg, suffix)
        console.log(`${user} pause: `, suffix)
        break
      case 'resume':
        musicBot.resumeFunction(msg, suffix)
        console.log(`${user} resume: `, suffix)
        break
      case 'clear':
        musicBot.clearFunction(msg, suffix)
        console.log(`${user} clear: `, suffix)
        break
      case 'leave':
      case 'bye':
        musicBot.leaveFunction(msg, suffix)
        console.log(`${user} leave: `, suffix)
        break
      case 'p':
      case 'play':
        try {
          if (suffix.includes('http') && suffix.includes('com')) {
            musicBot.playFunction(msg, suffix)
          } else {
            musicBot.searchFunction(msg, suffix)
          }
          console.log(`${user} search/play: `, suffix)
        } catch (err) {
          console.log(`${user} search/play err: `, err)
        }
        break
      case 'v':
      case 'volume':
        musicBot.volumeFunction(msg, suffix)
        console.log(`${user} volume: `, suffix)
        break
      case 'rm':
      case 'remove':
        musicBot.removeFunction(msg, suffix)
        console.log(`${user} remove: `, suffix)
        break
    }
  }
})

client.login(
  isDevMode ? process.env.DISCORD_DEV_SECRET : process.env.DISCORD_SECRET
)
