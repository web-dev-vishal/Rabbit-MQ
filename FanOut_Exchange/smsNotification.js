const amqp = require("amqplib");

const smsNotification = async (product) => {
    try {
        const connection = await amqp.connect("amqp://localhost");
        const channel = await connection.createChannel();

        const exchange = "new_product_launch";
        const exchangeType = "fanout";

        await channel.assertExchange(exchange, exchangeType, { durable: true });

        const queue = await channel.assertQueue("", { exclusive: true });
        console.log("waiting for mgs => ", queue)

        await channel.bindQueue(queue.queue, exchange, "");

        channel.consume(queue.queue, (msg) => {
            if (msg !== null) {
                const product = JSON.parse(msg.content.toString());
                console.log("Sending SMS notification for produvt =>", product.name);
                console.ack(msg)
            }
        })

    } catch (error) {
        console.log("Error:", error);
    }
};

smsNotification();