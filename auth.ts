import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "./lib/prisma"

export const { handlers, signIn, signOut, auth } = NextAuth({
    adapter: PrismaAdapter(prisma),
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text", placeholder: "your-email@example.com" },
                name: { label: "Name", type: "text" },
            },
            async authorize(credentials) {
                const user = await prisma.user.findUnique({
                    where: { email: credentials.email as string },
                })

                if (user) {
                    // Implement password hashing and comparison for security
                    return user
                }else{
                    const user = await prisma.user.create({
                        data:{
                            email:credentials?.email as string,
                            name:credentials?.name  as string,
                        }
                    })
                    return user
                }
            },
        }),
    ],
    pages: {
        signIn: '/auth/signin', // Custom sign-in page
    },
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id
            }
            return token
        },
        async session({ session, token }) {
            session.user.id = token.id as string
            return session
        },
    },
})