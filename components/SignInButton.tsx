'use client';

import { signIn } from "next-auth/react";

export default function SignInButton() {
  return (
    <div className="text-center">
      <h1 className="mb-6 text-3xl font-bold text-gray-900 dark:text-white">Welcome to News Dashboard</h1>
      <button
        onClick={() => signIn("google")}
        className="flex items-center justify-center rounded-lg bg-blue-500 px-6 py-3 text-white transition-colors hover:bg-blue-600"
      >
        Sign in with Google
      </button>
    </div>
  );
}
