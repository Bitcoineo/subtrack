import NextAuth from "next-auth";
import authConfig from "@/auth.config";

// Middleware uses Edge-compatible config only (no bcrypt, no DB)
const { auth } = NextAuth(authConfig);
export default auth;

export const config = {
  matcher: ["/dashboard/:path*", "/api/checkout/:path*", "/api/billing/:path*"],
};
