const amqp = require("amqplib");

const announceNewProduct = async (product) => {
    try {
        const connection = await amqp.connect("amqp://localhost");
        const channel = await connection.createChannel();
        const exchange = "new_product_launch";
        const exchangeType = "fanout";

        await channel.assertExchange(exchange, exchangeType, { durable: true });


        
        channel.publish(exchange, routingKey, Buffer.from(JSON.stringify(message)), { persistent: true });

        console.log("[x] Sent '%s': '%s'", routingKey, JSON.stringify(message));
        console.log(`Message was send! with routing key as ${routingKey} and content as ${JSON.stringify(message)}`);

        setTimeout(() => {
            connection.close();
        }, 500);
    } catch (error) {
        console.log("Error:", error);
    }
};

sendMessage("order.placed", { orderId: 12345, status: "placed" });

sendMessage("payment.processed", { paymentId: 6789, status: "processed" });