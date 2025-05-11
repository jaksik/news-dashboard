'use client';

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [posts, setPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  if (status === "loading") {
    return <div className="p-8">Loading...</div>;
  }

  if (status === "unauthenticated") {
    redirect("/auth/signin");
  }

  const loadPosts = async () => {
    try {
      setIsLoading(true);
      setError("");
      console.log('Dashboard: Fetching posts...');
      const response = await fetch("/api/posts");
      console.log('Dashboard: Response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Dashboard: Error response:', errorData);
        throw new Error(errorData.details || "Failed to fetch posts");
      }
      
      const data = await response.json();
      console.log('Dashboard: Received posts:', data.length);
      setPosts(data);
    } catch (err: any) {
      console.error('Dashboard: Error loading posts:', err);
      setError(err.message || "Failed to load posts");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-4">News Dashboard</h1>
        <p className="text-gray-600">Welcome, {session?.user?.name}!</p>
        <div className="mt-4">
          <button
            onClick={loadPosts}
            disabled={isLoading}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:bg-blue-300"
          >
            {isLoading ? "Loading..." : "Load News Articles"}
          </button>
        </div>
        {error && (
          <p className="mt-4 text-red-500">{error}</p>
        )}
      </div>

      {posts.length > 0 && (
        <div className="grid gap-8">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post: any) => (
              <Link
                href={post.link}
                target="_blank"
                rel="noopener noreferrer"
                key={post._id.toString()}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200"
              >
                {post.image && (
                  <div className="relative w-full h-48">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-blue-600">
                      {post.source}
                    </span>
                    <span className="text-sm text-gray-500">{post.time}</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2 line-clamp-2">
                    {post.title}
                  </h3>
                  <div className="flex items-center mt-4">
                    <span className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-600">
                      {post.searchTerm}
                    </span>
                    <span className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-600 ml-2">
                      {post.articleType}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}