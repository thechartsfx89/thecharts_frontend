import { NextApiRequest } from "next";

export function getClientIp(req: NextApiRequest) {
    const xff = req.headers['x-forwarded-for'] as string | undefined;
    if (xff) return xff.split(',')[0].trim();
    // 2️⃣ Fallback to socket remoteAddress
    const sock = req.socket?.remoteAddress || req.connection?.remoteAddress;
    if (typeof sock === 'string') {
        // Normalize IPv4-mapped IPv6 addresses
        let ip = sock.replace(/^::ffff:/, '');
        // Convert loopback IPv6 to IPv4
        if (ip === '::1') ip = '127.0.0.1';
        return ip;
    }

    // 3️⃣ If all else fails
    return '';
}

// export function getClientIp(req: any) {
//     // 1. Check standard proxy headers (Vercel, Cloudflare, Nginx)
//     const xForwardedFor = req.headers['x-forwarded-for'];
//     const xRealIp = req.headers['x-real-ip'];

//     let ip = '';

//     if (xForwardedFor) {
//         // If there's a comma-separated list, the first one is the client
//         ip = typeof xForwardedFor === 'string' 
//              ? xForwardedFor.split(',')[0] 
//              : xForwardedFor[0];
//     } else if (xRealIp) {
//         ip = xRealIp;
//     } else {
//         // Fallback for local development
//         ip = req.socket?.remoteAddress || req.connection?.remoteAddress || '';
//     }

//     // Normalize
//     ip = ip.trim();
//     if (ip === '::1') ip = '127.0.0.1';
//     return ip.replace(/^::ffff:/, '');
// }