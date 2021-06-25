const { Client } = require('eris');
const { Manager } = require('kerm.js');
const { voiceLinkNodes } = require('./config');
const config = require('./config');
const client = new Client(config.clientToken, {
    intents: ['guilds', 'guildVoiceStates', 'guildMessages']
});
const youtubei = require("youtubei");
const youtube = new youtubei.Client();
const kermManager = new Manager({
    send: (id, payload) => {
        console.log(id)
        const guild = client.guilds.get(id);
        if(guild) guild.shard.sendWS(payload.op, payload.d);
    },
    nodes: voiceLinkNodes
})
client.once('ready', () => {
    console.log('ready.');
    kermManager.init(client.user.id)
});
client.on('rawWS', (packet) => kermManager.handleClientRaw(packet));
client.on('messageCreate', async (message) => {
    const prefix = config.prefix
    if (!message.content.startsWith(prefix) || message.author.bot) return;
    const args = message.content.slice(prefix.length).trim().split(' ');
	const command = args.shift().toLowerCase();
    switch(command) {
        case 'join': {
            if(!message.member.voiceState.channelID) message.channel.createMessage("please join a voice channel.")
            kermManager.nodes.get('node-1').postSubscription({ userId: client.user.id, guildId: message.guildID, channelId: message.member.voiceState.channelID })
            message.channel.createMessage('joined voice channel.');
            break;
        }
        case 'play': {
            if(!args.length) message.channel.createMessage("please input music name.")
            const videos = await youtube.search(args.join(" "), {
                type: "video",
            });
            kermManager.nodes.get('node-1').postTrack({ userId: client.user.id, guildId: message.guildID, track: 'https://youtube.com/watch?v=' + videos[0].id })
            break;
        }
    }
})
client.connect()
