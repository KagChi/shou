module.exports = {
    voiceLinkNodes: [
        {
            id: 'node-1',
            host: 'localhost',
            auth: 'secure_this',
            port: 3000,
            secure: false,
            delay: 5000
        }
    ],
    clientToken: 'Bot ' + process.env.discordToken,
    prefix: 's!'
}
