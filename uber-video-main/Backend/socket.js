const socketIo = require('socket.io');
const userModel = require('./models/user.model');
const captainModel = require('./models/captain.model');

let io;

function initializeSocket(server) {
    io = socketIo(server, {
        cors: {
            origin: [
                "http://localhost:5173",
                "http://localhost:3000",
                "https://uber-clone-main.vercel.app",
                "https://uber-clone-main-1.onrender.com",
                "https://*.vercel.app"
            ],
            methods: ["GET", "POST"],
            credentials: true,
            allowedHeaders: ["Content-Type", "Authorization"]
        }
    });

    io.on('connection', (socket) => {
        console.log(`✅ Client connected: ${socket.id}`);

        socket.on('join', async (data) => {
            try {
                const { userId, userType } = data;

                if (!userId || !userType) {
                    return socket.emit('error', { 
                        message: 'userId and userType required' 
                    });
                }

                if (userType === 'user') {
                    await userModel.findByIdAndUpdate(userId, { 
                        socketId: socket.id 
                    });
                    socket.join(`user_${userId}`);
                } else if (userType === 'captain') {
                    await userModel.findByIdAndUpdate(userId, { 
                        socketId: socket.id 
                    });
                    socket.join(`captain_${userId}`);
                }

                console.log(`User ${userType} ${userId} joined with socket ${socket.id}`);
                socket.emit('joined', { success: true, socketId: socket.id });

            } catch (error) {
                console.error('Join error:', error);
                socket.emit('error', { message: 'Join failed' });
            }
        });

        socket.on('update-location-captain', async (data) => {
            try {
                const { userId, location } = data;

                if (!location?.lat || !location?.lng) {
                    return socket.emit('error', { 
                        message: 'Invalid location data: lat/lng required' 
                    });
                }

                await captainModel.findByIdAndUpdate(userId, {
                    location: {
                        lat: location.lat,
                        lng: location.lng
                    },
                    lastActive: new Date()
                });

                console.log(`Captain ${userId} location updated:`, location);
                socket.emit('location-updated', { success: true });

            } catch (error) {
                console.error('Location update error:', error);
                socket.emit('error', { message: 'Location update failed' });
            }
        });

        socket.on('find-nearby-captains', async (data) => {
            try {
                const { userId, location, radius = 5000 } = data;
                
                socket.emit('nearby-captains', { captains: [] });
                
            } catch (error) {
                socket.emit('error', { message: 'Find captains failed' });
            }
        });

        socket.on('disconnect', async () => {
            console.log(`❌ Client disconnected: ${socket.id}`);
            
            try {
                await userModel.updateMany({ socketId: socket.id }, { socketId: null });
                await captainModel.updateMany({ socketId: socket.id }, { socketId: null });
            } catch (error) {
                console.error('Disconnect cleanup error:', error);
            }
        });

        socket.on('ping', () => {
            socket.emit('pong');
        });
    });

    console.log('🚀 Socket.IO server initialized');
}

const sendMessageToSocketId = (socketId, messageObject) => {
    if (io && socketId) {
        io.to(socketId).emit(messageObject.event, messageObject.data);
        console.log(`📤 Sent to ${socketId}:`, messageObject.event);
    } else {
        console.warn('Socket.io not initialized or invalid socketId');
    }
};

const sendMessageToRoom = (room, messageObject) => {
    if (io && room) {
        io.to(room).emit(messageObject.event, messageObject.data);
        console.log(`📤 Sent to room ${room}:`, messageObject.event);
    }
};

module.exports = { 
    initializeSocket, 
    sendMessageToSocketId, 
    sendMessageToRoom 
};
