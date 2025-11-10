// Tipe data untuk aplikasi futsal booking
// Tipe-tipe ini sesuai dengan struktur tabel database

export type Lapangan = {
  id: number;
  nama: string;
  gambar: string;
  hargaPerJam: number;
  deskripsi: string;
};

export type Booking = {
  id: number;
  lapanganId: number;
  tanggal: string; // Format "YYYY-MM-DD"
  jamMulai: number; // Jam dalam format 24 jam
  jamSelesai: number;
};

// Data dummy telah dihapus
// Data akan diambil langsung dari database yang terintegrasi
