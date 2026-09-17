import { MOCK_POPULAR_MANGA, MOCK_CHAPTERS_BY_MANGA, MOCK_CHAPTERS_FLAT, MOCK_CHAPTER_PAGES } from "./mock-data";

const BASE_URL = process.env.MANGADEX_API_URL || 'https://api.mangadex.org';
const API_KEY = process.env.MANGADEX_API_KEY;

const DEFAULT_HEADERS = {
    'User-Agent': 'WebKomikApp/1.0',
    'Accept': 'application/json',
    ...(API_KEY ? { 'Authorization': `Bearer ${API_KEY}` } : {}),
};

// Judul MangaDex disimpan per-bahasa (en, ja-ro, ko-ro, zh-ro, dst) dan tidak semua
// komik punya title.en — banyak manhwa/manhua cuma punya judul di key romanized
// bahasa aslinya. Fungsi ini coba beberapa key umum dulu, baru fallback ke title
// pertama yang ada, baru altTitles, sebelum benar-benar nyerah ke "Tanpa Judul".
const PREFERRED_TITLE_KEYS = ["en", "ja-ro", "ko-ro", "zh-ro", "ja", "ko", "zh"];

export function getMangaTitle(manga: any): string {
    const title = manga?.attributes?.title || {};

    for (const key of PREFERRED_TITLE_KEYS) {
        if (title[key]) return title[key];
    }

    const firstTitle = Object.values(title)[0];
    if (firstTitle) return firstTitle as string;

    const altTitles: any[] = manga?.attributes?.altTitles || [];
    for (const key of PREFERRED_TITLE_KEYS) {
        const found = altTitles.find((alt) => alt?.[key]);
        if (found) return found[key];
    }
    const firstAlt = altTitles.map((alt) => Object.values(alt || {})[0]).find(Boolean);
    if (firstAlt) return firstAlt as string;

    return "Tanpa Judul";
}

// Helper function for fetch with retry and extended timeout
async function fetchWithRetry(url: string, options: RequestInit = {}, maxRetries = 2) {
    const timeoutMs = 30000; // Increased timeout to 30 seconds

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            console.log(`[MangaDex API] Attempt ${attempt + 1}/${maxRetries + 1} for: ${url}`);
            const response = await fetch(url, {
                ...options,
                signal: AbortSignal.timeout(timeoutMs),
            });

            if (!response.ok) {
                console.warn(`[MangaDex API] Request failed (attempt ${attempt + 1}): ${response.status} ${response.statusText}`);
                if (attempt === maxRetries) {
                    const errorText = await response.text().catch(() => 'Could not read error body');
                    console.warn('[MangaDex API] Final error response:', errorText.substring(0, 200));
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
                await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
                continue;
            }

            const data = await response.json();
            console.log(`[MangaDex API] Request succeeded on attempt ${attempt + 1}`);
            return data;
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            console.warn(`[MangaDex API] Attempt ${attempt + 1} failed:`, message);
            if (attempt === maxRetries) {
                throw error;
            }
            await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
        }
    }
}

export async function getPopularManga() {
    try {
        console.log('[MangaDex API] Fetching popular manga');
        const data = await fetchWithRetry(
            `${BASE_URL}/manga?includes[]=cover_art&order[followedCount]=desc&limit=12`,
            {
                headers: DEFAULT_HEADERS,
                next: { revalidate: 3600 },
            }
        );
        console.log('[MangaDex API] Popular manga fetched successfully, count:', data.data?.length || 0);
        return data;
    } catch (error) {
        console.warn('⚠️ MangaDex API terblokir/gagal koneksi, beralih ke Mock Data komik populer.', error);
        return MOCK_POPULAR_MANGA;
    }
}

// Fungsi untuk mengambil detail spesifik 1 komik (Sinopsis & Cover)
export async function getMangaDetail(id: string) {
    try {
        console.log(`[MangaDex API] Fetching manga detail for id: ${id}`);
        if (!id || id === 'undefined') {
            throw new Error('Invalid manga ID: ' + id);
        }
        const data = await fetchWithRetry(
            `${BASE_URL}/manga/${id}?includes[]=cover_art`,
            {
                headers: DEFAULT_HEADERS,
                next: { revalidate: 3600 },
            }
        );
        console.log(`[MangaDex API] Manga detail fetched successfully for id: ${id}`);
        return data;
    } catch (error) {
        console.warn(`⚠️ MangaDex API terblokir/gagal, beralih ke Mock Detail komik untuk id: ${id}`, error);
        const found = MOCK_POPULAR_MANGA.data.find((m) => m.id === id);
        return { data: found || null };
    }
}

