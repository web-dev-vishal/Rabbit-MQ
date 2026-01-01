const amqp = require("amqplib");

async function setup(message) {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();

    const exchangeName = "notifications_exchange";
    const queueName = "Lazy_notification_queue";
    const routingKey = "notification.key";

    await channel.assertExchange(exchangeName, "direct", { durable: true });

    await channel.assertQueue(queueName, {
        durable: true,
        arguments: {
            "x-queue-node": "lazy"
        },
    });

    await channel.bindQueue(queueName, exchangeName, routingKey)

    channel.publish(exchangeName, routingKey, Buffer.from(message), {
        persistent: true,
    });

    console.log(`Message sent: ${message}`);

    await channel.close();
    await connection.close();
}

setup(`Hello i am a message`)