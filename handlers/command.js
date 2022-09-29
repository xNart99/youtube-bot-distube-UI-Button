const { ReactionUserManager } = require("discord.js");
const { readdirSync } = require("fs");
const functions = require("../handlers/functions");
const ascii = require("ascii-table");
const { id } = require("common-tags");
const configEmbed = require("../botconfig/embed.json");
let table = new ascii("Commands");
table.setHeading("Command", "Load status");
module.exports = (client) => {
  try{
    readdirSync("./commands/").forEach((dir) => {
        const commands = readdirSync(`./commands/${dir}/`).filter((file) => file.endsWith(".js"));
        for (let file of commands) {
            let pull = require(`../commands/${dir}/${file}`);
            if (pull.name) {
                client.commands.set(pull.name, pull);
                table.addRow(file, "Ready");
            } else {
                table.addRow(file, `error->missing a help.name,or help.name is not a string.`);
                continue;
            }
            if (pull.aliases && Array.isArray(pull.aliases)) pull.aliases.forEach((alias) => client.aliases.set(alias, pull.name));
        }
    });
    console.log(table.toString().cyan);
  }catch (e){
    console.log(String(e.stack).bgRed)
  }

  const guildonlycounter = new Map();
    client.on("ready", () => {
        console.log(`${client.user.username} đã sẵn sàng hoạt động`.brightYellow);
        setInterval(() => {
            client.guilds.cache.forEach(async guild => {
                await functions.delay(client.ws.ping);
                let member = await client.guilds.cache.get(guild.id).members.cache.get(client.user.id)
                if(!member) return;
                if(!member.voice) return;
                if (!member.voice.channel)
                    return;
                if(member.voice.channel.id === "738019409527963682") return;
                if (member.voice.channel.members.size === 1) {if (!guildonlycounter.has(guild.id)) return guildonlycounter.set(guild.id);
                    try { guildonlycounter.delete(guild.id);return member.voice.channel.leave();} catch {}  }
            });
        }, (30 * 1000));
    });

    client.distube
    .on("playSong", async (message, queue, song) => {
        client.infos.set("global", Number(client.infos.get("global", "songs")) + 1, "songs");

       try{queue.connection.voice.setDeaf(true);}catch (error) {
        console.error(error)
        functions.embedbuilder(client, 5000, message, configEmbed.colors.accepted, "LỖI: ", "```" + error.toString().substr(0, 100) + "```" + "\n\n**Lỗi đã được gửi cho chủ sở hữu của tôi!**")
        functions.errorbuilder(error.stack.toString().substr(0, 2000))
       }
       try{queue.connection.voice.setSelfDeaf(true);}catch (error) {
        console.error(error)
        functions.embedbuilder(client, 5000, message, configEmbed.colors.accepted, "LỖI: ", "```" + error.toString().substr(0, 100) + "```" + "\n\n**Lỗi đã được gửi cho chủ sở hữu của tôi!**")
        functions.errorbuilder(error.stack.toString().substr(0, 2000))
       }
        try {
            functions.playsongyes(client, message, queue, song);
        } catch (error) {
            console.error(error)
            functions.embedbuilder(client, 5000, message, configEmbed.colors.accepted, "LỖI: ", "```" + error.toString().substr(0, 100) + "```" + "\n\n**Lỗi đã được gửi cho chủ sở hữu của tôi!**")
            functions.errorbuilder(error.stack.toString().substr(0, 2000))
        }
    })
    .on("addSong", (message, queue, song) => {
        try {
            functions.playsongyes.updateMusicPanel();
            return functions.embedbuilder(client, 3500, message, configEmbed.colors.accepted, "Đã thêm một bài hát!", `Bài hát: [\`${song.name}\`](${song.url})  -  \`${song.formattedDuration}\` \n\nĐược yêu cầu bởi: ${song.user}\n\nThơi gian dự định: ${queue.songs.length - 1} song(s) - \`${(Math.floor((queue.duration - song.duration) / 60 * 100) / 100).toString().replace(".", ":")}\`\nThời lượng hàng đợi: \`${queue.formattedDuration}\``, song.thumbnail)
        } catch (error) {
            console.error(error)
            functions.embedbuilder(client, 5000, message, configEmbed.colors.accepted, "LỖI: ", "```" + error.toString().substr(0, 100) + "```" + "\n\n**Lỗi đã được gửi cho chủ sở hữu của tôi!**")
            functions.errorbuilder(error.stack.toString().substr(0, 2000))
        }
    })
    .on("searchResult", (message, result) => {
        try {
            let i = 0;
            return functions.embedbuilder(client, "null", message, configEmbed.colors.accepted, "", `**Đây là những bài hát em tìm được**\n${result.map(song => `**${++i}**. [${song.name}](${song.url}) - \`${song.formattedDuration}\``).join("\n")}\n*Mời anh/chị nhập số thứ tự bài hát muốn chọn nhé! Hoặc nó sẽ tự động hủy 60 giây*`)
        } catch (error) {
            console.error(error)
            functions.embedbuilder(client, 5000, message, configEmbed.colors.accepted, "LỖI: ", "```" + error.toString().substr(0, 100) + "```" + "\n\n**Lỗi đã được gửi cho chủ sở hữu của tôi!**")
            functions.errorbuilder(error.stack.toString().substr(0, 2000))
        }
    })
    .on("searchCancel", (message) => {
        try {
            message.reactions.removeAll();
            message.react("❌")
        } catch (error) {
            console.error(error)
            functions.embedbuilder(client, 5000, message, configEmbed.colors.accepted, "LỖI: ", "```" + error.toString().substr(0, 100) + "```" + "\n\n**Lỗi đã được gửi cho chủ sở hữu của tôi!**")
            functions.errorbuilder(error.stack.toString().substr(0, 2000))
        }
        try {
            return functions.embedbuilder(client, 5000, message, configEmbed.colors.accepted, `Tìm kiếm đã bị hủy`, "")
        } catch (error) {
            console.error(error)
            functions.embedbuilder(client, 5000, message, configEmbed.colors.accepted, "LỖI: ", "```" + error.toString().substr(0, 100) + "```" + "\n\n**Lỗi đã được gửi cho chủ sở hữu của tôi!**")
            functions.errorbuilder(error.stack.toString().substr(0, 2000))
        }
    }).on("error", (message, err) => {
        try {
            message.reactions.removeAll();
            message.react("❌")
        } catch (error) {
            console.error(error)
            functions.embedbuilder(client, 5000, message, configEmbed.colors.accepted, "LỖI: ", "```" + error.toString().substr(0, 100) + "```" + "\n\n**Lỗi đã được gửi cho chủ sở hữu của tôi!**")
            functions.errorbuilder(error.stack.toString().substr(0, 2000))
        }
        console.log(err);
        try {
            return functions.embedbuilder(client, "null", message, configEmbed.colors.accepted, "Đã xảy ra lỗi:", "```" + err + "```")
        } catch (error) {
            console.error(error)
            functions.embedbuilder(client, 5000, message, configEmbed.colors.accepted, "LỖI: ", "```" + error.toString().substr(0, 100) + "```" + "\n\n**Lỗi đã được gửi cho chủ sở hữu của tôi!**")
            functions.errorbuilder(error.stack.toString().substr(0, 2000))
        }
    })
    .on("finish", message => {
        try {
            return functions.embedbuilder(client, 5000, message, configEmbed.colors.accepted, "Thông báo", "Em đã phục vụ văn nghệ xong rồi! em xin phép được ra khỏi phòng ạ ❤")
        } catch (error) {
            console.error(error)
            functions.embedbuilder(client, 5000, message, configEmbed.colors.accepted, "LỖI: ", "```" + error.toString().substr(0, 100) + "```" + "\n\n**Lỗi đã được gửi cho chủ sở hữu của tôi!**")
            functions.errorbuilder(error.stack.toString().substr(0, 2000))
        }
    })
    .on("empty", message => {

        try {
            return functions.embedbuilder(client, 5000, message, configEmbed.colors.accepted, "Rời khỏi kênh vì nó bị trống!")
        } catch (error) {
            console.error(error)
            functions.embedbuilder(client, 5000, message, configEmbed.colors.accepted, "LỖI: ", "```" + error.toString().substr(0, 100) + "```" + "\n\n**Lỗi đã được gửi cho chủ sở hữu của tôi!**")
            functions.errorbuilder(error.stack.toString().substr(0, 2000))
        }
    }).on("noRelated", message => {
        try {
            return functions.embedbuilder(client, 5000, message, configEmbed.colors.accepted, "Không thể tìm thấy video liên quan để phát. Dừng phát nhạc.")
        } catch (error) {
            console.error(error)
            functions.embedbuilder(client, 5000, message, configEmbed.colors.accepted, "LỖI: ", "```" + error.toString().substr(0, 100) + "```" + "\n\n**Lỗi đã được gửi cho chủ sở hữu của tôi!**")
            functions.errorbuilder(error.stack.toString().substr(0, 2000))
        }
    })

};



