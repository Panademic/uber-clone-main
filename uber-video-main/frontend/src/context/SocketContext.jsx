import React, { createContext, useEffect, useMemo } from 'react';
import { io } from 'socket.io-client';

export const SocketContext = createContext();

const BACKEND_URL = import.meta.env.BACKEND_URL;

const SocketProvider = ({ children }) => {
    const socket = useMemo(() => {
        return io(BACKEND_URL, {
            transports: ['websocket'],
        });
    }, []);

    useEffect(() => {
        socket.on('connect', () => {
            console.log('✅ Connected to server');
        });

        socket.on('disconnect', () => {
            console.log('❌ Disconnected from server');
        });

        return () => {
            socket.disconnect();
        };
    }, [socket]);

    return (
        <SocketContext.Provider value={{ socket }}>
            {children}
        </SocketContext.Provider>
    );
};

export default SocketProvider;
