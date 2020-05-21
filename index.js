/*
Author: Raphaelle Guinanao
Last Updated: May 20, 2020

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

------ USER @s -----
<@433479964097118208> = HuklBot
<@282624296637956108> = Huklpopz [Me]

Notes:
guild.roles.cache.forEach(role => console.log(role.name, role.id)) -- Retrieve all roles in the server
*/

/*----- GLOBAL VARIABLES-----*/
const Discord = require('discord.js');
const bot = new Discord.Client();
const fs = require("fs");
// const token = 'NDMzNDc5OTY0MDk3MTE4MjA4.Xn25-A.AejV_FMOQtZCZegt9OKK2bbq48w';
const PREFIX = "~";


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
var safeWord = "safe word";

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

// Load commands
bot.commands = new Discord.Collection();
fs.readdir("./commands", (err, files) => {
    if (err) console.error(err);
    let jsfiles = files.filter(f => f.split(".").pop() === "js");

    if (jsfiles.length <= 0) return console.error("There are no commands to load");

    console.log(`Loading ${jsfiles.length} commands`);
    jsfiles.forEach((f, i) => {
        let props = require(`./commands/${f}`);
        console.log(`${i + 1}: ${f} loaded!`);
        bot.commands.set(props.help.name, props);
    });
});

// Message event
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
    let cmd = "";
    let args = msg.content.substring(PREFIX.length).toLowerCase().split(" ");

    cmd = bot.commands.get("gulag");
    cmd.run(bot, msg, args, isAdmin, "pester", dictGulag, safeWord);

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
            cmd = bot.commands.get(args[0]);
            var results = cmd.run(bot, msg, args, isAdmin, "send", dictGulag, safeWord)[0];
            dictGulag = results[0];
            break;
        case "degulag":
            cmd = bot.commands.get("gulag");
            var results = cmd.run(bot, msg, args, isAdmin, "remove", dictGulag, safeWord)[0];
            dictGulag = results[0];
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

bot.login(process.env.token);
// bot.login(token);