<div align="center">

# 📖 KomikKu

**Baca Manga, Manhwa & Manhua favoritmu — gratis, sub Indonesia.**

Dibangun di atas [MangaDex API](https://api.mangadex.org/docs/), dikemas dengan Next.js App Router, Tailwind CSS v4, dan shadcn/ui.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38BDF8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-Base_UI-000000)](https://ui.shadcn.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](#-lisensi)

</div>

---

## ✨ Fitur

- **Katalog lengkap** — komik terpopuler, dikelompokkan otomatis per **genre** (Action, Romance, Comedy, Fantasy, Isekai, Horror, Slice of Life, Adventure) dan per **kategori** (Manga 🇯🇵 / Manhwa 🇰🇷 / Manhua 🇨🇳).
- **Pencarian instan** berdasarkan judul.
- **Filter & sortir** di setiap halaman "Lihat Semua" — jenis komik, status (ongoing/completed/hiatus/cancelled), dan urutan (terpopuler/update terbaru/A-Z).
- **Fallback bahasa chapter otomatis** — kalau sebuah komik belum ada scan Sub Indo di MangaDex, aplikasi otomatis menampilkan chapter Bahasa Inggris dengan penanda yang jelas, alih-alih halaman kosong.
- **Chapter reader** bergaya immersive: gambar full-width, prev/next mengambang yang muncul saat scroll ke atas dan sembunyi saat scroll ke bawah.
- **Responsive penuh** — bottom navigation ala aplikasi mobile di layar kecil, grid/row adaptif dari HP sampai desktop.
- **Tangguh terhadap block ISP** — banyak ISP di Indonesia memblokir `api.mangadex.org`. Setiap pemanggilan API punya retry + fallback ke data mock supaya UI tetap bisa di-develop/di-preview walau API sedang tidak terjangkau.

## 🖥️ Tumpukan Teknologi

| Layer | Teknologi |
| --- | --- |
| Framework | [Next.js](https://nextjs.org) (App Router, React Server Components) |
| Bahasa | TypeScript |
| Styling | [Tailwind CSS v4](https://tailwindcss.com) |
| Komponen UI | [shadcn/ui](https://ui.shadcn.com) di atas [Base UI](https://base-ui.com) |
| Ikon | [lucide-react](https://lucide.dev) |
| Sumber data | [MangaDex API](https://api.mangadex.org/docs/) |

## 🚀 Menjalankan Secara Lokal

### Prasyarat

- Node.js 20+
- npm (atau package manager lain yang kamu suka)

### Instalasi

```bash
git clone https://github.com/<username>/web-komik.git
cd web-komik
npm install
```

### Konfigurasi environment

Salin `.env.example` menjadi `.env` lalu isi API key MangaDex kamu (opsional, tapi disarankan untuk menghindari rate limit):

```bash
cp .env.example .env
```

```env
# .env
MANGADEX_API_KEY=your-mangadex-client-key
# MANGADEX_API_URL=https://api.mangadex.org   # opsional, override base URL
```

> Dapatkan API key di [mangadex.org/settings/api](https://mangadex.org/settings/api). Tanpa key pun aplikasi tetap jalan — hanya lebih rentan rate limit.

### Jalankan dev server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

> **Koneksi ke MangaDex diblokir?** Beberapa ISP di Indonesia memblokir domain MangaDex (Internet Positif). Aktifkan VPN atau [Cloudflare WARP](https://1.1.1.1/) lalu refresh halaman — aplikasi akan otomatis fallback ke data mock kalau API benar-benar tidak terjangkau, jadi UI tetap bisa dilihat.

## 🗂️ Struktur Proyek

```
app/
├── page.tsx                 # Beranda — hero, kategori, genre, terpopuler
├── search/page.tsx          # Hasil pencarian
├── genre/page.tsx           # Index semua genre
├── genre/[id]/page.tsx      # Daftar komik per genre (filter + pagination)
├── type/[type]/page.tsx     # Daftar komik per kategori (manga/manhwa/manhua)
├── manga/[id]/page.tsx      # Detail komik + daftar chapter
└── chapter/[id]/page.tsx    # Reader chapter

components/
├── ui/                      # Komponen dasar shadcn/ui (Button, Badge, Select, dst)
├── Header.tsx, BottomNav.tsx, SearchBar.tsx
├── MangaCard.tsx, MangaGrid.tsx, MangaRow.tsx
├── BrowseFilterBar.tsx, Pagination.tsx
├── BackButton.tsx, ViewAllButton.tsx
└── ChapterFloatingNav.tsx   # Nav mengambang di halaman reader

lib/
├── api.ts                   # Semua pemanggilan MangaDex API + helper (judul, genre, kategori)
└── mock-data.ts             # Fallback data saat API tidak terjangkau
```

## 🧭 Rute Aplikasi

| Rute | Deskripsi |
| --- | --- |
| `/` | Beranda |
| `/search?q=...` | Pencarian judul |
| `/genre` | Daftar semua genre |
| `/genre/[id]?name=...` | Komik per genre, dengan filter jenis/status/urutan |
| `/type/[type]` | Komik per kategori (`manga` / `manhwa` / `manhua`), dengan filter genre/status/urutan |
| `/manga/[id]` | Detail komik + daftar chapter |
| `/chapter/[id]` | Baca chapter |

## ⚠️ Disclaimer

Proyek ini dibuat untuk tujuan pembelajaran dan mengonsumsi data publik dari [MangaDex API](https://api.mangadex.org/docs/). Semua konten komik adalah milik penerbit/pembuat aslinya masing-masing — aplikasi ini hanya menampilkan data yang disediakan MangaDex, tidak meng-hosting konten apa pun.

## 📄 Lisensi

[MIT](LICENSE)
