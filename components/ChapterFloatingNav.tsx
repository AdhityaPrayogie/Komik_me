"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ChapterFloatingNav({
    prevChapterId,
    nextChapterId,
}: {
    prevChapterId: string | null;
    nextChapterId: string | null;
}) {
    const [visible, setVisible] = useState(false);
    const lastY = useRef(0);

    useEffect(() => {
        lastY.current = window.scrollY;

        const onScroll = () => {
            const y = window.scrollY;
            const diff = y - lastY.current;

            if (Math.abs(diff) < 8) return; // abaikan jitter kecil

            if (diff < 0 && y > 120) {
                setVisible(true); // scroll ke atas -> munculkan nav
            } else if (diff > 0) {
                setVisible(false); // scroll ke bawah -> sembunyikan biar baca lega
            }

            lastY.current = y;
        };

        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <div
            className={`fixed inset-x-0 bottom-5 z-50 flex justify-center px-4 transition-all duration-300 ${
                visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-16 opacity-0"
            }`}
            style={{ marginBottom: "env(safe-area-inset-bottom)" }}
        >
            <div className="flex items-center gap-1 rounded-full border border-zinc-700 bg-zinc-900/95 p-1.5 shadow-xl backdrop-blur">
                {prevChapterId ? (
                    <Button
                        render={<Link href={`/chapter/${prevChapterId}`} />}
                        className="h-auto rounded-full bg-zinc-800 px-4 py-2 text-xs font-medium text-zinc-100 hover:bg-zinc-700"
                    >
                        &larr; Prev
                    </Button>
                ) : (
                    <Button disabled className="h-auto rounded-full bg-zinc-800/40 px-4 py-2 text-xs font-medium text-zinc-600">
                        &larr; Prev
                    </Button>
                )}

                {nextChapterId ? (
                    <Button
                        render={<Link href={`/chapter/${nextChapterId}`} />}
                        className="h-auto rounded-full bg-blue-600 px-4 py-2 text-xs font-medium text-white hover:bg-blue-500"
                    >
                        Next &rarr;
                    </Button>
                ) : (
                    <Button disabled className="h-auto rounded-full bg-zinc-800/40 px-4 py-2 text-xs font-medium text-zinc-600">
                        Next &rarr;
                    </Button>
                )}
            </div>
        </div>
    );
}
