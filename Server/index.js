const dotenv = require('dotenv').config();
const server = require('./bundles/server');
const io = require('socket.io')(server);
const redis = require("redis");
const subscriber = redis.createClient(JSON.parse(dotenv.parsed.SOCKET_IO_SUB));
const publisher = redis.createClient(JSON.parse(dotenv.parsed.SOCKET_IO_PUB));
const RedisIO = require('./bundles/redis-io');

(new RedisIO(dotenv.parsed.SOCKET_IO_NSP, io, subscriber, publisher, dotenv.parsed.SOCKET_IO_CHANNELS.split(',')))
    .listen();

server.listen(
    dotenv.parsed.SOCKET_IO_WS_SERVER.split(':')[1],
    dotenv.parsed.SOCKET_IO_WS_SERVER.split(':')[0]
);