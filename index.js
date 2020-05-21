/*

Author: Raphaelle Guinanao
Last Updated: May 18, 2020

node . to START
ctrl + c to STOP 

*IDEAS
~insult: insults a random person on the server with a random insult
~organ battle, instead of pet teams and such; sell to the black market; 
    Maybe higher ranking, better worth
~shuffle: channel shuffle
~distort: makes everything weird
~gulagify: sends user to gulag, can only be used by admin

Rankings determined by how many times someone's talked, and have
names such as:
Baby Hippo
Turd Burglar
Baby Snatcher
etc

bark: replies to the 'nearest' person with barks WOOF WOOF WOOF

------ USER @s -----
<@433479964097118208> = HuklBot
<@282624296637956108> = Huklpopz [Me]
<@403239775290523680> = LastMann

Notes:
guild.roles.cache.forEach(role => console.log(role.name, role.id)) -- Retrieve all roles in the server

*/

/*----- GLOBAL VARIABLES-----*/
const Discord = require('discord.js');
const bot = new Discord.Client();
// const token = 'NDMzNDc5OTY0MDk3MTE4MjA4.Xn25-A.AejV_FMOQtZCZegt9OKK2bbq48w';
const PREFIX = "~";
const imageapi = require("imageapi.js");


const huklbot = "<@433479964097118208>"; // Huklbot's role
const guild = bot.guilds.cache.get("456235847529005078"); // The server
const gulagRoleId = "504552560493854731";
const gulagChannelId = "504553057560821780";

// Hey, is this thing on? 
bot.on('ready', () =>{
    console.log("Teehee, I'm hewe! UwU");
});

var recentAuthor = "";
var dictGulag = new Object();
bot.on('guildMemberAdd', member => {
    // Send the message to a designated channel on a server:
    const channel = member.guild.channels.cache.find(ch => ch.name === 'lobby');
    // Do nothing if the channel wasn't found on this server
    if (!channel) return;
    // Send the message, mentioning the member
    var addIntro = ["Welcome to hell :eye: :lips: :eye:,", ":eye: :lips: :eye: Hope your ass cheeks are wide open ", "Leave before it's too late :eye: :lips: :eye:"];
    var randInt = parseInt((Math.random() * addIntro.length));
    channel.send(addIntro[randInt] + `${member}`);
});

bot.on('message', msg=>{
     console.log(msg.author.username + ": " + msg.content.toLowerCase());
     var isAdmin = checkAdmin(msg);
      
     if (!msg.author.toString().includes("<@433479964097118208>") && !msg.author.toString().includes("<@282624296637956108>"))
         recentAuthor = msg.author.toString(); // Retrieves the most recent 'author' of a message.

    // The bot obeys me UwU
    if (msg.content.toLowerCase().includes("<@433479964097118208>")){
        if (msg.author.toString().includes("<@282624296637956108>")){
            msg.reply("At your service, master :hugging:");
        } else{
            msg.reply("Whaddaya want >:V");
        }
    }

    // --- OFFICIAL COMMANDS ---
     let args = msg.content.substring(PREFIX.length).toLowerCase().split(" ");
     switch (args[0]){
         case "help":
             help(msg, args);
             break;
         case "bark":
             if (recentAuthor != ""){
                msg.channel.send(recentAuthor + " WOOF");
                msg.channel.send(recentAuthor + " WOOF WOOF");
                msg.channel.send(recentAuthor + " WOOF WOOF WOOF");
             }
             break;
        case "annoy":
            annoy(msg, args);
            break;
        case "distort":
            // Distorts the previous message
            break;
        case "profile":
            displayProfile(msg, args);
            break;
        case "gulag":
            sendToGulag(isAdmin, msg, args);
            break;
        case "degulag":
            removeFromGulag(isAdmin, msg, args);
            break;
        case "test":
            msg.reply("This command is reserved for testing purposes. :)");
            break;
     }
});

function checkAdmin(msg){
    if (!msg.author.toString().includes(huklbot) && msg.member != null)
        return msg.member.roles.cache.some(r=>["Admin"].includes(r.name));
    return false;
}

/*----- COMMAND HELPERS -----*/
function help(msg, args){
    if (args[1] == "me"){
        msg.reply("You need all the help you can get :unamused:");
    } else{
      const embed = new Discord.MessageEmbed()
      .setTitle('__COMMANDS__')
      .setColor('#b72025')
      .setDescription('Listen to me you little shit, here are your fucking commands, happy now?\n\n ' + 
      '`help` Dumbass, you just used this \n ' + 
      '`bark`\tWoof woof, motherfucker')
      .addField('profile', 'View your profile')
      .addField('command', 'command description');

      msg.channel.send(embed);
    }
}

function annoy(msg, args){
    if (args[1].toString().includes("<@") && (args[1].length == 21 || args[1].length == 22)){
        var memberId = args[1].toString();
        memberId = memberId.substring(3, memberId.length - 1);  
        bot.users.cache.get(memberId).send("Listen here you little shit, just because I'm a bot and because you called this command doesn't give you the authority to act like a cunt. You freak, you think you're funny and all with your constant pestering. Just quit it. No one loves you and no one will ever love you.");  
    } else if(isAdmin && args[1].toString() == "everyone") {
        if (msg.content.substring(PREFIX.length + args[1].length).length > 0){
            guild.members.cache.forEach(function(member) {
                setTimeout(function(){
                    bot.users.cache.get(member.user.id).send(member.user.username + ", " + msg.content.substring(1 + PREFIX.length + args[0].toString().length + args[1].toString().length) + " - " + msg.author.toString())
                }, 500); 
            });
        }
        msg.reply(" I messaged them all, are you happy now? >:V");
        msg.channel.send("Do you feel proud with what you've done? :unamused:");
    }
}

function displayProfile(msg, args){
    const embed = new Discord.MessageEmbed()
        .setDescription('Wow, narcissistic much?')
        .setColor('#b72025')
        .setThumbnail(msg.author.avatarURL)
        .addField('Profile', msg.author.username); //.fetchProfile
    msg.channel.send(embed);
}

    // GULAG COMMANDS
function sendToGulag(isAdmin, msg, args){
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
                gulagify(msg, member);
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

function gulagify(msg, member){
    //Have a local or global variable set to the safe word 
    //Allow admin to set the safe word
    // Initiate url fetch 


    const gulagChannel = msg.guild.channels.cache.find(ch => ch.id === gulagChannelId);
    gulagChannel.send("<@" + member + "> The gulag process will start now <:evil:573737708099338250>");

    module.exports={
        name: "huklbot", 
        description: "Indescribable", 
        category: "cool", 
        run: async(bot, msg, args) => {
            let subreddits = [
                "cursedimages",
                "popping"
            ]
            let subreddit = subreddits[Math.floor(Math.random() * subreddits.length)]
            console.log(subreddit);
            let img = await api(subreddit);
            console.log(subreddit);
    
            const embed = new Discord.MessageEmbed()
            .setTitle('*** GULAG ***')
            .setColor('#b72025')
            .setURL(`https://reddit.com/r/${subreddit}`);
            msg.channel.send(embed);
        }
    }
}

function removeFromGulag(isAdmin, msg, args){
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
            } 
        msg.reply("You have to provide a valid member to send to gulag! <:ss:456282514068340756>");
        return;
    }
    msg.reply("You must be an Admin to release the prisoner <:evil:573737708099338250>");
}

bot.login(process.env.token);