// Mengambil SEMUA chapter untuk 1 bahasa dengan cara paginasi (MangaDex membatasi
// max limit=500 per request), supaya komik dengan ratusan chapter (One Piece, dst)
// tetap lengkap semuanya, bukan cuma 50 pertama.
async function fetchAllChaptersByLanguage(id: string, lang: string) {
    const limit = 500;
    const safetyCap = 3000; // batas aman jaga-jaga biar tidak infinite loop
    let offset = 0;
    let all: any[] = [];
    let total = Infinity;

    while (offset < total && offset < safetyCap) {
        const data = await fetchWithRetry(
            `${BASE_URL}/manga/${id}/feed?translatedLanguage[]=${lang}&order[chapter]=desc&limit=${limit}&offset=${offset}`,
            {
                headers: DEFAULT_HEADERS,
                next: { revalidate: 3600 },
            }
        );

        if (!data?.data || data.data.length === 0) break;

        all = all.concat(data.data);
        total = data.total ?? all.length;
        offset += limit;
    }

    return { data: all, total: all.length };
}

// Fungsi untuk mengambil daftar chapter. Prioritas Sub Indo, tapi kalau komiknya
// belum ada terjemahan bahasa Indonesia di MangaDex, otomatis fallback ke Bahasa Inggris
// supaya halaman detail tidak kosong.
export async function getMangaChapters(id: string) {
    try {
        console.log(`[MangaDex API] Fetching manga chapters for id: ${id}`);
        if (!id || id === 'undefined') {
            throw new Error('Invalid manga ID: ' + id);
        }

        let data = await fetchAllChaptersByLanguage(id, 'id');
        let language = 'id';

        if (!data?.data || data.data.length === 0) {
            console.log(`[MangaDex API] No Indonesian chapters for id: ${id}, falling back to English`);
            data = await fetchAllChaptersByLanguage(id, 'en');
            language = 'en';
        }

        console.log(`[MangaDex API] Manga chapters fetched successfully for id: ${id} (language: ${language}, count: ${data?.data?.length || 0})`);
        return { ...data, language };
    } catch (error) {
        console.warn(`⚠️ MangaDex API terblokir/gagal, beralih ke Mock Chapters untuk id: ${id}`, error);
        return { ...(MOCK_CHAPTERS_BY_MANGA[id] || { data: [] }), language: 'id' };
    }
}

// Fungsi untuk mengambil detail 1 chapter (metadata, chapter number, & manga relationship)
export async function getChapterDetail(chapterId: string) {
    try {
        console.log(`[MangaDex API] Fetching chapter detail for id: ${chapterId}`);
        if (!chapterId || chapterId === 'undefined') {
            throw new Error('Invalid chapter ID: ' + chapterId);
        }
        const data = await fetchWithRetry(
            `${BASE_URL}/chapter/${chapterId}?includes[]=manga`,
            {
                headers: DEFAULT_HEADERS,
                next: { revalidate: 3600 },
            }
        );
        console.log(`[MangaDex API] Chapter detail fetched successfully for id: ${chapterId}`);
        return data;
    } catch (error) {
        console.warn(`⚠️ MangaDex API terblokir/gagal, beralih ke Mock Chapter Detail: ${chapterId}`, error);
        const found = MOCK_CHAPTERS_FLAT.find((c) => c.id === chapterId);
        return { data: found || null };
    }
}

// Fungsi untuk mengambil daftar URL gambar chapter dari MangaDex At-Home server
export async function getChapterImages(chapterId: string) {
    try {
        console.log(`[MangaDex API] Fetching chapter images for id: ${chapterId}`);
        if (!chapterId || chapterId === 'undefined') {
            throw new Error('Invalid chapter ID: ' + chapterId);
        }
        const data = await fetchWithRetry(
            `${BASE_URL}/at-home/server/${chapterId}`,
            {
                headers: DEFAULT_HEADERS,
                next: { revalidate: 3600 },
            }
        );
        console.log(`[MangaDex API] Chapter images fetched successfully for id: ${chapterId}`);

        const baseUrl = data.baseUrl;
        const hash = data.chapter?.hash;
        const files: string[] = data.chapter?.data || [];

        const pages: string[] = files.map(
            (filename) => `${baseUrl}/data/${hash}/${filename}`
        );

        return { baseUrl, hash, pages, isPlaceholder: false };
    } catch (error) {
        console.warn(`⚠️ MangaDex API terblokir/gagal, beralih ke Mock Pages untuk chapter: ${chapterId}`, error);
        return {
            baseUrl: "",
            hash: "",
            pages: MOCK_CHAPTER_PAGES,
            isPlaceholder: true,
        };
    }
}

