import { io } from 'socket.io-client';

export function connectWS() {
    return io(process.env.NEXT_PUBLIC_WEBSOCKET_URL || process.env.NEXT_PUBLIC_URL, {
        transports: ['websocket'],
    });
}
