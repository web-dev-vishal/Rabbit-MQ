const amqp = require("amqplib");


async function sendMail() {
    try {
        const connection = await amqp.connect("amqp://localhost");
        const channel = await connection.createChannel()

        const exchange = "mail_exchange";
        const routingKeyForSubUser = "send_mail_to_subcribed_users"
        const routingKeyForNormalUser = "send_mail_to_users"

        const message = {
            to: "abc@gmail.com",
            from: "guyr07332@gmail.com",
            subject: "Thank you message mail",
            body: "Hello abc!!!"
        }

        await channel.assertExchange(exchange, "direct", { durable: false });

        await channel.assertQueue("subcribed_users_mail_queue", { durable: false });
        await channel.assertQueue("mail_queue", { durable: false });

        await channel.bindQueue("subscribed_usres_mail_queue", exchange, routingKeyForSubUser)
        await channel.bindQueue("usres_mail_queue", exchange, routingKeyForNormalUser)

        channel.publish(exchange, routingKey, Buffer.from(JSON.stringify(message)));
        console.log("Mail data was sent", message);

        setTimeout(() => {
            connection.close();
        }, 500)


    } catch (error) {
        console.log(error)
    }
}

sendMail();