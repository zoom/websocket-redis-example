require('dotenv/config');
const axios = require('axios');
const WebSocket = require('ws');
const Redis = require('ioredis');

// Create a new Redis client
const redis = new Redis({
    host: '127.0.0.1',
    port: 6379
});

let eventCounter = 1; // Initialize event counter

(async () => {
    try {
        const authString = Buffer.from(`${process.env.clientID}:${process.env.clientSecret}`).toString('base64');

        // Request an access token using the account id associated with your app
        let response = await axios.post('https://zoom.us/oauth/token?grant_type=account_credentials&account_id=' + process.env.account_id, {}, {
            headers: {
                Authorization: 'Basic ' + authString
            }
        });

        let access_token = response.data.access_token;

        // Logs your access tokens in the console
        console.log(`access_token: ${access_token}`);

        // Connect to WebSocket
        const zoomWebSocket = new WebSocket(`wss://ws.zoom.us/ws?subscriptionId=${process.env.subscription_id}&access_token=${access_token}`);

        zoomWebSocket.on('open', () => {
            console.log("Connected to WebSocket");

            // Send a heartbeat message
            const msg = {
                module: "heartbeat"
            };
            zoomWebSocket.send(JSON.stringify(msg));
        });

        zoomWebSocket.on('message', (data) => {
            console.log(`Received message: ${data}`);

            // Store the event data in Redis
            redis.set(`zoom_event_${eventCounter}`, JSON.stringify(data));

            eventCounter += 1; // Increment event counter
        });

    } catch (error) {
        console.error('Error:', error);
    }
})();
