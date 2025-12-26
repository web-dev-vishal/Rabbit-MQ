const amqp = require("amqplib");

const receiveMessage = async () => {
    try {
        const connection = await amqp.connect("amqp://localhost");
        const channel = await connection.createChannel();

        const exchange = "mail_exchange";
        const queue = "payment_queue";

        await channel.assertExchange(exchange, "topic", {durable: false});
        await channel.assertQueue(queue, {durable: true});

        await channel.bindQueue(queue, exchange, "payment.*");

        console.log("Waiting for messages");
        channel.consume(
            queue,
            (msg) => {
                if (msg !== null) {
                    console.log(`[Payment Notification] Msg was consumed! with routingKey: ${msg.fields.routingKey} and content as ${msg.content.toString()}`);
                    channel.ack(msg);
                }
            },
            { noAck: false }
        );

    } catch (error) {
        console.log("Error:", error);
    }
};

receiveMessage();