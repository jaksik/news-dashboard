import Link from "next/link";
import { getServerSession } from "next-auth";

export default async function Home() {
  const session = await getServerSession();

  return (
    <div className="flex min-h-[calc(100vh-64px)] flex-col items-center justify-center p-4">
      <h1 className="mb-8 text-4xl font-bold">Welcome to Dashboard App</h1>
      {!session ? (
        <Link
          href="/auth/signin"
          className="rounded-lg bg-blue-500 px-6 py-3 text-white hover:bg-blue-600"
        >
          Sign in to start
        </Link>
      ) : (
        <Link
          href="/admin"
          className="rounded-lg bg-blue-500 px-6 py-3 text-white hover:bg-blue-600"
        >
          Go to Dashboard
        </Link>
      )}
    </div>
  );
}
