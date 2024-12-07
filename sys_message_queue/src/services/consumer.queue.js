const { consumerQueue, connectToRabbitMQ } = require("../dbs/init.rabbitmq");

const messageService = {
    consumerToQueue: async(queueName)=>{
        try {
            const {channel, connection} = await connectToRabbitMQ()
            await consumerQueue(channel, queueName)
        } catch (error) {
            console.log(error)
        }
    },
    consumerToQueueNomal: async(queueName)=>{
        try {
            const {channel, connection} = await connectToRabbitMQ()
            const notiQueue = "notificationQueueProcess"
            channel.consume(notiQueue, msg =>{
                console.log("Send notificationQueue Sucessfully processed", msg.content.toString())
                channel.ack(msg)
            })
        } catch (error) {
            console.log(error);
            throw error
        }
    },
    consumerToQueueFailsed: async(queueName)=>{
        try {
            const {channel,connection} = await connectToRabbitMQ();
            const notificaitionExchangeDLX = "notificationExDLX";
            const notificaitionRoutingKeyDLX = "notificationRoutingKeyDLX";
            const notiQueueHandler = 'notificationQueueHotFix';
            await channel.assertExchange(notificaitionExchangeDLX, 'direct',{
                durable:true,
            })
            const queueResult = await channel.assertQueue(notiQueueHandler,{
                exclusive:false
            })
            await channel.bindQueue(queueResult.queue, notificaitionExchangeDLX, notificaitionRoutingKeyDLX);
            await channel.consume(queueResult.queue, msgFailsed=>{
                console.log("this notification error: pls hot fix", msgFailsed.content.toString())
            },{
                noAck:true
            })
        } catch (error) {
            console.log(error);
            throw error
        }
    }
}

module.exports = messageService 