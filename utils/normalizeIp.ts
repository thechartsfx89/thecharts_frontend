// utils/normalizeIp.ts
export function normalizeIp(ip: string): string {
  if (!ip) return '';
  if (ip === '::1') return '127.0.0.1';
  return ip.replace(/^::ffff:/, '');
}
