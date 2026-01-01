const amqp = require("amqplib");

async function consumerMessage() {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();

    const queueName = "lazy_notification_queue";
    await channel.assertQueue(queueName, {
        durable: true,
        arguments: {
            "x-queue-node": "lazy",
        },
    });

    console.log(`Wating for message in ${queueName}`);

    channel.consume(queueName, (msg) => {
        if (msg !== null) {
            console.log(`Received mesaage: ${msg.content.toString()}`);
            channel.ack(msg);
        }
    });
}

consumerMessage();