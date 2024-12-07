const {Client, GatewayIntentBits} = require("discord.js")
const {DISCORDID, DISCORDTOKEN } = process.env
class LoggerService{
    constructor(){
        this.client = new Client({
            intents:[
                GatewayIntentBits.DirectMessages,
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent
            ]
        })
        this.channelID = DISCORDID  
        this.client.on("ready", ()=>{
            console.log(`Log is as ${this.client.user.tag}`)
        })
        this.client.login(DISCORDTOKEN)
    }
    sendToFormatCode(logData){
        const {code, message ='This is some additional information about the code.', title = 'Code exam'} = logData
        const codeMessage = {
            content:message,
            embeds:[
                {
                    color: parseInt('00ff00', 16),
                    title:title,
                    description:'```json\n' + JSON.stringify(code, null, 2)+ '\n```'
                }
            ]
        }
        this.sendToMessage(codeMessage) 
    }
    sendToMessage(message = 'message'){
        const channel = this.client.cache.get(this.channelID)
        if(!channel){
            console.error(`couldn't find the channel`, this.channelID)
            return
        }
        channel.send(message).catch(e=> console.error(e))
    }
}

// const loggerService = new LoggerService()
module.exports = new LoggerService()