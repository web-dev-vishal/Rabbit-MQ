// const amqp = require("amqplib");

// const sendNotification = async (headers, message) => {
//     try {
//         const connection = await amqp.connect("amqp://localhost");
//         const channel = await connection.createChannel();

//         const exchange = "header_exchange";
//         const exchangeType = "headers";

//         await channel.assertExchange(exchange, exchangeType, { durable: true });

//         // const message = JSON.stringify(product);

//         channel.publish(exchange, "", Buffer.from(message), {
//             persistent: true,
//             headers
//         });
//         console.log("Sent notification with headers");

//         setTimeout(() => {
//             connection.close()
//         }, 500);
//     } catch (error) {
//         console.log("Error:", error);
//     }
// };

// // Example usage
// sendNotification({ "x-match": "all", "notifiaction-type": "new_video", "content-type": "video" }, "New music video uploaded")
// sendNotification({ "x-match": "all", "notifiaction-type": "Live_stream", "content-type": "gaming" }, "Gaming live stream started")
// sendNotification({ "x-match": "any", "notification-type-comment": "comment", "content-type": "vlog" }, "New comment on your vlog")
// sendNotification({ "x-match": "any", "notification-type-like": "like", "content-type": "vlog" }, "New comment on your vlog")


const amqp = require("amqplib");

const sendNotification = async (headers, message) => {
    try {
        const connection = await amqp.connect("amqp://localhost");
        const channel = await connection.createChannel();

        const exchange = "header_exchange";
        const exchangeType = "headers";

        await channel.assertExchange(exchange, exchangeType, { durable: true });

        channel.publish(exchange, "", Buffer.from(message), {
            persistent: true,
            headers  // These headers must match what consumers are binding with
        });
        console.log("Sent notification with headers:", headers);
        console.log("Message:", message);

        setTimeout(() => {
            connection.close()
        }, 500);
    } catch (error) {
        console.log("Error:", error);
    }
};

// CORRECTED: Headers now match the consumer bindings
// Consumer 1: Expects "notification-type": "new_video" AND "content-type": "video" (x-match: all)
sendNotification({ 
    "notification-type": "new_video", 
    "content-type": "video" 
}, "New music video uploaded");

// Consumer 2: Expects "notification-type": "Live_stream" AND "content-type": "gaming" (x-match: all)
sendNotification({ 
    "notification-type": "Live_stream", 
    "content-type": "gaming" 
}, "Gaming live stream started");

// Consumer 3: Expects "notification-type": "comment" OR "content-type": "like" (x-match: any)
sendNotification({ 
    "notification-type": "comment", 
    "content-type": "vlog" 
}, "New comment on your vlog");

// Consumer 3: This will also match because it has "content-type": "like"
sendNotification({ 
    "notification-type": "other", 
    "content-type": "like" 
}, "Someone liked your video");