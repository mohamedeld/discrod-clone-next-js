import { prisma } from "@/lib/prisma";
import NextAuth, { AuthOptions } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";


declare module "next-auth"{
    interface Session{
        user:{
            id:string;
            name:string;
            email:string;
        }
    }
}
export const authOptions:AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "your-email@example.com",
        },
        name: { label: "Name", type: "text" },
      },
      async authorize(credentials: any) {
        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });
        console.log("user ",user)
        if (user) {
          return user;
        } else {
          const newUser = await prisma.user.create({
            data: {
              email: credentials?.email as string,
              name: credentials?.name as string,
            },
          });
          return newUser;
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
  },
  session: {
    strategy: "jwt", // Ensure this is compatible with your NextAuth version
  },
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        console.log("user",user);
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }: any) {
        console.log("session",session);
        console.log("token ",token)
      session.user.id = token.id as string;
      return session;
    },
  },
}
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST }

