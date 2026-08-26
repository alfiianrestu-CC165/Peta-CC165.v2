import Papa from 'papaparse';
import { DataRow, CategoryBreakdownData } from '../types';

export const SHEET_ID = '1MjFAlH-fl2Y5acLWgNqQcX6E7nYfEol2gi6bHHfvH0U';
const CSV_URL_MAIN = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=0`;
const CSV_URL_CATEGORY = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=801320162`;

// Fallback data for category breakdown if network error occurs
const DEFAULT_CATEGORY_DATA: CategoryBreakdownData = {
  informasi: [
    { topik: 'Perbaikan data identitas peserta (NIK, nama, tanggal lahir, jenis kelamin dan alamat)', jumlah: 156556, persen: '18,39%', persenVal: 18.39 },
    { topik: 'Prosedur Perubahan Segmen Kepesertaan', jumlah: 125926, persen: '14,79%', persenVal: 14.79 },
    { topik: 'Cek Tagihan/Pembayaran', jumlah: 70187, persen: '8,24%', persenVal: 8.24 },
    { topik: 'Status Kepesertaan', jumlah: 62972, persen: '7,40%', persenVal: 7.40 },
    { topik: 'Tata Cara Pembayaran Iuran', jumlah: 62380, persen: '7,33%', persenVal: 7.33 }
  ],
  pengaduan: [
    { topik: 'Aplikasi Mobile JKN sulit diakses (registrasi)', jumlah: 2270, persen: '28,69%', persenVal: 28.69 },
    { topik: 'Gangguan antrean melalui aplikasi mobile JKN', jumlah: 1052, persen: '13,30%', persenVal: 13.30 },
    { topik: 'Data pembayaran iuran belum masuk FTP', jumlah: 822, persen: '10,39%', persenVal: 10.39 },
    { topik: 'Non-aktif karena Iuran dengan status pembayaran lunas', jumlah: 691, persen: '8,73%', persenVal: 8.73 },
    { topik: 'Aplikasi Mobile JKN tidak dapat diakses (pemanfaatan fitur)', jumlah: 357, persen: '4,51%', persenVal: 4.51 }
  ],
  permintaan: [
    { topik: 'Perubahan Identitas (No Hp)', jumlah: 32716, persen: '27,99%', persenVal: 27.99 },
    { topik: 'Perubahan Segmen', jumlah: 22827, persen: '19,53%', persenVal: 19.53 },
    { topik: 'Penambahan Anggota Keluarga', jumlah: 14754, persen: '12,62%', persenVal: 12.62 },
    { topik: 'Perubahan Identitas (Email)', jumlah: 9434, persen: '8,07%', persenVal: 8.07 },
    { topik: 'Perubahan Nama Bayi', jumlah: 8672, persen: '7,42%', persenVal: 7.42 }
  ],
  totals: {
    informasi: 851408,
    permintaan: 116901,
    pengaduan: 7911,
    total: 976220
  }
};

// Fetch main voice calls dataset (Monthly)
export async function fetchSheetData(): Promise<DataRow[]> {
  const res = await fetch(CSV_URL_MAIN);
  if (!res.ok) throw new Error("Gagal mengambil data bulanan dari Google Sheets");
  
  const csvText = await res.text();
  
  return new Promise((resolve, reject) => {
    Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const dataRows: DataRow[] = results.data.map((row: any, index: number) => {
          return {
            rowNumber: index + 2,
            bulan: row['Bulan'] || '',
            panggilanMasuk: parseInt(row['Panggilan Masuk']?.replace(/,/g, '') || '0', 10),
            panggilanDijawab: parseInt(row['Panggilan Dijawab Petugas']?.replace(/,/g, '') || '0', 10),
            persenDijawab: row['% Panggilan Dijawab Petugas'] || '',
            rataWaktu: row['Rata - Rata Waktu Layanan'] || '',
            dijawabKurang20: row['Panggilan Dijawab \n< 20 Detik'] || row['Panggilan Dijawab < 20 Detik'] || '',
            informasi: parseInt(row['Informasi']?.replace(/,/g, '') || '0', 10),
            permintaan: parseInt(row['Permintaan']?.replace(/,/g, '') || '0', 10),
            pengaduan: parseInt(row['Pengaduan']?.replace(/,/g, '') || '0', 10),
            total: parseInt(row['Total']?.replace(/,/g, '') || '0', 10),
            tuntas: parseInt(row['Tuntas pada Layanan CC 165']?.replace(/,/g, '') || '0', 10),
            persenTuntas: row['% Tuntas pada Layanan CC 165'] || '',
            disposisi: parseInt(row['Disposisi Kantor Cabang']?.replace(/,/g, '') || '0', 10),
            persenDisposisi: row['% Disposisi'] || '',
          };
        });
        resolve(dataRows);
      },
      error: (error: any) => {
        reject(error);
      }
    });
  });
}

