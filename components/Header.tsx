import Link from "next/link";
import SearchBar from "@/components/SearchBar";

export default function Header({ initialQuery = "" }: { initialQuery?: string }) {
    return (
        <header className="sticky top-0 z-30 -mx-4 mb-6 border-b border-gray-200 bg-white/90 px-4 py-3 backdrop-blur sm:mx-0 sm:mb-8 sm:rounded-2xl sm:border sm:px-6 sm:py-4 sm:shadow-sm">
            <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3">
                <Link href="/" className="shrink-0 flex items-center gap-2">
                    <span className="text-2xl">📖</span>
                    <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-gray-800 transition hover:text-blue-600">
                        KomikKu
                    </h1>
                </Link>
                <div className="min-w-0 flex-1 sm:flex-none">
                    <SearchBar initialQuery={initialQuery} />
                </div>
            </div>
        </header>
    );
}
