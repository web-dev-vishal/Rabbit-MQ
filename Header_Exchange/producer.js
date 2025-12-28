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

announceNewProduct({ id: 123, name: "iphone 20 pro max", price: 200000});