# RabbitMQ Producer-Consumer Implementation

A simple Node.js implementation demonstrating message queuing using RabbitMQ with producer and consumer patterns.

---

## 🎯 Main Points (Quick Summary)

### What This Project Does:
- **Sends messages** from a Producer to RabbitMQ
- **Receives messages** in a Consumer from RabbitMQ
- Uses **Lazy Queues** for memory-efficient message storage
- Implements **durable** queues and **persistent** messages (data survives restarts)

### Why Use RabbitMQ:
- **Decouples** applications (producer and consumer don't need to run at the same time)
- **Reliable** message delivery with acknowledgments
- **Scalable** - can handle thousands of messages
- **Flexible** routing with exchanges and routing keys

### Key Components:
1. **Producer** (`producer.js`) - Sends "Hello i am a message" to the exchange
2. **Consumer** (`consumer.js`) - Listens continuously and processes incoming messages
3. **Exchange** - Routes messages based on routing key
4. **Queue** - Stores messages until consumer processes them
5. **Routing Key** - Connects exchange to queue ("notification.key")

### Quick Start:
```bash
# Terminal 1 - Start Consumer
node consumer.js

# Terminal 2 - Send Message
node producer.js
```

### Result:
- Producer sends message → Consumer receives and displays it
- Message flow: `Producer → Exchange → Queue → Consumer`

---

## 📋 Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Project Structure](#project-structure)
- [Key Concepts](#key-concepts)
- [How It Works](#how-it-works)
- [Usage](#usage)
- [Configuration](#configuration)
- [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

This project demonstrates a basic RabbitMQ messaging system with:
- **Producer**: Sends messages to a RabbitMQ exchange
- **Consumer**: Receives and processes messages from a queue
- **Lazy Queue**: Optimized for handling large numbers of messages by storing them on disk

---

## ✅ Prerequisites

Before running this project, ensure you have:

1. **Node.js** (v14 or higher)
2. **RabbitMQ Server** installed and running
3. **npm** (Node Package Manager)

### Installing RabbitMQ

**On Ubuntu/Debian:**
```bash
sudo apt-get update
sudo apt-get install rabbitmq-server
sudo systemctl start rabbitmq-server
```

**On macOS (using Homebrew):**
```bash
brew install rabbitmq
brew services start rabbitmq
```

**On Windows:**
- Download from [RabbitMQ official website](https://www.rabbitmq.com/download.html)
- Install and start the service

**Verify RabbitMQ is running:**
```bash
sudo systemctl status rabbitmq-server  # Linux
brew services list                      # macOS
```

RabbitMQ Management Console: `http://localhost:15672` (default credentials: guest/guest)

---

## 📦 Installation

1. **Clone or create your project directory**
```bash
mkdir rabbitmq-demo
cd rabbitmq-demo
```

2. **Initialize npm and install dependencies**
```bash
npm init -y
npm install amqplib
```

3. **Create the producer and consumer files**
- `producer.js` - Sends messages
- `consumer.js` - Receives messages

---

## 📁 Project Structure

```
rabbitmq-demo/
│
├── producer.js          # Publishes messages to exchange
├── consumer.js          # Consumes messages from queue
├── package.json         # Project dependencies
└── README.md            # This file
```

---

## 🧠 Key Concepts

### 1. **Exchange**
- Acts as a message router
- Receives messages from producers and routes them to queues
- **Type: Direct** - Routes messages to queues based on exact routing key match

### 2. **Queue**
- Stores messages until consumers retrieve them
- **Durable**: Queue survives broker restarts
- **Lazy Mode**: Messages are stored on disk rather than in memory (better for large queues)

### 3. **Routing Key**
- A string used to route messages from exchange to queue
- Must match for message delivery in direct exchanges

### 4. **Binding**
- Links an exchange to a queue using a routing key
- Defines the routing rules

### 5. **Message Acknowledgment (ACK)**
- Consumer confirms message was processed successfully
- Prevents message loss if consumer fails

### 6. **Persistent Messages**
- Messages are saved to disk
- Survive broker restarts

---

## ⚙️ How It Works

### Producer Flow:
```
1. Connect to RabbitMQ server
2. Create a channel
3. Declare exchange (notifications_exchange)
4. Declare queue (lazy_notification_queue)
5. Bind queue to exchange with routing key
6. Publish message to exchange
7. Close connection
```

### Consumer Flow:
```
1. Connect to RabbitMQ server
2. Create a channel
3. Declare queue (same as producer)
4. Start consuming messages
5. Process each message
6. Acknowledge message (ACK)
7. Wait for more messages (keeps connection open)
```

### Visual Flow:
```
Producer → Exchange (notifications_exchange)
              ↓ (routing key: notification.key)
          Queue (lazy_notification_queue)
              ↓
          Consumer
```

---

## 🚀 Usage

### Step 1: Start the Consumer
The consumer must be running first to receive messages.

```bash
node consumer.js
```

**Output:**
```
Waiting for message in lazy_notification_queue
```

### Step 2: Run the Producer
In a new terminal, send a message:

```bash
node producer.js
```

**Output:**
```
Message sent: Hello i am a message
```

### Step 3: Check Consumer Output
The consumer terminal will show:

```
Received message: Hello i am a message
```

---

## ⚙️ Configuration

### Connection URL
Default: `amqp://localhost`

For remote RabbitMQ or with credentials:
```javascript
await amqp.connect("amqp://username:password@hostname:5672");
```

### Queue Configuration

**Lazy Queue** (Current Implementation):
```javascript
{
    durable: true,
    arguments: {
        "x-queue-mode": "lazy"
    }
}
```

**Standard Queue** (Alternative):
```javascript
{
    durable: true
}
```

### Exchange Types

Current: **Direct Exchange**
- Messages route to queues with exact routing key match

Alternatives:
- **Fanout**: Routes to all bound queues (broadcasting)
- **Topic**: Routes based on pattern matching
- **Headers**: Routes based on message headers

---

## 🔧 Troubleshooting

### Error: Connection Refused
**Problem:** RabbitMQ server is not running

**Solution:**
```bash
# Linux
sudo systemctl start rabbitmq-server

# macOS
brew services start rabbitmq

# Windows
net start RabbitMQ
```

### Error: Queue/Exchange Not Found
**Problem:** Consumer started before producer created the queue

**Solution:** Run producer first, or ensure both declare the same queue

### Messages Not Being Received
**Possible causes:**
1. Queue name mismatch between producer and consumer
2. Routing key mismatch
3. Consumer not running
4. Messages not persistent and broker restarted

**Check:**
- Queue names are identical (case-sensitive)
- Routing keys match
- Consumer is actively running

### View Queue Status
Access RabbitMQ Management Console:
```
http://localhost:15672
```
Login: `guest` / `guest`

---

## 📚 Additional Resources

- [RabbitMQ Official Documentation](https://www.rabbitmq.com/documentation.html)
- [AMQP 0-9-1 Model Explained](https://www.rabbitmq.com/tutorials/amqp-concepts.html)
- [amqplib NPM Package](https://www.npmjs.com/package/amqplib)

---

## 📝 Notes

- **Lazy Queues** are ideal for scenarios with:
  - Large numbers of messages
  - Messages that stay in queue for extended periods
  - Memory constraints

- Always close connections in producer after sending messages
- Keep consumer connections open to continuously receive messages
- Use error handling in production environments

---

## 🎓 Learning Exercise

Try modifying the code to:
1. Send multiple messages in a loop
2. Add error handling with try-catch blocks
3. Implement different exchange types (fanout, topic)
4. Create multiple consumers for load balancing
5. Add message priorities
6. Implement dead letter exchanges for failed messages

---

**Happy Coding! 🚀**