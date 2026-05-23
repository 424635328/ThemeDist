export function verifyCredentials(account: string, password: string): boolean {
  const expectedAccount = import.meta.env.ADMIN_ACCOUNT || process.env.ADMIN_ACCOUNT;
  const expectedPassword = import.meta.env.ADMIN_PASSWORD || process.env.ADMIN_PASSWORD;
  if (!expectedAccount || !expectedPassword) return false;
  return account === expectedAccount && password === expectedPassword;
}

function sessionToken(): string {
  const secret = import.meta.env.ADMIN_PASSWORD || process.env.ADMIN_PASSWORD || 'default-secret';
  // Simple token — not crypto-secure but sufficient for a single-admin dashboard
  let hash = 0;
  for (let i = 0; i < secret.length; i++) {
    hash = ((hash << 5) - hash + secret.charCodeAt(i)) | 0;
  }
  return `admin_${Math.abs(hash).toString(36)}`;
}

export function setAdminCookie(cookies: { set: (name: string, value: string, opts?: Record<string, unknown>) => void }): void {
  cookies.set('admin_session', sessionToken(), {
    httpOnly: true,
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

export function clearAdminCookie(cookies: { delete: (name: string, opts?: Record<string, unknown>) => void }): void {
  cookies.delete('admin_session', { path: '/' });
}
