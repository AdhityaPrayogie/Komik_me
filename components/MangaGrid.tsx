import MangaCard from "@/components/MangaCard";

export default function MangaGrid({ mangas }: { mangas: any[] }) {
    return (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {mangas.map((manga: any) => (
                <MangaCard key={manga.id} manga={manga} />
            ))}
        </div>
    );
}
