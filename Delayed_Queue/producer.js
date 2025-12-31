const amqp = require("amqplib");

async function sendToDelayedQueue(batchId, orders, delay) {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();

    const exchange = "delayed_exchange";
    await channel.assertExchange(exchange, "x-delayed-message", {
        arguments: { "x-delayed-type": "direct" },
    });

    const queue = "delayed_order_updates_queue";
    await channel.assertQueue(queue, { durable: true });
    await channel.bindQueue(queue, exchange, "");

    const message = JSON.stringify({ batchId, orders });
    channel.publish(exchange, "", Buffer.from(message), {
        headers: { "x-delay": delay },
    });
    console.log("-------------------------------------------\n")
    console.log(`Sent batch ${batchId} update task to delayed queue with ${delay} ms delay`);
    console.log("-------------------------------------------\n")

    await channel.close();
    await connection.close();
}

async function processBatchOrders() {
    const batchId = generateBatchId();
    const orders = collectOrdersForBatch();

    console.log("-------------------------------------------\n")
    console.log(`Processing batch ${batchId} with orders: ${JSON.stringify(orders)}`);
    console.log("------------------------------------------- \n")

    // Update inventory, generate shipping labels, etc.
    await processOrders(orders);

    // Send delayed message to update order status
    const delay = 5000; // 10 sec
    await sendToDelayedQueue(batchId, orders, delay);
}

function generateBatchId() {
    return "batch-" + Date.now();
}

function collectOrdersForBatch() {
    // Collect orders for the current batch 
    return [
        { orderId: 1, item: "Laptop", quantity: 1 },
        { orderId: 2, item: "Phone", quantity: 2 }
    ];
}

async function processOrders(orders) {
    // Process orders logic here
    console.log("Processing orders...");
}

// Run the producer
(async () => {
    try {
        await processBatchOrders();
        console.log("Batch orders processed successfully");
        process.exit(0);
    } catch (error) {
        console.error("Error in producer:", error);
        process.exit(1);
    }
})();