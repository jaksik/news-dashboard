'use client';

import { AdminNav } from "./AdminNav";
import { SidebarProvider, useSidebar } from "./SidebarContext";
import { HamburgerButton } from "./HamburgerButton";

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const { isSidebarOpen } = useSidebar();

  return (
    <div className="flex h-full">
      <HamburgerButton />
      {/* Side Navigation */}
      <aside className={`fixed w-64 h-full transition-all duration-300 transform ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } z-20`}>
        <div className="flex flex-col h-full bg-white dark:bg-boxdark border-r border-stroke dark:border-strokedark">
          <div className="py-5 px-4 border-b border-stroke dark:border-strokedark">
            <h2 className="text-lg font-semibold text-bodydark2">Admin Panel</h2>
          </div>
          <AdminNav />
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-4">
          {children}
        </div>
      </div>
    </div>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AdminLayoutContent>
        {children}
      </AdminLayoutContent>
    </SidebarProvider>
  );
}