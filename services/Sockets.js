module.exports = {
    onConnection: (socket) => {
        console.log("Hello from IoSocket",socket.request.headers.cookie);
    },
    getSocket: (socketId)=> {
        let s = null ;
        if (morphineserver.io.sockets.connected[socketId]) s = morphineserver.io.sockets.connected[socketId] ;
        return s ;
    },
    getSocketsIdInRoom: (room_name)=> {
        let socketIds = [] ;
        if (morphineserver.io.sockets.adapter.rooms[room_name] && morphineserver.io.sockets.adapter.rooms[room_name].sockets) {
            _.each(morphineserver.io.sockets.adapter.rooms[room_name].sockets, (ok, socketId)=> {
                // if (req.io.sockets.connected[socketid].handshake.bo_id==row_bo.bo_id) row_bo.isup = true ;
                if (ok) socketIds.push(socketId) ;
            }) ;
        }
        return socketIds ;
    }
} ;