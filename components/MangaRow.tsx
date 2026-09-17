import MangaCard from "@/components/MangaCard";

export default function MangaRow({ mangas }: { mangas: any[] }) {
    return (
        <div className="scrollbar-hide -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
            {mangas.map((manga: any) => (
                <div key={manga.id} className="w-[128px] shrink-0 snap-start sm:w-[160px]">
                    <MangaCard manga={manga} />
                </div>
            ))}
        </div>
    );
}
