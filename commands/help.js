const Discord = require('discord.js');
const api = require('imageapi.js');

const guildId = "456235847529005078"; // The server
const gulagRoleId = "504552560493854731";
const gulagChannelId = "504553057560821780";

module.exports.run = async(bot, msg, args) => {
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
};

module.exports.help = {
    name: "gulag"
};