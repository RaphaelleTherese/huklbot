const discord = require('discord.js');
const api = require('imageapi.js');

const guildId = "456235847529005078"; // The server
const gulagRoleId = "504552560493854731";
const gulagChannelId = "504553057560821780";

var dictGulag = new Object();
var safeWord = "safeWord";

module.exports.run = async(bot, msg, args, isAdmin, cmd, dict, word) => {
    dict = dictGulag;
    safeWord = word;
    if (cmd == "send") sendToGulag(bot, msg, args, isAdmin);
    if (cmd == "remove") removeFromGulag(bot, msg, args, isAdmin);
    if (cmd == "pester") gulagify(bot, msg, args);
    
    switch (args[0]){
        case "setsafeword":
        break;
    }
    return [dictGulag, safeWord];
};

function sendToGulag(bot, msg, args, isAdmin){
    if (isAdmin){
        const gulag = msg.guild.roles.cache.get(gulagRoleId); // Gulag role
        const gulagChannel = msg.guild.channels.cache.find(ch => ch.id === gulagChannelId); // Gulag channel
        if (args.length > 1 && args[1].toString().includes("<@") && (args[1].length == 21 || args[1].length == 22)){
            var member = msg.mentions.members.first();
            var prevRoles = [""];

            if (!member.roles.cache.some(r=>["Admin"].includes(r.name))){
                member.roles.cache.forEach(function(role) {
                    if (role.name != "@everyone"){
                        member.roles.remove(role.id);
                        prevRoles.push(role.id)
                    }
                });

                dictGulag[member.id] = prevRoles;
                member.roles.add(gulag);
                msg.reply("<@" + member + "> has been gulaged <:blush:681648731837169664>");
                bot.users.cache.get(member.id).send("You've been gulaged <:evil:573737708099338250>");
                const gulagChannel = msg.guild.channels.cache.find(ch => ch.id === gulagChannelId);
                gulagChannel.send("<@" + member + "> The gulag process will start now <:evil:573737708099338250>");
                return;
            } 
            msg.reply("Sry, but ai don't have the poer for this <:cry:570001747809009674>");
            return;
        } 
        msg.reply("You have to provide a valid member to send to gulag! <:ss:456282514068340756>");
        return;
    }
    msg.reply("Sry, but ur weak. You lack the poer! <:ss:456282514068340756>");
}

async function gulagify(bot, msg, args){
    //Have a local or global variable set to the safe word 
    //Allow admin to set the safe word
    // Initiate url fetch 
    // Iterate through all of those in gulag
    const gulagChannel = msg.guild.channels.cache.find(ch => ch.id === gulagChannelId);
    let subreddits = [
        "cursedimages",
        "popping",
        "creepy",
        "oldschoolcreepy",
        "yaoi"
    ];
    if (msg.author.id in dictGulag){
        if(!msg.content.includes(safeWord)){
            let subreddit = subreddits[Math.floor(Math.random() * subreddits.length)];
            let img = await api(subreddit);
        
            const embed = new discord.MessageEmbed()
            .setTitle("*** G U L A G ***")
            // .setURL(`https://reddit.com/r/${subreddit}`)
            .setColor('#b72025')
            .setDescription(`*insert agressive message for the use to say the ${safeWord} here`)
            .setImage(img);
            
            msg.reply(embed);
        } else{
            removeFromGulag(bot, msg, args, true);
        }
    }
}

function removeFromGulag(bot, msg, args, isAdmin){
    if (isAdmin){
        const gulag = msg.guild.roles.cache.get(gulagRoleId); // Gulag role
        const gulagChannel = msg.guild.channels.cache.find(ch => ch.id === gulagChannelId); // Gulag channel
            if (args.length > 1 && args[1].toString().includes("<@") && (args[1].length == 21 || args[1].length == 22)){ 
                var member = msg.mentions.members.first();
                if (member.id in dictGulag){
                    dictGulag[member.id].forEach(function (roleId) {
                        member.roles.add(roleId);
                    });
                    member.roles.remove(gulag);
                    delete dictGulag[member.id];
                    msg.reply("<@" + member + "> has been de-gulaged <:guilt:570001778372771853>");
                    bot.users.cache.get(member.id).send("You've been de-gulaged :pensive:");
                    return;
                }
                msg.reply("They haven't even been gulaged yet <:what:456287851647336450>");
                return;
            } else if(msg.author.id in dictGulag){
                dictGulag[msg.member.id].forEach(function (roleId) {
                    msg.member.roles.add(roleId);
                });
                msg.member.roles.remove(gulag);
                delete dictGulag[msg.member.id];
                msg.reply("<@" + msg.member.id + "> has been de-gulaged <:guilt:570001778372771853>");
                bot.users.cache.get(msg.member.id).send("You've been de-gulaged :pensive:");
                return;
            }
        msg.reply("You have to provide a valid member to send to gulag! <:ss:456282514068340756>");
        return;
    }
    msg.reply("You must be an Admin to release the prisoner <:evil:573737708099338250>");
}

module.exports.help = {
    name: "gulag"
};