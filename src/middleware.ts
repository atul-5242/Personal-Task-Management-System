import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/components/auth/login",
  },
});

export const config = {
  matcher: ["/components/projects/:path*"],
}; 