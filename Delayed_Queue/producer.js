const amqp = require("amqplib");

async function sendToDelayedQueue(batchId, orders, delay) {
}

async function processBatchOrders(batchId, orders, delay) {
    const batchId = generateBatchId();
    const orders = collectOrdersForBatch();

    console.log(`Processing batch ${batchId} with orders: ${JSON.stringify(orders)}`);

    //Update inventory, generate shipping labels, etc.
    await processOrders(orders);

    // Send delayed message to update order status
    const delay = 10000; // 10 sec
    sendToDelayedQueue(batchId, orders, delay)
}

function generateBatchId() {
    return "batch-" + Date.now();
}

function collectOrdersForBatch() {
    // Collect orders for the current batch 
    return [
        { orderId: 1, item: "Laptop", quantity: 1 },
        { orderId: 2, item: "Phone", quantity: 2 }
    ]

}
async function processOrders(orders) {

}

processOrders();