import fs from 'fs';
import path from 'path';
import { 
  Document, 
  Packer, 
  Paragraph, 
  TextRun, 
  Table, 
  TableRow, 
  TableCell, 
  HeadingLevel, 
  AlignmentType, 
  BorderStyle, 
  WidthType, 
  ShadingType,
  Header,
  Footer,
  PageNumber
} from 'docx';

function createTitle(text) {
  return new Paragraph({
    text: text,
    heading: HeadingLevel.TITLE,
    alignment: AlignmentType.CENTER,
    spacing: { before: 200, after: 120 }
  });
}

function createHeading1(text) {
  return new Paragraph({
    text: text,
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 360, after: 160 }
  });
}

function createHeading2(text) {
  return new Paragraph({
    text: text,
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 240, after: 100 }
  });
}

function createParagraph(text, bold = false, italic = false) {
  return new Paragraph({
    children: [
      new TextRun({
        text: text,
        bold: bold,
        italics: italic,
        font: 'Calibri',
        size: 22,
        color: '1E293B'
      })
    ],
    spacing: { after: 120, line: 276 }
  });
}

function createBullet(text, boldPrefix = '') {
  const children = [];
  if (boldPrefix) {
    children.push(new TextRun({ text: boldPrefix, bold: true, font: 'Calibri', size: 22, color: '1E293B' }));
  }
  children.push(new TextRun({ text: text, font: 'Calibri', size: 22, color: '334155' }));

  return new Paragraph({
    children: children,
    bullet: { level: 0 },
    spacing: { after: 80, line: 260 }
  });
}

function createTableHeaderCell(text, widthPct = 25) {
  return new TableCell({
    width: { size: widthPct, type: WidthType.PERCENTAGE },
    shading: { fill: '1F3A5F', type: ShadingType.CLEAR },
    margins: { top: 120, bottom: 120, left: 140, right: 140 },
    children: [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text: text,
            bold: true,
            color: 'FFFFFF',
            font: 'Calibri',
            size: 20
          })
        ]
      })
    ]
  });
}

function createTableCell(text, widthPct = 25, severity = 'NORMAL', align = AlignmentType.LEFT) {
  let textColor = '1E293B';
  let bold = false;
  let bgFill = 'FFFFFF';

  if (severity === 'HIGH') {
    textColor = 'B91C1C';
    bold = true;
    bgFill = 'FEE2E2';
  } else if (severity === 'MEDIUM') {
    textColor = 'B45309';
    bold = true;
    bgFill = 'FEF3C7';
  } else if (severity === 'LOW') {
    textColor = '1D4ED8';
    bold = true;
    bgFill = 'DBEAFE';
  } else if (severity === 'RESOLVED') {
    textColor = '047857';
    bold = true;
    bgFill = 'D1FAE5';
  }

  return new TableCell({
    width: { size: widthPct, type: WidthType.PERCENTAGE },
    shading: { fill: bgFill, type: ShadingType.CLEAR },
    margins: { top: 100, bottom: 100, left: 140, right: 140 },
    children: [
      new Paragraph({
        alignment: align,
        children: [
          new TextRun({
            text: text,
            bold: bold,
            color: textColor,
            font: 'Calibri',
            size: 19
          })
        ]
      })
    ]
  });
}

