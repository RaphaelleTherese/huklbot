/**
 * HuklBot for Discord
 * Author: Raphaelle Therese
 * 
 */
const { Client, Events, GatewayIntentBits } = require('discord.js');

// Creating client instance
global.client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.MessageContent
    ]
});
client.config = require('./config');

client.once(Events.ClientReady, c => {
    console.log(`---------- Teehee, ${c.user.tag} hewe! UwU ----------`);
});

client.login(client.config.token);

// // Hey, is this thing on? 
// bot.on('ready', () =>{
//     console.log("---------- Teehee, I'm hewe! UwU ----------");
// });

// // Load commands
// bot.commands = new Discord.Collection();
// fs.readdir("./commands", (err, files) => {
//     if (err) console.error(err);
//     let jsfiles = files.filter(f => f.split(".").pop() === "js");

//     if (jsfiles.length <= 0) return console.error("There are no commands to load");

//     console.log(`Loading ${jsfiles.length} commands`);
//     jsfiles.forEach((f, i) => {
//         let props = require(`./commands/${f}`);
//         console.log(`${i + 1}: ${f} loaded!`);
//         bot.commands.set(props.help.name, props);
//     });
// });

// // On member arrival
// bot.on('guildMemberAdd', member => {
//     // Send the message to a designated channel on a server:
//     const channel = member.guild.channels.cache.find(ch => ch.name === 'lobby');
//     // Do nothing if the channel wasn't found on this server
//     if (!channel) return;
//     // Send the message, mentioning the member
//     var addIntro = ["Welcome to hell :eye: :lips: :eye:,", ":eye: :lips: :eye: Hope your ass cheeks are wide open ", "Leave before it's too late :eye: :lips: :eye:"];
//     var randInt = parseInt((Math.random() * addIntro.length));
//     channel.send(addIntro[randInt] + `${member}`);
// });

// /*----- GLOBAL VARIABLES -----*/
// var recentAuthor = "";
// var dictGulag = new Object();
// var safeWord = "safe word";

// // Message event
// bot.on('message', async msg=>{
//      console.log(msg.author.username + ": ");
//      var isAdmin = checkAdmin(msg);
    
//      if (msg.author.bot) return;
//      if (msg.channel.type == "dm") return;
//      if(!msg.author.toString().includes(me)) recentAuthor = msg.author.toString(); // Retrieves the most recent 'author' of a message.

//     // The bot obeys me UwU
//     if (msg.content.toLowerCase().includes(huklbot)){
//         if (msg.author.toString().includes("<@282624296637956108>")){
//             msg.reply("At your service, master :hugging:");
//         } else{
//             msg.reply("Whaddaya want >:V");
//         }
//     }
    
//     // msg.channel.send("Suck my cock, you fuckers :3");

//     // --- OFFICIAL COMMANDS ---
//     let cmd = "";
//     let args = "";
//     if (msg.content.substring(0,PREFIX.length) == PREFIX) args = msg.content.substring(PREFIX.length).toLowerCase().split(" ");

//     cmd = bot.commands.get("gulag");
//     cmd.run(bot, msg, args, isAdmin, "pester", dictGulag, safeWord);

//     switch (args[0]){
//          case "help":
//              cmd = bot.commands.get("help");
//              cmd.run(bot, msg, args);
//              break;
//          case "bark":
//              if (recentAuthor != ""){
//                 msg.channel.send(recentAuthor + " WOOF");
//                 msg.channel.send(recentAuthor + " WOOF WOOF");
//                 msg.channel.send(recentAuthor + " WOOF WOOF WOOF");
//              }
//              break;
//         case "annoy":
//             if (args[1].toString().includes("<@") && (args[1].length == 21 || args[1].length == 22)){
//                 var memberId = args[1].toString();
//                 memberId = memberId.substring(3, memberId.length - 1);  
//                 if (msg.content.substring(PREFIX.length + args[1].length).length > 0){
//                     bot.users.cache.get(memberId).send(msg.content.substring(1 + PREFIX.length + args[0].toString().length + args[1].toString().length));
//                 }  
//             } else if(isAdmin && args[1].toString() == "everyone") {
//                 if (msg.content.substring(PREFIX.length + args[1].length).length > 0){
//                     const guild = bot.guilds.cache.get("456235847529005078");

//                     guild.members.cache.forEach(async function(member) {
//                         try {
                            
//                         user = new Discord.GuildMember(bot, member, guild);
                        
//                         setTimeout(function(){
//                             bot.users.cache.get(member.user.id).send(member.user.username + ", " + msg.content.substring(1 + PREFIX.length + args[0].toString().length + args[1].toString().length) + " - " + msg.author.toString())
//                         }, 1000); 
//                           }
//                           catch(err) {
//                             console.log(err);
//                           }

//                     });
//                 }
//                 msg.reply(" I messaged them all, are you happy now? >:V");
//                 msg.channel.send("Do you feel proud with what you've done? :unamused:");
//             }
//             break;
//         case "distort":
//             // Distorts the previous message
//             break;
//         case "profile":
//             displayProfile(msg, args);
//             break;
//         case "gulag":
//             cmd = bot.commands.get("gulag");
//             dictGulag = cmd.run(bot, msg, args, isAdmin, "", dictGulag, safeWord);
//             break;
//         case "setsafeword":
//             if (isAdmin) {
//                 safeWord = msg.content.substring(1 + PREFIX.length + args[0].toString().length);
//                 msg.reply(`The safe word has been set to ${safeWord}`);
//             }
//             break;
//         case "harvest":
//         case "h":
//             cmd = bot.commands.get("harvest");
//             cmd.run(bot, msg, args);
//             break;
//         case "test":
//             msg.reply("This command is reserved for testing purposes. :)");
//             break;
//         case "ping":
//             var ping = Date.now() - msg.createdTimestamp + " ms";
//             msg.channel.send(new Discord.MessageEmbed()
//                 .setColor('#b72025')
//                 .setTitle(':information_source: Pong')
//                 .setDescription(`My **ping** is **${Math.round(bot.ws.ping)}ms**.`)
//             );
//             break;
//         case "suggest":
//             suggest(msg, args);
//             break;
//      }
// });

// /*----- COMMAND HELPERS -----*/
// function checkAdmin(msg){
//     if (!msg.author.toString().includes(huklbot) && msg.member != null)
//         return (msg.member.hasPermission('ADMINISTRATOR') || msg.author.toString().includes(me));
//     return false;
// }

// function displayProfile(msg, args){
//     const embed = new Discord.MessageEmbed()
//         .setDescription('Wow, narcissistic much?')
//         .setColor('#b72025')
//         .setThumbnail(msg.author.avatarURL)
//         .addField('Profile', msg.author.username); //.fetchProfile
//     msg.channel.send(embed);
// }

// function suggest(msg, args) {
//     var suggestion = msg.content.substring(PREFIX.length + args[0].length);
//     conn.query(`CALL SendSuggestion('${msg.author.id}', '${suggestion}')`, (err, results) => {
//         if (err) return console.error(err);

//         msg.reply("*I sent the suggestion, why don't you do it yourself next time. :confounded:*");
//     })
// }

// // bot.login(process.env.token);
// bot.login(token);
