'use client';

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { IPost } from '@/models/Post';

export function ArticleManager() {
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

  if (isLoadingFilters) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div>
      <div className="card p-4 md:p-6 2xl:p-7.5">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <div>
            <label className="mb-2.5 block font-medium text-black dark:text-white">Search Term</label>
            <select
              className="input-style"
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
            <label className="mb-2.5 block font-medium text-black dark:text-white">Article Status</label>
            <select
              className="input-style"
              value={filters.usedFilter}
              onChange={(e) => handleFilterChange('usedFilter', e.target.value)}
            >
              <option value="all">All Articles</option>
              <option value="unused">Unused Only</option>
              <option value="used">Used Only</option>
            </select>
          </div>
          <div>
            <label className="mb-2.5 block font-medium text-black dark:text-white">Number of Results</label>
            <select
              className="input-style"
              value={filters.numResults}
              onChange={(e) => handleFilterChange('numResults', e.target.value)}
            >
              <option value="5">5 Articles</option>
              <option value="10">10 Articles</option>
              <option value="15">15 Articles</option>
              <option value="20">20 Articles</option>
              <option value="25">25 Articles</option>
              <option value="50">50 Articles</option>
              <option value="100">100 Articles</option>
            </select>
          </div>
          <div>
            <label className="mb-2.5 block font-medium text-black dark:text-white">Date Range</label>
            <select
              className="input-style"
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
        <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={clearFilters}
              className="button-secondary"
            >
              Clear Filters
            </button>
            <button 
              onClick={loadPosts}
              disabled={isLoading}
              className="button-primary"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Loading...
                </span>
              ) : (
                'Load Articles'
              )}
            </button>
          </div>
          
          {posts.length > 0 && (
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Found {posts.length} articles
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="mt-4 rounded-lg bg-red-50 p-4 text-red-500 dark:bg-red-500/10">
          {error}
        </div>
      )}

      {posts.length > 0 && (
        <div className="mt-4 grid grid-cols-1 gap-4">
          {posts.map((post: IPost) => (
            <div
              key={post._id.toString()}
              className={`card transition-all ${
                post.used ? 'bg-opacity-50' : ''
              }`}
            >
              <div className="flex">
                {post.image && (
                  <div className="relative h-48 w-48 flex-shrink-0">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="rounded-l-lg object-cover"
                    />
                  </div>
                )}
                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                        {post.searchTerm}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {post.time}
                      </span>
                      <span className="text-xs font-medium text-gray-600 dark:text-gray-300 hover:text-primary">
                        {post.source}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => toggleUsed(post._id.toString(), post.used || false)}
                        className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                          post.used
                            ? 'bg-success/10 text-success hover:bg-success/20'
                            : 'bg-warning/10 text-warning hover:bg-warning/20'
                        }`}
                      >
                        {post.used ? 'Used' : 'Unused'}
                      </button>
                    </div>
                  </div>
                  <h3 className="mt-2 flex-grow text-lg font-semibold text-black dark:text-white">
                    {post.title}
                  </h3>
                  <div className="mt-4 flex justify-end gap-3">
                    <Link
                      href={post.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="button-primary"
                    >
                      Read Article
                    </Link>
                    <button
                      onClick={() => deletePost(post._id.toString())}
                      className="button-secondary text-danger hover:bg-danger/10"
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