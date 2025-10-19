import React from 'react';

/**
 * LoginButton
 *
 * Small placeholder login button to place in the Toolbar. Styles use Tailwind classes so it
 * fits nicely into the app. This file intentionally does not depend on any auth library.
 *
 * Future integration notes:
 * - If you use NextAuth.js: replace onClick with signIn()/signOut() from 'next-auth/react'.
 * - For OAuth custom flows, open a popup or redirect to your auth endpoint.
 * - Store session in context (or use next-auth session) and render user info instead of this button.
 */

export default function LoginButton({ onClick }: { onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-blue-600 text-white text-sm hover:bg-blue-700 focus:ring-2 focus:ring-blue-300 focus:outline-none"
      aria-label="Log in"
    >
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
        <path d="M15 3H21V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M10 14L21 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M21 21H3V3H9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span>Log in</span>
    </button>
  );
}
