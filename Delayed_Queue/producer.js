const amqp = require("amqplib");

async function sendToDelayedQueue(batchId, orders, delay) { 
}

async function processBatchOrders (batchId, orders, delay) { 
}

function generateBatchId() {
    return "batch-" + Date.now();
}

function collectOrdersForBatch(){

}
async function processOrders(orders) {
    
}

processOrders();