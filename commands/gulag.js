const discord = require('discord.js');
const api = require('imageapi.js');

module.exports = {
    name: "gulag", 
    description: "Gulagify", 
    run: async(bot, msg, args) => {
        let subreddits = [
            "cursedimages", 
            "popping"
        ]

        let subreddit = subreddits[Math.floor(Math.random() * subreddits.length)];
        console.log("> Gulag: " + subreddit);
        let img = await api(subreddit);

        const embed = new MessageEmbed()
        .setTitle("*** G U L A G ***")
        .setURL(`https://reddit.com/r/${subreddit}`);
        msg.channel.send(embed);
    }
}