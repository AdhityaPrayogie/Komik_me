"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SearchBar({ initialQuery = "" }: { initialQuery?: string }) {
    const [query, setQuery] = useState(initialQuery);
    const router = useRouter();

    const handleSearch = (e: FormEvent) => {
        e.preventDefault();
        const trimmed = query.trim();
        if (trimmed) {
            router.push(`/search?q=${encodeURIComponent(trimmed)}`);
        }
    };

    return (
        <form onSubmit={handleSearch} className="relative flex w-full items-center sm:w-64 md:w-80">
            <Input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari komik..."
                enterKeyHint="search"
                className="h-auto w-full min-w-0 rounded-lg py-2.5 pr-10 text-sm shadow-sm sm:py-2"
            />
            <Button
                type="submit"
                variant="ghost"
                size="icon"
                aria-label="Cari"
                className="absolute right-1 h-8 w-8 rounded-md text-gray-400 hover:bg-gray-100 hover:text-blue-500"
            >
                <SearchIcon className="h-5 w-5" />
            </Button>
        </form>
    );
}
