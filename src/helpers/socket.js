import { io } from 'socket.io-client';
export const socket = io(`http://localhost:${__BE_ROUTER_PORT__}`);