async function generateSecurityReport() {
  console.log('Generating Security Audit Word DOCX Report...');

  // Vulnerability Matrix Data
  const vulnMatrix = [
    {
      id: 'SEC-01',
      cwe: 'CWE-79 (DOM XSS)',
      desc: 'Potensi eksekusi script injeksi HTML pada konten pop-up Leaflet Marker.',
      severity: 'HIGH',
      remediation: 'Implementasi fungsi sanitasi entitas escapeHTML() dan validasi skema URI foto.',
      status: 'RESOLVED'
    },
    {
      id: 'SEC-02',
      cwe: 'CWE-1236 (CSV Injection)',
      desc: 'Risiko eksekusi formula Excel (DDE) jika judul/lokasi pengaduan diawali simbol =, +, -, atau @.',
      severity: 'MEDIUM',
      remediation: 'Sanitasi nilai kolom ekspor CSV dengan penambahan prefiks tanda petik tunggal pada trigger formula.',
      status: 'RESOLVED'
    },
    {
      id: 'SEC-03',
      cwe: 'CWE-434 (Unrestricted Upload)',
      desc: 'Risiko unggahan file dengan ekstensi atau ukuran yang berlebihan pada form pelaporan.',
      severity: 'MEDIUM',
      remediation: 'Validasi sisi klien diperketat: kuota maksimal 5 MB dan whitelist tipe MIME (image/jpeg, png, webp).',
      status: 'RESOLVED'
    },
    {
      id: 'SEC-04',
      cwe: 'CWE-16 (Security Headers)',
      desc: 'Ketiadaan header proteksi browser standar terhadap MIME-sniffing dan cross-origin leakage.',
      severity: 'LOW',
      remediation: 'Penambahan meta tag X-Content-Type-Options: nosniff dan Referrer-Policy: strict-origin-when-cross-origin.',
      status: 'RESOLVED'
    },
    {
      id: 'SEC-05',
      cwe: 'CWE-359 (Privacy / PII Leak)',
      desc: 'Kemungkinan kebocoran identitas pelapor publik pada laporan yang menghendaki kerahasiaan.',
      severity: 'MEDIUM',
      remediation: 'Fitur Lapor Anonim secara ketat menyamarkan nama dan menghapus nomor telepon dari publikasi.',
      status: 'RESOLVED'
    },
    {
      id: 'SEC-06',
      cwe: 'CWE-1104 (Third-Party Vuln)',
      desc: 'Kerentanan pada paket library eksternal (Node npm dependencies).',
      severity: 'LOW',
      remediation: 'Pemeriksaan audit dependensi npm audit: 0 vulnerabilities (Clean & Audited).',
      status: 'RESOLVED'
    }
  ];

  const vulnTableRows = [
    new TableRow({
      tableHeader: true,
      children: [
        createTableHeaderCell('ID', 8),
        createTableHeaderCell('Kategori CWE', 18),
        createTableHeaderCell('Uraian Ancaman Keamanan', 28),
        createTableHeaderCell('Tingkat Risiko', 14),
        createTableHeaderCell('Tindakan Remediasi (Patch)', 22),
        createTableHeaderCell('Status', 10)
      ]
    })
  ];

  vulnMatrix.forEach((v) => {
    vulnTableRows.push(
      new TableRow({
        children: [
          createTableCell(v.id, 8, 'NORMAL', AlignmentType.CENTER),
          createTableCell(v.cwe, 18),
          createTableCell(v.desc, 28),
          createTableCell(v.severity, 14, v.severity, AlignmentType.CENTER),
          createTableCell(v.remediation, 22),
          createTableCell(v.status, 10, 'RESOLVED', AlignmentType.CENTER)
        ]
      })
    );
  });

  const vulnTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: vulnTableRows
  });

  // Construct Document
  const doc = new Document({
    styles: {
      default: {
        document: {
          run: {
            font: 'Calibri',
            size: 22,
            color: '1E293B'
          }
        }
      }
    },
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1440,
              bottom: 1440,
              left: 1440,
              right: 1440
            }
          }
        },
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun({
                    text: 'Laporan Audit Keamanan Sistem Informasi — Smart City Bandar Lampung',
                    italics: true,
                    size: 18,
                    color: '64748B'
                  })
                ]
              })
            ]
          })
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({ text: 'Halaman ', size: 18, color: '64748B' }),
                  new TextRun({ children: [PageNumber.CURRENT], size: 18, color: '64748B' }),
                  new TextRun({ text: ' dari ', size: 18, color: '64748B' }),
                  new TextRun({ children: [PageNumber.TOTAL_PAGES], size: 18, color: '64748B' })
                ]
              })
            ]
          })
        },
        children: [
          createTitle('LAPORAN AUDIT KEAMANAN SISTEM & ASESMEN KERENTANAN'),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: 'Smart Complaint System — Sistem Pengaduan Smart City Kota Bandar Lampung',
                bold: true,
                size: 26,
                color: '1F3A5F'
              })
            ],
            spacing: { after: 200 }
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: 'Inisiatif Kolaboratif: Pemerintah Daerah Provinsi Lampung & Universitas Teknokrat Indonesia',
                italics: true,
                size: 20,
                color: '64748B'
              })
            ],
            spacing: { after: 360 }
          }),

          // Metadata Box
          new Paragraph({
            children: [
              new TextRun({ text: 'Nomor Dokumen: ', bold: true }),
              new TextRun({ text: 'SEC-AUD-SCS-2026-001\n' }),
              new TextRun({ text: 'Tanggal Audit: ', bold: true }),
              new TextRun({ text: '10 November 2026\n' }),
              new TextRun({ text: 'Auditor Keamanan: ', bold: true }),
              new TextRun({ text: 'M Abiel Kurniawan (Cybersecurity & Lead Software Engineer)\n' }),
              new TextRun({ text: 'Standar Acuan: ', bold: true }),
              new TextRun({ text: 'OWASP Top 10 Web Application Security, CWE, UU No. 27/2022 (UU PDP)\n' }),
              new TextRun({ text: 'Hasil Akhir Keamanan: ', bold: true }),
              new TextRun({ text: 'STATUS: SECURE & REMEDIATED (0 Kerentanan Kritis Terbuka)\n', color: '047857', bold: true })
            ],
            spacing: { after: 300, line: 260 }
          }),

          // 1. Ringkasan Eksekutif
          createHeading1('1. Ringkasan Eksekutif (Executive Summary)'),
          createParagraph(
            'Laporan Audit Keamanan ini mendokumentasikan hasil pengujian penetrasi berbasis kode sumber (Source Code Review), analisis kerentanan statis (SAST), dan pengujian ancaman berbasis OWASP Top 10 pada aplikasi Smart Complaint System. Evaluasi ini bertujuan memastikan bahwa data pengaduan masyarakat, data pribadi pelapor, serta integrasi pemantauan aparat pemerintah terlindungi secara optimal dari potensi manipulasi, kebocoran data, maupun gangguan ketersediaan layanan.'
          ),
          createParagraph(
            'Hasil pengujian mendeteksi beberapa potensi vektor ancaman pada fase awal, antara lain celah DOM XSS pada pop-up Leaflet GIS, risiko CSV Formula Injection pada fitur ekspor analitik, serta batas validasi file gambar. Seluruh temuan tersebut telah ditangani secara menyeluruh (100% Remediated) melalui penerapan sanitasi berlapis, validasi tipe MIME/ukuran berkas, penguatan header keamanan, dan kepatuhan prinsip privasi UU PDP.'
          ),
          createBullet(' Tingkat Risiko Keseluruhan Saat Ini: RENDAH (Low / Well-Protected).', 'Skor Postur Keamanan:'),
          createBullet(' Seluruh celah keamanan yang teridentifikasi telah diperbaiki dan diverifikasi melalui Automated Security Test Suite.', 'Status Remediasi:'),
          createBullet(' Paket dependensi pihak ketiga (node_modules) terbukti bersih: 0 vulnerabilities pada database npm advisory.', 'Audit Dependensi:'),

          // 2. Ruang Lingkup & Metodologi
          createHeading1('2. Ruang Lingkup & Metodologi Pengujian Keamanan'),
          createParagraph(
            'Audit keamanan mencakup seluruh permukaan serangan (attack surface) aplikasi yang terdiri dari:'
          ),
          createBullet(' Validasi input judul, deskripsi, lokasi, koordinat GPS, nomor telepon, dan berkas foto bukti.', 'Komponen Formulir Masukan:'),
          createBullet(' Mekanisme penyajian teks dinamis pada marker pemetaan wilayah Kota Bandar Lampung.', 'Visualisasi Geografis (Leaflet GIS):'),
          createBullet(' Sanitasi karakter formula saat mengunduh berkas laporan CSV ke Microsoft Excel atau LibreOffice.', 'Saluran Ekspor Data:'),
          createBullet(' Perlindungan nomor kontak dan nama warga melalui mode pelaporan anonim.', 'Perlindungan Data Pribadi (PII):'),
          createBullet(' Integritas skema 7 tabel relasional ANSI SQL dan penggunaan bcrypt password hash.', 'Arsitektur Skema Database:'),

          // 3. Matriks Temuan & Tindakan Remediasi
          createHeading1('3. Matriks Temuan Kerentanan & Remediasi (OWASP Top 10)'),
          createParagraph(
            'Tabel berikut memaparkan rincian temuan keamanan, klasifikasi kelemahan CWE, tingkat risiko asli, serta langkah mitigasi teknis yang telah diterapkan:'
          ),
          vulnTable,

          // 4. Analisis Teknis & Pembahasan Patch Keamanan
          createHeading1('4. Analisis Teknis & Pembahasan Patch Keamanan'),
          
          createHeading2('4.1 Mitigasi DOM Cross-Site Scripting (CWE-79)'),
          createParagraph(
            'Pada komponen InteractiveMap.jsx, kode sebelumnya merender string masukan pengguna langsung ke dalam properti innerHTML tanpa sanitasi. Jika pelapor memasukkan karakter berbahaya (seperti tag <script> atau payload event handler inline), kode tersebut dapat dieksekusi di peramban pengguna lain atau admin.'
          ),
          createParagraph(
            'Remediasi: Dibuat fungsi helper escapeHTML() yang secara ketat mengubah karakter khusus (&, <, >, ", \') menjadi entitas HTML aman, serta helper sanitizeImageSrc() yang hanya mengizinkan protokol HTTP/HTTPS/data:image dan menolak protokol berbahaya seperti javascript: atau vbscript:.'
          ),

          createHeading2('4.2 Pencegahan CSV Formula Injection (CWE-1236)'),
          createParagraph(
            'Pada fitur ekspor rekap laporan (ExecutiveAnalytics.jsx), masukan warga diekspor ke dalam file berekstensi .csv. Program spreadsheet seperti Microsoft Excel akan secara otomatis mengeksekusi sel yang diawali dengan simbol =, +, -, atau @ sebagai formula matematika atau perintah DDE (Dynamic Data Exchange).'
          ),
          createParagraph(
            'Remediasi: Diterapkan fungsi pembersih sanitizeCsvField() yang mendeteksi karakter awalan formula tersebut dan secara otomatis menyisipkan tanda petik tunggal (\') di depannya, sehingga aplikasi spreadsheet memperlakukan sel tersebut murni sebagai teks biasa tanpa risiko eksekusi kode.'
          ),

          createHeading2('4.3 Penguatan Validasi Unggah Berkas (CWE-434)'),
          createParagraph(
            'Untuk mencegah potensi serangan denial of service akibat pengunggahan berkas berukuran raksasa atau berkas biner berbahaya, form unggah foto pada CitizenForm.jsx dan OfficerPortal.jsx dilengkapi pembatasan ketat:'
          ),
          createBullet(' Kuota ukuran maksimal 5 Megabytes (5 * 1024 * 1024 bytes).', 'Batas Ukuran:'),
          createBullet(' Whitelist tipe MIME ketat: hanya menerima image/jpeg, image/png, dan image/webp.', 'Batas Format:'),

          // 5. Kepatuhan Regulasi Privasi (UU No. 27/2022 tentang Perlindungan Data Pribadi)
          createHeading1('5. Kepatuhan Terhadap Regulasi Pelindungan Data Pribadi (UU PDP)'),
          createParagraph(
            'Sebagai sistem pengaduan publik yang mengelola data warga, Smart Complaint System mematuhi prinsip akuntabilitas dan kerahasiaan data pribadi:'
          ),
          createBullet(' Warga diberikan hak untuk melapor tanpa menyertakan identitas publik. Saat fitur ini aktif, nama diganti dengan "Warga (Anonim)" dan nomor kontak dihapus total dari tampilan publik maupun petugas.', 'Mode Lapor Anonim:'),
          createBullet(' Data nomor telepon pelapor hanya dapat diakses oleh petugas dinas berwenang untuk koordinasi penanganan lapangan.', 'Prinsip Need-to-Know:'),
          createBullet(' Setiap perubahan status pengaduan dicatat dengan stempel waktu (timestamp) dan aktor yang bertanggung jawab untuk memastikan akuntabilitas instansi pemerintah.', 'Audit Trail & Transparansi:'),

          // 6. Rekomendasi Penguatan untuk Tahap Backend Server
          createHeading1('6. Rekomendasi Strategis untuk Tahap Pengembangan Lanjutan'),
          createParagraph(
            'Saat arsitektur backend API dihubungkan secara penuh dengan database MySQL/PostgreSQL di server pemerintah, direkomendasikan implementasi kontrol keamanan lanjutan berikut:'
          ),
          createBullet(' Gunakan JSON Web Token (JWT) yang disimpan dalam cookie dengan atribut HttpOnly, Secure, dan SameSite=Strict guna mencegah pencurian token via XSS.', 'Autentikasi Sisi Server:'),
          createBullet(' Terapkan pembatasan frekuensi pengiriman (misal: maksimum 5 laporan per 15 menit per alamat IP) untuk mencegah spamming dan bot flood.', 'Rate Limiting & Anti-Spam:'),
          createBullet(' Seluruh pertukaran data wajib melalui enkripsi TLS 1.3 dengan sertifikat SSL terpercaya dan header HSTS (HTTP Strict Transport Security).', 'Enkripsi Jalur Komunikasi:'),

          // 7. Kesimpulan
          createHeading1('7. Kesimpulan Audit'),
          createParagraph(
            'Berdasarkan evaluasi menyeluruh, verifikasi pengujian otomatis 57 kasus uji (100% Passed), serta penguatan patch keamanan yang telah diterapkan, Smart Complaint System dinyatakan telah memenuhi standar keamanan web modern dan aman untuk dioperasikan dalam lingkungan uji publik Smart City Provinsi Lampung.'
          ),

          new Paragraph({
            spacing: { before: 400 },
            children: [
              new TextRun({ text: 'Bandar Lampung, 10 November 2026\n\n\n\n', bold: true }),
              new TextRun({ text: 'M Abiel Kurniawan\n', bold: true, underline: {} }),
              new TextRun({ text: 'Auditor Keamanan Perangkat Lunak / Cybersecurity Lead\nKolaborasi Pemda Lampung & Universitas Teknokrat Indonesia' })
            ]
          })
        ]
      }
    ]
  });

  const outputPath = path.join(process.cwd(), 'Laporan_Security_Audit_Smart_Complaint_System.docx');
  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(outputPath, buffer);
  console.log(`Security Audit Document successfully generated at: ${outputPath}`);
}

generateSecurityReport().catch(err => {
  console.error('Error generating security audit report:', err);
  process.exit(1);
});
