// const amqp = require("amqplib");

// const consumeNewVideoNotifications = async () => {
//     try {
//         const connection = await amqp.connect("amqp://localhost");
//         const channel = await connection.createChannel();
//         const exchange = "header_exchange";
//         const exchangeType = "headers";

//         await channel.assertExchange(exchange, exchangeType, { durable: true });

//         // await channel.assertQueue(queue, {durable: true});

//         const q = await channel.assertExchange("", { exclusive: true });
//         console.log("Waiting for new video notifiactions");

//         await channel.bindQueue(q.queue, exchange, "", {
//             "x-watch": "all",
//             "notifiaction-type": "new_video",
//             "content-type": "video"
//         });

//         // console.log("Waiting for messages");
//         channel.consume(q.queue, (msg) => {
//             if (msg !== null) {
//                 const message = msg.content.toString();
//                 console.log(" Recevide new video notification", message);
//                 console.ack(msg)
//             }
//         });

//     } catch (error) {
//         console.log("Error:", error);
//     }
// };

// consumeNewVideoNotifications();

const amqp = require("amqplib");

const consumeNewVideoNotifications = async () => {
    try {
        const connection = await amqp.connect("amqp://localhost");
        const channel = await connection.createChannel();
        const exchange = "header_exchange";
        const exchangeType = "headers";

        await channel.assertExchange(exchange, exchangeType, { durable: true });

        // Changed assertExchange to assertQueue - this was the bug!
        const q = await channel.assertQueue("", { exclusive: true });
        console.log("Waiting for new video notifications");

        await channel.bindQueue(q.queue, exchange, "", {
            "x-match": "all",  // Fixed typo: "x-watch" -> "x-match"
            "notification-type": "new_video",  // Fixed typo: "notifiaction-type" -> "notification-type"
            "content-type": "video"
        });

        channel.consume(q.queue, (msg) => {
            if (msg !== null) {
                const message = msg.content.toString();
                console.log("Received new video notification:", message);
                channel.ack(msg);  // Fixed: console.ack -> channel.ack
            }
        });

    } catch (error) {
        console.log("Error:", error);
    }
};

consumeNewVideoNotifications();