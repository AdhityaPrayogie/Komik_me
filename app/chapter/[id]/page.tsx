import Link from "next/link";
import { getChapterImages, getChapterDetail, getMangaChapters, getMangaTitle } from "@/lib/api";
import ChapterFloatingNav from "@/components/ChapterFloatingNav";

export default async function ChapterReaderPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id: chapterId } = await params;

    const [imageData, chapterData] = await Promise.all([
        getChapterImages(chapterId),
        getChapterDetail(chapterId),
    ]);

    const chapterDetail = chapterData?.data;
    const pages = imageData?.pages || [];
    const isPlaceholder = imageData?.isPlaceholder ?? false;

    if (!chapterDetail || pages.length === 0) {
        return (
            <div className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center p-6 text-center">
                <h1 className="text-2xl font-bold text-red-500 mb-2">Gagal Memuat Chapter</h1>
                <p className="text-zinc-400 mb-6">
                    Gambar chapter tidak tersedia atau terjadi kendala saat memuat dari MangaDex.
                </p>
                <Link
                    href="/"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm transition"
                >
                    Kembali ke Beranda
                </Link>
            </div>
        );
    }

    const mangaRel = chapterDetail.relationships?.find((rel: any) => rel.type === "manga");
    const mangaId = mangaRel?.id;
    const mangaTitle = mangaRel ? getMangaTitle(mangaRel) : "Detail Komik";

    // Ambil daftar chapter untuk navigasi prev & next
    let prevChapterId: string | null = null;
    let nextChapterId: string | null = null;

    if (mangaId) {
        const feedData = await getMangaChapters(mangaId);
        const chapterList: any[] = feedData?.data || [];

        // Daftar chapter berurutan desc (misal [Ch 3, Ch 2, Ch 1])
        const currentIndex = chapterList.findIndex((item) => item.id === chapterId);

        if (currentIndex !== -1) {
            // Chapter berikutnya (angka lebih besar) ada di index sebelumnya pada urutan desc
            if (currentIndex > 0) {
                nextChapterId = chapterList[currentIndex - 1].id;
            }
            // Chapter sebelumnya (angka lebih kecil) ada di index sesudahnya pada urutan desc
            if (currentIndex < chapterList.length - 1) {
                prevChapterId = chapterList[currentIndex + 1].id;
            }
        }
    }

    const currentChapterNumber = chapterDetail.attributes?.chapter || "?";
    const currentChapterTitle = chapterDetail.attributes?.title;

    return (
        <main className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
            {/* Sticky Header Navigasi Atas */}
            <header className="sticky top-0 z-40 bg-zinc-900/90 backdrop-blur border-b border-zinc-800 px-4 py-3">
                <div className="max-w-4xl mx-auto flex min-w-0 items-center gap-2 sm:gap-3">
                    {mangaId ? (
                        <Link
                            href={`/manga/${mangaId}`}
                            className="shrink-0 text-xs md:text-sm font-medium text-zinc-400 hover:text-white transition flex items-center gap-1"
                        >
                            &larr; <span className="hidden sm:inline">{mangaTitle}</span>
                        </Link>
                    ) : (
                        <Link
                            href="/"
                            className="shrink-0 text-xs md:text-sm font-medium text-zinc-400 hover:text-white transition"
                        >
                            &larr; Beranda
                        </Link>
                    )}
                    <span className="text-zinc-600 hidden sm:inline">|</span>
                    <h1 className="min-w-0 truncate text-xs sm:text-sm md:text-base font-bold text-white">
                        Chapter {currentChapterNumber}
                        {currentChapterTitle && ` - ${currentChapterTitle}`}
                    </h1>
                </div>
            </header>

            {/* Kontainer Gambar Komik (Memanjang ke bawah) */}
            <section className="flex-1 max-w-3xl w-full mx-auto px-2 py-6 flex flex-col items-center">
                {isPlaceholder && (
                    <div className="w-full mb-4 rounded-lg bg-amber-950/60 border border-amber-800 text-amber-200 text-xs md:text-sm px-4 py-3">
                        Gambar chapter asli tidak tersedia saat ini, halaman di bawah ini hanya <strong>preview placeholder</strong>, bukan isi chapter sebenarnya.
                    </div>
                )}
                {pages.map((url: string, index: number) => (
                    <div key={index} className="w-full relative bg-zinc-900 mb-1 last:mb-0 shadow-lg">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={url}
                            alt={`Halaman ${index + 1}`}
                            loading={index < 2 ? "eager" : "lazy"}
                            className="w-full h-auto block select-none"
                        />
                    </div>
                ))}
            </section>

            {/* Navigasi Bawah */}
            <footer className="border-t border-zinc-800 bg-zinc-900 px-4 py-5 sm:py-6" style={{ paddingBottom: "max(1.25rem, env(safe-area-inset-bottom))" }}>
                <div className="mx-auto max-w-4xl">
                    <div className="mb-3 text-center text-xs text-zinc-400 sm:mb-4 sm:text-left">
                        Total: <span className="font-semibold text-zinc-200">{pages.length}</span> halaman
                    </div>

                    <div className="grid grid-cols-3 gap-2 sm:flex sm:items-center sm:justify-between sm:gap-3">
                        {prevChapterId ? (
                            <Link
                                href={`/chapter/${prevChapterId}`}
                                className="rounded-lg bg-zinc-800 px-2 py-2.5 text-center text-xs font-medium transition hover:bg-zinc-700 active:bg-zinc-600 sm:px-4 sm:text-sm"
                            >
                                &larr; <span className="hidden sm:inline">Chapter </span>Sebelumnya
                            </Link>
                        ) : (
                            <button
                                disabled
                                className="cursor-not-allowed rounded-lg bg-zinc-800/40 px-2 py-2.5 text-center text-xs font-medium text-zinc-600 sm:px-4 sm:text-sm"
                            >
                                &larr; <span className="hidden sm:inline">Chapter </span>Sebelumnya
                            </button>
                        )}

                        {mangaId ? (
                            <Link
                                href={`/manga/${mangaId}`}
                                className="rounded-lg bg-zinc-800 px-2 py-2.5 text-center text-xs font-medium text-zinc-300 transition hover:bg-zinc-700 active:bg-zinc-600 sm:px-4 sm:text-sm"
                            >
                                Daftar Chapter
                            </Link>
                        ) : (
                            <span />
                        )}

                        {nextChapterId ? (
                            <Link
                                href={`/chapter/${nextChapterId}`}
                                className="rounded-lg bg-blue-600 px-2 py-2.5 text-center text-xs font-medium text-white transition hover:bg-blue-500 active:bg-blue-400 sm:px-4 sm:text-sm"
                            >
                                <span className="hidden sm:inline">Chapter </span>Selanjutnya &rarr;
                            </Link>
                        ) : (
                            <button
                                disabled
                                className="cursor-not-allowed rounded-lg bg-zinc-800/40 px-2 py-2.5 text-center text-xs font-medium text-zinc-600 sm:px-4 sm:text-sm"
                            >
                                <span className="hidden sm:inline">Chapter </span>Selanjutnya &rarr;
                            </button>
                        )}
                    </div>
                </div>
            </footer>

            {/* Nav mengambang: muncul di tengah-bawah saat scroll ke atas, sembunyi saat scroll ke bawah */}
            <ChapterFloatingNav prevChapterId={prevChapterId} nextChapterId={nextChapterId} />
        </main>
    );
}
