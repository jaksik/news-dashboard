'use client';

import { signIn } from "next-auth/react";

export default function SignIn() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="rounded-lg bg-white p-8 shadow-md dark:bg-gray-800">
        <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">Sign In</h1>
        <button
          onClick={() => signIn("google", { callbackUrl: "/" })}
          className="flex w-full items-center justify-center rounded-lg bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
}