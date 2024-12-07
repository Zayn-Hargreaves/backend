const {connectToRabbitMQTest} =require("../dbs/init.rabbitmq")

describe("Rabbitmq Connection", ()=>{
    it('Should connect to successfull RabbitMQ', async()=>{
        const result = await connectToRabbitMQTest()
        expect(result).toBeUndefined();
    })
})