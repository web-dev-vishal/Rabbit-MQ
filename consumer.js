const amqp = require("amqplib");

async function recvMail() {
    try {
        const connection = await amqp.connect("amqp://localhost");
        const channel = await connection.createChannel()
    } catch (error) {
        console.log(error)
    }

}

recvMail();