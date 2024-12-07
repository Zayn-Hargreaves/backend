const { Kafka } = require("kafkajs"); // Đảm bảo Kafka được import chính xác

// Khởi tạo Kafka client
const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['localhost:9092'], // Địa chỉ của Kafka broker
});

// Tạo consumer từ instance của Kafka
const consumer = kafka.consumer({ groupId: 'test-group' });

const runConsumer = async () => {
  try {
    await consumer.connect(); // Kết nối đến Kafka
    await consumer.subscribe({ topic: 'test-topic', fromBeginning: true }); // Đăng ký topic cần lắng nghe
    
    // Xử lý từng message
    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        console.log({
          topic,
          partition,
          value: message.value.toString(),
        });
      },
    });
  } catch (error) {
    console.error("Error in consumer: ", error);
  }
};

runConsumer(); // Gọi hàm chạy consumer
