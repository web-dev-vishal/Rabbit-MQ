const amqp = require("amqplib");

const sendNotification = async (headers, message) => {
    try {
        const connection = await amqp.connect("amqp://localhost");
        const channel = await connection.createChannel();

        const exchange = "header_exchange";
        const exchangeType = "headers";

        await channel.assertExchange(exchange, exchangeType, { durable: true });

        // const message = JSON.stringify(product);

        channel.publish(exchange, "", Buffer.from(message), {
            persistent: true,
            headers
        });
        console.log("Sent notification with headers");

        setTimeout(() => {
            connection.close()
        }, 500);
    } catch (error) {
        console.log("Error:", error);
    }
};

// Example usage
sendNotification({ "x-match": "all", "notifiaction-type": "new_video",  "content-type": "video"}, "New music video uploaded")
sendNotification({ "x-match": "all", "notifiaction-type": "Live_stream", "content-type": "gaming" }, "Gaming live stream started")
sendNotification({ "x-match": "any", "notification-type-comment": "comment", "content-type": "vlog" }, "New comment on your vlog")
sendNotification({ "x-match": "any", "notification-type-like": "like",  "content-type": "vlog"}, "New comment on your vlog")