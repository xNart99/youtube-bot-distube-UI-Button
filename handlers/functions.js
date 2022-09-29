const Discord = require("discord.js")
const configEmbed = require("../botconfig/embed.json")
// module.exports.embedbuilder = embedbuilder;
// module.exports.errorbuilder = errorbuilder;
// module.exports.QueueEmbed = QueueEmbed;
// module.exports.customplaylistembed = customplaylistembed;
// module.exports.lyricsEmbed = lyricsEmbed;
// module.exports.playsongyes = playsongyes;
// module.exports.curembed = curembed;

module.exports = {
  //get a member lol
  getMember: function(message, toFind = "") {
    try{
      toFind = toFind.toLowerCase();
      let target = message.guild.members.get(toFind);
      if (!target && message.mentions.members) target = message.mentions.members.first();
      if (!target && toFind) {
        target = message.guild.members.find((member) => {
          return member.displayName.toLowerCase().includes(toFind) || member.user.tag.toLowerCase().includes(toFind);
        });
      }
      if (!target) target = message.member;
      return target;
    }catch (e){
      console.log(String(e.stack).bgRed)
    }
  },
  //changeging the duration from ms to a date
  duration: function(ms) {
      const sec = Math.floor((ms / 1000) % 60).toString();
      const min = Math.floor((ms / (60 * 1000)) % 60).toString();
      const hrs = Math.floor((ms / (60 * 60 * 1000)) % 60).toString();
      const days = Math.floor((ms / (24 * 60 * 60 * 1000)) % 60).toString();
      return `\`${days}Days\`,\`${hrs}Hours\`,\`${min}Minutes\`,\`${sec}Seconds\``;
  },
  //function for awaiting reactions
  promptMessage: async function(message, author, time, validReactions) {
    try{
      time *= 1000;
      for (const reaction of validReactions) await message.react(reaction);
      const filter = (reaction, user) => validReactions.includes(reaction.emoji.name) && user.id === author.id;
      return message.awaitReactions(filter, {
        max: 1,
        time: time
      }).then((collected) => collected.first() && collected.first().emoji.name);
    }catch (e){
      console.log(String(e.stack).bgRed)
    }
  },
  //Function to wait some time
  delay: function(delayInms) {
    try{
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(2);
        }, delayInms);
      });
    }catch (e){
      console.log(String(e.stack).bgRed)
    }
  },
  //randomnumber between 0 and x
  getRandomInt: function(max) {
    try{
      return Math.floor(Math.random() * Math.floor(max));
    }catch (e){
      console.log(String(e.stack).bgRed)
    }
  },
  //random number between y and x
  getRandomNum: function(min, max) {
    try{
      return Math.floor(Math.random() * Math.floor((max - min) + min));
    }catch (e){
      console.log(String(e.stack).bgRed)
    }
  },
  //function for creating a bar
  createBar: function(maxtime, currenttime, size = 25, line = "▬", slider = "🔶") {
    try{
      let bar = currenttime > maxtime ? [line.repeat(size / 2 * 2), (currenttime / maxtime) * 100] : [line.repeat(Math.round(size / 2 * (currenttime / maxtime))).replace(/.$/, slider) + line.repeat(size - Math.round(size * (currenttime / maxtime)) + 1), currenttime / maxtime];
      if (!String(bar).includes("🔶")) return `**[🔶${line.repeat(size - 1)}]**\n**00:00:00 / 00:00:00**`;
      return `**[${bar[0]}]**\n**${new Date(currenttime).toISOString().substr(11, 8)+" / "+(maxtime==0?" ◉ LIVE":new Date(maxtime).toISOString().substr(11, 8))}**`;
    }catch (e) {
      console.log(String(e.stack).bgRed)
    }
  },
  format: function(millis) {
    try{
      var h = Math.floor(millis / 3600000),
        m = Math.floor(millis / 60000),
        s = ((millis % 60000) / 1000).toFixed(0);
      if (h < 1) return (m < 10 ? "0" : "") + m + ":" + (s < 10 ? "0" : "") + s + " | " + (Math.floor(millis / 1000)) + " Seconds";
      else return (h < 10 ? "0" : "") + h + ":" + (m < 10 ? "0" : "") + m + ":" + (s < 10 ? "0" : "") + s + " | " + (Math.floor(millis / 1000)) + " Seconds";
    }catch (e){
      console.log(String(e.stack).bgRed)
    }
  },
  escapeRegex: function(str) {
    try{
      return str.replace(/[.*+?^${}()|[\]\\]/g, `\\$&`);
    }catch (e){
      console.log(String(e.stack).bgRed)
    }
  },
  arrayMove: function(array, from, to) {
    try{
      array = [...array];
      const startIndex = from < 0 ? array.length + from : from;
      if (startIndex >= 0 && startIndex < array.length) {
        const endIndex = to < 0 ? array.length + to : to;
        const [item] = array.splice(from, 1);
        array.splice(endIndex, 0, item);
      }
      return array;
    }catch (e){
      console.log(String(e.stack).bgRed)
    }
  },// Building Embed for return message
  embedbuilder: function embedbuilder(client, deletetime, message, color, title, description, thumbnail) {
    try{
      if(title.includes("filter") && title.inclues("Adding")){
        client.infos.set("global",Number(client.infos.get("global","filters"))+1, "filters");
      }
    }catch{}
    try{
      let embed = new Discord.MessageEmbed()
          .setColor(color)
          .setAuthor(message.author.tag, message.member.user.displayAvatarURL({
            dymatic: true
          }))
          .setFooter(client.user.username);
        if(title){
          embed.setTitle(title);
        }if(description){
          embed.setDescription(description);
        }if(thumbnail){
          embed.setThumbnail(thumbnail);
        }
        if(!deletetime || deletetime === undefined || deletetime === "null"){
          message.channel.send(embed)
            .then(msg => {
              try{
                if(msg.channel.type === "news"){
                  msg.crosspost()
                }
              }catch(err){
                console.log(err);
                errorbuilder(err.stack.toSTring().substr(0,2000))
              }
            })
            return;
        }return message.channel.send(embed).then(msg => msg.delete({
          timeout: deletetime
      }));
    }catch (error){
      this.embedbuilder(client,5000, message,"RED","ERROR: ","```"+ error.toString().substr(0,100)+"```"+"\n\n[Hãy thông báo lỗi cho Dev để fix lỗi]")
      this.errorbuilder(error.stack.toString().substr(0,2000));
  
    }
  }, //Creating errorbuilder function
  errorbuilder: function errorbuilder(error){
    console.log(error);
  },//Creating playing song embed
  playsongyes: async function playsongyes(client,message,queue,song){
    try{
        client.embed1 = new Discord.MessageEmbed()
          .setColor(configEmbed.colors.accepted)
          .setTitle(`Bắt đầu phát nhạc`)
          .setDescription(`Bài hát [${song.name}](${song.url})`)
          .addField(`Yêu cầu bởi:`,` ${song.user}`,true)
          .addField(`Thời lượng:`, ` \`${queue.formattedCurrentTime} / ${song.formattedDuration}\``, true)
          .addField(`Xếp hàng:`, ` \`${queue.songs.length} song(s) - ${queue.formattedDuration}\``, true)
          .addField(`Âm lượng:`, ` \`${queue.volume} %\``, true)
          .addField(`Vòng Lặp:`, ` ${queue.repeatMode ? queue.repeatMode === 2 ? "✅ Queue" : "✅ Song" : "❌"}`, true)
          .addField(`Tự chạy:`, ` ${queue.autoplay ? "✅" : "❌"}`, true)
          .addField(`Tải bài hát:`, ` [Bấm vào đây](${song.streamURL})`, true)
          .addField(`Bộ lọc:`, ` \`${queue.filter || "❌"}\``, true)
          .setFooter("Develop by JarC")
          .setAuthor(message.author.tag,message.member.user.displayAvatarURL({
            dymatic: true
          }))
          .setTimestamp(`https://img.youtube.com/vi/${song.id}/mqdefault.jpg`)
          //Creating clone Functiong to update the music Control panel
          playsongyes.updateMusicPanel= function(){
            playingMessage.edit(new Discord.MessageEmbed()
                .setColor(configEmbed.colors.accepted)
                .setTitle(`Bắt đầu phát nhạc`)
                .setDescription(`Bài hát [${song.name}](${song.url})`)
                .addField(`Yêu cầu bởi:`,` ${song.user}`,true)
                .addField(`Thời lượng:`, ` \`${queue.formattedCurrentTime} / ${song.formattedDuration}\``, true)
                .addField(`Xếp hàng:`, ` \`${queue.songs.length} song(s) - ${queue.formattedDuration}\``, true)
                .addField(`Âm lượng:`, ` \`${queue.volume} %\``, true)
                .addField(`Vòng Lặp:`, ` ${queue.repeatMode ? queue.repeatMode === 2 ? "✅ Queue" : "✅ Song" : "❌"}`, true)
                .addField(`Tự chạy:`, ` ${queue.autoplay ? "✅" : "❌"}`, true)
                .addField(`Tải bài hát:`, ` [Bấm vào đây](${song.streamURL})`, true)
                .addField(`Bộ lọc:`, ` \`${queue.filter || "❌"}\``, true)
                .setFooter("Dev by JarC")
                .setAuthor(message.author.tag,message.member.user.displayAvatarURL({
                  dymatic: true
                }))
                .setTimestamp(`https://img.youtube.com/vi/${song.id}/mqdefault.jpg`))
          }
          // end of Function
          var playingMessage = await message.channel.send(client.embed1)
  
          client.settings.set(message.guild.id, playingMessage.id, "playingembed")
          client.settings.set(message.guild.id, message.channel.id, "playingchannel")
          
          try {
            await playingMessage.react("⏭");
            await playingMessage.react("⏹");
            await playingMessage.react("🔉");
            await playingMessage.react("🔊");
            await playingMessage.react("⬅️");
            await playingMessage.react("➡️");
            await playingMessage.react("🔃");
        } catch (error) {
            embedbuilder(client, 5000, message, configEmbed.colors.decline, "ERROR: ", "```" + error.toString().substr(0, 100) + "```" + "\n\n[Hãy thông báo lỗi cho Dev để fix lỗi]")
            this.errorbuilder(error.stack.toString().substr(0, 2000))
            console.log(error);
        }
  
        const filter = (reaction, user) => ["⏭", "⏹", "🔉", "🔊", "⬅️", "➡️","🔃"].includes(reaction.emoji.id || reaction.emoji.name) && user.id !== message.client.user.id;
        var collector = await playingMessage.createReactionCollector(filter, {
          time: song.duration > 0 ? song.duration * 1000 : 600000
        });

        collector.on("collect", async (reaction, user) => {
          if (!queue) return;
  
          const member = reaction.message.guild.member(user);
  
          reaction.users.remove(user);
  
          if (!member.voice.channel) return embedbuilder(client, 3000, message, configEmbed.colors.decline, "`" + message.author.tag + "`" + " Bạn phải tham gia Kênh voice nào đó")
  
          if (member.voice.channel.id !== member.guild.me.voice.channel.id) return embedbuilder(client, 3000, message, config.colors.no, "`" + message.author.tag + "`" + " Bạn phải tham gia Kênh voice của tôi")
  
          switch (reaction.emoji.id || reaction.emoji.name) {
              case "⏭":
                
                
                    try {
                        playingMessage.reactions.removeAll();
                    } catch {}
                   
                    try {
                      await playingMessage.delete({
                        timeout: client.ws.ping
                    });
                    } catch {}
                    client.distube.skip(message);
                    break;
              case "⏹":
                  client.distube.stop(message);
                  try {
                      await playingMessage.reactions.removeAll();
                  } catch {}
                  try {
                      await playingMessage.delete({
                          timeout: client.ws.ping
                      });
                      // playingMessage.edit("Chờ được xóa").then(msg => msg.delete({ timeout: 5000 })).catch(console.error);

                      // playingMessage.edit(new Discord.MessageEmbed().setColor(configEmbed.colors.accepted).setTitle("Thông báo").setDescription("Chương trình văn nghệ đến đây là kết thúc em xin cáo từ ạ"));
                  } catch {}
                  //this.embedbuilder(client, 3000, message, configEmbed.colors.decline, "Thông báo", `Em đã phục vụ văn nghệ xong rồi! em xin cáo từ`,"https://images.saymedia-content.com/.image/t_share/MTc4NzcyMTMzODg1NzgxNTEx/10-reasons-why-i-love-music.jpg")
                  break;
  
              case "🔉":
                  await client.distube.setVolume(message, Number(queue.volume) - 10);
                  // this.embedbuilder(client, 1000, message, configEmbed.colors.accepted, "Thông báo", `\`Em vừa giảm âm lượng xuống: ${queue.volume}\``)
                  playsongyes.updateMusicPanel();
                  break;
  
              case "🔊":
                  await client.distube.setVolume(message, Number(queue.volume) + 10);
                  // this.embedbuilder(client, 1000, message, configEmbed.colors.accepted, "Thông báo", `\`Em vừa tăng âm lượng lên: ${queue.volume}\``)
                  playsongyes.updateMusicPanel();
                  break;
  
              case "⬅️":
                  let seektime = queue.currentTime - 10000;
                  if (seektime < 0) seektime = 0;
                  await client.distube.seek(message, Number(seektime));
  
                  this.embedbuilder(client, 1000, message, configEmbed.colors.accepted, "Thông báo", `\`Em vừa tua ngược lại 10 giây của bài hát\``)
                  playsongyes.updateMusicPanel();
                  break;
  
              case "➡️":
                  let seektime2 = queue.currentTime + 10000;
                  if (seektime2 >= queue.songs[0].duration * 1000) {
                      seektime2 = queue.songs[0].duration * 1000 - 1;
                  }
                  await client.distube.seek(message, seektime2);
  
                  this.embedbuilder(client, 1000, message, configEmbed.colors.accepted, "Thông báo", `\`Em vừa tua tới 10 giây của bài hát\``)
                  playsongyes.updateMusicPanel();
                  break;
              case "🔃":
                playsongyes.updateMusicPanel();
                  break;
              default:
                  break;
          }
      });
      collector.on("end", () => {
          playingMessage.reactions.removeAll();
          playingMessage.delete({
              timeout: client.ws.ping
          });
      })
  
    }catch(error){
      console.log(error);
      this.embedbuilder(client, 5000, message, configEmbed.colors.decline, "ERROR: ", "```" + error.toString().substr(0, 100) + "```" + "\n\n[Hãy thông báo lỗi cho Dev để fix lỗi]")
      this.errorbuilder(error.stack.toString().substr(0, 2000));
    }
  },//Creating queue embed
  QueueEmbed: function QueueEmbed(client,queue){
    try{
      let embeds = [];
      let k = 10;
      for(let i = 0; i < queue.songs.length ;i+= 10){
        let qus = queue.songs;
        const current = qus.slice(i,k);
        let j = i;
        k += 10;
        const info = current.map((track) => `**${j++} -** [${track.name}](${track.url}) - ${track.formattedDuration}`).join("\n");
        const embed = new Discord.MessageEmbed()
              .setTitle("Hàng chờ")
              .setColor(configEmbed.colors.accepted)
              .setDescription(`**Bài hát hiện tại - [${qus[0].name}](${qus[0].url})**\n\n${info}`)
              .setFooter(client.user.username)
        embeds.push(embed)
      }
      return embeds;
    }catch(error){
      console.log(error);
      // errorbuilder(error.stack.toSTring().substr(0,2000))
    }
  },// Creating Custom Playlist Embed
  customplaylistembed: function customplaylistembed(client, message, lyrics, song) {
    if (!lyrics) lyrics = "Không có bài hát nào trong danh sách phát!";
    try {
        let embeds = [];
        let k = 1000;
        for (let i = 0; i < lyrics.length; i += 1000) {
            const current = lyrics.slice(i, k);
            k += 1000;
            const embed = new Discord.MessageEmbed()
                .setTitle("Custom Playlist")
                .setColor(configEmbed.colors.accepted)
                .setDescription(current)
            embeds.push(embed);
        }
        return embeds;
    } catch (error) {
        console.log(error)
        embedbuilder(client,5000, message,"RED","ERROR: ","```"+ error.toString().substr(0,100)+"```"+"\n\n[Hãy thông báo lỗi cho Dev để fix lỗi]")
        errorbuilder(error.stack.toString().substr(0, 2000))
    }
  },// Creating Lyrics embed
  lyricsEmbed: function lyricsEmbed(client, message, lyrics, song) {
    try {
        let embeds = [];
        let k = 1000;
        for (let i = 0; i < lyrics.length; i += 1000) {
            const current = lyrics.slice(i, k);
            k += 1000;
            const embed = new Discord.MessageEmbed()
                .setTitle("Lyrics - " + song.name)
                .setURL(song.url)
                .setThumbnail(song.thumbnail)
                .setColor(configEmbed.colors.accepted)
                .setDescription(current)
            embeds.push(embed);
        }
        return embeds;
    } catch (error) {
        console.log(error)
        embedbuilder(client,5000, message,"RED","ERROR: ","```"+ error.toString().substr(0,100)+"```"+"\n\n[Hãy thông báo lỗi cho Dev để fix lỗi]")
        errorbuilder(error.stack.toString().substr(0, 2000))
    }
  },//Creating current embed
  curembed: function curembed(client,message){
    try {
      let queue = client.distube.getQueue(message);
      let song = queue.songs[0];
      embed = new Discord.MessageEmbed()
          .setColor(config.colors.yes)
          .setTitle(`Bắt đầu phát nhạc`)
          .setDescription(`Bài hát: [${song.name}](${song.url})`)
          .addField(`Yêu cầu bởi:`, `>>> ${song.user}`, true)
          .addField(`Thời lượng:`, `>>> \`${queue.formattedCurrentTime} / ${song.formattedDuration}\``, true)
          .addField(`Xếp hàng:`, `>>> \`${queue.songs.length} song(s) - ${queue.formattedDuration}\``, true)
          .addField(`Âm lượng:`, `>>> \`${queue.volume} %\``, true)
          .addField(`Vòng Lặp:`, `>>> ${queue.repeatMode ? queue.repeatMode === 2 ? "✅ Queue" : "✅ Song" : "❌"}`, true)
          .addField(`Tự chạy:`, `>>> ${queue.autoplay ? "✅" : "❌"}`, true)
          .addField(`Bộ lọc:`, `>>> \`${queue.filter || "❌"}\``, true)
          .setFooter("Dev by JarC")
          .setAuthor(message.author.tag,message.member.user.displayAvatarURL({
            dymatic: true
          }))
          .setThumbnail(song.thumbnail)
      return embed;
    } catch (error) {
      console.log(error)
      embedbuilder(client, 5000, message, configEmbed.colors.decline, "ERROR: ", "```" + error.toString().substr(0, 100) + "```" + "\n\n[Hãy thông báo lỗi cho Dev để fix lỗi]")
      errorbuilder(error.stack.toString().substr(0, 2000))
    }
  }

}













