// const amqp = require("amqplib");

// const consumeLiveStreamNotifications = async () => {
//     try {
//         const connection = await amqp.connect("amqp://localhost");
//         const channel = await connection.createChannel();
//         const exchange = "header_exchange";
//         const exchangeType = "headers";

//         await channel.assertExchange(exchange, exchangeType, { durable: true });

//         // await channel.assertQueue(queue, {durable: true});

//         const q = await channel.assertExchange("", { exclusive: true });
//         console.log("Waiting for live stream notifiactions");

//         await channel.bindQueue(q.queue, exchange, "", {
//             "x-watch": "all",
//         "notifiaction-type": "Live_stream",
//             "content-type": "gaming"
//         });

//         // console.log("Waiting for messages");
//         channel.consume(q.queue, (msg) => {
//             if (msg !== null) {
//                 const message = msg.content.toString();
//                 console.log(" Recevide new video notification", message);
//                 // Process the notification
//                 console.ack(msg)
//             }
//         });

//     } catch (error) {
//         console.log("Error:", error);
//     }
// };

// consumeLiveStreamNotifications();

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
        console.log("Waiting for live stream notifications");

        await channel.bindQueue(q.queue, exchange, "", {
            "x-match": "all",  // Fixed typo: "x-watch" -> "x-match"
            "notification-type": "Live_stream",  // Fixed typo: "notifiaction-type" -> "notification-type"
            "content-type": "gaming"
        });

        channel.consume(q.queue, (msg) => {
            if (msg !== null) {
                const message = msg.content.toString();
                console.log("Received live stream notification:", message);
                channel.ack(msg);  // Fixed: console.ack -> channel.ack
            }
        });

    } catch (error) {
        console.log("Error:", error);
    }
};

consumeLiveStreamNotifications();