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
        
            // Define the heartbeat message
            const heartbeatMessage = {
                module: "heartbeat"
            };
        
            // Set up a delay for the first heartbeat message
            setTimeout(() => {
                // Start sending heartbeat messages every 55 seconds after the initial delay
                setInterval(() => {
                    zoomWebSocket.send(JSON.stringify(heartbeatMessage));
                    console.log('Heartbeat sent');
                }, 55000); // 55000 milliseconds = 55 seconds
            }, 55000); // Initial delay of 55 seconds
        });
        

        zoomWebSocket.on('message', (data) => {
            console.log(`Received message: ${data}`);

            // Convert the data from a Buffer to a string
            let dataString = data.toString();

                // Parse the string as JSON
            let jsonData = JSON.parse(dataString);

            // Store the event data in Redis
            redis.set(`zoom_event_${eventCounter}`, JSON.stringify(jsonData));

            eventCounter += 1; // Increment event counter
        });

    } catch (error) {
        console.error('Error:', error);
    }
})();
