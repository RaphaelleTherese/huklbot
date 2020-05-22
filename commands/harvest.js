const Discord = require('discord.js');
const api = require('imageapi.js');

const guildId = "456235847529005078"; // The server
const gulagRoleId = "504552560493854731";
const gulagChannelId = "504553057560821780";

module.exports.run = async(bot, msg, args) => {
    msg.reply("Organs will be harvested here");
};

module.exports.help = {
    name: "harvest"
};