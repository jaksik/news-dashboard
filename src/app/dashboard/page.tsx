'use client';

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { IPost } from '@/models/Post';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [posts, setPosts] = useState<IPost[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Filter states
  const [filters, setFilters] = useState({
    searchTerm: "",
    numResults: "10", // Default to 10 results
    dateRange: "all", // all, today, week, month
    usedFilter: "all" // all, used, unused
  });
  
  // Unique values for filters
  const [searchTerms, setSearchTerms] = useState<string[]>([]);
  const [isLoadingFilters, setIsLoadingFilters] = useState(true);

  // Load filter options when component mounts
  useEffect(() => {
    const loadFilterOptions = async () => {
      try {
        setIsLoadingFilters(true);
        const response = await fetch('/api/posts?filterOptions=true');
        
        if (!response.ok) {
          throw new Error('Failed to load filter options');
        }
        
        const data = await response.json();
        setSearchTerms(data.searchTerms);
      } catch (error) {
        console.error('Failed to load filter options:', error);
      } finally {
        setIsLoadingFilters(false);
      }
    };

    loadFilterOptions();
  }, []);

  if (status === "loading" || isLoadingFilters) {
    return <div className="p-8">Loading...</div>;
  }

  if (status === "unauthenticated") {
    redirect("/auth/signin");
  }

  const loadPosts = async () => {
    try {
      setIsLoading(true);
      setError("");
      
      // Build query string from filters
      const params = new URLSearchParams();
      if (filters.searchTerm) params.append('searchTerm', filters.searchTerm);
      if (filters.numResults) params.append('limit', filters.numResults);
      if (filters.dateRange !== 'all') params.append('dateRange', filters.dateRange);
      if (filters.usedFilter !== 'all') params.append('used', filters.usedFilter === 'used' ? 'true' : 'false');
      
      const response = await fetch(`/api/posts?${params.toString()}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || "Failed to fetch posts");
      }
      
      const data = await response.json();
      // Ensure the used field is properly set for each post
      const postsWithUsed = data.map((post: IPost) => ({
        ...post,
        used: post.used || false
      }));
      setPosts(postsWithUsed);
    } catch (error: unknown) {
      const err = error as Error;
      setError(err.message || "Failed to load posts");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (filterType: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      searchTerm: "",
      numResults: "10",
      dateRange: "all",
      usedFilter: "all"
    });
  };

  const toggleUsed = async (postId: string, currentUsed: boolean) => {
    try {
      const response = await fetch('/api/posts', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postId,
          used: !currentUsed
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update article status');
      }

      // Update the posts state with the new used status
      setPosts(currentPosts => 
        currentPosts.map(post => 
          post._id.toString() === postId 
            ? { ...post, used: !currentUsed }
            : post
        )
      );
    } catch (error) {
      console.error('Error updating article status:', error);
    }
  };

  const deletePost = async (postId: string) => {
    // if (!confirm('Are you sure you want to delete this article?')) {
    //   return;
    // }
    
    try {
      const response = await fetch(`/api/posts?postId=${postId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete article');
      }

      // Remove the post from the posts state
      setPosts(currentPosts => 
        currentPosts.filter(post => post._id.toString() !== postId)
      );
    } catch (error) {
      console.error('Error deleting article:', error);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold mb-2">News Dashboard</h1>
            <p className="text-gray-600">Welcome, {session?.user?.name}!</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Search Term</label>
              <select
                className="w-full rounded-md border border-gray-300 p-2"
                value={filters.searchTerm}
                onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
              >
                <option value="">All Terms</option>
                {searchTerms.map(term => (
                  <option key={term} value={term}>{term}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Article Status</label>
              <select
                className="w-full rounded-md border border-gray-300 p-2"
                value={filters.usedFilter}
                onChange={(e) => handleFilterChange('usedFilter', e.target.value)}
              >
                <option value="all">All Articles</option>
                <option value="unused">Unused Only</option>
                <option value="used">Used Only</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Number of Results</label>
              <select
                className="w-full rounded-md border border-gray-300 p-2"
                value={filters.numResults}
                onChange={(e) => handleFilterChange('numResults', e.target.value)}
              >
                <option value="5">5 Articles</option>
                <option value="10">10 Articles</option>
                <option value="15">15 Articles</option>
                <option value="20">20 Articles</option>
                <option value="25">25 Articles</option>
                <option value="25">25 Articles</option>
                <option value="50">50 Articles</option>
                <option value="100">100 Articles</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
              <select
                className="w-full rounded-md border border-gray-300 p-2"
                value={filters.dateRange}
                onChange={(e) => handleFilterChange('dateRange', e.target.value)}
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">Past Week</option>
                <option value="month">Past Month</option>
              </select>
            </div>
          </div>
          <div className="mt-4 flex justify-between items-center">
            <div className="space-x-2">
              <button
                onClick={clearFilters}
                className="text-sm text-gray-600 hover:text-gray-800"
              >
                Clear Filters
              </button>
              <button
                onClick={loadPosts}
                disabled={isLoading}
                className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 disabled:bg-blue-300 transition-colors ml-2"
              >
                {isLoading ? "Loading..." : "Load Articles"}
              </button>
            </div>
            {posts.length > 0 && (
              <div className="text-sm text-gray-600">
                Found {posts.length} articles
              </div>
            )}
          </div>
        </div>

        {error && (
          <p className="mt-4 text-red-500">{error}</p>
        )}
      </div>

      {posts.length > 0 && (
        <div className="space-y-4 max-w-3xl mx-auto">
          {posts.map((post: IPost) => (
            <div
              key={post._id.toString()}
              className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200 w-full ${
                post.used ? 'bg-gray-50' : ''
              }`}
            >
              <div className="flex w-full">
                {post.image && (
                  <div className="relative w-34 h-35 flex-shrink-0">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="flex-1 p-6 flex flex-col">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-600">
                        {post.searchTerm}
                      </span>
                      <span className="text-xs text-gray-500">{post.time}</span>
                      <span className="text-xs font-medium text-gray-600 underline">
                        {post.source}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => toggleUsed(post._id.toString(), post.used || false)}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                          post.used
                            ? 'bg-red-100 text-red-800 hover:bg-red-200'
                            : 'bg-green-100 text-green-800 hover:bg-green-200'
                        }`}
                      >
                        {post.used ? 'Used' : 'Unused'}
                      </button>
                    </div>
                  </div>
                  <div className="flex-grow">
                    <span className="text-base font-medium leading-relaxed text-gray-800">
                      {post.title}
                    </span>
                  </div>
                  <div className="flex justify-end gap-2 mt-4">
                    <Link
                      href={post.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                    >
                      Read
                    </Link>
                    <button
                      onClick={() => deletePost(post._id.toString())}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}