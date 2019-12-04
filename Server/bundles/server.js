const dotenv = require('dotenv').config();
const https = require('https');
const http = require('http');
const fs = require('fs');

let ssl = null;

try {
    ssl = JSON.parse(dotenv.parsed.SOCKET_IO_SSL);
} catch (e) {
    ssl = null
}

const server = ssl ? https.createServer({
    key: fs.readFileSync(ssl.key),
    cert: fs.readFileSync(ssl.cert)
}) : http.createServer();

module.exports = server;