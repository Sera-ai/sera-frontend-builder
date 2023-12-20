import { io } from 'socket.io-client';
export const socket = io(`http://${window.location.hostname}:${__BE_ROUTER_PORT__}`);