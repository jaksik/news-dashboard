'use client';

import Navigation from "@/components/Navigation";

interface AuthenticatedLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export default function AuthenticatedLayout({ children, title }: AuthenticatedLayoutProps) {
  return (
    <Navigation>
      <div className="p-4 md:p-6 2xl:p-10">
        {title && (
          <div className="mb-6">
            <h2 className="text-title-md2 font-semibold text-black dark:text-white">
              {title}
            </h2>
          </div>
        )}
        {children}
      </div>
    </Navigation>
  );
}