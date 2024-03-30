import React, { useRef, useEffect, createContext } from 'react';
import axios from 'axios';
import { w3cwebsocket as W3CWebSocket } from 'websocket';

export const KernelContext = createContext();

export function KernelManager({ children }) {
  const socketRef = useRef(null);

  useEffect(() => {
    const createKernel = async () => {
      if (!socketRef.current) { // Only create a new kernel if one doesn't already exist
        try {
          const response = await axios.post('http://localhost:8888/api/kernels?token=123456');
          const kernelId = response.data.id;
          socketRef.current = new W3CWebSocket(`ws://localhost:8888/api/kernels/${kernelId}/channels?token=123456`);
        } catch (error) {
          console.error('Failed to create kernel:', error);
        }
      }
    };

    createKernel();

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, []); 

  return (
    <KernelContext.Provider value={socketRef.current}>
      {children}
    </KernelContext.Provider>
  );
}