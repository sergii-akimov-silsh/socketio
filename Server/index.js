const dotenv = require('dotenv').config();
const server = require('./bundles/server');
const io = require('socket.io')(server);
const redis = require("redis");
const subscriber = redis.createClient(JSON.parse(dotenv.parsed.SOCKET_IO_SUB));
const publisher = redis.createClient(JSON.parse(dotenv.parsed.SOCKET_IO_PUB));
const RedisIO = require('./bundles/redis-io');
const axios = require('axios');

(new RedisIO(dotenv.parsed.SOCKET_IO_NSP, io, subscriber, publisher, dotenv.parsed.SOCKET_IO_CHANNELS.split(',')))
    .listen();

const authMiddleware = (function (socket, next) {
    if (!socket.handshake.query || !socket.handshake.query.token) {
        next(new Error('Token requied'));
    }

    axios.post(
        process.env.SOCKET_IO_VALIDATE_TOKEN,
        {},
        {headers: {Authorization: "Bearer " + socket.handshake.query.token}}
    )
        .then(response => {
            socket.handshake.user_id = response.data.user_id;
            next();
        })
        .catch(error => next(error));
});

io.of('notifications').use(authMiddleware);

io.of('notifications').use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
    next();
});

server.listen(
    dotenv.parsed.SOCKET_IO_WS_SERVER.split(':')[1],
    dotenv.parsed.SOCKET_IO_WS_SERVER.split(':')[0]
);
