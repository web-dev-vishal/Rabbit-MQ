const amqp = require("amqplib");

async function processBatchOrders() {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();

    const queue = "delayed_order_updates_queue";
    await channel.assertQueue(queue, { durable: true });

    channel.consume(
        queue, 
        async (msg) => {
            if (msg !== null){
                const {batchId} = JSON.parse(msg.content.toString());
                console.log(`Processing order update task for batch: ${batchId}`);

                // Update order statuses for the batch 
                await updateOrderStatus(batchId);

                channel.ack(msg);
            }
        },
        { noAck: false }
    )
}