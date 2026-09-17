"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { GENRES, MANGA_TYPES, MANGA_STATUSES, MANGA_SORTS } from "@/lib/api";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Base UI Select tidak mengizinkan value kosong ("") pada SelectItem, jadi opsi
// "Semua ..." dipetakan ke sentinel "all" lalu dikonversi balik ke "" saat update filter.
const ALL_VALUE = "all";

type BrowseFilterBarProps = {
    baseHref: string; // contoh: `/genre/${id}` atau `/type/${type}`
    extraParams?: Record<string, string>; // param yang selalu dipertahankan, misal { name: genreName }
    showTypeSelect?: boolean; // dropdown Manga/Manhwa/Manhua (dipakai di halaman genre)
    showGenreSelect?: boolean; // dropdown Genre (dipakai di halaman type)
};

export default function BrowseFilterBar({ baseHref, extraParams = {}, showTypeSelect, showGenreSelect }: BrowseFilterBarProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const type = searchParams.get("type") || ALL_VALUE;
    const tag = searchParams.get("tag") || ALL_VALUE;
    const status = searchParams.get("status") || ALL_VALUE;
    const sort = searchParams.get("sort") || "followedCount";

    const updateFilter = (key: string, rawValue: string | null) => {
        const value = !rawValue || rawValue === ALL_VALUE ? "" : rawValue;
        const params = new URLSearchParams(searchParams.toString());
        if (value) {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        for (const [k, v] of Object.entries(extraParams)) {
            params.set(k, v);
        }
        params.delete("page"); // reset ke halaman 1 setiap ganti filter
        router.push(`${baseHref}?${params.toString()}`);
    };

    const triggerClass = "w-full sm:w-auto";

    return (
        <div className="mb-5 grid grid-cols-2 gap-2.5 sm:mb-6 sm:flex sm:flex-wrap sm:gap-3">
            {showTypeSelect && (
                <Select value={type} onValueChange={(value) => updateFilter("type", value)}>
                    <SelectTrigger className={triggerClass} aria-label="Filter jenis komik">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {MANGA_TYPES.map((t) => (
                            <SelectItem key={t.value} value={t.value || ALL_VALUE}>
                                {t.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            )}

            {showGenreSelect && (
                <Select value={tag} onValueChange={(value) => updateFilter("tag", value)}>
                    <SelectTrigger className={triggerClass} aria-label="Filter genre">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value={ALL_VALUE}>Semua Genre</SelectItem>
                        {GENRES.map((g) => (
                            <SelectItem key={g.id} value={g.id}>
                                {g.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            )}

            <Select value={status} onValueChange={(value) => updateFilter("status", value)}>
                <SelectTrigger className={triggerClass} aria-label="Filter status komik">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    {MANGA_STATUSES.map((s) => (
                        <SelectItem key={s.value} value={s.value || ALL_VALUE}>
                            {s.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <Select value={sort} onValueChange={(value) => updateFilter("sort", value)}>
                <SelectTrigger className={`${triggerClass} col-span-2 sm:col-span-1`} aria-label="Urutkan">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    {MANGA_SORTS.map((s) => (
                        <SelectItem key={s.value} value={s.value}>
                            {s.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}
