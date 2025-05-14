'use client';

import { SessionProvider } from "next-auth/react";
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

export default function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Reset scroll position when route changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  );
}