// const amqp = require("amqplib");

// async function consumerMessage() {
//     const connection = await amqp.connect("amqp://localhost");
//     const channel = await connection.createChannel();

//     const queueName = "lazy_notification_queue";
//     await channel.assertQueue(queueName, {
//         durable: true,
//         arguments: {
//             "x-queue-node": "lazy",
//         },
//     });

//     console.log(`Wating for message in ${queueName}`);

//     channel.consume(queueName, (msg) => {
//         if (msg !== null) {
//             console.log(`Received mesaage: ${msg.content.toString()}`);
//             channel.ack(msg);
//         }
//     });
// }

// consumerMessage();

const amqp = require("amqplib");

/**
 * Connects to RabbitMQ and continuously listens for messages in the queue
 */
async function consumerMessage() {
    // Establish connection to RabbitMQ server running on localhost
    const connection = await amqp.connect("amqp://localhost");
    
    // Create a channel for communication
    const channel = await connection.createChannel();

    // Define the queue name (must match producer's queue name)
    const queueName = "lazy_notification_queue"; // FIXED: Already lowercase, matches producer now

    // Assert the queue exists with same configuration as producer
    await channel.assertQueue(queueName, {
        durable: true, // Queue survives broker restart
        arguments: {
            "x-queue-mode": "lazy", // FIXED: Changed from "x-queue-node" to "x-queue-mode"
        },
    });

    console.log(`Waiting for message in ${queueName}`); // FIXED: Typo "Wating" -> "Waiting"

    // Start consuming messages from the queue
    channel.consume(queueName, (msg) => {
        // Check if message exists (not null)
        if (msg !== null) {
            // Log the received message content
            console.log(`Received message: ${msg.content.toString()}`); // FIXED: Typo "mesaage" -> "message"
            
            // Acknowledge the message (tells RabbitMQ we processed it successfully)
            channel.ack(msg);
        }
    });
}

// Start the consumer
consumerMessage();