"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
    {
        href: "/",
        label: "Beranda",
        icon: (active: boolean) => (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth={active ? 0 : 2} className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955a1.5 1.5 0 012.122 0L22.28 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75" />
            </svg>
        ),
    },
    {
        href: "/genre",
        label: "Genre",
        icon: (active: boolean) => (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth={active ? 0 : 2} className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
            </svg>
        ),
    },
    {
        href: "/search",
        label: "Cari",
        icon: (active: boolean) => (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth={active ? 0 : 2} className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
        ),
    },
];

export default function BottomNav() {
    const pathname = usePathname();

    // Sembunyikan nav di halaman baca chapter supaya layar penuh dipakai buat baca komik.
    const isImmersiveReader = pathname.startsWith("/chapter/");
    if (isImmersiveReader) return null;

    return (
        <>
            {/* Spacer biar konten paling bawah tidak ketutup nav fixed di mobile */}
            <div className="h-16 md:hidden" aria-hidden />
            <nav
                className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-white border-t border-gray-200 flex items-stretch h-16 shadow-[0_-1px_6px_rgba(0,0,0,0.05)]"
                style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
            >
                {NAV_ITEMS.map((item) => {
                    const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex-1 flex flex-col items-center justify-center gap-0.5 text-xs font-medium transition active:bg-gray-50 ${
                                active ? "text-blue-600" : "text-gray-500"
                            }`}
                        >
                            {item.icon(active)}
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
            </nav>
        </>
    );
}
