'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useSidebar } from './SidebarContext';

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
    path: "/admin",
    icon: "/window.svg",
  },
  {
    name: "Articles",
    icon: "/file.svg",
    items: [
      {
        name: "Discover",
        path: "/admin/articles/discover",
      },
      {
        name: "Manage",
        path: "/admin/articles/manage",
      },
    ],
  },
  {
    name: "Tools",
    icon: "/settings.svg",
    items: [
      {
        name: "Create",
        path: "/admin/tools/create",
      },
      {
        name: "Manage",
        path: "/admin/tools/manage",
      },
    ],
  },
];

export function AdminNav() {
  const [openMenus, setOpenMenus] = useState<string[]>([]);
  const pathname = usePathname();
  const { isSidebarOpen } = useSidebar();

  const toggleMenu = (menuName: string) => {
    setOpenMenus(prev => 
      prev.includes(menuName) 
        ? prev.filter(name => name !== menuName)
        : [...prev, menuName]
    );
  };

  const isActive = (path: string) => pathname === path;
  const isMenuActive = (item: MenuItem) => {
    if (item.path) return isActive(item.path);
    return item.items?.some(subItem => pathname.startsWith(subItem.path));
  };

  if (!isSidebarOpen) {
    return null;
  }

  return (
    <nav className="py-4 px-4">
      <ul className="space-y-2">
        {menuItems.map((item) => (
          <li key={item.name}>
            {item.path ? (
              <Link
                href={item.path}
                className={`flex items-center gap-3 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  isActive(item.path)
                    ? 'bg-primary text-white'
                    : 'text-bodydark2 hover:bg-gray-100 dark:hover:bg-meta-4'
                }`}
              >
                <Image
                  src={item.icon}
                  width={20}
                  height={20}
                  alt={item.name}
                  className={isActive(item.path) ? 'brightness-0 invert' : 'opacity-75'}
                />
                {item.name}
              </Link>
            ) : (
              <div className="space-y-1">
                <button
                  onClick={() => toggleMenu(item.name)}
                  className={`flex w-full items-center justify-between rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                    isMenuActive(item)
                      ? 'bg-primary text-white'
                      : 'text-bodydark2 hover:bg-gray-100 dark:hover:bg-meta-4'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Image
                      src={item.icon}
                      width={20}
                      height={20}
                      alt={item.name}
                      className={isMenuActive(item) ? 'brightness-0 invert' : 'opacity-75'}
                    />
                    {item.name}
                  </div>
                  <svg
                    className={`h-4 w-4 transition-transform ${
                      openMenus.includes(item.name) ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {openMenus.includes(item.name) && item.items && (
                  <ul className="space-y-1 pl-11">
                    {item.items.map((subItem) => (
                      <li key={subItem.path}>
                        <Link
                          href={subItem.path}
                          className={`block rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                            isActive(subItem.path)
                              ? 'text-primary'
                              : 'text-bodydark2 hover:text-primary'
                          }`}
                        >
                          {subItem.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}