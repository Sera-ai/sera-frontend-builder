import { io } from 'socket.io-client';
export const socket = io(`http://localhost:${process.env.BE_ROUTER_PORT}`);