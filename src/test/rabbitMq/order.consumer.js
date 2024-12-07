const amqp = require("amqplib")
async function ConsumerOrderMessage() {
    const connection = await amqp.connect("amqp://localhost")
    const channel = await connection.createChannel("");
    const queueName = 'order-queue-message';
    await channel.assertQueue(queueName, {
        durable: true,
    })
    channel.prefetch(1)
    channel.consume(queueName, msg=>{
        const message = msg.content.toString()
        setTimeout(() => {
            console.log(`Processed::`, message)
            channel.ack(message)
        }, Math.random * 1000   );
    })
}

ConsumerOrderMessage().catch(error=> console.log(error))
