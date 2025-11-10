import { Lapangan } from '@/types/api';

// Data lapangan futsal dengan foto dari Unsplash
export const lapanganData: Lapangan[] = [
  {
    id: 1,
    nama: "FUTSAL ARENA SENAYAN",
    gambar: "https://images.unsplash.com/photo-1595514535215-8a5b0fcd981c?w=800&h=600&fit=crop&crop=entropy&auto=format,compress",
    hargaPerJam: 120000,
    deskripsi: "Lapangan futsal premium dengan rumput sintetis kualitas internasional. Dilengkapi lighting system profesional dan fasilitas lengkap.",
    fasilitas: [
      "Rumput sintetis kualitas A",
      "Lighting system profesional",
      "Kamar ganti pria & wanita",
      "Area parkir luas",
      "Kantin & area tunggu",
      "Toilet bersih",
      "Wi-Fi gratis",
      "Ruang istirahat"
    ],
    lokasi: "Jl. Pintu Satu Senayan, Jakarta Pusat",
    harga_per_jam: 120000,
    status: "aktif",
    created_at: "2025-11-11",
    updated_at: "2025-11-11"
  },
  {
    id: 2,
    nama: "JAKARTA FUTSAL CENTER",
    gambar: "https://images.unsplash.com/photo-1623079398025-470a08890e5b?w=800&h=600&fit=crop&crop=entropy&auto=format,compress",
    hargaPerJam: 100000,
    deskripsi: "Lapangan futsal modern di jantung kota Jakarta. Akses mudah dengan transportasi umum dan fasilitas standar internasional.",
    fasilitas: [
      "Rumput sintetis standar",
      "Sistem pencahayaan modern",
      "Kamar ganti",
      "Area parkir",
      "Minimarket",
      "Toilet",
      "Wi-Fi",
      "Tempat duduk penonton"
    ],
    lokasi: "Jl. Sudirman No. 45, Jakarta Selatan",
    harga_per_jam: 100000,
    status: "aktif",
    created_at: "2025-11-11",
    updated_at: "2025-11-11"
  },
  {
    id: 3,
    nama: "SPORT CITY FUTSAL",
    gambar: "https://images.unsplash.com/photo-1581836499900-5251cb482d19?w=800&h=600&fit=crop&crop=entropy&auto=format,compress",
    hargaPerJam: 90000,
    deskripsi: "Kompleks olahraga modern dengan beberapa lapangan futsal. Cocok untuk turnamen dan latihan rutin tim.",
    fasilitas: [
      "Beberapa lapangan tersedia",
      "Rumput sintetis berkualitas",
      "Gym fitness center",
      "Kafe olahraga",
      "Area parkir luas",
      "Kamar ganti modern",
      "Toilet bersih",
      "Loker penyimpanan"
    ],
    lokasi: "Jl. TB Simatupang No. 15, Jakarta Selatan",
    harga_per_jam: 90000,
    status: "aktif",
    created_at: "2025-11-11",
    updated_at: "2025-11-11"
  },
  {
    id: 4,
    nama: "UNIVERSITY FUTSAL FIELD",
    gambar: "https://images.unsplash.com/photo-1605495134673-a6439aa23c30?w=800&h=600&fit=crop&crop=entropy&auto=format,compress",
    hargaPerJam: 75000,
    deskripsi: "Lapangan futsal kampus dengan suasana muda dan energik. Ideal untuk latihan rutin dan pertandingan persahabatan.",
    fasilitas: [
      "Suasana muda dan energik",
      "Rumput sintetis standar",
      "Lapangan terbuka",
      "Area parkir kampus",
      "Kantin kampus",
      "Toilet umum",
      "Tempat makan",
      "ATM center"
    ],
    lokasi: "Jl. Salemba Raya No. 4, Jakarta Pusat",
    harga_per_jam: 75000,
    status: "aktif",
    created_at: "2025-11-11",
    updated_at: "2025-11-11"
  },
  {
    id: 5,
    nama: "PREMIUM FUTSAL CLUB",
    gambar: "https://images.unsplash.com/photo-1569794269399-2422eb2dd3e2?w=800&h=600&fit=crop&crop=entropy&auto=format,compress",
    hargaPerJam: 150000,
    deskripsi: "Lapangan futsal eksklusif dengan pelayanan premium. Fasilitas lengkap dan pelayanan personal untuk pengalaman bermain terbaik.",
    fasilitas: [
      "Rumput sintetis premium",
      "Sistem pencahayaan LED",
      "Lounge eksklusif",
      "Parkir valet",
      "Kafe premium",
      "Kamar ganti mewah",
      "Locker pribadi",
      "Pelayanan concierge"
    ],
    lokasi: "Jl. Kemang Raya No. 88, Jakarta Selatan",
    harga_per_jam: 150000,
    status: "aktif",
    created_at: "2025-11-11",
    updated_at: "2025-11-11"
  },
  {
    id: 6,
    nama: "COMMUNITY FUTSAL PARK",
    gambar: "https://images.unsplash.com/photo-1587486907988-45f54a74cf30?w=800&h=600&fit=crop&crop=entropy&auto=format,compress",
    hargaPerJam: 65000,
    deskripsi: "Lapangan futsal komunitas dengan harga terjangkau. Cocok untuk latihan rutin dan pertandingan antar komunitas.",
    fasilitas: [
      "Harga terjangkau",
      "Rumput sintetis standar",
      "Area komunitas",
      "Parkir umum",
      "Kantin sederhana",
      "Toilet umum",
      "Area bermain anak",
      "Tempat sampah"
    ],
    lokasi: "Jl. Kelapa Gading Boulevard, Jakarta Utara",
    harga_per_jam: 65000,
    status: "aktif",
    created_at: "2025-11-11",
    updated_at: "2025-11-11"
  }
];

export function getLapanganById(id: number): Lapangan | undefined {
  return lapanganData.find(lapangan => lapangan.id === id);
}

export function getAllLapangans(): Lapangan[] {
  return lapanganData;
}

export function searchLapangans(keyword: string): Lapangan[] {
  const lowerKeyword = keyword.toLowerCase();
  return lapanganData.filter(lapangan => 
    lapangan.nama.toLowerCase().includes(lowerKeyword) ||
    lapangan.deskripsi.toLowerCase().includes(lowerKeyword)
  );
}

export function getAvailableLapangans(date: string, time: string): Lapangan[] {
  // Logika sederhana untuk menentukan ketersediaan
  // Dalam implementasi nyata, ini akan dicek dari database
  const bookedLapanganIds = [2, 4]; // Contoh lapangan yang sedang dipesan
  
  return lapanganData.filter(lapangan => !bookedLapanganIds.includes(lapangan.id));
}
