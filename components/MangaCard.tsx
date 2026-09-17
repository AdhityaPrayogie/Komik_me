import Image from "next/image";
import Link from "next/link";
import { getMangaTitle } from "@/lib/api";
import { Badge } from "@/components/ui/badge";

const STATUS_STYLES: Record<string, string> = {
    ongoing: "bg-green-100 text-green-700",
    completed: "bg-blue-100 text-blue-700",
    hiatus: "bg-amber-100 text-amber-700",
    cancelled: "bg-red-100 text-red-700",
};

export default function MangaCard({ manga }: { manga: any }) {
    const coverRel = manga.relationships?.find((rel: any) => rel.type === "cover_art");
    const coverFileName = coverRel?.attributes?.fileName;
    const coverUrl =
        manga.mockCover ||
        (coverFileName
            ? `https://uploads.mangadex.org/covers/${manga.id}/${coverFileName}`
            : "https://via.placeholder.com/300x400?text=No+Cover");

    const title = getMangaTitle(manga);
    const status = manga.attributes.status || "unknown";
    const statusClass = STATUS_STYLES[status] || "bg-gray-100 text-gray-600";

    return (
        <Link href={`/manga/${manga.id}`} className="group block h-full">
            <div className="flex h-full flex-col overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-black/5 transition hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 active:shadow-sm">
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-gray-200">
                    <Image
                        src={coverUrl}
                        alt={title}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
                        className="object-cover transition duration-300 group-hover:scale-105"
                        unoptimized
                    />
                    <Badge className={`absolute left-1.5 top-1.5 h-auto rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize shadow-sm ${statusClass}`}>
                        {status}
                    </Badge>
                </div>
                <div className="flex flex-1 flex-col p-2.5 sm:p-3">
                    <h3 className="line-clamp-2 text-xs font-bold leading-snug text-gray-800 sm:text-sm" title={title}>
                        {title}
                    </h3>
                </div>
            </div>
        </Link>
    );
}
