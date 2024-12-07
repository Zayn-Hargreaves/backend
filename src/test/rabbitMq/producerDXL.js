const amqp = require("amqplib")
const message ="hello world"

const runProducer = async()=>{
    try {
        const connection = await amqp.connect("amqp://localhost")
        const channel = await connection.createChannel("");
        const notificationExchange = 'notificationEX'; // notificationEX direct thanh cong
        const notiQueue = "notificationQueueProcess"; //asert queue xử lý 
        const notificationExchangeDLX = "notificationExDLX"; //notification direct thất bại
        const notificationRoutingKeyDLX = "notificaitionRoutingKeyDLX"; // assert 
        // 1. create exchange
        await channel.assertExchange(notificationExchange,"direct",{durable:true})
        // 2. creat queue
        const queueResult = await channel.assertQueue(notiQueue, {
            exclusive:false, // cho phép các kết nối khác truy cập vào hàng đợi 
            deadLetterExchange:notificationExchangeDLX,
            deadLetterRoutingKey:notificationRoutingKeyDLX
        }) 
        // nếu tin nhắn hết hạn thì nó sẽ gửi đến khóa định tuyến được chỉ định bởi deadLetterRoutringKey
        // 3.bind Queue
        await channel.bindQueue(queueResult.queue, notificationExchange)
        // liên kết gưiar queue name và notificatonExchange, diềud này có nghĩa là các mesage đã publish cảu notificationExchange sẽ được định tuyến đến notiQueue
        // 4.sendmesage
        const msg = "a new product"
        console.log(`producer msg:: `, msg)
        channel.sendToQueue(queueResult.queue, Buffer.from(msg),{
            expiration:10000
        })
    } catch (error) {
        console.error(error)
    }
}
runProducer().catch(console.error)