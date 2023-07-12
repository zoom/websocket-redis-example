// Bring in environment secrets through dotenv
require('dotenv/config')

// Use the axios module to make HTTP requests from Node
const axios = require('axios')

// Run the express app
const express = require('express')
const bodyParser = require('body-parser')
const app = express()

// Import Redis client
const Redis = require('ioredis');
const redis = new Redis({
    host: '127.0.0.1',
    port: 6379
});

// Express middleware for parsing JSON bodies
app.use(bodyParser.json());

app.get('/', async (req, res) => {
    try {
        const authString = Buffer.from(`${process.env.clientID}:${process.env.clientSecret}`).toString('base64');

        // Request an access token using the account id associated with your app
        let response = await axios.post('https://zoom.us/oauth/token?grant_type=account_credentials&account_id=' + process.env.account_id, {}, {
            headers: {
                Authorization: 'Basic ' + authString
            }
        });

        let bwt = response.data.access_token;

        // Logs your access tokens in the browser
        console.log(`access_token: ${bwt}`);

        // We can now use the access token to authenticate API calls
        // Send a request to get your user information using the userID of the user.
        let userResponse = await axios.get(`https://api.zoom.us/v2/users/${process.env.user_id}`, {
            headers: { Authorization: `Bearer ${bwt}` }
        });
        
        console.log(`User Id is ${process.env.user_id}`);
        console.log('API call ', userResponse.data);

        // Display Websocket in browser
        res.send(generateHTML(bwt));
    } catch (error) {
        console.error('Error:', error);
    }
});
let eventCounter = 1; // Initialize event counter

app.post('/store-event', async (req, res) => {
    try {
        
        // Prepare the data
        const eventData = JSON.stringify({
            //Number: eventCounter,
            Payload: req.body.eventData,
            //Time: localTime
        });

        // Increment the event counter
        eventCounter++;

        // Push event data to a list
        await redis.rpush('events', eventData);

        res.send({ status: 'success' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send({ status: 'error', message: 'An error occurred' });
    }
});







app.listen(4000, () => console.log(`Zoom Hello World app listening at PORT: 4000`))

function generateHTML(bwt) {
    return `
        <html>
            <head>
                <title>websocket</title>
            </head>
            <body>
                <script>
                    var exampleSocket = new WebSocket("wss://ws.zoom.us/ws?subscriptionId=${process.env.subscription_id}&access_token=${bwt}");

                    exampleSocket.onopen = function (event) {
                        log("Connection...");
                        var msg = {
                            module: "heartbeat"
                        };
                        exampleSocket.send(JSON.stringify(msg));
                    };
                    
                    exampleSocket.onmessage = function (event) {
                        console.log(JSON.stringify(event.data));
                        log(event.data);

                        // Send a POST request to store the event data
                        fetch('/store-event', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ eventData: typeof event.data === 'string' ? JSON.parse(event.data) : event.data }),

                        })
                        .then(response => response.json())
                        .then(data => console.log('Event data stored:', data))
                        .catch((error) => {
                            console.error('Error:', error);
                        });
                    }
                    
                    exampleSocket.onclose = function(event){
                        console.log(JSON.stringify(event));
                        console.log(event);
                    }
                    
                    var t = setInterval(function(){ 
                        var msg = {
                            module: "heartbeat"
                        };
                        exampleSocket.send(JSON.stringify(msg));
                        log(JSON.stringify(msg));
                    }, 25000);

                    
                    function log(text){
                        var txt = document.createTextNode(text);
                        var p = document.createElement("p");
                        p.appendChild(txt);
                        document.body.appendChild(p);
                    }
                </script>
            </body>
        </html>
    `;
}
