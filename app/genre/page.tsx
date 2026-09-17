import Link from "next/link";
import { GENRES } from "@/lib/api";
import Header from "@/components/Header";

export default function GenreIndexPage() {
    return (
        <main className="min-h-screen bg-gray-50 p-4 sm:p-8">
            <div className="mx-auto max-w-6xl">
                <Header />

                <h2 className="mb-5 text-xl font-bold tracking-tight text-gray-800 sm:mb-6 sm:text-2xl">Jelajahi Genre</h2>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4">
                    {GENRES.map((genre) => (
                        <Link
                            key={genre.id}
                            href={`/genre/${genre.id}?name=${encodeURIComponent(genre.name)}`}
                            className="rounded-xl border border-gray-200 bg-white p-5 text-center font-semibold text-gray-700 shadow-sm transition hover:border-blue-200 hover:text-blue-600 hover:shadow-md active:scale-[0.98] sm:p-6"
                        >
                            {genre.name}
                        </Link>
                    ))}
                </div>
            </div>
        </main>
    );
}
