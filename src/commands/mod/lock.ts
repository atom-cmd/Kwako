import { Client, Message, MessageEmbed, TextChannel, OverwriteResolvable } from 'discord.js'

module.exports.run = async (bot: Client, msg: Message, args:string[], db:any, commands:any, guildConf:any) => {
    if ((!msg.member.hasPermission('MANAGE_GUILD')) && (msg.author.id != process.env.IWA && process.env.SUDO === '0')) return;

    (msg.channel as TextChannel).permissionOverwrites.forEach(async (value, key) => {
        await value.update({
            'SEND_MESSAGES': false,
            'ADD_REACTIONS': false
        });
    })

    const embed = new MessageEmbed();
    embed.setColor('RED')
    embed.setTitle(`🔒 The channel has been locked by **${msg.author.username}**`)

    try {
        await msg.channel.send(embed);
    } catch (err) {
        console.error(err);
    }
};

module.exports.help = {
    name: 'lock',
    usage: 'ban (mention someone) [reason]',
    staff: true,
    perms: ['EMBED_LINKS', 'MANAGE_MESSAGES', 'READ_MESSAGE_HISTORY', 'BAN_MEMBERS']
}