import React, { createContext, useEffect, useMemo, useCallback, useState } from 'react';
import { io } from 'socket.io-client';

export const SocketContext = createContext({
    socket: null,
    isConnected: false,
    joinRoom: () => {},
    updateCaptainLocation: () => {},
});

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || import.meta.env.BACKEND_URL;

const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const socketInstance = useMemo(() => {
        console.log('🔌 Initializing socket with URL:', BACKEND_URL);
        
        const newSocket = io(BACKEND_URL, {
            transports: ['websocket', 'polling'], 
            autoConnect: true,
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
            timeout: 20000,
            withCredentials: true, 
        });

        return newSocket;
    }, [BACKEND_URL]);

    const joinRoom = useCallback((userId, userType) => {
        if (socketInstance && isConnected) {
            socketInstance.emit('join', { userId, userType });
        }
    }, [socketInstance, isConnected]);

    const updateCaptainLocation = useCallback((userId, location) => {
        if (socketInstance && isConnected && location?.lat && location?.lng) {
            socketInstance.emit('update-location-captain', { userId, location });
        }
    }, [socketInstance, isConnected]);

    useEffect(() => {
        console.log('🔌 Setting up socket listeners...');

        socketInstance.on('connect', () => {
            console.log('Socket connected:', socketInstance.id);
            setSocket(socketInstance);
            setIsConnected(true);
        });

        socketInstance.on('connect_error', (error) => {
            console.error('Socket connection error:', error.message);
            setIsConnected(false);
        });

        socketInstance.on('disconnect', (reason) => {
            console.log('Socket disconnected:', reason);
            setIsConnected(false);
        });

        socketInstance.on('reconnect', (attempt) => {
            console.log('Reconnected after', attempt, 'attempts');
            setIsConnected(true);
        });

        socketInstance.on('joined', (data) => {
            console.log('Joined room:', data);
        });

        socketInstance.on('location-updated', (data) => {
            console.log('Location updated:', data);
        });

        socketInstance.on('error', (error) => {
            console.error('Socket error:', error.message);
        });

        socketInstance.on('pong', () => {
            console.log('Pong received');
        });

        setSocket(socketInstance);

        return () => {
            console.log('Cleaning up socket...');
            socketInstance.disconnect();
            setIsConnected(false);
            setSocket(null);
        };
    }, [socketInstance]);

    useEffect(() => {
        if (socketInstance) {
      
            socketInstance.emit('ping');
        }
    }, [socketInstance]);

    const contextValue = {
        socket,
        isConnected,
        joinRoom,
        updateCaptainLocation,
    };

    return (
        <SocketContext.Provider value={contextValue}>
            {children}
        </SocketContext.Provider>
    );
};

export default SocketProvider;
