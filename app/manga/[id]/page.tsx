import Image from "next/image";
import Link from "next/link";
import { getMangaDetail, getMangaChapters, getMangaTitle } from "@/lib/api";
import Header from "@/components/Header";
import BackButton from "@/components/BackButton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

const STATUS_STYLES: Record<string, string> = {
    ongoing: "bg-green-100 text-green-700",
    completed: "bg-blue-100 text-blue-700",
    hiatus: "bg-amber-100 text-amber-700",
    cancelled: "bg-red-100 text-red-700",
};

export default async function MangaDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    // Mengambil data secara paralel agar loading lebih cepat
    const [mangaData, chapterData] = await Promise.all([
        getMangaDetail(id),
        getMangaChapters(id)
    ]);

    const manga: any = mangaData?.data;
    // Handle case where chapterData might not have .data property
    const chapters = chapterData?.data || [];
    const chapterLanguage = chapterData?.language || "id";
    // chapters berurutan desc (chapter terbaru duluan), jadi elemen terakhir = chapter pertama
    const firstChapter = chapters.length > 0 ? chapters[chapters.length - 1] : null;

    if (!manga) {
        return (
            <main className="min-h-screen bg-gray-50 p-4 sm:p-8">
                <div className="mx-auto max-w-6xl">
                    <Header />
                    <div className="p-12 text-center text-xl font-bold text-gray-700 sm:p-20">
                        Komik tidak ditemukan!
                    </div>
                </div>
            </main>
        );
    }

    // Ekstrak informasi
    const title = getMangaTitle(manga);
    const descriptionMap = manga.attributes.description || {};
    const description = descriptionMap.en || descriptionMap.id || Object.values(descriptionMap)[0] || "Sinopsis tidak tersedia.";
    const status = manga.attributes.status || "unknown";
    const statusClass = STATUS_STYLES[status] || "bg-gray-100 text-gray-600";
    const tags: string[] = (manga.attributes.tags || [])
        .map((tag: any) => tag.attributes?.name?.en)
        .filter(Boolean);

    // Ekstrak Cover
    const coverRel = manga.relationships?.find((rel: any) => rel.type === "cover_art");
    const coverFileName = coverRel?.attributes?.fileName;
    const coverUrl =
        manga.mockCover ||
        (coverFileName
            ? `https://uploads.mangadex.org/covers/${manga.id}/${coverFileName}`
            : "https://via.placeholder.com/300x400?text=No+Cover");

    return (
        <main className="min-h-screen bg-gray-50 p-4 sm:p-8">
            <div className="mx-auto max-w-6xl">
                <Header />

                <Card className="mx-auto max-w-4xl p-4 sm:p-6">
                    {/* Tombol Kembali */}
                    <div className="mb-3 sm:mb-4">
                        <BackButton />
                    </div>

                    {/* Bagian Detail Info */}
                    <div className="mb-6 flex flex-col gap-5 sm:mb-8 sm:flex-row sm:gap-6">
                        <div className="relative mx-auto h-64 w-48 shrink-0 overflow-hidden rounded-lg shadow-md sm:mx-0 sm:h-96 sm:w-64">
                            <Image src={coverUrl} alt={title} fill sizes="(max-width: 640px) 192px, 256px" className="object-cover" unoptimized />
                        </div>
                        <div className="min-w-0">
                            <h2 className="mb-2 text-2xl font-bold tracking-tight text-gray-800 sm:text-3xl">{title}</h2>
                            <Badge className={`h-auto rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusClass}`}>
                                {status}
                            </Badge>

                            {tags.length > 0 && (
                                <div className="mt-3 flex flex-wrap gap-1.5">
                                    {tags.map((tag) => (
                                        <Badge key={tag} variant="secondary" className="h-auto rounded-full px-2.5 py-1 text-xs font-medium">
                                            {tag}
                                        </Badge>
                                    ))}
                                </div>
                            )}

                            {firstChapter && (
                                <Button
                                    render={<Link href={`/chapter/${firstChapter.id}`} />}
                                    className="mt-4 h-auto rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
                                >
                                    ▶ Baca Sekarang
                                </Button>
                            )}

                            <h3 className="mb-2 mt-5 text-base font-semibold text-gray-700 sm:mt-6">Sinopsis:</h3>
                            <p className="whitespace-pre-line text-sm leading-relaxed text-gray-600">
                                {description}
                            </p>
                        </div>
                    </div>

                    {/* Bagian Daftar Chapter */}
                    <hr className="my-5 sm:my-6" />
                    <div className="mb-4 flex flex-wrap items-center gap-2.5">
                        <h3 className="text-xl font-bold tracking-tight text-gray-800 sm:text-2xl">Daftar Chapter</h3>
                        {chapters.length > 0 && (
                            <>
                                <Badge variant="secondary" className="h-auto rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-wide">
                                    {chapterLanguage === "id" ? "Sub Indo" : "Bahasa Inggris"}
                                </Badge>
                                <span className="text-sm font-medium text-gray-500">{chapters.length} chapter</span>
                            </>
                        )}
                    </div>
                    {chapters.length > 0 && chapterLanguage !== "id" && (
                        <p className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700">
                            Belum ada terjemahan Sub Indo untuk komik ini, menampilkan chapter Bahasa Inggris sebagai gantinya.
                        </p>
                    )}

                    {chapters.length > 0 ? (
                        <div className="grid max-h-[70vh] grid-cols-1 gap-2.5 overflow-y-auto pr-1 sm:grid-cols-2 sm:gap-3">
                            {chapters.map((chapter: any) => (
                                <div key={chapter.id} className="flex items-center justify-between gap-3 rounded-lg border p-3 transition hover:bg-gray-50 active:bg-gray-100">
                                    <span className="min-w-0 truncate font-medium text-gray-700">
                                        Chapter {chapter.attributes.chapter || "?"}
                                        {chapter.attributes.title && ` - ${chapter.attributes.title}`}
                                    </span>
                                    <Button
                                        render={<Link href={`/chapter/${chapter.id}`} />}
                                        size="sm"
                                        className="h-auto shrink-0 rounded-md bg-blue-500 px-4 py-2 text-sm text-white hover:bg-blue-600"
                                    >
                                        Baca
                                    </Button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="italic text-gray-500">Belum ada chapter yang tersedia untuk komik ini.</p>
                    )}
                </Card>
            </div>
        </main>
    );
}
