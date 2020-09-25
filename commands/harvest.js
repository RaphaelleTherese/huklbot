// add view body command, what are you a perv? 

const Discord = require('discord.js');
const api = require('imageapi.js');
const mysql = require("mysql");
const { stat } = require('fs');
const { domainToUnicode } = require('url');

const guildId = "456235847529005078"; // The server
const gulagRoleId = "504552560493854731";
const gulagChannelId = "504553057560821780";
const me = "282624296637956108";

var conn = mysql.createConnection({
    host: "localhost",
    user: "root", 
    password: "ZingBox25HUK!", 
    database: "notitiacentrum"
});

module.exports.run = async(bot, msg, args) => {
    switch(args[1]) {
        case "spawnorgan":
        case "so":
            spawnOrgan(bot, msg, args);
            break;
        case "listorgans":
        case "lo":
            organlist(bot, msg, args);
            break;
        case "myorgans":
        case "mo":
            myorgans(bot, msg, args);
            break;
        case "reset":
            reset(bot, msg, args);
            break;
        case "rm":
            removeOrgan(bot, msg, args);
            break;
        case "mybody":
            break
        case "top": 
            top(bot, msg, args);
            break;
        case "donorcard":
        case "dc":
            donorcard(bot, msg, args);
            break;
        case "donate":
            donate(bot, msg, args);
            break;
        case "pages":
            embed_pages(bot, msg, args);
            break;
        default:
            if (args.length <= 1){
                harvest(bot, msg, args);
            } else{
                msg.channel.send("Illegal command! >:V");
            }
            break;
    }
};

function spawnOrgan(bot, msg, args) {
    if (msg.author.id != me) {
        msg.reply("Who do you think you are? You think you can just make organs like some kind of God? Fuck off. <:weird:540586649583747078>");
        return;
    }
    if (args.length < 4) return;
    let organ = args[2];
    let emoji = args[3];

    conn.query(`CALL SpawnOrgan('${organ}', '${emoji}')`, (err, results) => {
        if (err) return console.error(err.message);

        emoji = getEmoji(msg, emoji);

        if (results[0][0].Status == 0) msg.channel.send(`The '${organ}' has already been created <:sus:536135510641475604>!`);
        if (results[0][0].Status == 1) msg.channel.send(`The '${organ}' ${emoji} has been created :eye: :lips: :eye:!`);
    });

}

function organlist(bot, msg, args) {
    conn.query(`SELECT * FROM Organs`, (err, results) => {
        if (err) return console.error(err.message);

        var organlist = "";
        results.forEach(function(organ) {
            organlist += getEmoji(msg, organ.Emoji) + "<:transparent:710952594163367976><:transparent:710952594163367976> `" + organ.Name + "` \n";
        });

        const embed = new Discord.MessageEmbed()
        .setTitle('__O R G A N S__')
        .setColor('#b72025')
        .setDescription('||*shhh, help me smuggle them*||\n\n' + organlist);

        msg.channel.send(embed);
    });
}