// Daftar genre kurasi (tag resmi MangaDex) yang ditampilkan di beranda & halaman genre.
export const GENRES = [
    { id: "391b0423-d847-456f-aff0-8b0cfc03066b", name: "Action" },
    { id: "423e2eae-a7a2-4a8b-ac03-a8351462d71d", name: "Romance" },
    { id: "4d32cc48-9f00-4cca-9b5a-a839f0764984", name: "Comedy" },
    { id: "cdc58593-87dd-415e-bbc0-2ec27bf404cc", name: "Fantasy" },
    { id: "ace04997-f6bd-436e-b261-779182193d3d", name: "Isekai" },
    { id: "cdad7e68-1419-41dd-bdce-27753074a640", name: "Horror" },
    { id: "e5301a23-ebd9-49dd-a0cb-2add944c7fe9", name: "Slice of Life" },
    { id: "87cc87cd-a395-47af-b27a-93258283bbc6", name: "Adventure" },
];

// Fungsi untuk mengambil komik berdasarkan genre/tag MangaDex
export async function getMangaByGenre(tagId: string, limit = 12) {
    try {
        console.log(`[MangaDex API] Fetching manga for genre tag: ${tagId}`);
        const data = await fetchWithRetry(
            `${BASE_URL}/manga?includedTags[]=${tagId}&includes[]=cover_art&order[followedCount]=desc&limit=${limit}&contentRating[]=safe&contentRating[]=suggestive`,
            {
                headers: DEFAULT_HEADERS,
                next: { revalidate: 3600 },
            }
        );
        console.log(`[MangaDex API] Manga for genre ${tagId} fetched successfully, count:`, data.data?.length || 0);
        return data;
    } catch (error) {
        console.warn(`⚠️ MangaDex API terblokir/gagal, beralih ke Mock Data untuk genre: ${tagId}`, error);
        return { data: [] };
    }
}

// Kategori jenis komik berdasarkan bahasa asli MangaDex, dipakai untuk section
// "Manga / Manhwa / Manhua" di beranda, halaman /type/[type], dan filter di halaman genre.
export const MANGA_TYPES = [
    { value: "", label: "Semua Jenis", originalLanguage: [] as string[] },
    { value: "manga", label: "Manga (Jepang)", originalLanguage: ["ja"] },
    { value: "manhwa", label: "Manhwa (Korea)", originalLanguage: ["ko"] },
    { value: "manhua", label: "Manhua (China)", originalLanguage: ["zh", "zh-hk"] },
];

// MANGA_TYPES tanpa opsi "Semua Jenis", untuk di-iterasi jadi section/kartu kategori.
export const CATEGORIES = MANGA_TYPES.filter((t) => t.value !== "");

export const MANGA_STATUSES = [
    { value: "", label: "Semua Status" },
    { value: "ongoing", label: "Ongoing" },
    { value: "completed", label: "Completed" },
    { value: "hiatus", label: "Hiatus" },
    { value: "cancelled", label: "Cancelled" },
];

export const MANGA_SORTS = [
    { value: "followedCount", label: "Terpopuler" },
    { value: "latestUploadedChapter", label: "Update Terbaru" },
    { value: "title", label: "Judul (A-Z)" },
];

export type MangaFilters = {
    type?: string; // "" | "manga" | "manhwa" | "manhua"
    status?: string; // "" | "ongoing" | "completed" | "hiatus" | "cancelled"
    sort?: string; // "followedCount" | "latestUploadedChapter" | "title"
};

function buildFilterQuery(filters?: MangaFilters) {
    const params: string[] = [];

    const type = MANGA_TYPES.find((t) => t.value === filters?.type);
    if (type && type.originalLanguage.length > 0) {
        for (const lang of type.originalLanguage) {
            params.push(`originalLanguage[]=${lang}`);
        }
    }

    if (filters?.status) {
        params.push(`status[]=${filters.status}`);
    }

    const sortField = MANGA_SORTS.some((s) => s.value === filters?.sort) ? filters!.sort : "followedCount";
    const sortDir = sortField === "title" ? "asc" : "desc";
    params.push(`order[${sortField}]=${sortDir}`);

    return params.join("&");
}

export async function getMangaByGenrePaginated(tagId: string, offset = 0, limit = 24, filters?: MangaFilters) {
    try {
        console.log(`[MangaDex API] Fetching paginated manga for genre tag: ${tagId}, offset: ${offset}, filters:`, filters);
        const filterQuery = buildFilterQuery(filters);
        const data = await fetchWithRetry(
            `${BASE_URL}/manga?includedTags[]=${tagId}&includes[]=cover_art&limit=${limit}&offset=${offset}&contentRating[]=safe&contentRating[]=suggestive${filterQuery ? `&${filterQuery}` : ""}`,
            {
                headers: DEFAULT_HEADERS,
                next: { revalidate: 3600 },
            }
        );
        console.log(`[MangaDex API] Paginated manga for genre ${tagId} fetched successfully, count:`, data.data?.length || 0);
        return data;
    } catch (error) {
        console.warn(`⚠️ MangaDex API terblokir/gagal, beralih ke Mock Data untuk genre: ${tagId}`, error);
        return { data: [], total: 0 };
    }
}

