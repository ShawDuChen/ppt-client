import NextAuth, { type DefaultSession, type User } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

import { jwtDecode } from 'jwt-decode';
import { type JWT } from 'next-auth/jwt';

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module 'next-auth' {
  /**
   * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      email: string;
      email_verified: boolean;
      /**
       * By default, TypeScript merges new interface properties and overwrites existing ones.
       * In this case, the default session user properties will be overwritten,
       * with the new ones defined above. To keep the default session user properties,
       * you need to add them back into the newly declared interface.
       */
    } & DefaultSession['user'];
    accessToken: string;
  }
}
declare module 'next-auth/jwt' {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    email: string;
    email_verified: boolean;
    accessToken?: string;
  }
}

export const { auth, handlers, signIn, signOut } = NextAuth({
  pages: {
    signIn: '/auth/login',
    error: '/auth/auth-error',
  },
  session: {
    strategy: 'jwt',
    maxAge: 86400, // 24 hours
  },
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
        },
        password: {
          label: 'Password',
          type: 'password',
        },
      },
      async authorize(credentials) {
        const { email, password } = credentials;
        try {
          const response = await fetch(process.env.API_BASE_URL + '/auth', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email,
              password,
            }),
          });

          if (!response.ok) {
            throw response;
          }

          const data: { user: User; token: string } =
            (await response.json()) as { user: User; token: string };

          console.log(data);

          if (!data?.token) {
            throw response;
          }

          const decodedToken = jwtDecode(data.token);

          return {
            ...data.user,
            email: decodedToken.sub || '',
            accessToken: data?.token,
          };
        } catch (error) {
          if (error instanceof Response) {
            console.error('Error response', error);
            return null;
          }

          throw new Error('An error has occurred during login request');
        }
      },
    }),
    CredentialsProvider({
      id: 'register',
      name: 'Register',
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
        },
        password: {
          label: 'Password',
          type: 'password',
        },
        name: {
          label: 'Name',
          type: 'text',
        },
        company: {
          label: 'Company',
          type: 'text',
        },
        jobTitle: {
          label: 'Job Title',
          type: 'text',
        },
      },
      async authorize(credentials) {
        const registerCredentials = {
          email: credentials?.email,
          password: credentials?.password,
          name: credentials?.name,
          company: credentials?.company,
          job_position: credentials?.jobTitle,
        };

        try {
          const response = await fetch(process.env.API_BASE_URL + '/signup', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(registerCredentials),
          });

          if (!response.ok) {
            throw response;
          }

          const data: { user: User; token: string } =
            (await response.json()) as { user: User; token: string };

          if (!data?.token) {
            throw response;
          }

          return {
            email: (credentials?.email as string) || '',
            email_verified: false,
            accessToken: data?.token,
          };
        } catch (error) {
          if (error instanceof Response) {
            if (error.status === 400) {
              throw new Error('EmailAddressInUse');
            } else return null;
          }
          throw new Error('An error has occurred during register request');
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (trigger === 'update') {
        // This callback is triggered whenever the user updates their profile.
        // Also when the user verifies their email address after signing up.
        if (session.action === 'VERIFY_EMAIL' && token.accessToken) {
          token.email_verified = true;
          return { ...token, ...user };
        }

        return { ...token, ...session };
      }

      if (user) {
        return { ...token, ...user };
      }

      if (!token.accessToken) {
        return token;
      }

      const { exp: accessTokenExpires } = jwtDecode(token.accessToken);

      if (!accessTokenExpires) {
        return token;
      }

      const currentUnixTimestamp = Math.floor(Date.now() / 1000);
      const accessTokenHasExpired = currentUnixTimestamp > accessTokenExpires;

      if (accessTokenHasExpired) {
        // TODO: This is not implemented yet on the API side.
        // We need to implement a refresh token strategy.
        return await refreshAccessToken(token);
      }

      return token;
    },
    session({ session, token }) {
      if (token.error) {
        throw new Error('Refresh token has expired');
      }

      session.accessToken = token?.accessToken || '';
      session.user.email = token.email ?? '';
      session.user.email_verified = token.email_verified ?? false;

      return session;
    },
  },
});

async function refreshAccessToken(token: JWT) {
  try {
    const response = await fetch(process.env.API_BASE_URL + '/api/refresh', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token.accessToken,
      },
    });

    if (!response.ok) throw response;

    const refreshedAccessToken: { access_token: string } =
      await response.json();
    const { exp } = jwtDecode(refreshedAccessToken.access_token);

    return {
      ...token,
      accessToken: refreshedAccessToken.access_token,
      exp,
    };
  } catch (error) {
    return {
      ...token,
      error: 'RefreshAccessTokenError',
    };
  }
}
