const amqp = require("amqplib");

async function setup (message) {
    const connection  = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();

    const exchangeName = "notifications_exchange";
    const queueName = "Lazy_notification_queue";
    const routingKey = "notification.key";
}