// const amqp = require("amqplib");

// async function processBatchOrders() {
//     const connection = await amqp.connect("amqp://localhost");
//     const channel = await connection.createChannel();

//     const queue = "delayed_order_updates_queue";
//     await channel.assertQueue(queue, { durable: true });

//     channel.consume(
//         queue, 
//         async (batch) => {
//             if (batch !== null){
//                 const {batchId, orders} = JSON.parse(batch.content.toString());
//                 console.log(`Processing order update task for batch: ${batchId}`);

//                 // Update order statuses for the batch 
//                 await updateOrderStatus(batchId);

//                 channel.ack(batch);
//             }
//         },
//         { noAck: false }
//     )
// }

// function updateOrderStatus(batchId) {
//     // Simulate order status update
//     return new Promise((resolve) => {
//         setTimeout(()=> {
//             console.log(`Order statuses update to "Stated Shipping" for batch: ${batchId}`)
//         })
//         resolve();
//     }, 1000); //Simulate time taken to update order statuses
// }

// processOrderUpdates();

const amqp = require("amqplib");

async function processOrderUpdates() {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();

    const queue = "delayed_order_updates_queue";
    await channel.assertQueue(queue, { durable: true });

    console.log("Waiting for order update messages...");

    channel.consume(
        queue, 
        async (batch) => {
            if (batch !== null) {
                const { batchId, orders } = JSON.parse(batch.content.toString());
                console.log(`Processing order update task for batch: ${batchId}`);

                // Update order statuses for the batch 
                await updateOrderStatus(batchId);

                channel.ack(batch);
            }
        },
        { noAck: false }
    );
}

function updateOrderStatus(batchId) {
    // Simulate order status update
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log(`Order statuses updated to "Started Shipping" for batch: ${batchId}`);
            resolve();
        }, 1000); // Simulate time taken to update order statuses
    });
}

// Run the consumer
(async () => {
    try {
        await processOrderUpdates();
    } catch (error) {
        console.error("Error in consumer:", error);
        process.exit(1);
    }
})();