'use client';

import withAuth from "@/components/withAuth";
import { useSession } from "next-auth/react";

function Home() {
  const { data: session } = useSession();
  
  return (
    <div className="p-6">
      <h1 className="mb-6 text-2xl font-bold">Welcome, {session?.user?.name}!</h1>
      {/* Add your dashboard content here */}
    </div>
  );
}

export default withAuth(Home, "Dashboard");
