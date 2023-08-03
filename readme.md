# Zoom Websocket Redis Example

This repository is a sample application that demonstrates how to:
1. Generate a server to server OAuth Token
2. Open a Websocket Connection
3. Store the received websocket payload to redis database

## Prerequisites

Before running the application, make sure you have the following requirements:

- Node.js installed on your computer
- A Zoom account 
- [Server to server Oauth app](https://developers.zoom.us/docs/internal-apps/create/) with [Websocket Configured](https://developers.zoom.us/docs/api/rest/websockets/)  ( required to get these credentials: client ID, client secret, account ID, user ID, subscription ID)
- [Redis server installed and running on your machine](https://redis.io/docs/getting-started/installation/install-redis-on-mac-os/)

## Installation

Follow these steps to install and set up the application:

1. Clone the repository:

   ```
   git clone [https://github.com/ojusave/Zoom-Websocket-Redis-Example.git](https://github.com/zoom/websocket-redis-example)
   ```

2. Go to the project directory:

   ```
   cd Zoom-Websocket-Redis-Example
   ```

3. Install the dependencies:

   ```
   npm install
   ```

4. Configure the environment variables by creating a `.env` file in the main directory and adding the necessary values:

   ```
   clientID=YOUR_CLIENT_ID
   clientSecret=YOUR_CLIENT_SECRET
   account_id=YOUR_ACCOUNT_ID
   subscription_id=YOUR_SUBSCRIPTION_ID
   ```

   Remember to replace `YOUR_CLIENT_ID`, `YOUR_CLIENT_SECRET`, `YOUR_ACCOUNT_ID`, and `YOUR_SUBSCRIPTION_ID` with the actual values from your Server to server OAuth app.

## Usage

To start the application, follow these steps:

1. Start the application:

   ```
   npm start
   ```

The console will display the access token, user information, WebSocket connection status.

2. Whenever you trigger the event that you have subscribed in the zoom app (for example meeting created / updated / deleted), you can see the payload in your console.

3. Verify that the received event data is logged in the console and stored successfully in your redis database, as indicated by the output messages.
