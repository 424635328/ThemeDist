export function verifyCredentials(account: string, password: string): boolean {
  const expectedAccount = import.meta.env.ADMIN_ACCOUNT || process.env.ADMIN_ACCOUNT;
  const expectedPassword = import.meta.env.ADMIN_PASSWORD || process.env.ADMIN_PASSWORD;
  if (!expectedAccount || !expectedPassword) return false;
  return account === expectedAccount && password === expectedPassword;
}

function sessionToken(): string {
  const secret = import.meta.env.ADMIN_PASSWORD || process.env.ADMIN_PASSWORD || 'default-secret';
  let hash = 0;
  for (let i = 0; i < secret.length; i++) {
    hash = ((hash << 5) - hash + secret.charCodeAt(i)) | 0;
  }
  return `admin_${Math.abs(hash).toString(36)}`;
}

/** Generate a random CSRF token. Not crypto-grade but sufficient for this use case. */
function csrfToken(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 32; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
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
}
