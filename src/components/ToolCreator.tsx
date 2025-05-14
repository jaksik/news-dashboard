'use client';

import { useState, FormEvent } from "react";

export function ToolCreator() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [formData, setFormData] = useState({
    name: "",
    link: "",
    affiliate: "",
    tagline: "",
    description: "",
    dashboard: "",
    category: "",
    tags: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Convert tags string to array
      const formDataWithTags = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '')
      };

      const response = await fetch('/api/tools', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formDataWithTags),
      });

      if (!response.ok) {
        throw new Error('Failed to create tool');
      }

      // Reset form after successful submission
      setFormData({
        name: "",
        link: "",
        affiliate: "",
        tagline: "",
        description: "",
        dashboard: "",
        category: "",
        tags: "",
      });

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">

      {error && (
        <div className="mb-4 p-4 text-red-500 bg-red-100 rounded-lg">
          {error}
        </div>
      )}

      <div className="rounded-lg border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark md:p-6 2xl:p-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-2.5 block font-medium text-black dark:text-white">
              Tool Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter tool name"
              className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              required
            />
          </div>
          <div>
            <label className="mb-2.5 block font-medium text-black dark:text-white">
              Official Link
            </label>
            <input
              type="url"
              name="link"
              value={formData.link}
              onChange={handleChange}
              placeholder="Enter tool link"
              className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              required
            />
          </div>
          <div>
            <label className="mb-2.5 block font-medium text-black dark:text-white">
              Affiliate Link
            </label>
            <input
              type="url"
              name="affiliate"
              value={formData.affiliate}
              onChange={handleChange}
              placeholder="Enter affiliate link"
              className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            />
          </div>
                    <div>
            <label className="mb-2.5 block font-medium text-black dark:text-white">
              Tagline
            </label>
            <input
              type="url"
              name="tagline"
              value={formData.tagline}
              onChange={handleChange}
              placeholder="Enter tagline"
              className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            />
          </div>
          <div>
            <label className="mb-2.5 block font-medium text-black dark:text-white">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter tool description"
              rows={4}
              className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              required
            />
          </div>
          <div>
            <label className="mb-2.5 block font-medium text-black dark:text-white">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              required
            >
              <option value="">Select a category</option>
              <option value="Automation">Automation</option>
              <option value="Marketing">Marketing</option>
              <option value="Analytics">Analytics</option>
              <option value="SEO">SEO</option>
              <option value="Social Media">Social Media</option>
              <option value="Content">Content</option>
              <option value="Design">Design</option>
              <option value="Development">Development</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="mb-2.5 block font-medium text-black dark:text-white">
              Tags
            </label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="Enter tags (comma-separated)"
              className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            />
          </div>
          <div>
            <label className="mb-2.5 block font-medium text-black dark:text-white">
              Affiliate Dashboard Link
            </label>
            <input
              type="url"
              name="dashboard"
              value={formData.dashboard}
              onChange={handleChange}
              placeholder="Enter affiliate dashboard link"
              className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            />
          </div>
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full justify-center rounded bg-primary p-3 font-medium text-white hover:bg-primary-hover disabled:opacity-50"
            >
              {isLoading ? 'Creating...' : 'Create Tool'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}