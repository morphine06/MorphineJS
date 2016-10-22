module.exports = {
    onConnection: (socket) => {
        console.log("Hello from IoSocket",socket.request.headers.cookie);
    }
} ;