# MARCOS MUA — Website Paket Wedding Makeup Artist

Website profesional untuk bisnis jasa makeup pengantin dengan sistem rekomendasi **SPK MARCOS**.  
Stack: **Next.js 14** · **Tailwind CSS v3** · **Supabase** · **TypeScript**

---

## 🗄️ Setup Supabase (Wajib Sebelum Deploy)

### 1. Buat Project Supabase
1. Buka [supabase.com](https://supabase.com) → **Start your project** → **New project**
2. Isi nama project, password database, pilih region **Singapore**
3. Tunggu project selesai dibuat (~2 menit)

### 2. Jalankan SQL Schema
1. Di Supabase dashboard → **SQL Editor** → **New Query**
2. Copy seluruh isi file `supabase_schema.sql` → paste → klik **Run**
3. Pastikan muncul pesan sukses (tidak ada error merah)

### 3. Ambil Credentials
1. **Settings** (gear icon) → **API**
2. Catat: **Project URL** dan **anon / public key**

---

## 🚀 Deploy ke Vercel via GitHub

### Langkah 1 — Push ke GitHub
```bash
git init
git add .
git commit -m "feat: MARCOS MUA + Supabase"
git remote add origin https://github.com/USERNAME/NAMA-REPO.git
git branch -M main
git push -u origin main
```

### Langkah 2 — Import ke Vercel
1. [vercel.com](https://vercel.com) → **Add New** → **Project** → Import repo
2. Framework otomatis terdeteksi: **Next.js**

### Langkah 3 — Environment Variables
Tambahkan di halaman konfigurasi Vercel:

| Name | Value |
|------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL dari Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | anon key dari Supabase |

### Langkah 4 — Deploy!
Klik **Deploy** → tunggu ~2 menit → live! 🎉

---

## 💻 Development Lokal

```bash
npm install
cp .env.local.example .env.local   # Isi dengan credentials Supabase
npm run dev                         # http://localhost:3000
```

---

## ✏️ Konfigurasi Setelah Deploy

- **Nomor WhatsApp**: `components/WhatsAppButton.tsx` → ganti `628XXXXXXXXXX`
- **Rekening bank**: `components/BookingModal.tsx` → cari `BCA 1234567890`
- **Foto paket**: `lib/data.ts` → ganti URL `placehold.co`

---

## 🔐 Login Default Admin

| Email | Password |
|-------|----------|
| `admin@marcos.com` | `admin123` |

> Ganti password via **Supabase → Table Editor → users → Edit row admin1**

---

## 📁 Struktur

```
├── lib/
│   ├── supabase.ts     # Supabase client
│   ├── db.ts           # Async DB functions (users, bookings)
│   ├── data.ts         # Static data + types
│   └── marcos.ts       # Algoritma MARCOS
├── supabase_schema.sql # SQL — jalankan di Supabase SQL Editor
└── .env.local.example  # Template environment variables
```

---

## 🎓 Algoritma SPK MARCOS

> Stević et al. (2020). *MARCOS method*. Computers & Industrial Engineering, 140, 106231.

Fungsi utilitas: **f(K) = (K⁺ + K⁻) × K⁺ × K⁻ / (K⁺·K⁻ + K⁺² + K⁻²)**
