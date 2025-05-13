'use client';

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { ArticleManager } from "@/components/ArticleManager";

export default function Dashboard() {
  const { status } = useSession();

  if (status === "loading") {
    return <div className="p-8">Loading...</div>;
  }

  if (status === "unauthenticated") {
    redirect("/auth/signin");
  }

  return (
    <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      <div className="mb-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-title-md2 font-semibold text-black dark:text-white">
            Dashboard Overview
          </h2>
        </div>
      </div>
      <ArticleManager />
    </div>
  );
}