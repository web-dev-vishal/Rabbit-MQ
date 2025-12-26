const amqp = require("amqplib");

const announceNewProduct = async (product) => {
    try {
        const connection = await amqp.connect("amqp://localhost");
        const channel = await connection.createChannel();

        const exchange = "new_product_launch";
        const exchangeType = "fanout";

        await channel.assertExchange(exchange, exchangeType, { durable: true });

      

        channel.consume(q.queue, (msg) => {
            if (msg !== null) {
                const product = JSON.parse(msg.content.toString());
            }
        })
        
    } catch (error) {
        console.log("Error:", error);
    }
};

announceNewProduct({ id: 123, name: "iphone 20 pro max", price: 200000});