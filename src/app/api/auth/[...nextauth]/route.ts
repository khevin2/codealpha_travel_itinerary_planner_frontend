import { loginUser } from "@/lib/api";
import NextAuth, { Account, Profile, Session, User } from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials"

interface CustomUser extends User { 
  data: {
    token: string;
    user: {
      email: string;
      id: string;
      username: string;
    }
  }
}


const handler = NextAuth({
  secret: process.env.NEXTAUTH_SECRET as string,
  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/login",
    signOut: "/login",
    error: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        identifier: {},
        password: {},
      },
      async authorize(
        credentials: Record<"identifier" | "password", string> | undefined
      ) {
        if (!credentials) {
          return null;
        }
        console.log("creds: ", credentials);
        const res = await loginUser({
          email: credentials.identifier,
          password: credentials.password,
        });
        
        
        const user = await res.json();
        console.log("user: ", user);
        if (user?.data?.token) {
          return user;
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async jwt(params: {
      token: JWT;
      user: User;
      account: Account | null;
      profile?: Profile | undefined;
      trigger?: "signIn" | "signUp" | "update";
      isNewUser?: boolean;
      session?: Session | undefined;
    }) {
      if (params.user) {
        console.log("params.user: ", params.user, "params.token: ", params.token);
        const customUser = params.user as CustomUser;
        params.token.user = customUser.data;
      }
      return params.token;
    },
    async session({ session, token }) {
      // Pull user data from the token (instead of `user` directly)
      if (token.user) {
        session.user = token.user as User;
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST }