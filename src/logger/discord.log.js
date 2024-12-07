const {Client, GatewayIntentBits} = require("discord.js")

const client = new Client({
    intents:[
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
})

client.on('ready', ()=>{
    console.log(`Log is as ${client.user.tag}`);
})


client.login(token, ()=>{
    console.log("ok")
})

client.on('messageCreate', msg =>{
    if(msg.content === 'hello'){
        msg.reply("Hello!!!")
    }
})