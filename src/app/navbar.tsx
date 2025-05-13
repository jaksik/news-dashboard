'use client';

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";

export function NavBar() {
  const { data: session } = useSession();

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-boxdark border-b border-stroke dark:border-strokedark">
      <div className="flex items-center justify-between px-4 py-4 shadow-2">
        <div className="flex items-center gap-2">
          {/* Add pl-12 to account for the hamburger button */}
          <Link href="/" className="flex items-center gap-2 pl-12">
            <Image src="/globe.svg" width={32} height={32} alt="Logo" />
            <span className="text-xl font-semibold text-bodydark2">News Dashboard</span>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {session ? (
            <>
              <Link 
                href="/admin" 
                className="text-sm font-medium text-bodydark2 hover:text-primary"
              >
                Dashboard
              </Link>
              <div className="flex items-center gap-3">
                {session.user?.image && (
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
            </>
          ) : (
            <Link 
              href="/auth/signin" 
              className="button-primary"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}