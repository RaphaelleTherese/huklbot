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
        .addField('FUN', '' + 
          '`bark` Barks at the user sending the most recent message (HUKL ONLY <:smug:570002038318956544>)\n' +
          '')
        .addField('GULAG', '`~gulag <arg>`\n' + 
            '`send <@user>` Send a desired user to the depths of gulag\n' +
            '`release <@user>` Save a desired user from the gloomy gulag (for SIMPS only)\n' + 
            '')
        .addField('HARVEST', '`~harvest/~h <arg>`\n' + 
            '`spawnorgan <organ> <emoji>` Spawns a new organ for each user. (HUKL ONLY <:smug:570002038318956544>)\n' + 
            '`listorgans` Lists all of the available organs\n' + 
            '`myorgans` View the organs you\'ve collected\n' + 
            '`reset` Resets the progress all across the board, giving everyone their organs back (HUKL ONLY <:smug:570002038318956544>)\n' + 
            '`rm <organ name>` Removes an organ from everyone\'s organ collection (HUKL ONLY <:smug:570002038318956544>)\n' + 
            '`top` View the leaderboard \n' +
            '`donorcard` View your organ donor card (profile) \n')
        .addField('ANNOY', '`~annoy <arg> `\n' + 
            '`<@user> message` Sends given user a message\n' + 
            '`everyone message` Sends everyone a message (ADMIN ONLY)')
        .addField('OTHER', 'WIP');

      msg.channel.send(embed);
    }
};

module.exports.help = {
    name: "help"
};