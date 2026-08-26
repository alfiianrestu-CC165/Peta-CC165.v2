import Papa from 'papaparse';
import { 
  DataRow, 
  CategoryBreakdownData, 
  RegionalData, 
  BranchOfficeData, 
  RegionalSummaryItem,
  ParticipantSegmentData,
  SegmentItem,
  MonthlySegmentSummary,
  RegionalSegmentItem
} from '../types';

export const SHEET_ID = '1MjFAlH-fl2Y5acLWgNqQcX6E7nYfEol2gi6bHHfvH0U';
const CSV_URL_MAIN = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=0`;
const CSV_URL_CATEGORY = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=801320162`;
export const CSV_URL_REGIONAL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=1804505187`;
export const CSV_URL_SEGMENT = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=695192154`;

// Metadata definitions for 7 segments
export const SEGMENT_METADATA: Record<string, { fullName: string; description: string; color: string }> = {
  'PBPU': {
    fullName: 'Pekerja Bukan Penerima Upah (Mandiri)',
    description: 'Peserta yang membayar iuran secara mandiri setiap bulan.',
    color: '#2563eb' // Blue
  },
  'PPU': {
    fullName: 'Pekerja Penerima Upah (Swasta/BUMN)',
    description: 'Pekerja di sektor swasta, BUMN, dan BUMD yang iurannya dibayarkan oleh pemberi kerja & pekerja.',
    color: '#0d9488' // Teal
  },
  'PBI APBN': {
    fullName: 'Penerima Bantuan Iuran (PBI) APBN',
    description: 'Fakir miskin dan orang tidak mampu yang iurannya dibiayai oleh Pemerintah Pusat melalui APBN.',
    color: '#16a34a' // Green
  },
  'PBI APBD': {
    fullName: 'Penerima Bantuan Iuran (PBI) APBD',
    description: 'Penduduk yang didaftarkan dan diintegrasikan oleh Pemerintah Daerah melalui APBD.',
    color: '#ca8a04' // Amber/Yellow
  },
  'PPU PN': {
    fullName: 'PPU Penyelenggara Negara (ASN / TNI / POLRI)',
    description: 'Pegawai Negeri Sipil, Anggota TNI, Anggota Polri, Pejabat Negara, dan Pegawai Pemerintah non PNS.',
    color: '#7c3aed' // Purple
  },
  'BP': {
    fullName: 'Bukan Pekerja (Investor / Pensiunan / Veteran)',
    description: 'Penerima pensiun, veteran, perintis kemerdekaan, janda/duda/yatim dari veteran, investor, dan bukan pekerja lainnya.',
    color: '#ea580c' // Orange
  },
  'Belum Terdaftar': {
    fullName: 'Calon Peserta / Belum Terdaftar',
    description: 'Masyarakat umum yang menghubungi CC 165 untuk pendaftaran baru atau konsultasi kepesertaan.',
    color: '#64748b' // Slate
  }
};

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

