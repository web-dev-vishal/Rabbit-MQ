const amqp = require("amqplib");

const consumeLiveStreamNotifications = async () => {
    try {
        const connection = await amqp.connect("amqp://localhost");
        const channel = await connection.createChannel();
        const exchange = "header_exchange";
        const exchangeType = "headers";

        await channel.assertExchange(exchange, exchangeType, { durable: true });

        // Changed assertExchange to assertQueue - this fixes the error!
        const q = await channel.assertQueue("", { exclusive: true });
        console.log("Waiting for any watching stream notifications");

        await channel.bindQueue(q.queue, exchange, "", {
            "x-match": "any",  // Fixed typo: "x-watch" -> "x-match"
            "notification-type": "comment",  // Fixed typo: "notifiaction-type" -> "notification-type"
            "content-type": "like"
        });

        channel.consume(q.queue, (msg) => {
            if (msg !== null) {
                const message = msg.content.toString();
                console.log("Received notification:", message);
                channel.ack(msg);  // Fixed: console.ack -> channel.ack
            }
        });

    } catch (error) {
        console.log("Error:", error);
    }
};

consumeLiveStreamNotifications();