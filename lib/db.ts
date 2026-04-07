/**
 * lib/db.ts — Database layer using Supabase
 * Menggantikan localStorage untuk data Users dan Bookings.
 * Data statis (Paket, Galeri, Testimoni) tetap di lib/data.ts
 */
import { supabase } from './supabase'
import type { User, Booking } from './data'

const isBrowser = typeof window !== 'undefined'

// ── Session (tetap pakai localStorage untuk sesi login) ──────
export function getCurrentUser(): User | null {
  if (!isBrowser) return null
  try {
    const data = localStorage.getItem('marcos_current_user')
    return data ? JSON.parse(data) : null
  } catch { return null }
}

export function setCurrentUser(user: User | null) {
  if (!isBrowser) return
  if (user) localStorage.setItem('marcos_current_user', JSON.stringify(user))
  else localStorage.removeItem('marcos_current_user')
}

// ── Users ────────────────────────────────────────────────────

/** Login: cari user berdasarkan email & password */
export async function findUserByCredentials(
  email: string,
  password: string
): Promise<User | null> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .eq('password', password)
    .single()

  if (error || !data) return null
  return dbRowToUser(data)
}

/** Registrasi customer baru */
export async function registerUser(
  input: Pick<User, 'nama' | 'email' | 'noHp' | 'password'>
): Promise<{ user: User | null; error: string | null }> {
  // Cek duplikat email
  const { data: exist } = await supabase
    .from('users')
    .select('id')
    .eq('email', input.email)
    .maybeSingle()

  if (exist) return { user: null, error: 'Email sudah terdaftar.' }

  const newUser: User = {
    id: `u_${Date.now()}`,
    nama: input.nama,
    email: input.email,
    noHp: input.noHp,
    password: input.password,
    role: 'customer',
    createdAt: new Date().toISOString(),
  }

  const { error } = await supabase.from('users').insert(userToDbRow(newUser))
  if (error) return { user: null, error: 'Gagal mendaftar. Coba lagi.' }

  return { user: newUser, error: null }
}

/** Ambil semua customer (untuk halaman admin) */
export async function getAllCustomers(): Promise<User[]> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('role', 'customer')
    .order('created_at', { ascending: false })

  if (error || !data) return []
  return data.map(dbRowToUser)
}

// ── Bookings ─────────────────────────────────────────────────

/** Ambil semua booking (untuk admin) */
export async function getAllBookings(): Promise<Booking[]> {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .order('created_at', { ascending: false })

  if (error || !data) return []
  return data.map(dbRowToBooking)
}

/** Ambil booking milik satu customer */
export async function getBookingsByCustomer(customerId: string): Promise<Booking[]> {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('customer_id', customerId)
    .order('created_at', { ascending: false })

  if (error || !data) return []
  return data.map(dbRowToBooking)
}

/** Tambah booking baru */
export async function addBooking(booking: Booking): Promise<void> {
  const { error } = await supabase.from('bookings').insert(bookingToDbRow(booking))
  if (error) console.error('addBooking error:', error.message)
}

/** Update status / bukti pembayaran booking */
export async function updateBooking(
  id: string,
  updates: Partial<Booking>
): Promise<void> {
  const dbUpdates: Record<string, unknown> = { updated_at: new Date().toISOString() }

  if (updates.status !== undefined) dbUpdates.status = updates.status
  if (updates.buktiPembayaran !== undefined) dbUpdates.bukti_pembayaran = updates.buktiPembayaran
  if (updates.catatan !== undefined) dbUpdates.catatan = updates.catatan
  if (updates.lokasiAcara !== undefined) dbUpdates.lokasi_acara = updates.lokasiAcara
  if (updates.tanggalAcara !== undefined) dbUpdates.tanggal_acara = updates.tanggalAcara

  const { error } = await supabase.from('bookings').update(dbUpdates).eq('id', id)
  if (error) console.error('updateBooking error:', error.message)
}

// ── Helper: mapping DB row ↔ TypeScript types ─────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function dbRowToUser(d: any): User {
  return {
    id: d.id,
    nama: d.nama,
    email: d.email,
    noHp: d.no_hp,
    password: d.password,
    role: d.role,
    createdAt: d.created_at,
  }
}

function userToDbRow(u: User) {
  return {
    id: u.id,
    nama: u.nama,
    email: u.email,
    no_hp: u.noHp,
    password: u.password,
    role: u.role,
    created_at: u.createdAt,
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function dbRowToBooking(d: any): Booking {
  return {
    id: d.id,
    customerId: d.customer_id,
    customerNama: d.customer_nama,
    customerEmail: d.customer_email,
    customerHp: d.customer_hp,
    paketId: d.paket_id,
    paketNama: d.paket_nama,
    paketHarga: d.paket_harga,
    tanggalAcara: d.tanggal_acara,
    lokasiAcara: d.lokasi_acara,
    catatan: d.catatan,
    status: d.status,
    buktiPembayaran: d.bukti_pembayaran,
    createdAt: d.created_at,
    updatedAt: d.updated_at,
  }
}

function bookingToDbRow(b: Booking) {
  return {
    id: b.id,
    customer_id: b.customerId,
    customer_nama: b.customerNama,
    customer_email: b.customerEmail,
    customer_hp: b.customerHp,
    paket_id: b.paketId,
    paket_nama: b.paketNama,
    paket_harga: b.paketHarga,
    tanggal_acara: b.tanggalAcara,
    lokasi_acara: b.lokasiAcara,
    catatan: b.catatan,
    status: b.status,
    bukti_pembayaran: b.buktiPembayaran ?? null,
    created_at: b.createdAt,
    updated_at: b.updatedAt,
  }
}
