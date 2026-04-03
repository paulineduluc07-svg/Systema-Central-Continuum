// OAuth callback no longer used — auth is now email/password via tRPC auth.login
export default function handler(_req: any, res: any) {
  res.redirect(302, "/");
}
