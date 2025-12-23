import { AuthOptions } from 'next-auth';
import GitHubProvider from 'next-auth/providers/github';
import CredentialsProvider from 'next-auth/providers/credentials';

import { compare } from 'bcrypt';
import { UserRole } from '@prisma/client';
import { cookies } from 'next/headers';
import { prisma } from '../../prisma/prisma-client';
import { mergeGuestCartOnLogin } from './cart-utils';

export const authOptions: AuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID || '',
      clientSecret: process.env.GITHUB_SECRET || '',
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });
        if (!user || !user.password) {
          return null;
        }
        const isPasswordValid = await compare(credentials.password, user.password);
        if (!isPasswordValid) {
          return null;
        }

        // Merge guest cart with user cart on credentials login
        const cartToken = cookies().get('cartToken')?.value;
        if (cartToken) {
          const newToken = await mergeGuestCartOnLogin(user.id, cartToken);
          // Update cookie if token changed (user had existing cart)
          if (newToken && newToken !== cartToken) {
            cookies().set('cartToken', newToken);
          }
        }

        return {
          id: String(user.id),
          email: user.email,
          name: user.fullName,
          role: user.role,
          verified: !!user.verified,
        };
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60,
  },
  callbacks: {
    async signIn({ user, account }) {
      if (!user.email) return false;

      const cartToken = cookies().get('cartToken')?.value;
      const existingUser = await prisma.user.findUnique({ where: { email: user.email } });

      if (existingUser) {
        // Update provider if changed
        if (existingUser.provider !== account?.provider) {
          await prisma.user.update({
            where: { id: existingUser.id },
            data: {
              provider: account?.provider,
              providerId: account?.providerAccountId,
            },
          });
        }

        // Merge guest cart with user cart
        const newToken = await mergeGuestCartOnLogin(existingUser.id, cartToken);
        if (newToken && newToken !== cartToken) {
          cookies().set('cartToken', newToken);
        }
      } else {
        // Create new user
        const newUser = await prisma.user.create({
          data: {
            email: user.email,
            fullName: user.name || 'User',
            password: '',
            verified: new Date(),
            provider: account?.provider,
            providerId: account?.providerAccountId,
            role: 'USER',
          },
        });

        // Merge guest cart with new user
        const newToken = await mergeGuestCartOnLogin(newUser.id, cartToken);
        if (newToken && newToken !== cartToken) {
          cookies().set('cartToken', newToken);
        }
      }

      return true;
    },
    async jwt({ token }) {
      if (token.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email },
        });
        if (dbUser) {
          token.id = String(dbUser.id);
          token.role = dbUser.role;
          token.verified = !!dbUser.verified;
        }
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as UserRole;
        session.user.verified = token.verified as boolean;
      }
      return session;
    },
  },
  pages: {
    signIn: '/',
    error: '/',
  },
};
