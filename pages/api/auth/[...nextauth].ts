import NextAuth from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';

export default NextAuth({
  providers: [
    // Add GitHub provider if env vars are present
    process.env.GITHUB_ID && process.env.GITHUB_SECRET
      ? GithubProvider({ clientId: process.env.GITHUB_ID, clientSecret: process.env.GITHUB_SECRET })
      : null,

    process.env.GOOGLE_ID && process.env.GOOGLE_SECRET
      ? GoogleProvider({ clientId: process.env.GOOGLE_ID, clientSecret: process.env.GOOGLE_SECRET })
      : null,
  ].filter(Boolean),
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/login',
  },
});
