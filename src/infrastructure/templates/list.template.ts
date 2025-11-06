interface ListTemplate {
  id: string;
  title: string;
  description: string;
  answer: string;
}

export const listTemplate: ListTemplate[] = [
  {
    id: 'izin_penelitian',
    title: 'Izin Penelitian',
    description: 'Ajukan izin penelitian di BP3MI Riau.',
    answer: `📚 Untuk permohonan *penelitian* di lingkungan BP3MI Riau, silakan isi formulir berikut:
    👉 [Formulir Penelitian](https://forms.gle/4TSHqAFKgFAPRo7L8)

    Setelah formulir dikirim, tim kami akan meninjau dan menghubungi Anda untuk konfirmasi lebih lanjut.
    Mohon menunggu balasan dari kami.📬
    Jika belum ada respon setelah *1×24 jam*, silakan hubungi kembali melalui pesan ini.
    Terima kasih atas kerja samanya.🙏`,
  },
  {
    id: 'permintaan_data',
    title: 'Akses Data',
    description: 'Permintaan data resmi BP3MI Riau.',
    answer: `📊 Untuk keperluan *permintaan data resmi* BP3MI Riau, silakan isi formulir berikut:  
👉 [Formulir Permintaan Data](https://forms.gle/4TSHqAFKgFAPRo7L8)  

Permintaan Anda akan kami proses sesuai dengan prosedur dan ketersediaan data.  
📬 Mohon menunggu balasan dari kami.  
Apabila belum ada respon setelah *1×24 jam*, silakan hubungi kembali melalui pesan ini.  
Terima kasih.🙏`,
  },
  {
    id: 'izin_magang',
    title: 'Izin Magang',
    description: 'Ajukan izin magang di BP3MI Riau.',
    answer: `🎓 Untuk pengajuan *magang* di BP3MI Riau, silakan isi formulir berikut:  
👉 [Formulir Perizinan Magang](https://forms.gle/4TSHqAFKgFAPRo7L8)  

Kami akan meninjau permohonan Anda dan menghubungi kembali setelah proses administrasi selesai.  
📬 Mohon menunggu balasan dari kami.  
Jika belum ada respon setelah *1×24 jam*, silakan hubungi kembali melalui pesan ini.  
Terima kasih.🙏`,
  },
  {
    id: 'kerja_sama',
    title: 'Kerja Sama',
    description: 'Ajukan kerja sama kelembagaan.',
    answer: `🤝 Untuk mengajukan *kerja sama* dengan BP3MI Riau, silakan isi formulir berikut:  
👉 [Formulir Permohonan Kerja Sama](https://forms.gle/4TSHqAFKgFAPRo7L8)  

Tim kami akan meninjau proposal Anda dan menghubungi lebih lanjut.  
📬 Mohon menunggu balasan dari kami.  
Jika belum ada respon setelah *1×24 jam*, silakan hubungi kembali melalui pesan ini.  
Terima kasih.🙏`,
  },
  {
    id: 'lowongan_kerja',
    title: 'Lowongan Kerja',
    description: 'Lihat daftar lowongan luar negeri resmi.',
    //     answer: `💼 Untuk melihat *informasi lowongan kerja luar negeri resmi* yang tersedia melalui BP3MI Riau, silakan kunjungi tautan berikut:
    // 👉 [Daftar Lowongan Kerja Luar Negeri] (https://siskop2mi.bp2mi.go.id/lowongan/list)

    // Pastikan Anda hanya melamar melalui sumber resmi BP3MI untuk menghindari penipuan tenaga kerja.
    // Semoga informasi ini bermanfaat.
    // Terima kasih.🙏`,
    answer: `💬 Untuk info lowongan kerja, silakan hubungi kembali admin kami melalui tautan berikut:
    👉 (wa.me/+6281175511011)`,
  },
  {
    id: 'perusahaan_p3mi',
    title: 'Daftar P3MI',
    description: 'Lihat perusahaan penempatan resmi di Riau.',
    answer: `🏢 Berikut daftar resmi *Perusahaan Penempatan Pekerja Migran Indonesia (P3MI)* yang beroperasi di wilayah Riau:  
👉 [Daftar P3MI Riau](https://siskop2mi.bp2mi.go.id/profil/lembaga/list)  
Semoga informasi ini bermanfaat.🙏`,
  },
  {
    id: 'kendala_siskop2mi',
    title: 'Kendala SISKOP2MI',
    description: 'Laporkan kendala aplikasi SISKOP2MI.',
    answer: `⚙️ Jika Anda mengalami kendala pada aplikasi *SISKOP2MI*, mohon laporkan melalui kontak berikut:  
👉 (wa.me/+6281175511011)  

Tim teknis kami akan membantu secepat mungkin.
📬 Mohon menunggu balasan dari kami.  
Jika belum ada respon setelah *1×24 jam*, silakan hubungi kembali melalui pesan ini.  
Terima kasih.🙏`,
  },
  {
    id: 'hubungi_admin',
    title: 'Hubungi Admin',
    description: 'Hubungi admin untuk bantuan lebih lanjut.',
    answer: `💬 Untuk bantuan lebih lanjut, silakan hubungi admin kami melalui tautan berikut:
    👉 (wa.me/+6281175511011)`,
  },
];

type ListTemplateWithoutAnswer = Omit<ListTemplate, 'answer'>;

export const listTemplateWithoutAnswer: ListTemplateWithoutAnswer[] =
  listTemplate.map(({ answer, ...rest }) => rest);
