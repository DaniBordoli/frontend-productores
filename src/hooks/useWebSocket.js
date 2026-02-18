import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

export const useWebSocket = (tripId) => {
  const socketRef = useRef(null);
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);

  useEffect(() => {
    if (!tripId) return;

    // Obtener URL del WebSocket desde env
    const wsUrl = import.meta.env.VITE_WS_URL || 'http://localhost:5000';

    // Conectar al WebSocket
    socketRef.current = io(wsUrl, {
      transports: ['websocket', 'polling'],
    });
    setSocket(socketRef.current);

    socketRef.current.on('connect', () => {
      console.log('✅ WebSocket conectado');
      setIsConnected(true);

      // Unirse a la sala del viaje
      socketRef.current.emit('join-trip', tripId);
    });

    socketRef.current.on('disconnect', () => {
      console.log('❌ WebSocket desconectado');
      setIsConnected(false);
    });

    // Escuchar actualizaciones de ubicación
    socketRef.current.on('location-update', (data) => {
      console.log('📍 Actualización de ubicación:', data);
      setLastUpdate({
        type: 'location',
        data,
        timestamp: new Date(),
      });
    });

    // Escuchar check-ins
    socketRef.current.on('check-in', (data) => {
      console.log('✅ Check-in recibido:', data);
      setLastUpdate({
        type: 'check-in',
        data,
        timestamp: new Date(),
      });
    });

    // Escuchar cambios de estado
    socketRef.current.on('trip-status-change', (data) => {
      console.log('🔄 Cambio de estado:', data);
      setLastUpdate({
        type: 'status-change',
        data,
        timestamp: new Date(),
      });
    });

    // Cleanup
    return () => {
      if (socketRef.current) {
        socketRef.current.emit('leave-trip', tripId);
        socketRef.current.disconnect();
        setSocket(null);
      }
    };
  }, [tripId]);

  return {
    isConnected,
    lastUpdate,
    socket,
  };
};
