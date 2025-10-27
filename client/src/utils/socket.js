import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:5000';

export const socket = io(SOCKET_URL, {
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

export const connectSocket = () => {
  if (!socket.connected) {
    socket.connect();
  }
};

export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
  }
};

export const subscribeToCrowdUpdates = (callback) => {
  socket.on('crowdUpdate', (data) => {
    callback(data);
  });
};

export const unsubscribeToCrowdUpdates = () => {
  socket.off('crowdUpdate');
};

export const subscribeToMedia = (callback) => {
  socket.on('media', (payload) => {
    callback(payload);
  });
};

export const unsubscribeToMedia = () => {
  socket.off('media');
};