function myorgans(bot, msg, args){
    conn.query(`SELECT C.Username, B.Name, B.Emoji FROM CollectiveOrgans A JOIN Organs B ON A.OrganId = B.ID JOIN Users C ON A.UserId = C.UserID WHERE OrganOwnerId = '${msg.author.id}'`, (err, results) => {
        if (err) return console.error(err.message);

        var dictOrgans = new Object();
        results.forEach(function (organ) {
            var user_organs = [];
            var organs = [];
            organs.push(organ.Name);
            organs.push(organ.Emoji);

            if (organ.Username in dictOrgans) user_organs = dictOrgans[organ.Username];
            user_organs.push(organs);
            dictOrgans[organ.Username] = user_organs;
        });
        
        conn.query(`CALL GetThieves('${msg.author.id}')`, (err, results) => {
            if (err) return console.error(err.message);

            var pages = [];
            var page = 1;
            // GET THE FIRST USER
            var curpage = "<:body:749835809909112833> **<@" + msg.author.id + ">'S ORGANS** :eye::lips::eye:\n\n <:transparent:710952594163367976>";
            for (i in dictOrgans[msg.author.username]) {
                curpage += getEmoji(msg, dictOrgans[msg.author.username][i][1]) + " ";
            }
            curpage += "\n\n════════════════════════════════\n\n";
            curpage += "<:jailpeep:749829923518021722> **WANTED ORGAN THIEVES**\n";

            first = true;
            results[0].forEach(function(r) {
                if (r.OrganOwnerId != msg.author.id) curpage += "<:transparent:710952594163367976><@" + r.OrganOwnerId + "> owns " + r.OrgansCaught + " of your organs.\n";
            });
            pages.push(curpage);

            // GET THE REST OF THE USERS
            var users_per_page = [];
            for (userid in dictOrgans) {
                if (userid == msg.author.username) continue;
                var user = []
                var organlist = "<:transparent:710952594163367976>";
                user.push(userid);

                for (i in dictOrgans[userid]) {
                    var organ = dictOrgans[userid][i];
                    organlist += getEmoji(msg, organ[1]) + " ";
                };

                user.push(organlist);
                users_per_page.push(user);

                if(users_per_page.length % 9 == 0) {
                    pages.push(users_per_page);
                    users_per_page = [];
                }
            }

            while (users_per_page.length % 9 != 0) {
                users_per_page.push(["blank", "blank"]);
            }
            pages.push(users_per_page);

            const embed = new Discord.MessageEmbed()
            .setTitle('***Here are your organs!*** <:blush:681648731837169664>')
            .setImage(msg.author.avatarURL)
            .setColor('#b72025')
            .setFooter(`Page ${page} of ${pages.length}`)
            .setDescription(pages[page - 1]);

            msg.channel.send(embed).then(msg2 => {
                msg2.react('⬅️').then(r => {
                    msg2.react('➡️');
        
                    const backwardsFilter = (reaction, user) => reaction.emoji.name == '⬅️' && user.id == msg.author.id;
                    const forwardsFilter = (reaction, user) => reaction.emoji.name == '➡️' && user.id == msg.author.id;
        
                    const backwards = msg2.createReactionCollector(backwardsFilter, {time: 60000});
                    const forwards = msg2.createReactionCollector(forwardsFilter, {time: 60000});
                    
                    backwards.on('collect', r => {
                        if (page == 1) return;
                        page--;
                        embed.setFooter(`Page ${page} of ${pages.length}`);
                        embed.fields = [];
                        embed.setDescription("");

                        if (page == 1){
                            embed.setDescription(pages[page - 1]);
                        } else{
                            if (pages[page - 1][0][0] != "blank") embed.addFields({ name: "<:body:749835809909112833> `" + pages[page - 1][0][0] + "'s organs`", value: pages[page - 1][0][1], inline: true });
                            if (pages[page - 1][1][0] != "blank") embed.addFields({ name: "<:body:749835809909112833> `" + pages[page - 1][1][0] + "'s organs`", value: pages[page - 1][1][1], inline: true });
                            if (pages[page - 1][2][0] != "blank") embed.addFields({ name: "<:body:749835809909112833> `" + pages[page - 1][2][0] + "'s organs`", value: pages[page - 1][2][1], inline: true });
                            if (pages[page - 1][3][0] != "blank") embed.addFields({ name: "<:body:749835809909112833> `" + pages[page - 1][3][0] + "'s organs`", value: pages[page - 1][3][1], inline: true });
                            if (pages[page - 1][4][0] != "blank") embed.addFields({ name: "<:body:749835809909112833> `" + pages[page - 1][4][0] + "'s organs`", value: pages[page - 1][4][1], inline: true });
                            if (pages[page - 1][5][0] != "blank") embed.addFields({ name: "<:body:749835809909112833> `" + pages[page - 1][5][0] + "'s organs`", value: pages[page - 1][5][1], inline: true});
                            if (pages[page - 1][6][0] != "blank") embed.addFields({ name: "<:body:749835809909112833> `" + pages[page - 1][6][0] + "'s organs`", value: pages[page - 1][6][1], inline: true });
                            if (pages[page - 1][7][0] != "blank") embed.addFields({ name: "<:body:749835809909112833> `" + pages[page - 1][7][0] + "'s organs`", value: pages[page - 1][7][1], inline: true });
                            if (pages[page - 1][8][0] != "blank") embed.addFields({ name: "<:body:749835809909112833> `" + pages[page - 1][8][0] + "'s organs`", value: pages[page - 1][8][1], inline: true });
                        }
                        msg2.edit(embed);
                    });
        
                    forwards.on('collect', r => {
                        if (page == pages.length) return;
                        page++;
                        embed.setFooter(`Page ${page} of ${pages.length}`);
                        embed.fields = [];
                        embed.setDescription("");
                        
                        if (page == 1){
                            embed.setDescription(pages[page - 1]);
                        } else{
                            if (pages[page - 1][0][0] != "blank") embed.addFields({ name: "<:body:749835809909112833> `" + pages[page - 1][0][0] + "'s organs`", value: pages[page - 1][0][1], inline: true });
                            if (pages[page - 1][1][0] != "blank") embed.addFields({ name: "<:body:749835809909112833> `" + pages[page - 1][1][0] + "'s organs`", value: pages[page - 1][1][1], inline: true });
                            if (pages[page - 1][2][0] != "blank") embed.addFields({ name: "<:body:749835809909112833> `" + pages[page - 1][2][0] + "'s organs`", value: pages[page - 1][2][1], inline: true });
                            if (pages[page - 1][3][0] != "blank") embed.addFields({ name: "<:body:749835809909112833> `" + pages[page - 1][3][0] + "'s organs`", value: pages[page - 1][3][1], inline: true });
                            if (pages[page - 1][4][0] != "blank") embed.addFields({ name: "<:body:749835809909112833> `" + pages[page - 1][4][0] + "'s organs`", value: pages[page - 1][4][1], inline: true });
                            if (pages[page - 1][5][0] != "blank") embed.addFields({ name: "<:body:749835809909112833> `" + pages[page - 1][5][0] + "'s organs`", value: pages[page - 1][5][1], inline: true});
                            if (pages[page - 1][6][0] != "blank") embed.addFields({ name: "<:body:749835809909112833> `" + pages[page - 1][6][0] + "'s organs`", value: pages[page - 1][6][1], inline: true });
                            if (pages[page - 1][7][0] != "blank") embed.addFields({ name: "<:body:749835809909112833> `" + pages[page - 1][7][0] + "'s organs`", value: pages[page - 1][7][1], inline: true });
                            if (pages[page - 1][8][0] != "blank") embed.addFields({ name: "<:body:749835809909112833> `" + pages[page - 1][8][0] + "'s organs`", value: pages[page - 1][8][1], inline: true });
                        }
                        msg2.edit(embed);
                    });
                });
            });
        });

    });
}

