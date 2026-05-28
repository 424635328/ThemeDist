import { createHash } from 'node:crypto';

export function verifyCredentials(account: string, password: string): boolean {
  const expectedAccount = import.meta.env.ADMIN_ACCOUNT || process.env.ADMIN_ACCOUNT;
  const expectedPassword = import.meta.env.ADMIN_PASSWORD || process.env.ADMIN_PASSWORD;
  if (!expectedAccount || !expectedPassword) return false;
  return account === expectedAccount && password === expectedPassword;
}

function sessionToken(): string {
  const secret = import.meta.env.ADMIN_PASSWORD || process.env.ADMIN_PASSWORD || 'default-secret';
  return `admin_${createHash('sha256').update(secret).digest('hex').slice(0, 32)}`;
}

function csrfToken(): string {
  return crypto.randomUUID();
}

export function setAdminCookie(cookies: { set: (name: string, value: string, opts?: Record<string, unknown>) => void }): void {
  const token = csrfToken();
  cookies.set('admin_session', sessionToken(), {
    httpOnly: true,
    path: '/',
    maxAge: 60 * 60 * 24,
    sameSite: 'strict',
  });
  // CSRF token in a readable cookie for the client to send back in a header
  cookies.set('csrf_token', token, {
    httpOnly: false,
    path: '/',
    maxAge: 60 * 60 * 24,
    sameSite: 'strict',
  });
}

export function isAdmin(cookies: { get: (name: string) => { value: string } | undefined }): boolean {
  const session = cookies.get('admin_session');
  if (!session) return false;
  return session.value === sessionToken();
}

/** Validate CSRF token for write operations (POST/PUT/DELETE). */
export function verifyCsrf(cookies: { get: (name: string) => { value: string } | undefined }, headers: { get: (name: string) => string | null }): boolean {
  const cookieToken = cookies.get('csrf_token');
  if (!cookieToken) return false;
  const headerToken = headers.get('X-CSRF-Token') || headers.get('x-csrf-token');
  if (!headerToken) return false;
  return cookieToken.value === headerToken;
}

export function clearAdminCookie(cookies: { delete: (name: string, opts?: Record<string, unknown>) => void }): void {
  cookies.delete('admin_session', { path: '/' });
  cookies.delete('csrf_token', { path: '/' });
  cookies.delete('admin_account', { path: '/' });
}

/** Read the admin account name from cookie (set during login). */
export function getAdminAccount(cookies: { get: (name: string) => { value: string } | undefined }): string {
  const c = cookies.get('admin_account');
  return c?.value || '未知管理员';
}
