import { getMangaByGenrePaginated, GENRES } from "@/lib/api";
import Header from "@/components/Header";
import MangaGrid from "@/components/MangaGrid";
import BrowseFilterBar from "@/components/BrowseFilterBar";
import Pagination from "@/components/Pagination";
import BackButton from "@/components/BackButton";

const PAGE_SIZE = 24;

export default async function GenrePage({
    params,
    searchParams,
}: {
    params: Promise<{ id: string }>;
    searchParams:
        | Promise<{ name?: string; page?: string; type?: string; status?: string; sort?: string }>
        | { name?: string; page?: string; type?: string; status?: string; sort?: string };
}) {
    const { id } = await params;
    const resolvedSearchParams = await Promise.resolve(searchParams);
    const page = Math.max(1, Number(resolvedSearchParams?.page) || 1);
    const offset = (page - 1) * PAGE_SIZE;

    const genreName = resolvedSearchParams?.name || GENRES.find((g) => g.id === id)?.name || "Genre";
    const filters = {
        type: resolvedSearchParams?.type || "",
        status: resolvedSearchParams?.status || "",
        sort: resolvedSearchParams?.sort || "followedCount",
    };

    const genreData = await getMangaByGenrePaginated(id, offset, PAGE_SIZE, filters);
    const mangas = genreData?.data || [];
    const total = genreData?.total || 0;
    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

    const pageLink = (targetPage: number) => {
        const params = new URLSearchParams();
        params.set("name", genreName);
        if (filters.type) params.set("type", filters.type);
        if (filters.status) params.set("status", filters.status);
        if (filters.sort) params.set("sort", filters.sort);
        params.set("page", String(targetPage));
        return `/genre/${id}?${params.toString()}`;
    };

    return (
        <main className="min-h-screen bg-gray-50 p-4 sm:p-8">
            <div className="mx-auto max-w-6xl">
                <Header />

                <div className="mb-5 sm:mb-6">
                    <BackButton />
                    <h2 className="mt-1 text-xl font-bold tracking-tight text-gray-800 sm:text-2xl">
                        Genre: <span className="text-blue-600">{genreName}</span>
                    </h2>
                    {total > 0 && (
                        <p className="mt-1 text-sm font-medium text-gray-500">{total} komik ditemukan</p>
                    )}
                </div>

                <BrowseFilterBar baseHref={`/genre/${id}`} extraParams={{ name: genreName }} showTypeSelect />

                <section>
                    {mangas.length > 0 ? (
                        <MangaGrid mangas={mangas} />
                    ) : (
                        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center text-gray-500 sm:p-12">
                            <p className="mb-2 text-base font-semibold text-gray-700 sm:text-lg">Tidak ada komik</p>
                            <p className="text-sm">Coba ubah filter, atau MangaDex sedang tidak bisa diakses.</p>
                        </div>
                    )}
                </section>

                <Pagination page={page} totalPages={totalPages} pageLink={pageLink} />
            </div>
        </main>
    );
}