// Fetch Regional Breakdown Dataset (Pemanfaatan per Kedeputian Wilayah & Kantor Cabang)
export async function fetchRegionalData(): Promise<RegionalData> {
  const emptyResult: RegionalData = {
    regions: [],
    branches: [],
    provinces: [],
    totals: { januari: 0, februari: 0, maret: 0, april: 0, mei: 0, juni: 0, juli: 0, total: 0 }
  };

  try {
    const res = await fetch(CSV_URL_REGIONAL);
    if (!res.ok) throw new Error("Gagal mengambil data wilayah dari Google Sheets");
    
    const csvText = await res.text();
    const parsed = Papa.parse<string[]>(csvText, { skipEmptyLines: true });
    
    const branches: BranchOfficeData[] = [];
    const regionMap = new Map<string, RegionalSummaryItem>();
    const provinceMap = new Map<string, number>();
    const totals = { januari: 0, februari: 0, maret: 0, april: 0, mei: 0, juni: 0, juli: 0, total: 0 };
    
    // Rows usually start with Header at row 0 and row 1, data starts row 2
    for (let i = 0; i < parsed.data.length; i++) {
      const row = parsed.data[i];
      if (!row || row.length < 4) continue;
      
      const kc = (row[0] || '').trim();
      const kw = (row[1] || '').trim();
      const prov = (row[2] || '').trim();
      
      // Skip header rows
      if (!kw || !kw.toLowerCase().includes('kedeputian wilayah') || !kc || kc.toLowerCase() === 'kantor cabang') {
        continue;
      }
      
      const jan = parseInt((row[3] || '0').replace(/,/g, ''), 10) || 0;
      const feb = parseInt((row[4] || '0').replace(/,/g, ''), 10) || 0;
      const mar = parseInt((row[5] || '0').replace(/,/g, ''), 10) || 0;
      const apr = parseInt((row[6] || '0').replace(/,/g, ''), 10) || 0;
      const may = parseInt((row[7] || '0').replace(/,/g, ''), 10) || 0;
      const jun = parseInt((row[8] || '0').replace(/,/g, ''), 10) || 0;
      const jul = parseInt((row[9] || '0').replace(/,/g, ''), 10) || 0;
      const branchTotal = jan + feb + mar + apr + may + jun + jul;
      
      const branchObj: BranchOfficeData = {
        kantorCabang: kc,
        kedeputianWilayah: kw,
        provinsi: prov,
        januari: jan,
        februari: feb,
        maret: mar,
        april: apr,
        mei: may,
        juni: jun,
        juli: jul,
        total: branchTotal
      };
      
      branches.push(branchObj);
      
      totals.januari += jan;
      totals.februari += feb;
      totals.maret += mar;
      totals.april += apr;
      totals.mei += may;
      totals.juni += jun;
      totals.juli += jul;
      totals.total += branchTotal;
      
      if (!regionMap.has(kw)) {
        const romanId = kw.replace(/kedeputian wilayah/i, '').trim();
        regionMap.set(kw, {
          kedeputianWilayah: kw,
          romanId,
          provinces: [],
          branchCount: 0,
          januari: 0,
          februari: 0,
          maret: 0,
          april: 0,
          mei: 0,
          juni: 0,
          juli: 0,
          total: 0,
          percentage: 0,
          branches: []
        });
      }
      
      const reg = regionMap.get(kw)!;
      reg.branches.push(branchObj);
      reg.branchCount += 1;
      if (prov && !reg.provinces.includes(prov)) {
        reg.provinces.push(prov);
      }
      reg.januari += jan;
      reg.februari += feb;
      reg.maret += mar;
      reg.april += apr;
      reg.mei += may;
      reg.juni += jun;
      reg.juli += jul;
      reg.total += branchTotal;
      
      if (prov) {
        provinceMap.set(prov, (provinceMap.get(prov) || 0) + branchTotal);
      }
    }
    
    const regions = Array.from(regionMap.values()).map(r => ({
      ...r,
      percentage: totals.total > 0 ? (r.total / totals.total) * 100 : 0
    }));
    
    const provinces = Array.from(provinceMap.entries())
      .map(([name, total]) => ({
        name,
        total,
        region: branches.find(b => b.provinsi === name)?.kedeputianWilayah || ""
      }))
      .sort((a, b) => b.total - a.total);
      
    return {
      regions,
      branches,
      provinces,
      totals
    };
  } catch (error) {
    console.warn("Could not fetch regional data from Google Sheets:", error);
    return emptyResult;
  }
}

export const ROMAN_NUMERALS: Record<string, number> = {
  'I': 1,
  'II': 2,
  'III': 3,
  'IV': 4,
  'V': 5,
  'VI': 6,
  'VII': 7,
  'VIII': 8,
  'IX': 9,
  'X': 10,
  'XI': 11,
  'XII': 12,
};

export function getKedeputianWilayahIndex(name: string): number {
  if (!name) return 999;
  const match = name.toUpperCase().match(/\b(XII|XI|X|IX|VIII|VII|VI|V|IV|III|II|I)\b/);
  if (match && ROMAN_NUMERALS[match[1]]) {
    return ROMAN_NUMERALS[match[1]];
  }
  return 999;
}