// Fetch Category Breakdown Dataset (Informasi, Pengaduan, Permintaan)
export async function fetchCategoryBreakdown(): Promise<CategoryBreakdownData> {
  try {
    const res = await fetch(CSV_URL_CATEGORY);
    if (!res.ok) return DEFAULT_CATEGORY_DATA;
    
    const csvText = await res.text();
    const parsed = Papa.parse<string[]>(csvText, { skipEmptyLines: true });
    
    let currentCategory: 'informasi' | 'pengaduan' | 'permintaan' | '' = '';
    const totals = {
      informasi: 851408,
      permintaan: 116901,
      pengaduan: 7911,
      total: 976220
    };

    const result: CategoryBreakdownData = {
      informasi: [],
      pengaduan: [],
      permintaan: [],
      totals
    };
    
    for (const row of parsed.data) {
      if (!row || row.length < 2) continue;
      const col0 = (row[0] || '').trim();
      const col1 = (row[1] || '').trim();
      const col2 = (row[2] || '').trim();
      
      if (!col0 && !col1) continue;
      
      const lowerCol0 = col0.toLowerCase();
      const lowerCol1 = col1.toLowerCase();
      
      if (lowerCol0 === 'informasi' && (lowerCol1 === 'jumlah' || lowerCol1 === '%')) {
        currentCategory = 'informasi';
        continue;
      }
      if (lowerCol0 === 'pengaduan' && (lowerCol1 === 'jumlah' || lowerCol1 === '%')) {
        currentCategory = 'pengaduan';
        continue;
      }
      if (lowerCol0 === 'permintaan' && (lowerCol1 === 'jumlah' || lowerCol1 === '%')) {
        currentCategory = 'permintaan';
        continue;
      }
      
      // Check for summary/total rows (e.g. "Jumlah, 851408")
      if (lowerCol0 === 'jumlah' || lowerCol0 === 'total') {
        const val = parseInt(col1.replace(/,/g, '') || '0', 10);
        if (currentCategory && val > 0) {
          totals[currentCategory] = val;
        }
        continue;
      }

      if (currentCategory && col0) {
        const jumlah = parseInt(col1.replace(/,/g, '') || '0', 10);
        const persenVal = parseFloat(col2.replace('%', '').replace(',', '.')) || 0;
        result[currentCategory].push({
          topik: col0,
          jumlah,
          persen: col2 || `${persenVal}%`,
          persenVal
        });
      }
    }
    
    totals.total = totals.informasi + totals.permintaan + totals.pengaduan;
    result.totals = totals;
    
    if (result.informasi.length === 0 && result.pengaduan.length === 0 && result.permintaan.length === 0) {
      return DEFAULT_CATEGORY_DATA;
    }
    
    return result;
  } catch (error) {
    console.warn("Could not fetch category breakdown from Google Sheets, using fallback:", error);
    return DEFAULT_CATEGORY_DATA;
  }
}

// Write operations are disabled because login is removed
export async function addRow(row: Omit<DataRow, 'rowNumber'>): Promise<void> {
  throw new Error("Otorisasi Login dinonaktifkan. Anda dalam mode Read-Only.");
}

export async function updateRow(rowNumber: number, row: Omit<DataRow, 'rowNumber'>): Promise<void> {
  throw new Error("Otorisasi Login dinonaktifkan. Anda dalam mode Read-Only.");
}

export async function deleteRow(rowNumber: number): Promise<void> {
  throw new Error("Otorisasi Login dinonaktifkan. Anda dalam mode Read-Only.");
}
