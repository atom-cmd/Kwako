import { Client, Message, Collection, MessageEmbed } from 'discord.js';
import { Db } from 'mongodb';
let commands = new Map();
let member = new MessageEmbed();
let mod = new MessageEmbed();

import * as fs from 'fs';

readDirs()
setTimeout(() => {
    member.setTitle("**Commands List**")
    member.setColor(3852663)
    member.addFields([
        {
            "name": "**👤 Profile**",
            "value": commands.get("profile")
        },
        {
            "name": "**💕 Actions**",
            "value": commands.get("actions")
        },
        {
            "name": "**🕹 Games**",
            "value": commands.get("games")
        },
        {
            "name": "**🎶 Music**",
            "value": commands.get("music")
        },
        {
            "name": "**🛠 Utility**",
            "value": commands.get("utility")
        },
    ])

    mod.setTitle("**Staff Commands**")
    mod.addFields([
        {
            "name": "**⚙️ Config**",
            "value": commands.get("config")
        },
        {
            "name": "**🔨 Moderation**",
            "value": commands.get("mod")
        },
        {
            "name": "**📨 Suggestions**",
            "value": commands.get("suggestions")
        },
    ])
    mod.setColor(4886754)
}, 5000)

module.exports.run = async (bot: Client, msg: Message, args: string[], db: Db, commands: Collection<any, any>, guildConf: any) => {
    if (args.length == 1) {
        let cmd: any = commands.get(args[0]) || commands.find((comd) => comd.help.aliases && comd.help.aliases.includes(args[0]));
        if (!cmd || !cmd.help.usage) return;
        if (cmd.help.staff && !msg.member.hasPermission('MANAGE_GUILD')) return;

        await msg.channel.send("`Syntax : ( ) is needed argument, [ ] is optional argument`")
        let commandHelp = `\`\`\`markdown\n< ${cmd.help.name} >\n\n`
        commandHelp = `${commandHelp}# Usage\n${guildConf.prefix}${cmd.help.usage}\n\n# Description\n${cmd.help.desc}\n\n`
        if (cmd.help.aliases) commandHelp = `${commandHelp}# Aliases\n${cmd.help.aliases.toString()}\`\`\``
        return msg.channel.send(commandHelp);
    } else
        sendHelp(msg, guildConf);
    console.log(`info: help sent to ${msg.author.tag}`)
}

module.exports.help = {
    name: 'help',
    aliases: ['commands', 'command'],
    usage: "help",
    desc: "Sends you the list of the commands available",
    perms: ['EMBED_LINKS', 'MANAGE_ROLES']
};

async function sendHelp(msg: Message, guildConf: any) {
    let memberEmbed = member;
    memberEmbed.setDescription(`Prefix : \`${guildConf.prefix}\`\nUse \`${guildConf.prefix}help (command)\` to have more info about a specific command`);
    memberEmbed.setFooter('Need more help? https://discord.gg/4ZFYUcw');
    if (msg.member.hasPermission('MANAGE_GUILD'))
        try {
            await msg.channel.send(member)
            await msg.author.send(mod)
        } catch (ex) {
            return msg.channel.send(":x: > **Please open your DMs, I can't reach you**")
        }
    else
        try {
            await msg.channel.send(member)
        } catch {
            return msg.channel.send(":x: > **Commands list loading, redo the commands in a few seconds!**")
        }
}

async function readDirs() {
    fs.readdir('./build/commands/', { withFileTypes: true }, async (error, f) => {
        if (error) return console.error(error);
        f.forEach((f) => {
            if (f.isDirectory()) {
                fs.readdir(`./build/commands/${f.name}/`, async (error, fi) => {
                    if (error) return console.error(error);
                    let string: string = "";
                    fi.forEach(async (fi) => {
                        string = `${string}\`${fi.slice(0, -3)}\` `;
                    })
                    commands.set(f.name, string);
                })
            }
        });
    });
}
