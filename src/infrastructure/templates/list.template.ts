interface ListTemplate {
  id: string;
  title: string;
  description: string;
}

export const listTemplate: ListTemplate[] = [
  {
    id: 'penelitian',
    title: 'Izin Penelitian',
    description: 'Ajukan izin penelitian di BP3MI Riau.',
  },
  {
    id: 'permintaan_data',
    title: 'Akses Data Resmi',
    description: 'Permintaan data resmi BP3MI Riau.',
  },
  {
    id: 'perizinan_magang',
    title: 'Izin Magang',
    description: 'Ajukan izin magang di BP3MI Riau.',
  },
  {
    id: 'permohonan_kerja_sama',
    title: 'Kerja Sama',
    description: 'Ajukan kerja sama kelembagaan.',
  },
  {
    id: 'info_lowongan_kerja',
    title: 'Info Lowongan',
    description: 'Lihat daftar lowongan luar negeri resmi.',
  },
  {
    id: 'info_p3mi_riau',
    title: 'Daftar P3MI Riau',
    description: 'Lihat perusahaan penempatan resmi di Riau.',
  },
  {
    id: 'kendala_siskop2mi',
    title: 'Kendala SISKOP2MI',
    description: 'Laporkan kendala aplikasi SISKOP2MI.',
  },
];