function harvest(bot, msg, args) {
    var organs = [];
    var users = [];
    conn.query(`SELECT * FROM Organs`, (err, results) => {
        if (err) return console.error(err.message);

        results.forEach(function(organ) {
            var attributes = [];
            attributes.push(organ.ID);
            attributes.push(organ.Name);
            attributes.push(organ.Emoji);
            organs.push(attributes);
        });

        bot.users.cache.forEach(function(user) {
            var attributes = [];
            attributes.push(user.username);
            attributes.push(user.id);

            users.push(attributes);
        });
        
        var unfortunate_user = users[Math.floor(Math.random() * users.length)];
        var unfortunate_organ = organs[Math.floor(Math.random() * organs.length)];

        conn.query(`CALL CollectOrgan('${removeEmojis(msg.author.username)}','${msg.author.id}','${removeEmojis(unfortunate_user[0])}','${unfortunate_user[1]}','${unfortunate_organ[0]}')`, (err, results) => {
            if (err) return console.error(err);

            console.log(results[0][0].PreviousOwner);
            msg.channel.send("<:evil:573737708099338250> **|** `HUeHuhHEHuhUHEUhuHUHuhUHheEU! `\n" + 
                "<:transparent:710952594163367976> **|** **`" + msg.author.username + "`**`, YOU'VE COLLECTED `**`" + unfortunate_user[0] + "'s`**`" + unfortunate_organ[1].toUpperCase() + " `" + getEmoji(msg, unfortunate_organ[2]) + " \n" +
                "<:transparent:710952594163367976> **|** `FROM `**`" + results[0][0].PreviousOwner + "`**`! ` <:oho:534150017162805262>");
            // msg.reply("*you've collected <@" + unfortunate_user[1] + ">'s " + unfortunate_organ[1] + "* " + getEmoji(msg, unfortunate_organ[2]) + " <:oho:534150017162805262>");
        });
    });
}

function reset(bot, msg, args) {
    if (msg.author.id != me) {
        msg.reply("<:weird:540586649583747078> **|** `You fucker, you thought you could get away with this without my beloved owner, huh.`");
        return;
    }

    conn.query(`CALL ResetOrganCollection()`);
    msg.channel.send(":unamused: **|** `All organs have been returned to their owners` ||fucking simp||");
}

function removeOrgan(bot, msg, args) {
    if (msg.author.id != me) {
        msg.reply("<:weird:540586649583747078> **|** `What, so you think you're just gonna try and get rid of this " + args[2] + " without anyone knowing. Nice try buddy, I'm watching you.`");
        return;
    }
    var organ = args[2];

    var animals = ["buffalos", "squirrels", "ferrel rats", "aardvarks", "anteaters", "Ryann's retirement home buddies", "lions", "Ash's furry baras", "me", "porcupines", "Crim's poor lolis", "sharks", "the dogs", "baboons", "dolphins"];

    conn.query(`CALL RemoveOrgan('${organ}')`);

    msg.channel.send(":yum: **|** `All " + organ + "s have been fed to " + animals[Math.floor(Math.random() * animals.length)] + "`");
}

