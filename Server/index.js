const server = require('./bundles/server');
const io = require('socket.io')(server);
const redis = require("redis");
const subscriber = redis.createClient(JSON.parse(process.env.SOCKET_IO_SUB));
const publisher = redis.createClient(JSON.parse(process.env.SOCKET_IO_PUB));
const RedisIO = require('./bundles/redis-io');
const axios = require('axios');

(new RedisIO(process.env.SOCKET_IO_NSP, io, subscriber, publisher, process.env.SOCKET_IO_CHANNELS.split(',')))
    .listen();

const authMiddleware = (function (socket, next) {
    if (!socket.handshake.query || !socket.handshake.query.token) {
        next(new Error('Token requied'));
    }

    console.log('Auth:', socket.handshake.query.token);

    axios.post(
        process.env.SOCKET_IO_VALIDATE_TOKEN,
        {},
        {headers: {Authorization: "Bearer " + socket.handshake.query.token}}
    )
        .then(response => {
            console.log('Auth success', socket.handshake.query.token, response);
            socket.handshake.user_id = response.data.user_id;
            next();
        })
        .catch(error => {
            console.error('Auth error', socket.handshake.query.token, error);
            next(error)
        });
});

io.of('notifications').use(authMiddleware);

server.listen(
    process.env.SOCKET_IO_WS_SERVER.split(':')[1],
    process.env.SOCKET_IO_WS_SERVER.split(':')[0]
);

console.log('Listen');
