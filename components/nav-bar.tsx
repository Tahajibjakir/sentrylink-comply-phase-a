'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

export function NavBar() {
    const pathname = usePathname();

    const isActive = (path: string) => {
        return pathname.startsWith(path);
    };

    return (
        <nav className="border-b bg-teal-600 px-6 py-4 flex items-center gap-6 dark:bg-teal-900">
            <Link href="/" className="flex items-center gap-2 font-bold text-lg text-white hover:opacity-90 transition-opacity">
                <Shield className="w-6 h-6 text-teal-100" />
                <span>SentryLink Comply</span>
            </Link>
            <div className="flex gap-4 text-sm font-medium ml-auto">
                <Link
                    href="/vault"
                    className={cn(
                        "transition-colors px-3 py-2 rounded-md",
                        isActive('/vault')
                            ? "bg-white/20 text-white font-semibold"
                            : "text-teal-100 hover:text-white hover:bg-white/10"
                    )}
                >
                    Evidence Vault
                </Link>
                <Link
                    href="/requests"
                    className={cn(
                        "transition-colors px-3 py-2 rounded-md",
                        isActive('/requests')
                            ? "bg-white/20 text-white font-semibold"
                            : "text-teal-100 hover:text-white hover:bg-white/10"
                    )}
                >
                    Buyer Requests
                </Link>
            </div>
        </nav>
    );
}
