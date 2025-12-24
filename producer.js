const amqp = require("amqplib"); 


async function sendMail() {
    try {
        const connection = await amqp.connect("amqp://localhost");
        const channel = await connection.createChannel()
        const exchange = "mail_exchange";
        const routingKey = "send_mail"

        const message = {
            to: "VS@gmail.com",
            from: "guyr07332@gmail.com",
            subject: "Thank you mail",
            body: "Hello VS!!!"
        }

        await channel.assertExchange(exchange, "direct", {durable: false});
        await channel.assertQueue("mail_queue", {durable: false});
        
        await channel.bindQueue("mail_queue", exchange, routingKey)

        channel.publish(exchange, routingKey, Buffer.from(JSON.stringify(message)));
        console.log("Mail data was sent", message);

        setTimeout(()=> {
            connection.close();
        }, 500)


    } catch (error) {
        console.log(error)
    }
}

sendMail();