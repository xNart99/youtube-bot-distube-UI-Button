const functions = require("../../handlers/functions");
const config = require("../../botconfig/config.json");
const configEmbed = require("../../botconfig/embed.json")

module.exports = {
    name: "queue",
    category: "Music",
    aliases: ["queue"],
    cooldown: 2,
    usage: `${config.prefix}queue`,
    description: "Hiển thị danh sách hàng chờ",
    run: async (client, message, args) => {
    if (!client.distube.isPlaying(message)) return functions.embedbuilder(client, 3000, message, configEmbed.colors.decline, "\`Không có bài nào được phát\`")
    if (!message.member.voice.channel) return functions.embedbuilder(client, 3000, message, configEmbed.colors.decline, "`" + message.author.tag + "`"  + "\`Anh/Chị phải tham gia một kênh đàm thoại để em phục vụ văn nghệ\`")
    if (client.distube.isPlaying(message) && message.member.voice.channel.id !== message.member.guild.me.voice.channel.id) return functions.embedbuilder(client, 5000, message, config.colors.no, "`" + message.author.tag + "`"  + "❌ \`Bạn phải tham gia Kênh voice của tôi:\` " + ` \`${message.member.guild.me.voice.channel.name ? message.member.guild.me.voice.channel.name : ""}\``)
          
        try{
            let queue = client.distube.getQueue(message);
            if (!queue) return functions.embedbuilder(client, "null", message, configEmbed.colors.decline, "🎶 \`Khoong có bài nào được phát\`");
            
            var listQueue = queue.songs.map((song,id) =>`${id+1}. ${song.name} -${song.formattedDuration}`).join(`\n`)
            functions.embedbuilder(client, 3000, message, configEmbed.colors.decline,"Danh sách", listQueue)
        }catch{}
    

}
}
