function verifyCredentials(account, password) {
  const expectedAccount = "admin666";
  const expectedPassword = "Google.@*123456";
  return account === expectedAccount && password === expectedPassword;
}
function sessionToken() {
  const secret = "Google.@*123456";
  let hash = 0;
  for (let i = 0; i < secret.length; i++) {
    hash = (hash << 5) - hash + secret.charCodeAt(i) | 0;
  }
  return `admin_${Math.abs(hash).toString(36)}`;
}
function setAdminCookie(cookies) {
  cookies.set("admin_session", sessionToken(), {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24,
    sameSite: "strict"
  });
}
function isAdmin(cookies) {
  const session = cookies.get("admin_session");
  if (!session) return false;
  return session.value === sessionToken();
}
function clearAdminCookie(cookies) {
  cookies.delete("admin_session", { path: "/" });
}

export { clearAdminCookie as c, isAdmin as i, setAdminCookie as s, verifyCredentials as v };
