// Mock data untuk fallback ketika MangaDex API terblokir ISP di localhost

export const MOCK_POPULAR_MANGA = {
  data: [
    {
      id: "solo-leveling-id",
      type: "manga",
      attributes: {
        title: { en: "Solo Leveling" },
        description: {
          id: "10 tahun yang lalu, setelah 'Gerbang' yang menghubungkan dunia nyata dengan dunia monster terbuka, beberapa orang biasa menerima kekuatan untuk berburu monster di dalam Gerbang. Mereka dikenal sebagai 'Hunter'. Sung Jin-Woo adalah Hunter E-Rank terlemah...",
        },
        status: "completed",
      },
      relationships: [
        {
          id: "cover-1",
          type: "cover_art",
          attributes: {
            fileName: "mock-solo-leveling",
          },
        },
      ],
      mockCover: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80",
    },
    {
      id: "jujutsu-kaisen-id",
      type: "manga",
      attributes: {
        title: { en: "Jujutsu Kaisen" },
        description: {
          id: "Yuuji Itadori adalah seorang siswa SMA dengan kebugaran fisik yang luar biasa. Suatu hari, untuk menyelamatkan temannya yang diserang oleh Kutukan, ia memakan jari dari Ryoumen Sukuna...",
        },
        status: "ongoing",
      },
      relationships: [
        {
          id: "cover-2",
          type: "cover_art",
          attributes: {
            fileName: "mock-jjk",
          },
        },
      ],
      mockCover: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop&q=80",
    },
    {
      id: "one-piece-id",
      type: "manga",
      attributes: {
        title: { en: "One Piece" },
        description: {
          id: "Gol D. Roger dikenal sebagai 'Raja Bajak Laut', makhluk terkuat dan paling terkenal yang pernah mengarungi Grand Line. Sebelum dieksekusi, kata-kata terakhirnya mengungkapkan lokasi harta karun terbesarnya, One Piece...",
        },
        status: "ongoing",
      },
      relationships: [
        {
          id: "cover-3",
          type: "cover_art",
          attributes: {
            fileName: "mock-one-piece",
          },
        },
      ],
      mockCover: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80",
    },
    {
      id: "chainsaw-man-id",
      type: "manga",
      attributes: {
        title: { en: "Chainsaw Man" },
        description: {
          id: "Denji memiliki mimpi sederhana—hidup bahagia dan damai bersama seorang gadis yang disukainya. Namun, kenyataan memaksanya menjadi pemburu iblis demi melunasi hutang ayahnya...",
        },
        status: "ongoing",
      },
      relationships: [
        {
          id: "cover-4",
          type: "cover_art",
          attributes: {
            fileName: "mock-chainsaw-man",
          },
        },
      ],
      mockCover: "https://images.unsplash.com/photo-1563089145-599997674d42?w=600&auto=format&fit=crop&q=80",
    },
    {
      id: "spy-x-family-id",
      type: "manga",
      attributes: {
        title: { en: "Spy x Family" },
        description: {
          id: "Mata-mata ahli berkode nama 'Twilight' harus membangun keluarga palsu dalam misi terbarunya untuk menyusup ke sekolah elit politik...",
        },
        status: "ongoing",
      },
      relationships: [
        {
          id: "cover-5",
          type: "cover_art",
          attributes: {
            fileName: "mock-spy-family",
          },
        },
      ],
      mockCover: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80",
    },
    {
      id: "kaiju-no-8-id",
      type: "manga",
      attributes: {
        title: { en: "Kaiju No. 8" },
        description: {
          id: "Monster mirip Godzilla yang disebut 'Kaiju' telah muncul di Jepang selama bertahun-tahun. Kafka Hibino bermimpi bergabung dengan Pasukan Pertahanan untuk membasmi mereka...",
        },
        status: "ongoing",
      },
      relationships: [
        {
          id: "cover-6",
          type: "cover_art",
          attributes: {
            fileName: "mock-kaiju-8",
          },
        },
      ],
      mockCover: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=600&auto=format&fit=crop&q=80",
    },
  ],
};

// Judul chapter per komik, supaya setiap komik punya daftar chapter sendiri
// (bukan chapter Solo Leveling yang dipakai ulang untuk semua komik).
const MOCK_CHAPTER_TITLES: Record<string, string[]> = {
  "solo-leveling-id": ["Hunter E-Rank Terlemah", "Ujian Kuil Ganda", "Kebangkitan Kekuatan"],
  "jujutsu-kaisen-id": ["Ryomen Sukuna", "Untuk Teman-Temanku", "Pertarungan Pertama"],
  "one-piece-id": ["Romance Dawn", "Buronan Bertopi Jerami", "Pedang Pemburu Iblis"],
  "chainsaw-man-id": ["Anjing & Pistol", "Kucing yang Terluka Parah", "Kencan Bersama Denji"],
  "spy-x-family-id": ["Operation Strix", "Ujian Masuk Sekolah", "Misi Keluarga Palsu"],
  "kaiju-no-8-id": ["Hari Pertama Bertugas", "Menjadi Kaiju", "Pasukan Pertahanan"],
};

function buildMockChaptersFor(mangaId: string) {
  const manga = MOCK_POPULAR_MANGA.data.find((m) => m.id === mangaId);
  const mangaTitle = manga?.attributes.title.en || "Tanpa Judul";
  const titles = MOCK_CHAPTER_TITLES[mangaId] || ["Chapter Pertama", "Chapter Kedua", "Chapter Ketiga"];

  return {
    data: titles
      .map((chapterTitle, index) => {
        const chapterNumber = index + 1;
        return {
          id: `${mangaId}-chapter-${chapterNumber}`,
          type: "chapter",
          attributes: {
            chapter: String(chapterNumber),
            title: chapterTitle,
            translatedLanguage: "id",
          },
          relationships: [
            {
              id: mangaId,
              type: "manga",
              attributes: { title: { en: mangaTitle } },
            },
          ],
        };
      })
      .reverse(), // urutan desc seperti API asli (order[chapter]=desc)
  };
}

// Daftar chapter mock, dikelompokkan per id manga.
export const MOCK_CHAPTERS_BY_MANGA: Record<string, { data: any[] }> = Object.fromEntries(
  MOCK_POPULAR_MANGA.data.map((m) => [m.id, buildMockChaptersFor(m.id)])
);

// Semua chapter mock dalam satu daftar datar, untuk pencarian detail chapter by id.
export const MOCK_CHAPTERS_FLAT = Object.values(MOCK_CHAPTERS_BY_MANGA).flatMap((c) => c.data);

export const MOCK_CHAPTER_PAGES = [
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1000&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1000&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1563089145-599997674d42?w=1000&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=1000&auto=format&fit=crop&q=80",
];
