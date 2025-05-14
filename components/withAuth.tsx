'use client';

import { useSession } from "next-auth/react";
import AuthenticatedLayout from "./AuthenticatedLayout";
import SignInButton from "./SignInButton";

export default function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  pageTitle?: string
) {
  return function ProtectedRoute(props: P) {
    const { status, data: session } = useSession();

    if (status === "loading") {
      return (
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-lg">Loading...</div>
        </div>
      );
    }

    if (!session) {
      return (
        <div className="flex min-h-screen items-center justify-center">
          <SignInButton />
        </div>
      );
    }

    return (
      <AuthenticatedLayout title={pageTitle}>
        <Component {...props} session={session} />
      </AuthenticatedLayout>
    );
  };
}