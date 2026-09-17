import { searchManga } from "@/lib/api";
import Header from "@/components/Header";
import MangaGrid from "@/components/MangaGrid";
import BackButton from "@/components/BackButton";

export default async function SearchPage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string }> | { q?: string };
}) {
    const resolvedParams = await Promise.resolve(searchParams);
    const query = resolvedParams?.q?.trim() || "";

    const searchData = query ? await searchManga(query) : { data: [] };
    const results = searchData?.data || [];

    return (
        <main className="min-h-screen bg-gray-50 p-4 sm:p-8">
            <div className="mx-auto max-w-6xl">
                <Header initialQuery={query} />

                {/* Subheader & Breadcrumb */}
                <div className="mb-5 flex flex-wrap items-start justify-between gap-2 sm:mb-6">
                    <div>
                        <BackButton />
                        <h2 className="mt-1 text-xl font-bold tracking-tight text-gray-800 sm:text-2xl">
                            {query ? (
                                <>
                                    Hasil Pencarian: <span className="text-blue-600">&ldquo;{query}&rdquo;</span>
                                </>
                            ) : (
                                "Pencarian Komik"
                            )}
                        </h2>
                    </div>
                    {query && results.length > 0 && (
                        <span className="mt-1 shrink-0 text-sm font-medium text-gray-500">
                            Ditemukan {results.length} komik
                        </span>
                    )}
                </div>

                {/* Grid Hasil Pencarian */}
                <section>
                    {!query ? (
                        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center text-gray-500 sm:p-12">
                            <p className="mb-2 text-base font-medium text-gray-700 sm:text-lg">Ketik judul komik yang ingin dicari</p>
                            <p className="text-sm">Gunakan kolom pencarian di atas untuk mulai mencari.</p>
                        </div>
                    ) : results.length > 0 ? (
                        <MangaGrid mangas={results} />
                    ) : (
                        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center text-gray-500 sm:p-12">
                            <p className="mb-2 text-base font-semibold text-gray-700 sm:text-lg">Komik tidak ditemukan</p>
                            <p className="text-sm">
                                Tidak ada komik yang cocok dengan kata kunci &ldquo;<span className="font-medium text-gray-800">{query}</span>&rdquo;.
                            </p>
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
}
