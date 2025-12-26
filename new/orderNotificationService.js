const amqp = require("amqplib");

const receiveMessage = async () => {
    try {
        const connection = await amqp.connect("amqp://localhost");
        const channel = await connection.createChannel()

        const exchange = "norification_exchange";
        const queue = "order_queue";

        await channel.assertExchange (exchange, "topic", {durable: true});
        await channel.assertQueue (queue, {durable: true});

        await channel.bindQueue(queue, exchange, "order.*")

        console.log("Waiting for messages");
        channel.consume(
        queue,
        (msg) => {
            if (msg !== null) {
                console.log(`[Order Notification] Msg was consumed! with routingKey`);
                channel.ack(msg);
            };
        },{ noAck: false}
        )

    } catch (error) {
        console.log("Error:", error)
    }
};

receiveMessage();