import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        // Connect to the correct backend URL instead of the frontend origin
        // 1. Prioritize VITE_SOCKET_URL
        // 2. Fallback to API base URL's origin (stripping '/api')
        // 3. Hardcoded production URL as ultimate fallback
        let backendUrl = import.meta.env.VITE_SOCKET_URL || '';
        
        if (!backendUrl && import.meta.env.VITE_API_BASE_URL) {
            try {
                const url = new URL(import.meta.env.VITE_API_BASE_URL);
                backendUrl = url.origin;
            } catch (e) {
                backendUrl = import.meta.env.VITE_API_BASE_URL.replace('/api', '');
            }
        }
        
        // Final fallback for production
        if (!backendUrl) {
           backendUrl = import.meta.env.MODE === 'production' 
               ? 'https://customer-backend-ibwg.onrender.com' 
               : 'http://localhost:5000';
        }

        const newSocket = io(backendUrl);

        setSocket(newSocket);

        newSocket.on('connect', () => {
            console.log('✅ Connected to Socket.io server');
        });

        newSocket.on('disconnect', () => {
            console.log('❌ Disconnected from Socket.io server');
        });

        return () => {
            newSocket.disconnect();
        };
    }, []);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};

export default SocketContext;
