//Importing all needed Commands
const Discord = require("discord.js"); //this is the official discord.js wrapper for the Discord Api, which we use!
const colors = require("colors"); //this Package is used, to change the colors of our Console! (optional and doesnt effect performance)
const fs = require("fs"); //this package is for reading files and getting their inputs
const DisTube = require("distube") //  This package is for calling library Distube for using to streaming music.
const config = require("./botconfig/config.json");
const functions = require("./handlers/functions");
const configEmbed = require("./botconfig/embed.json");


//Creating the Discord.js Client for This Bot with some default settings ;) and with partials, so you can fetch OLD messages
const client = new Discord.Client({
  intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES, 'GUILD_VOICE_STATES','GUILD_MESSAGE_REACTIONS'],
  messageCacheLifetime: 60,
  fetchAllMembers: false,
  messageCacheMaxSize: 10,
  restTimeOffset: 0,
  restWsBridgetimeout: 100,
  disableEveryone: true,
  partials: ['MESSAGE', 'CHANNEL', 'REACTION']
});
// emoji
client.emotes = config.emoji;
// Distube
client.distube = new DisTube(client, {
    searchSongs: 1,
    emitNewSongOnly: true,
    highWaterMark: 1024*1024*64,
    emptyCooldown: 0,
    leaveOnEmpty: true,
    leaveOnFinish: true,
    leaveOnStop: true,
    youtubeDL: true,
    updateYouTubeDL: false,
})
// const status = queue => `Âm lượng: \`${queue.volume}%\` | Filter: \`${queue.filters.join(", ") || "Off"}\` | Loop: \`${queue.repeatMode ? queue.repeatMode === 2 ? "All Queue" : "This Song" : "Off"}\` | Autoplay: \`${queue.autoplay ? "On" : "Off"}\``
// const status = queue => `Âm lượng: \`${queue.volume}%\` | Loop: \`${queue.repeatMode ? queue.repeatMode === 2 ? "All Queue" : "This Song" : "Off"} \``
// client.distube
//     .on("playSong", (queue, song) => queue.textChannel.send(
//         `${client.emotes.play} | Playing \`${song.name}\` - \`${song.formattedDuration}\`\nphát bởi: ${song.user}\n${status(queue)}`
//     ))
//     .on("addSong", (queue, song) => queue.textChannel.send(
//         `${client.emotes.success} | Đã thêm ${song.name} - \`${song.formattedDuration}\` vào danh sách chờ bởi ${song.user}`
//     ))
//     .on("addList", (queue, playlist) => queue.textChannel.send(
//         `${client.emotes.success} | Đã thêm \`${playlist.name}\` danh sách (${playlist.songs.length} bài hát) vào danh sách\n${status(queue)}`
//     ))
//     // DisTubeOptions.searchSongs = true
//     .on("searchResult", (message, result) => {
//         let i = 0
//         message.channel.send(`**Choose an option from below**\n${result.map(song => `**${++i}**. ${song.name} - \`${song.formattedDuration}\``).join("\n")}\n*Enter anything else or wait 60 seconds to cancel*`)
//     })
//     // DisTubeOptions.searchSongs = true
//     .on("searchCancel", message => message.channel.send(`${client.emotes.error} | Searching canceled`))
//     .on("error", (channel, e) => {
//         channel.send(`${client.emotes.error} | An error encountered: ${e}`)
//         console.error(e)
//     })
//     .on("empty", channel => channel.send("Voice channel is empty! Leaving the channel..."))
//     .on("searchNoResult", message => message.channel.send(`${client.emotes.error} | Không tìm thấy kết quả!`))
//     .on("finish", queue => queue.textChannel.send("Đã phục vụ văn nghệ xong rồi! Em xin cáo lui!"))


// Creaing emap
const Enmap = require("enmap");
client.settings = new Enmap({ name: "settings", dataDir: "./databases/settings" }); 
client.setups = new Enmap({ name: "setups", dataDir: "./databases/setups" }); 
client.infos = new Enmap({ name: "infos", dataDir: "./databases/infos" }); 
client.custom = new Enmap({ name: "custom", dataDir: "./databases/playlist" }); 
client.custom2 = new Enmap({ name: "custom", dataDir: "./databases/playlist2" }); 
client.points = new Enmap({ name: "points", dataDir: "./databases/ranking" }); 
client.reactionrole = new Enmap({ name: "reactionrole", dataDir: "./databases/reactionrole" }); 
client.apply = new Enmap({ name: "apply", dataDir: "./databases/apply" })



//Client variables to use everywhere
client.commands = new Discord.Collection(); //an collection (like a digital map(database)) for all your commands
client.aliases = new Discord.Collection(); //an collection for all your command-aliases
client.categories = fs.readdirSync("./commands/"); //categories
client.cooldowns = new Discord.Collection(); //an collection for cooldown commands of each user

//Loading files, with the client variable like Command Handler, Event Handler, ...
["command", "events"].forEach(handler => {
    require(`./handlers/${handler}`)(client);
});
//login into the bot
client.login(require("./botconfig/config.json").token);

/** Template by Tomato#6966 | https://github.com/Tomato6966/Discord-Js-Handler-Template */