function top(bot, msg, args) {
    conn.query(`SELECT C.UserId, COUNT(*) AS Caught FROM CollectiveOrgans A JOIN Organs B ON A.OrganId = B.ID JOIN Users C ON A.OrganOwnerId = C.UserId GROUP BY A.OrganOwnerId ORDER BY COUNT(*) DESC, C.Username ASC;`, (err, results) => {
        var num = 1;
        var leaderlist = "";
        var pages = [];
        var page = 1;
        results.forEach(function(user) {
            leaderlist += "`" + num + ".` <@" + user.UserId + "> **|**  `" + user.Caught + " organs harvested`";
            if (num == 1) leaderlist += ":star:";
            if (user.UserId == msg.author.id) leaderlist += " :point_left:";
            leaderlist += "\n";
            num++;

            if (num % 10 == 0) {
                pages.push(leaderlist);
                leaderlist = "";
            }
        });
        if (leaderlist != "") pages.push(leaderlist);

        const embed = new Discord.MessageEmbed()
            .setTitle('**__LEADERBOARD__** <:yay:476211389682286592>')
            .setColor('#b72025')
            .setDescription(pages[page - 1])
            .setFooter(`Page ${page} of ${pages.length}`);;
        
        msg.channel.send(embed).then(msg2 => {
            msg2.react('⬅️').then(r => {
                msg2.react('➡️');
    
                const backwardsFilter = (reaction, user) => reaction.emoji.name == '⬅️' && user.id == msg.author.id;
                const forwardsFilter = (reaction, user) => reaction.emoji.name == '➡️' && user.id == msg.author.id;
    
                const backwards = msg2.createReactionCollector(backwardsFilter, {time: 30000});
                const forwards = msg2.createReactionCollector(forwardsFilter, {time: 30000});
                
                backwards.on('collect', r => {
                    if (page == 1) return;
                    page--;
                    embed.setDescription(pages[page - 1]);
                    embed.setFooter(`Page ${page} of ${pages.length}`);
                    msg2.edit(embed);
                });
    
                forwards.on('collect', r => {
                    if (page == pages.length) return;
                    page++;
                    embed.setDescription(pages[page - 1]);
                    embed.setFooter(`Page ${page} of ${pages.length}`);
                    msg2.edit(embed);
                });
            });
        });
    });
}

