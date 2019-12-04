class RoomIO {
    constructor(socket) {
        this.socket = socket;
        this.room = [];
    }

    name() {
        return this.room[this.socket.id] || null;
    }

    join(room) {
        this.leave();

        // Do not join for channel
        if (Number(this.socket.handshake.user_id) !== Number(room.split('.')[1])) {
            return;
        }

        this.room[this.socket.id] = room;

        this.socket.join(room);
    }

    leave() {
        this.socket.leave(this.room[this.socket.id]);
    }
}

module.exports = RoomIO;