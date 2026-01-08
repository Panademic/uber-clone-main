import React, { createContext, useEffect } from 'react';
import { io } from 'socket.io-client';

export const SocketContext = createContext();

const SocketProvider = ({ children }) => {
    const socket = import.meta.env.DEV 
        ? io('http://localhost:3000')                    
        : io(import.meta.env.VITE_BACKEND_URL || '');   

    useEffect(() => {
        socket.on('connect', () => {
            console.log('✅ Connected to server');
        });

        socket.on('disconnect', () => {
            console.log('❌ Disconnected from server');
        });

        // Cleanup on unmount
        return () => {
            socket.off('connect');
            socket.off('disconnect');
        };
    }, [socket]);

    return (
        <SocketContext.Provider value={{ socket }}>
            {children}
        </SocketContext.Provider>
    );
};

export default SocketProvider;
