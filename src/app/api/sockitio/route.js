import { Server } from 'socket.io';

export default function handler(req, res) {
    if (!res.socket.server.io) {
        const io = new Server(res.socket.server);
        res.socket.server.io = io;

        io.on('connection', (socket) => {
            console.log('User connected');

            socket.on('disconnect', () => {
                console.log('User disconnected');
            });

            // Custom event to notify about new orders
            socket.on('new-order', (orderData) => {
                // Broadcast the order notification to all clients
                socket.broadcast.emit('new-order-notification', orderData);
            });
        });
    }

    res.end();
}
