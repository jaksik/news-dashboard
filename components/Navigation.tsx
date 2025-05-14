'use client';

import { useState } from 'react';
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from 'next/navigation';

interface MenuItem {
  name: string;
  icon: string;
  items?: {
    name: string;
    path: string;
  }[];
  path?: string;
}

const menuItems: MenuItem[] = [
  {
    name: "Dashboard",
    path: "/",
    icon: "/window.svg",
  },
  {
    name: "News",
    icon: "/file.svg",
    items: [
      {
        name: "Submit Article",
        path: "/news/create",
      }
    ],
  },
  {
    name: "Tools",
    icon: "/settings.svg",
    items: [
      {
        name: "Submit Tool",
        path: "/tools/create",
      },
      {
        name: "Manage Tools",
        path: "/tools/manage",
      },
    ],
  },
  {
    name: "Articles",
    icon: "/file.svg",
    items: [
      {
        name: "Discover",
        path: "/articles/discover",
      },
      {
        name: "Manage",
        path: "/articles/manage",
      },
    ],
  },
];

interface NavigationProps {
  children: React.ReactNode;
}

export default function Navigation({ children }: NavigationProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const { data: session } = useSession();
  const pathname = usePathname();

  const toggleSidebar = () => setIsSidebarOpen(prev => !prev);
  const toggleSubmenu = (menuName: string) => {
    setOpenSubmenu(openSubmenu === menuName ? null : menuName);
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-[60px] z-40 flex h-[calc(100vh-60px)] w-90 flex-col overflow-y-hidden bg-white duration-300 ease-linear dark:bg-boxdark ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Sidebar menu */}
        <nav className="py-4 px-4 lg:px-6">
          <div className="flex flex-col gap-2">
            {menuItems.map((item) => (
              <div key={item.name}>
                {item.path ? (
                  <Link
                    href={item.path}
                    className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                      pathname === item.path
                        ? "bg-primary text-white"
                        : "text-bodydark2 hover:bg-primary/10"
                    }`}
                  >
                    <Image
                      src={item.icon}
                      width={20}
                      height={20}
                      alt={item.name}
                      className="dark:invert"
                    />
                    {item.name}
                  </Link>
                ) : (
                  <>
                    <button
                      onClick={() => toggleSubmenu(item.name)}
                      className={`flex w-full items-center justify-between rounded-lg px-4 py-2 text-sm font-medium text-bodydark2 transition-colors hover:bg-primary/10`}
                    >
                      <div className="flex items-center gap-2">
                        <Image
                          src={item.icon}
                          width={20}
                          height={20}
                          alt={item.name}
                          className="dark:invert"
                        />
                        {item.name}
                      </div>
                      <svg
                        className={`h-4 w-4 transition-transform ${
                          openSubmenu === item.name ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                    {openSubmenu === item.name && item.items && (
                      <div className="ml-6 mt-2 flex flex-col gap-2">
                        {item.items.map((subItem) => (
                          <Link
                            key={subItem.path}
                            href={subItem.path}
                            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                              pathname === subItem.path
                                ? "bg-primary text-white"
                                : "text-bodydark2 hover:bg-primary/10"
                            }`}
                          >
                            {subItem.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-y-auto">
        {/* Top Navigation */}
        <header className="sticky top-0 z-50 flex h-[60px] w-full bg-white drop-shadow-1 dark:bg-boxdark">
          <div className="flex flex-grow items-center justify-between px-4 shadow-2">
            <div className="flex items-center gap-4">
              <button
                onClick={toggleSidebar}
                className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                aria-label="Toggle Sidebar"
              >
                <svg
                  className="h-6 w-6 text-gray-600 dark:text-gray-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={isSidebarOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                  />
                </svg>
              </button>
              
              <Link href="/" className="flex items-center gap-2">
                <Image
                  src="/globe.svg"
                  width={24}
                  height={24}
                  alt="Logo"
                  className="dark:invert"
                />
                <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  News Dashboard
                </span>
              </Link>
            </div>

            <div className="flex items-center gap-3">
              {session?.user?.image && (
                <Image
                  src={session.user.image}
                  width={32}
                  height={32}
                  alt="User"
                  className="rounded-full"
                />
              )}
              <button
                onClick={() => signOut()}
                className="text-sm font-medium text-bodydark2 hover:text-primary"
              >
                Sign Out
              </button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
