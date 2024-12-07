const { consumerToQueue, consumerToQueueNomal, consumerToQueueFailsed } = require("./src/services/consumer.queue")

const queueName = 'test-topic'
// consumerToQueue(queueName).then(()=>{
//     console.log(`Message consumer started:: ${queueName}`, )
// }).catch(console.error())
consumerToQueueNomal(queueName).then(()=>{
    console.log(`Message consumer nomal started:: ${queueName}`, )
}).catch(console.error())
consumerToQueueFailsed(queueName).then(()=>{
    console.log(`Message consumer failsed started:: ${queueName}`, )
}).catch(console.error())