const functions = require("../../handlers/functions");
const { MessageEmbed } = require("discord.js");
const config = require("../../botconfig/config.json");
const configEmbed = require("../../botconfig/embed.json")
const DeezerPublicApi = require('deezer-public-api');
let deezer = new DeezerPublicApi();
const ytsr = require("youtube-sr")
var { getData, getPreview } = require("spotify-url-info");

module.exports = {
    name: "play",
    category: "Music",
    aliases: ["p"],
    cooldown: 2,
    usage: `${config.prefix}play`,
    description: "Sử dụng BOT chơi nhạc",
    run: async (client, message, args, user, text, prefix) => {
      if (!message.member.voice.channel) return functions.embedbuilder(client, 3000, message, configEmbed.colors.decline, "`" + message.author.tag + "`"  + "\`Anh/Chị phải tham gia một kênh đàm thoại để em phục vụ văn nghệ\`")
        if(!args[0]) return functions.embedbuilder(client, 5000, message, configEmbed.colors.decline, "`" + message.author.tag + "`"  + "\`Vui lòng thêm một cái gì đó mà bạn muốn tìm kiếm\`")
        // if (client.distube.isPlaying(message) && message.member.voice.channel.id !== message.member.guild.me.voice.channel.id) return functions.embedbuilder(client, 5000, message, configEmbed.colors.decline, "`" + message.author.tag + "`"  + "  Vào kênh Voice chat của tôi để quẫy nào: " + ` \`${message.member.guild.me.voice.channel.name ? message.member.guild.me.voice.channel.name : ""}\``)
        functions.embedbuilder(client, 2000, message, configEmbed.colors.accepted, `Đang tìm bài hát`, "```" + args.join(" ") + "```")
        if(args.join(" ").includes("deezer")){
          let track = args.join(" ").split("/")
  
          track = track[track.length-1]
          deezer.playlist.tracks(track).then(async function(result) {
            let items = result.data;
            let songsarray = [];
            let tracklength = items.length;
            functions.embedbuilder(client, 2000, message, configEmbed.colors.accepte, `${emoji.Youtube} \`Đang tìm kiếm các bài hát:\`` + tracklength/2 + " giây");
            for(let i = 0; i < items.length; i++){
                let songInfo = await ytsr.searchOne(items[i].title) ;
                songsarray.push(songInfo.url)
            }
            console.log(songsarray)
            client.distube.playCustomPlaylist(message, songsarray, { name: message.author.username + "'s Deezer Playlist" });
          });
        }
        else if(args.join(" ").includes("track") && args.join(" ").includes("open.spotify")){
          let info = await getPreview(args.join(" "));
          return client.distube.play(message, info.artist + " " + info.title);
        }
        else  if(args.join(" ").includes("playlist") && args.join(" ").includes("open.spotify")){
          let info = await getData(args.join(" "));
          let items = info.tracks.items;
          let songsarray = [];
          let tracklength = items.length;
          if(tracklength > 25) 
          {
              message.reply(` Số lượng bài có thể phát tối đa là 25 bài, Nếu có vấn đề gì khác liên hệ JarC`); 
              tracklength = 25;
          }
          functions.embedbuilder(client, 5000, message, configEmbed.colors.accepted, "Đang tìm kiếm bài hát", "Vui lòng chờ trong: " + tracklength/2 + " giây");
          for(let i = 0; i < items.length; i++){
              let songInfo = await ytsr.searchOne(items[i].track.name) ;
              songsarray.push(songInfo.url)
          }
          client.distube.playCustomPlaylist(message, songsarray, { name: message.author.username + "'s Spotify Playlist" });
        }
        else{
          return client.distube.play(message, args.join(" "));
        }
      }
}
