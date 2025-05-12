'use client';

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { IPost } from '@/models/Post';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [posts, setPosts] = useState<IPost[]>([]);
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
    } catch (error: unknown) {
      const err = error as Error;
      console.error('Dashboard: Error loading posts:', err);
      setError(err.message || "Failed to load posts");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
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
        <div className="space-y-4 max-w-3xl mx-auto">
          {posts.map((post: IPost) => (
            <Link
              href={post.link}
              target="_blank"
              rel="noopener noreferrer"
              key={post._id.toString()}
              className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200 w-full"
            >
              <div className="flex w-full">
                {post.image && (
                  <div className="relative w-34 h-25 flex-shrink-0">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="flex-1 p-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-blue-600">
                        {post.source}
                      </span>
                      <span className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-600">
                        {post.searchTerm}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">{post.time}</span>
                  </div>
                  <span className="text-sm font-small leading-relaxed text-gray-800 mb-2">
                    {post.title}
                    </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}