function embed_pages(bot, msg, args) {
    let pages = ["suck", "my", "toes"];
    let page = 1;

    const embed = new Discord.MessageEmbed()
    .setColor('#b72025')
    .setTitle('Testing')
    .setFooter(`Page ${page} of ${pages.length}`)
    .setDescription(pages[page - 1])
    .addFields(
		{ name: '__**Some user**__', value: ':peach: :snail: :yum: :fire: :monkey: :chicken: :dog: :baby:', inline: true },
		{ name: '__**Some user**__', value: ':peach: :snail: :yum: :fire: :monkey: :chicken: :dog: :baby:', inline: true },
		{ name: '__**Some user**__', value: ':peach: :snail: :yum: :fire: :monkey: :chicken: :dog: :baby:', inline: true },
		{ name: '__**Some user**__', value: ':peach: :snail: :yum: :fire: :monkey: :chicken: :dog: :baby:', inline: true },
		{ name: '__**Some user**__', value: ':peach: :snail: :yum: :fire: :monkey: :chicken: :dog: :baby:', inline: true },
		{ name: '__**Some user**__', value: ':peach: :snail: :yum: :fire: :monkey: :chicken: :dog: :baby:', inline: true },
		{ name: '__**Some user**__', value: ':peach: :snail: :yum: :fire: :monkey: :chicken: :dog: :baby:', inline: true },
		{ name: '__**Some user**__', value: ':peach: :snail: :yum: :fire: :monkey: :chicken: :dog: :baby:', inline: true },
		{ name: '__**Some user**__', value: ':peach: :snail: :yum: :fire: :monkey: :chicken: :dog: :baby:', inline: true }
	);

    msg.channel.send(embed).then(msg2 => {
        msg2.react('⬅️').then(r => {
            msg2.react('➡️');

            const backwardsFilter = (reaction, user) => reaction.emoji.name == '⬅️' && user.id == msg.author.id;
            const forwardsFilter = (reaction, user) => reaction.emoji.name == '➡️' && user.id == msg.author.id;

            const backwards = msg2.createReactionCollector(backwardsFilter, {time: 30000});
            const forwards = msg2.createReactionCollector(forwardsFilter, {time: 30000});
            
            backwards.on('collect', r => {
                if (page == 1) return;
                page--;
                embed.setDescription(pages[page - 1]);
                embed.setFooter(`Page ${page} of ${pages.length}`);
                embed.fields = [];
                embed.addFields(
                    { name: '__**Some user 2**__', value: ':peach: :snail: :yum: :fire: :monkey: :chicken: :dog: :baby:', inline: true },
                    { name: '__**Some user 2**__', value: ':peach: :snail: :yum: :fire: :monkey: :chicken: :dog: :baby:', inline: true },
                    { name: '__**Some user 2**__', value: ':peach: :snail: :yum: :fire: :monkey: :chicken: :dog: :baby:', inline: true },
                    { name: '__**Some user 2**__', value: ':peach: :snail: :yum: :fire: :monkey: :chicken: :dog: :baby:', inline: true },
                    { name: '__**Some user 2**__', value: ':peach: :snail: :yum: :fire: :monkey: :chicken: :dog: :baby:', inline: true },
                    { name: '__**Some user 2**__', value: ':peach: :snail: :yum: :fire: :monkey: :chicken: :dog: :baby:', inline: true },
                    { name: '__**Some user 2**__', value: ':peach: :snail: :yum: :fire: :monkey: :chicken: :dog: :baby:', inline: true },
                    { name: '__**Some user 2**__', value: ':peach: :snail: :yum: :fire: :monkey: :chicken: :dog: :baby:', inline: true },
                    { name: '__**Some user 2**__', value: ':peach: :snail: :yum: :fire: :monkey: :chicken: :dog: :baby:', inline: true }
                );
                msg2.edit(embed);
            });

            forwards.on('collect', r => {
                if (page == pages.length) return;
                page++;
                embed.setDescription(pages[page - 1]);
                embed.setFooter(`Page ${page} of ${pages.length}`);
                embed.fields = [];
                embed.addFields(
                    { name: '__**Some user 2**__', value: ':peach: :snail: :yum: :fire: :monkey: :chicken: :dog: :baby:', inline: true },
                    { name: '__**Some user 2**__', value: ':peach: :snail: :yum: :fire: :monkey: :chicken: :dog: :baby:', inline: true },
                    { name: '__**Some user 2**__', value: ':peach: :snail: :yum: :fire: :monkey: :chicken: :dog: :baby:', inline: true },
                    { name: '__**Some user 2**__', value: ':peach: :snail: :yum: :fire: :monkey: :chicken: :dog: :baby:', inline: true },
                    { name: '__**Some user 2**__', value: ':peach: :snail: :yum: :fire: :monkey: :chicken: :dog: :baby:', inline: true },
                    { name: '__**Some user 2**__', value: ':peach: :snail: :yum: :fire: :monkey: :chicken: :dog: :baby:', inline: true },
                    { name: '__**Some user 2**__', value: ':peach: :snail: :yum: :fire: :monkey: :chicken: :dog: :baby:', inline: true },
                    { name: '__**Some user 2**__', value: ':peach: :snail: :yum: :fire: :monkey: :chicken: :dog: :baby:', inline: true },
                    { name: '__**Some user 2**__', value: ':peach: :snail: :yum: :fire: :monkey: :chicken: :dog: :baby:', inline: true }
                );
                msg2.edit(embed);
            });
        });
    });
}

function donorcard(bot, msg, args) {
    conn.query(`CALL GetStats('${msg.author.id}')`, (err, results) => {

        const embed = new Discord.MessageEmbed()
            .setColor('#b72025')
            .setTitle("__**MY DONOR CARD**__ :heart:")
            .setDescription("You've harvested `" + results[0][0].OrgansCaught + " organs`!\n" + 
                "You've had `" + results[0][0].OrgansStolen + " organs` stolen from you!\n" + 
                "You've successfully captured `" + results[0][0].BodiesCaptured + " bodies`!");
    
            msg.channel.send(embed);
    });
}

function getEmoji(msg, name) {
    let emojidisplay;
    var emoji = "";

    if (name.includes(':')) {
        emoji = name;
    } else {
        emoji = ":" + name + ":"
    }

    return emoji;
}

function removeEmojis (string) {
    var regex = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g;
  
    return string.replace(regex, '');
  }

module.exports.help = {
    name: "harvest"
};