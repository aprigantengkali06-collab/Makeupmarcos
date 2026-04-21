-- ============================================================
-- MARCOS MUA — Supabase Schema
-- Jalankan script ini di Supabase SQL Editor
-- (Dashboard → SQL Editor → New Query → paste → Run)
-- ============================================================

-- ── Tabel Users ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.users (
  id          TEXT        PRIMARY KEY,
  nama        TEXT        NOT NULL,
  email       TEXT        UNIQUE NOT NULL,
  no_hp       TEXT,
  password    TEXT        NOT NULL,
  role        TEXT        NOT NULL DEFAULT 'customer'
                          CHECK (role IN ('customer', 'admin')),
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── Tabel Bookings ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.bookings (
  id                TEXT        PRIMARY KEY,
  customer_id       TEXT        NOT NULL REFERENCES public.users(id),
  customer_nama     TEXT        NOT NULL,
  customer_email    TEXT        NOT NULL,
  customer_hp       TEXT,
  paket_id          TEXT        NOT NULL,
  paket_nama        TEXT        NOT NULL,
  paket_harga       NUMERIC     NOT NULL,
  tanggal_acara     TEXT        NOT NULL,
  lokasi_acara      TEXT,
  catatan           TEXT,
  status            TEXT        NOT NULL DEFAULT 'menunggu_pembayaran'
                                CHECK (status IN (
                                  'menunggu_pembayaran',
                                  'menunggu_konfirmasi',
                                  'dikonfirmasi',
                                  'selesai',
                                  'dibatalkan'
                                )),
  bukti_pembayaran  TEXT,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

-- ── Row Level Security ───────────────────────────────────────
-- (Aktifkan RLS lalu beri policy akses penuh via anon key)
ALTER TABLE public.users    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Policy: izinkan semua operasi (sesuai untuk proyek skripsi)
CREATE POLICY "allow_all_users"
  ON public.users FOR ALL
  USING (true) WITH CHECK (true);

CREATE POLICY "allow_all_bookings"
  ON public.bookings FOR ALL
  USING (true) WITH CHECK (true);

-- ── Seed Data: Admin Default ─────────────────────────────────
-- Password: admin123 (ganti setelah deploy pertama!)
INSERT INTO public.users (id, nama, email, no_hp, password, role, created_at)
VALUES (
  'admin1',
  'Admin Marcos',
  'admin@marcos.com',
  '081234567890',
  'admin123',
  'admin',
  NOW()
)
ON CONFLICT (email) DO NOTHING;

-- ── Tabel Paket ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.paket (
  id                TEXT        PRIMARY KEY,
  nama              TEXT        NOT NULL,
  harga             NUMERIC     NOT NULL,
  kategori_harga    TEXT        NOT NULL,
  deskripsi         TEXT,
  layanan           TEXT[]      NOT NULL DEFAULT '{}',
  kelengkapan       TEXT        NOT NULL,
  kualitas_makeup   TEXT        NOT NULL,
  pengalaman_mua    TEXT        NOT NULL,
  estetika_dekorasi TEXT        NOT NULL,
  foto              TEXT,
  rating            NUMERIC     DEFAULT 0,
  total_review      INTEGER     DEFAULT 0,
  terlaris          BOOLEAN     DEFAULT false,
  terbaik           BOOLEAN     DEFAULT false,
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

-- ── Tabel Galeri ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.galeri (
  id         TEXT        PRIMARY KEY,
  foto       TEXT        NOT NULL,
  kategori   TEXT,
  deskripsi  TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── RLS untuk Paket & Galeri ─────────────────────────────────
ALTER TABLE public.paket  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.galeri ENABLE ROW LEVEL SECURITY;

CREATE POLICY "allow_all_paket"
  ON public.paket FOR ALL
  USING (true) WITH CHECK (true);

CREATE POLICY "allow_all_galeri"
  ON public.galeri FOR ALL
  USING (true) WITH CHECK (true);

-- ── Storage: marcos-images bucket ────────────────────────────
-- Buat bucket via Dashboard (Storage → New bucket → "marcos-images" → Public ON)
-- Lalu jalankan policy berikut:
INSERT INTO storage.buckets (id, name, public)
VALUES ('marcos-images', 'marcos-images', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "allow_public_read_marcos_images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'marcos-images');

CREATE POLICY "allow_upload_marcos_images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'marcos-images');
