import Link from "next/link";
import { BookOpen, Sparkles, Flame, LayoutGrid } from "lucide-react";
import { getPopularManga, getMangaByGenre, getMangaByType, GENRES, CATEGORIES } from "@/lib/api";
import Header from "@/components/Header";
import MangaGrid from "@/components/MangaGrid";
import MangaRow from "@/components/MangaRow";
import ViewAllButton from "@/components/ViewAllButton";

const CATEGORY_ICONS: Record<string, typeof BookOpen> = {
  manga: BookOpen,
  manhwa: Sparkles,
  manhua: Flame,
};

export default async function Home() {
  const [mangaData, genreResults, categoryResults] = await Promise.all([
    getPopularManga(),
    Promise.all(GENRES.map((genre) => getMangaByGenre(genre.id, 12))),
    Promise.all(CATEGORIES.map((category) => getMangaByType(category.value, 12))),
  ]);

  const mangas = mangaData?.data || [];
  const genreSections = GENRES.map((genre, index) => ({
    genre,
    mangas: genreResults[index]?.data || [],
  }));
  const categorySections = CATEGORIES.map((category, index) => ({
    category,
    mangas: categoryResults[index]?.data || [],
  }));

  return (
    <main className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="mx-auto max-w-6xl">
        <Header />

        {/* Hero */}
        <section className="relative mb-8 overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 px-6 py-8 shadow-sm sm:mb-10 sm:px-10 sm:py-12">
          <div className="pointer-events-none absolute -right-8 -top-12 h-40 w-40 rounded-full bg-white/10" />
          <div className="pointer-events-none absolute -bottom-16 right-16 h-52 w-52 rounded-full bg-white/10" />
          <div className="relative z-10 max-w-xl">
            <h2 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
              Baca Manga, Manhwa &amp; Manhua Favoritmu
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-blue-100 sm:text-base">
              Update terbaru, ratusan judul populer, gratis, dan sub Indonesia.
            </p>
          </div>
        </section>

        {/* Akses cepat kategori & genre */}
        <div className="scrollbar-hide mb-8 -mx-4 flex gap-2.5 overflow-x-auto px-4 sm:mx-0 sm:mb-10 sm:flex-wrap sm:px-0">
          {CATEGORIES.map((category) => {
            const Icon = CATEGORY_ICONS[category.value] || BookOpen;
            return (
              <Link
                key={category.value}
                href={`/type/${category.value}`}
                className="flex shrink-0 items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition hover:border-blue-200 hover:text-blue-600 active:scale-[0.97]"
              >
                <Icon className="h-4 w-4" />
                {category.label}
              </Link>
            );
          })}
          <Link
            href="/genre"
            className="flex shrink-0 items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition hover:border-blue-200 hover:text-blue-600 active:scale-[0.97]"
          >
            <LayoutGrid className="h-4 w-4" />
            Semua Genre
          </Link>
        </div>

        <section className="mb-8 sm:mb-10">
          <h3 className="mb-3 text-lg font-bold tracking-tight text-gray-800 sm:mb-4 sm:text-xl">Terpopuler Saat Ini</h3>

          {mangas.length > 0 ? (
            <MangaGrid mangas={mangas} />
          ) : (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 text-center text-amber-900">
              <p className="mb-1 text-base font-semibold">Gagal memuat komik dari MangaDex</p>
              <p className="mx-auto max-w-lg text-sm text-amber-700">
                Koneksi ke <code className="rounded bg-amber-100 px-1.5 py-0.5 font-mono text-xs">api.mangadex.org</code> mengalami timeout. Di Indonesia, domain dan IP MangaDex sering kali diblokir oleh ISP lokal (Internet Positif).
              </p>
              <p className="mt-3 text-xs text-amber-600">
                Solusi: Aktifkan <strong>VPN</strong> atau <strong>Cloudflare WARP (1.1.1.1)</strong> di PC Anda lalu refresh halaman.
              </p>
            </div>
          )}
        </section>

        {categorySections.map(({ category, mangas: categoryMangas }) =>
          categoryMangas.length > 0 ? (
            <section key={category.value} className="mb-8 sm:mb-10">
              <div className="mb-3 flex items-center justify-between sm:mb-4">
                <h3 className="text-lg font-bold tracking-tight text-gray-800 sm:text-xl">{category.label}</h3>
                <ViewAllButton href={`/type/${category.value}`} />
              </div>
              <MangaRow mangas={categoryMangas} />
            </section>
          ) : null
        )}

        {genreSections.map(({ genre, mangas: genreMangas }) =>
          genreMangas.length > 0 ? (
            <section key={genre.id} className="mb-8 sm:mb-10">
              <div className="mb-3 flex items-center justify-between sm:mb-4">
                <h3 className="text-lg font-bold tracking-tight text-gray-800 sm:text-xl">Genre {genre.name}</h3>
                <ViewAllButton href={`/genre/${genre.id}?name=${encodeURIComponent(genre.name)}`} />
              </div>
              <MangaRow mangas={genreMangas} />
            </section>
          ) : null
        )}
      </div>
    </main>
  );
}
