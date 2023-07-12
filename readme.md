# Disclaimer
The following sample application is a personal, open-source project shared by the app creator and not an officially supported Zoom Video Communications, Inc. sample application. Zoom Video Communications, Inc., its employees and affiliates are not responsible for the use and maintenance of this application. Please use this sample application for inspiration, exploration and experimentation at your own risk and enjoyment. You may reach out to the app creator and broader Zoom Developer community on https://devforum.zoom.us/ for technical discussion and assistance, but understand there is no service level agreement support for this application. Thank you and happy coding!

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
- [Redis server installed and running on your machine] (https://redis.io/docs/getting-started/installation/install-redis-on-mac-os/)

## Installation

Follow these steps to install and set up the application:

1. Clone the repository:

   ```
   git clone https://github.com/ojusave/Zoom-Websocket-Redis-Example.git
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
   user_id=YOUR_USER_ID
   subscription_id=YOUR_SUBSCRIPTION_ID
   ```

   Remember to replace `YOUR_CLIENT_ID`, `YOUR_CLIENT_SECRET`, `YOUR_ACCOUNT_ID`, `YOUR_USER_ID`, and `YOUR_SUBSCRIPTION_ID` with the actual values from your Server to server OAuth app.

## Usage

To start the application, follow these steps:

1. Start the application:

   ```bash
   npm start
   ```

2. Open your web browser and go to [http://localhost:4000](http://localhost:4000). This will begin the authentication process and show the WebSocket events.

   WebSocket events received from Zoom will be logged in the browser console and stored in Redis.