// Fetch Participant Segment Dataset (Data Pemanfaatan Per Segmen - GID: 695192154)
export async function fetchParticipantSegmentData(): Promise<ParticipantSegmentData> {
  const segmentKeys = ['PBI APBN', 'PBI APBD', 'PBPU', 'PPU PN', 'PPU', 'BP', 'Belum Terdaftar'];
  const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli'];

  try {
    const res = await fetch(CSV_URL_SEGMENT);
    if (!res.ok) throw new Error("Gagal mengambil data segmen peserta dari Google Sheets");
    
    const csvText = await res.text();
    const parsed = Papa.parse<string[]>(csvText, { skipEmptyLines: true });
    
    const segmentMonthlyTotals: Record<string, { januari: number; februari: number; maret: number; april: number; mei: number; juni: number; juli: number }> = {};
    segmentKeys.forEach(k => {
      segmentMonthlyTotals[k] = { januari: 0, februari: 0, maret: 0, april: 0, mei: 0, juni: 0, juli: 0 };
    });

    const monthlySummaries: MonthlySegmentSummary[] = months.map(m => ({
      bulan: m,
      'PBI APBN': 0,
      'PBI APBD': 0,
      'PBPU': 0,
      'PPU PN': 0,
      'PPU': 0,
      'BP': 0,
      'Belum Terdaftar': 0,
      total: 0
    }));

    const regionalSegments: RegionalSegmentItem[] = [];
    let grandTotal = 0;

    // Find TOTAL row or calculate from Regional rows
    for (const row of parsed.data) {
      if (!row || row.length < 20) continue;
      const col0 = (row[0] || '').trim();

      // Regional rows (Only Kedeputian Wilayah I s.d. XII, ignore generic header "KEDEPUTIAN WILAYAH")
      const romanIndex = getKedeputianWilayahIndex(col0);
      if (col0.startsWith('KEDEPUTIAN WILAYAH') && !col0.includes('JANUARI') && romanIndex >= 1 && romanIndex <= 12) {
        const romanId = col0.replace(/KEDEPUTIAN WILAYAH/i, '').trim();
        const regItem: RegionalSegmentItem = {
          kedeputianWilayah: col0,
          romanId: romanId || `Wilayah ${romanIndex}`,
          'PBI APBN': 0,
          'PBI APBD': 0,
          'PBPU': 0,
          'PPU PN': 0,
          'PPU': 0,
          'BP': 0,
          'Belum Terdaftar': 0,
          total: 0,
          percentage: 0
        };

        for (let m = 0; m < 7; m++) {
          const startCol = 1 + m * 8;
          for (let s = 0; s < 7; s++) {
            const segName = segmentKeys[s];
            const val = parseInt((row[startCol + s] || '0').replace(/,/g, ''), 10) || 0;
            (regItem as any)[segName] += val;
            regItem.total += val;
          }
        }
        regionalSegments.push(regItem);
      }

      // Total row
      if (col0 === 'TOTAL') {
        for (let m = 0; m < 7; m++) {
          const startCol = 1 + m * 8;
          const monthKey = months[m].toLowerCase() as 'januari' | 'februari' | 'maret' | 'april' | 'mei' | 'juni' | 'juli';
          let mTotal = 0;
          
          for (let s = 0; s < 7; s++) {
            const segName = segmentKeys[s];
            const val = parseInt((row[startCol + s] || '0').replace(/,/g, ''), 10) || 0;
            segmentMonthlyTotals[segName][monthKey] = val;
            (monthlySummaries[m] as any)[segName] = val;
            mTotal += val;
          }
          monthlySummaries[m].total = mTotal;
          grandTotal += mTotal;
        }
      }
    }

    // If grandTotal not computed from TOTAL row, compute from regional
    if (grandTotal === 0 && regionalSegments.length > 0) {
      grandTotal = regionalSegments.reduce((sum, r) => sum + r.total, 0);
    }

    // Sort regional segments sequentially from Kedeputian Wilayah I to XII
    regionalSegments.sort((a, b) => getKedeputianWilayahIndex(a.kedeputianWilayah) - getKedeputianWilayahIndex(b.kedeputianWilayah));

    // Calculate regional percentages
    regionalSegments.forEach(r => {
      r.percentage = grandTotal > 0 ? (r.total / grandTotal) * 100 : 0;
    });

    // Build segments list
    const segments: SegmentItem[] = segmentKeys.map(key => {
      const meta = SEGMENT_METADATA[key] || {
        fullName: key,
        description: '',
        color: '#3b82f6'
      };
      const monthly = segmentMonthlyTotals[key];
      const total = monthly.januari + monthly.februari + monthly.maret + monthly.april + monthly.mei + monthly.juni + monthly.juli;
      const percentage = grandTotal > 0 ? (total / grandTotal) * 100 : 0;

      return {
        segmentName: key,
        fullName: meta.fullName,
        description: meta.description,
        color: meta.color,
        total,
        percentage,
        monthly
      };
    }).sort((a, b) => b.total - a.total);

    return {
      segments,
      monthlyData: monthlySummaries,
      regionalSegments,
      grandTotal
    };
  } catch (error) {
    console.warn("Could not fetch participant segment data from Google Sheets:", error);
    // Return standard fallback based on actual sheet data
    return {
      segments: [
        {
          segmentName: 'PBPU',
          fullName: SEGMENT_METADATA['PBPU'].fullName,
          description: SEGMENT_METADATA['PBPU'].description,
          color: SEGMENT_METADATA['PBPU'].color,
          total: 316929,
          percentage: 36.52,
          monthly: { januari: 58915, februari: 55600, maret: 40684, april: 42624, mei: 39005, juni: 40449, juli: 39652 }
        },
        {
          segmentName: 'PPU',
          fullName: SEGMENT_METADATA['PPU'].fullName,
          description: SEGMENT_METADATA['PPU'].description,
          color: SEGMENT_METADATA['PPU'].color,
          total: 219153,
          percentage: 25.25,
          monthly: { januari: 40034, februari: 33644, maret: 28158, april: 30428, mei: 29379, juni: 30225, juli: 27285 }
        },
        {
          segmentName: 'PBI APBN',
          fullName: SEGMENT_METADATA['PBI APBN'].fullName,
          description: SEGMENT_METADATA['PBI APBN'].description,
          color: SEGMENT_METADATA['PBI APBN'].color,
          total: 147854,
          percentage: 17.04,
          monthly: { januari: 22407, februari: 37876, maret: 17278, april: 19160, mei: 19078, juni: 17886, juli: 14169 }
        },
        {
          segmentName: 'PBI APBD',
          fullName: SEGMENT_METADATA['PBI APBD'].fullName,
          description: SEGMENT_METADATA['PBI APBD'].description,
          color: SEGMENT_METADATA['PBI APBD'].color,
          total: 99161,
          percentage: 11.43,
          monthly: { januari: 20432, februari: 16524, maret: 11599, april: 13877, mei: 12988, juni: 11526, juli: 12215 }
        },
        {
          segmentName: 'PPU PN',
          fullName: SEGMENT_METADATA['PPU PN'].fullName,
          description: SEGMENT_METADATA['PPU PN'].description,
          color: SEGMENT_METADATA['PPU PN'].color,
          total: 59294,
          percentage: 6.83,
          monthly: { januari: 13906, februari: 11048, maret: 6699, april: 7716, mei: 6938, juni: 6812, juli: 6175 }
        },
        {
          segmentName: 'BP',
          fullName: SEGMENT_METADATA['BP'].fullName,
          description: SEGMENT_METADATA['BP'].description,
          color: SEGMENT_METADATA['BP'].color,
          total: 14834,
          percentage: 1.71,
          monthly: { januari: 2163, februari: 1748, maret: 1909, april: 2267, mei: 2177, juni: 2494, juli: 2076 }
        },
        {
          segmentName: 'Belum Terdaftar',
          fullName: SEGMENT_METADATA['Belum Terdaftar'].fullName,
          description: SEGMENT_METADATA['Belum Terdaftar'].description,
          color: SEGMENT_METADATA['Belum Terdaftar'].color,
          total: 10607,
          percentage: 1.22,
          monthly: { januari: 2392, februari: 1985, maret: 1199, april: 1426, mei: 1470, juni: 716, juli: 1419 }
        }
      ],
      monthlyData: [],
      regionalSegments: [],
      grandTotal: 867832
    };
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
