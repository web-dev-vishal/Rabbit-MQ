const amqp = require("amqplib");

const consumeLiveStreamNotifications = async () => {
    try {
        const connection = await amqp.connect("amqp://localhost");
        const channel = await connection.createChannel();
        const exchange = "header_exchange";
        const exchangeType = "headers";

        await channel.assertExchange(exchange, exchangeType, { durable: true });

        // await channel.assertQueue(queue, {durable: true});

        const q = await channel.assertExchange("", { exclusive: true });
        console.log("Waiting for live stream notifiactions");

        await channel.bindQueue(q.queue, exchange, "", {
            "x-watch": "any",
            "notifiaction-type": "comment",
            "content-type": "like"
        });

        // console.log("Waiting for messages");
        channel.consume(q.queue, (msg) => {
            if (msg !== null) {
                const message = msg.content.toString();
                console.log(" Recevide new video notification", message);
                // Process the notification
                console.ack(msg)
            }
        });

    } catch (error) {
        console.log("Error:", error);
    }
};

consumeLiveStreamNotifications();