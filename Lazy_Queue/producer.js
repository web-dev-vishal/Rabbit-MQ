// const amqp = require("amqplib");

// async function setup(message) {
//     const connection = await amqp.connect("amqp://localhost");
//     const channel = await connection.createChannel();

//     const exchangeName = "notifications_exchange";
//     const queueName = "Lazy_notification_queue";
//     const routingKey = "notification.key";

//     await channel.assertExchange(exchangeName, "direct", { durable: true });

//     await channel.assertQueue(queueName, {
//         durable: true,
//         arguments: {
//             "x-queue-node": "lazy"
//         },
//     });

// await channel.bindQueue(queueName, exchangeName, routingKey)

//     channel.publish(exchangeName, routingKey, Buffer.from(message), {
//         persistent: true,
//     });

//     console.log(`Message sent: ${message}`);

//     await channel.close();
//     await connection.close();
// }

// setup(`Hello i am a message`)

const amqp = require("amqplib");

/**
 * Sets up RabbitMQ connection and publishes a message to the exchange
 * @param {string} message - The message to be sent to the queue
 */
async function setup(message) {
    // Establish connection to RabbitMQ server running on localhost
    const connection = await amqp.connect("amqp://localhost");
    
    // Create a channel for communication
    const channel = await connection.createChannel();

    // Define RabbitMQ components
    const exchangeName = "notifications_exchange";
    const queueName = "lazy_notification_queue"; // FIXED: Changed to lowercase to match consumer
    const routingKey = "notification.key";

    // Create a durable exchange (survives broker restart)
    // Type "direct" means messages go to queues with exact routing key match
    await channel.assertExchange(exchangeName, "direct", { durable: true });

    // Create a durable lazy queue
    // Lazy queues move messages to disk as early as possible to save memory
    await channel.assertQueue(queueName, {
        durable: true, // Queue survives broker restart
        arguments: {
            "x-queue-mode": "lazy" // FIXED: Changed from "x-queue-node" to "x-queue-mode"
        },
    });

    // Bind the queue to the exchange with the routing key
    // This tells RabbitMQ to route messages from exchange to queue when routing key matches
    await channel.bindQueue(queueName, exchangeName, routingKey);

    // Publish message to the exchange
    // persistent: true ensures message is saved to disk
    channel.publish(exchangeName, routingKey, Buffer.from(message), {
        persistent: true,
    });

    console.log(`Message sent: ${message}`);

    // Clean up: close channel and connection
    await channel.close();
    await connection.close();
}

// Execute the setup function with a sample message
setup("Hello i am a message");