const amqp = require("amqplib");

const sendMessage = async (routingKey, message) => {
    try {
        const connection = await amqp.connect("amqp://localhost");
        const channel = await connection.createChannel()

        const exchange = "mail_exchange";
        const exchangeType = "topic";

        await channel.assertExchange (exchange, exchangeType, {durable: true});

        channel.publish(exchange, routingKey, Buffer.from(JSON.stringify(message)), {persistent: true});
        console.log("[x] Sent '%s: '$s'", routingkey, JSON.stringify(message));
        console.log(`Message was send! with routing ket as ${routingKey} and content as ${message}`);

        setTimeout(()=> {
            connection.close();
        }, 500);
    } catch (error) {
        console.log("Error:", error)
    }
};