function buildTypeFilterQuery(filters?: { tag?: string; status?: string; sort?: string }) {
    const params: string[] = [];

    if (filters?.tag) {
        params.push(`includedTags[]=${filters.tag}`);
    }

    if (filters?.status) {
        params.push(`status[]=${filters.status}`);
    }

    const sortField = MANGA_SORTS.some((s) => s.value === filters?.sort) ? filters!.sort : "followedCount";
    const sortDir = sortField === "title" ? "asc" : "desc";
    params.push(`order[${sortField}]=${sortDir}`);

    return params.join("&");
}

// Fungsi untuk mengambil komik berdasarkan kategori (Manga/Manhwa/Manhua), dipakai di beranda
export async function getMangaByType(type: string, limit = 12) {
    try {
        const typeConfig = CATEGORIES.find((t) => t.value === type);
        const langQuery = (typeConfig?.originalLanguage || []).map((lang) => `originalLanguage[]=${lang}`).join("&");
        console.log(`[MangaDex API] Fetching manga for type: ${type}`);
        const data = await fetchWithRetry(
            `${BASE_URL}/manga?${langQuery}&includes[]=cover_art&order[followedCount]=desc&limit=${limit}&contentRating[]=safe&contentRating[]=suggestive`,
            {
                headers: DEFAULT_HEADERS,
                next: { revalidate: 3600 },
            }
        );
        console.log(`[MangaDex API] Manga for type ${type} fetched successfully, count:`, data.data?.length || 0);
        return data;
    } catch (error) {
        console.warn(`⚠️ MangaDex API terblokir/gagal, beralih ke Mock Data untuk type: ${type}`, error);
        return { data: [] };
    }
}

// Fungsi untuk mengambil komik berdasarkan kategori dengan pagination (halaman "Lihat Semua")
export async function getMangaByTypePaginated(
    type: string,
    offset = 0,
    limit = 24,
    filters?: { tag?: string; status?: string; sort?: string }
) {
    try {
        const typeConfig = CATEGORIES.find((t) => t.value === type);
        const langQuery = (typeConfig?.originalLanguage || []).map((lang) => `originalLanguage[]=${lang}`).join("&");
        console.log(`[MangaDex API] Fetching paginated manga for type: ${type}, offset: ${offset}, filters:`, filters);
        const filterQuery = buildTypeFilterQuery(filters);
        const data = await fetchWithRetry(
            `${BASE_URL}/manga?${langQuery}&includes[]=cover_art&limit=${limit}&offset=${offset}&contentRating[]=safe&contentRating[]=suggestive${filterQuery ? `&${filterQuery}` : ""}`,
            {
                headers: DEFAULT_HEADERS,
                next: { revalidate: 3600 },
            }
        );
        console.log(`[MangaDex API] Paginated manga for type ${type} fetched successfully, count:`, data.data?.length || 0);
        return data;
    } catch (error) {
        console.warn(`⚠️ MangaDex API terblokir/gagal, beralih ke Mock Data untuk type: ${type}`, error);
        return { data: [], total: 0 };
    }
}

// Fungsi untuk mencari komik berdasarkan judul
export async function searchManga(query: string) {
    if (!query || query.trim() === '') {
        return { data: [] };
    }

    try {
        console.log(`[MangaDex API] Searching manga for query: "${query}"`);
        const data = await fetchWithRetry(
            `${BASE_URL}/manga?title=${encodeURIComponent(query)}&includes[]=cover_art&limit=20`,
            {
                headers: DEFAULT_HEADERS,
                next: { revalidate: 3600 },
            }
        );
        console.log(`[MangaDex API] Search manga completed successfully for query: "${query}"`);
        return data;
    } catch (error) {
        console.warn(`⚠️ MangaDex API terblokir/gagal, mencari di Mock Data untuk: "${query}"`, error);
        const lowerQ = query.toLowerCase();
        const filtered = MOCK_POPULAR_MANGA.data.filter((m) => {
            const titleEn = m.attributes.title?.en?.toLowerCase() || '';
            const titleJp = (m.attributes.title as any)?.['ja-ro']?.toLowerCase() || '';
            return titleEn.includes(lowerQ) || titleJp.includes(lowerQ);
        });
        return { data: filtered };
    }
}
