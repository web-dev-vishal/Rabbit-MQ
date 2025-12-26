const amqp = require("amqplib");

const receiveMessage = async () => {
    try {
        const connection = await amqp.connect("amqp://localhost");
        const channel = await connection.createChannel()

        const exchange = "norification_exchange";
        const queue = "order_queue";

        await channel.assertExchange (exchange, "topic", {durable: true});
        await channel.assertExchange (queue, {durable: true});

        console.log("[x] Sent '%s: '$s'", routingkey, JSON.stringify(message));
        console.log(`Message was send! with routing ket as ${routingKey} and content as ${message}`);

        setTimeout(()=> {
            connection.close();
        }, 500);
    } catch (error) {
        console.log("Error:", error)
    }
};

sendMessage("order.placed", {orderId: 12345, status: "placed"});

sendMessage("payment.processed", {paymentId: 6789, status: "proccessed"})