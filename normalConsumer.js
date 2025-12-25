const amqp = require("amqplib");

async function recvMail() {
    try {
        const connection = await amqp.connect("amqp://localhost");
        const channel = await connection.createChannel()

        await channel.assertQueue("usres_mail_queue", { durable: false });

        channel.consume("usres_mail_queue", (message) => {
            if (message !== null) {
                console.log("Recv message for Normal user", JSON.parse(message.content));
                channel.ack(message);
            }
        })
    } catch (error) {
        console.log(error)
    }
}

recvMail();