import { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/app/lib/db/db";
import { users } from "@/app/lib/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

// Define authOptions
export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please provide both email and password");
        }

        try {
          const user = await db.select()
            .from(users)
            .where(eq(users.email, credentials.email))
            .limit(1);

          if (!user.length) {
            throw new Error("No user found with this email");
          }

          if (!user[0].password) {
            throw new Error("Please login with OAuth provider");
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user[0].password
          );

          if (!isPasswordValid) {
            throw new Error("Invalid password");
          }

          return {
            id: user[0].id.toString(),
            email: user[0].email,
            name: user[0].name,
            role: user[0].role ?? 'regular',
          };
        } catch (error) {
          console.error("Auth error:", error);
          throw error;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        // Handle initial sign in
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.role = user.role;

        // If signing in with OAuth (Google/GitHub)
        if (account?.provider === "google" || account?.provider === "github") {
          // Check if user exists in database
          const existingUser = await db.select()
            .from(users)
            .where(eq(users.email, user.email!))
            .limit(1);

          if (!existingUser.length) {
            // Create new user if doesn't exist
            const newUser = await db.insert(users)
              .values({
                email: user.email!,
                name: user.name ?? '',
                password: 'oauth-login',
                role: 'regular',
              })
              .returning();

            token.id = newUser[0].id.toString();
            token.role = newUser[0].role ?? 'regular';
          } else {
            token.id = existingUser[0].id.toString();
            token.role = existingUser[0].role ?? 'regular';
          }
        }
      }
      return token;
    },

    async session({ session, token }) {
      // Ensure session.user is defined
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.email = token.email ?? '';
        session.user.name = token.name ?? '';
      }
      return session;
    },

    async signIn({ user }) {
      if (user.email) {
        return true;
      }
      return false;
    },
  },

  pages: {
    signIn: '/components/auth/login',
    signOut: '/components/auth/login',
    error: '/components/auth/error',
    verifyRequest: '/components/auth/verify-request',
    newUser: '/components/auth/register'
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
};

// Extend next-auth types
declare module "next-auth" {
  interface User {
    id: string;
    role: string;
    email: string;
    name: string;
  }

  interface Session {
    user: {
      id: string;
      role: string;
      email: string;
      name: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
  }
}

// Create the NextAuth handler
const handler = NextAuth(authOptions);

// Export the handler for GET and POST requests
export { handler as GET, handler as POST };