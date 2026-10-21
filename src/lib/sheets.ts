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
  RegionalSegmentItem,
  SatisfactionSurveyRow,
  SatisfactionSurveyData,
  MonthlySocialMediaRow,
  SocialMediaChannelSummary,
  SocialMediaData,
  SocialMediaTopicItem,
  SocialMediaTopicsData
} from '../types';

export const SHEET_ID = '1MjFAlH-fl2Y5acLWgNqQcX6E7nYfEol2gi6bHHfvH0U';
const CSV_URL_MAIN = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=0`;
const CSV_URL_CATEGORY = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=801320162`;
export const CSV_URL_REGIONAL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=1804505187`;
export const CSV_URL_SEGMENT = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=695192154`;
export const CSV_URL_SURVEY = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=survei%20kepuasan&range=A1:K12&headers=0`;
export const GVIZ_URL_SOCIAL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=Data%20Pemanfaatan%20Media%20Sosial`;
export const GVIZ_URL_SOCIAL_TOPICS = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=Topik%20medsos`;

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
    { topik: 'Perbaikan data identitas peserta (NIK, nama, tanggal lahir, jenis kelamin dan alamat)', jumlah: 193213, persen: '18,40%', persenVal: 18.40 },
    { topik: 'Prosedur Perubahan Segmen Kepesertaan', jumlah: 152149, persen: '14,49%', persenVal: 14.49 },
    { topik: 'Cek Tagihan/Pembayaran', jumlah: 86764, persen: '8,26%', persenVal: 8.26 },
    { topik: 'Kanal Layanan', jumlah: 78984, persen: '7,52%', persenVal: 7.52 },
    { topik: 'Tata Cara Pembayaran Iuran', jumlah: 76925, persen: '7,33%', persenVal: 7.33 }
  ],
  pengaduan: [
    { topik: 'Aplikasi Mobile JKN sulit diakses (registrasi)', jumlah: 3206, persen: '28,68%', persenVal: 28.68 },
    { topik: 'Gangguan antrean melalui aplikasi mobile JKN', jumlah: 1772, persen: '15,85%', persenVal: 15.85 },
    { topik: 'Data pembayaran iuran belum masuk FTP', jumlah: 880, persen: '7,87%', persenVal: 7.87 },
    { topik: 'Non-aktif karena Iuran dengan status pembayaran lunas', jumlah: 804, persen: '7,19%', persenVal: 7.19 },
    { topik: 'Kendala Aplikasi E Dabu', jumlah: 585, persen: '5,23%', persenVal: 5.23 }
  ],
  permintaan: [
    { topik: 'Perubahan Identitas (No Hp)', jumlah: 39800, persen: '27,86%', persenVal: 27.86 },
    { topik: 'Perubahan Segmen', jumlah: 27600, persen: '19,32%', persenVal: 19.32 },
    { topik: 'Penambahan Anggota Keluarga', jumlah: 17622, persen: '12,34%', persenVal: 12.34 },
    { topik: 'Perubahan Identitas (Email)', jumlah: 11451, persen: '8,02%', persenVal: 8.02 },
    { topik: 'Perubahan Nama Bayi', jumlah: 10255, persen: '7,18%', persenVal: 7.18 }
  ],
  totals: {
    informasi: 1049892,
    permintaan: 142859,
    pengaduan: 11177,
    total: 1203928
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
            disposisi: parseInt((row['Tidak Tuntas pada Layanan CC 165'] || row['Disposisi Kantor Cabang'] || '0').replace(/,/g, ''), 10),
            persenDisposisi: row['% Tidak Tuntas pada Layanan CC 165'] || row['% Disposisi'] || '',
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
      informasi: 1049892,
      permintaan: 142859,
      pengaduan: 11177,
      total: 1203928
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
      
      // Capture summary/total row inside category table to keep category totals synced with sheet
      if (lowerCol0 === 'jumlah' || lowerCol0 === 'total') {
        if (currentCategory && col1) {
          const parsedCatTotal = parseInt(col1.replace(/,/g, '') || '0', 10);
          if (parsedCatTotal > 0) {
            totals[currentCategory] = parsedCatTotal;
          }
        }
        continue;
      }

      if (currentCategory && col0) {
        const jumlah = parseInt(col1.replace(/,/g, '') || '0', 10);
        const rawPct = parseFloat(col2.replace('%', '').replace(',', '.'));
        const catTotal = totals[currentCategory] || 1;
        const calcPersenVal = !isNaN(rawPct) && rawPct > 0
          ? Number(rawPct.toFixed(2))
          : Number(((jumlah / catTotal) * 100).toFixed(2));
        const persenFormatted = calcPersenVal.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '%';
        result[currentCategory].push({
          topik: col0,
          jumlah,
          persen: persenFormatted,
          persenVal: calcPersenVal
        });
      }
    }
    
    // Recalculate percentages if needed based on final category totals
    (['informasi', 'pengaduan', 'permintaan'] as const).forEach((catKey) => {
      const catTotal = totals[catKey] || 1;
      result[catKey] = result[catKey].map((item) => {
        const calcPersenVal = item.persenVal > 0
          ? item.persenVal
          : Number(((item.jumlah / catTotal) * 100).toFixed(2));
        const persenFormatted = calcPersenVal.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '%';
        return {
          ...item,
          persen: persenFormatted,
          persenVal: calcPersenVal
        };
      });
    });

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
    totals: { januari: 0, februari: 0, maret: 0, april: 0, mei: 0, juni: 0, juli: 0, agustus: 0, september: 0, total: 0 }
  };

  try {
    const res = await fetch(CSV_URL_REGIONAL);
    if (!res.ok) throw new Error("Gagal mengambil data wilayah dari Google Sheets");
    
    const csvText = await res.text();
    const parsed = Papa.parse<string[]>(csvText, { skipEmptyLines: true });
    
    const branches: BranchOfficeData[] = [];
    const regionMap = new Map<string, RegionalSummaryItem>();
    const provinceMap = new Map<string, number>();
    const totals = { januari: 0, februari: 0, maret: 0, april: 0, mei: 0, juni: 0, juli: 0, agustus: 0, september: 0, total: 0 };
    
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
      const aug = parseInt((row[10] || '0').replace(/,/g, ''), 10) || 0;
      const sep = parseInt((row[11] || '0').replace(/,/g, ''), 10) || 0;
      const branchTotal = jan + feb + mar + apr + may + jun + jul + aug + sep;
      
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
        agustus: aug,
        september: sep,
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
      totals.agustus += aug;
      totals.september += sep;
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
          agustus: 0,
          september: 0,
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
      reg.agustus += aug;
      reg.september += sep;
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
  const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September'];

  try {
    const res = await fetch(CSV_URL_SEGMENT);
    if (!res.ok) throw new Error("Gagal mengambil data segmen peserta dari Google Sheets");
    
    const csvText = await res.text();
    const parsed = Papa.parse<string[]>(csvText, { skipEmptyLines: true });
    
    const segmentMonthlyTotals: Record<string, { januari: number; februari: number; maret: number; april: number; mei: number; juni: number; juli: number; agustus: number; september: number }> = {};
    segmentKeys.forEach(k => {
      segmentMonthlyTotals[k] = { januari: 0, februari: 0, maret: 0, april: 0, mei: 0, juni: 0, juli: 0, agustus: 0, september: 0 };
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

        for (let m = 0; m < 9; m++) {
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
        for (let m = 0; m < 9; m++) {
          const startCol = 1 + m * 8;
          const monthKey = months[m].toLowerCase() as 'januari' | 'februari' | 'maret' | 'april' | 'mei' | 'juni' | 'juli' | 'agustus' | 'september';
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
      const total = monthly.januari + monthly.februari + monthly.maret + monthly.april + monthly.mei + monthly.juni + monthly.juli + monthly.agustus + monthly.september;
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
    // Return standard fallback based on actual sheet data up to September 2026
    return {
      segments: [
        {
          segmentName: 'PBPU',
          fullName: SEGMENT_METADATA['PBPU'].fullName,
          description: SEGMENT_METADATA['PBPU'].description,
          color: SEGMENT_METADATA['PBPU'].color,
          total: 391275,
          percentage: 36.72,
          monthly: { januari: 58915, februari: 55600, maret: 40684, april: 42624, mei: 39005, juni: 40449, juli: 39652, agustus: 36308, september: 38038 }
        },
        {
          segmentName: 'PPU',
          fullName: SEGMENT_METADATA['PPU'].fullName,
          description: SEGMENT_METADATA['PPU'].description,
          color: SEGMENT_METADATA['PPU'].color,
          total: 274019,
          percentage: 25.72,
          monthly: { januari: 40034, februari: 33644, maret: 28158, april: 30428, mei: 29379, juni: 30225, juli: 27285, agustus: 26933, september: 27933 }
        },
        {
          segmentName: 'PBI APBN',
          fullName: SEGMENT_METADATA['PBI APBN'].fullName,
          description: SEGMENT_METADATA['PBI APBN'].description,
          color: SEGMENT_METADATA['PBI APBN'].color,
          total: 174940,
          percentage: 16.42,
          monthly: { januari: 22407, februari: 37876, maret: 17278, april: 19160, mei: 19078, juni: 17886, juli: 14169, agustus: 13377, september: 13709 }
        },
        {
          segmentName: 'PBI APBD',
          fullName: SEGMENT_METADATA['PBI APBD'].fullName,
          description: SEGMENT_METADATA['PBI APBD'].description,
          color: SEGMENT_METADATA['PBI APBD'].color,
          total: 122604,
          percentage: 11.51,
          monthly: { januari: 20432, februari: 16524, maret: 11599, april: 13877, mei: 12988, juni: 11526, juli: 12215, agustus: 11493, september: 11950 }
        },
        {
          segmentName: 'PPU PN',
          fullName: SEGMENT_METADATA['PPU PN'].fullName,
          description: SEGMENT_METADATA['PPU PN'].description,
          color: SEGMENT_METADATA['PPU PN'].color,
          total: 70506,
          percentage: 6.62,
          monthly: { januari: 13906, februari: 11048, maret: 6699, april: 7716, mei: 6938, juni: 6812, juli: 6175, agustus: 5671, september: 5541 }
        },
        {
          segmentName: 'BP',
          fullName: SEGMENT_METADATA['BP'].fullName,
          description: SEGMENT_METADATA['BP'].description,
          color: SEGMENT_METADATA['BP'].color,
          total: 19174,
          percentage: 1.80,
          monthly: { januari: 2163, februari: 1748, maret: 1909, april: 2267, mei: 2177, juni: 2494, juli: 2076, agustus: 2125, september: 2215 }
        },
        {
          segmentName: 'Belum Terdaftar',
          fullName: SEGMENT_METADATA['Belum Terdaftar'].fullName,
          description: SEGMENT_METADATA['Belum Terdaftar'].description,
          color: SEGMENT_METADATA['Belum Terdaftar'].color,
          total: 12942,
          percentage: 1.21,
          monthly: { januari: 2392, februari: 1985, maret: 1199, april: 1426, mei: 1470, juni: 716, juli: 1419, agustus: 1200, september: 1135 }
        }
      ],
      monthlyData: [
        { bulan: 'Januari', 'PBI APBN': 22407, 'PBI APBD': 20432, 'PBPU': 58915, 'PPU PN': 13906, 'PPU': 40034, 'BP': 2163, 'Belum Terdaftar': 2392, total: 160249 },
        { bulan: 'Februari', 'PBI APBN': 37876, 'PBI APBD': 16524, 'PBPU': 55600, 'PPU PN': 11048, 'PPU': 33644, 'BP': 1748, 'Belum Terdaftar': 1985, total: 158425 },
        { bulan: 'Maret', 'PBI APBN': 17278, 'PBI APBD': 11599, 'PBPU': 40684, 'PPU PN': 6699, 'PPU': 28158, 'BP': 1909, 'Belum Terdaftar': 1199, total: 107526 },
        { bulan: 'April', 'PBI APBN': 19160, 'PBI APBD': 13877, 'PBPU': 42624, 'PPU PN': 7716, 'PPU': 30428, 'BP': 2267, 'Belum Terdaftar': 1426, total: 117498 },
        { bulan: 'Mei', 'PBI APBN': 19078, 'PBI APBD': 12988, 'PBPU': 39005, 'PPU PN': 6938, 'PPU': 29379, 'BP': 2177, 'Belum Terdaftar': 1470, total: 111035 },
        { bulan: 'Juni', 'PBI APBN': 17886, 'PBI APBD': 11526, 'PBPU': 40449, 'PPU PN': 6812, 'PPU': 30225, 'BP': 2494, 'Belum Terdaftar': 716, total: 110108 },
        { bulan: 'Juli', 'PBI APBN': 14169, 'PBI APBD': 12215, 'PBPU': 39652, 'PPU PN': 6175, 'PPU': 27285, 'BP': 2076, 'Belum Terdaftar': 1419, total: 102991 },
        { bulan: 'Agustus', 'PBI APBN': 13377, 'PBI APBD': 11493, 'PBPU': 36308, 'PPU PN': 5671, 'PPU': 26933, 'BP': 2125, 'Belum Terdaftar': 1200, total: 97107 },
        { bulan: 'September', 'PBI APBN': 13709, 'PBI APBD': 11950, 'PBPU': 38038, 'PPU PN': 5541, 'PPU': 27933, 'BP': 2215, 'Belum Terdaftar': 1135, total: 100521 }
      ],
      regionalSegments: [
        { kedeputianWilayah: 'KEDEPUTIAN WILAYAH I', romanId: 'I', 'PBI APBN': 6080, 'PBI APBD': 5297, 'PBPU': 13386, 'PPU PN': 4137, 'PPU': 7861, 'BP': 948, 'Belum Terdaftar': 1124, total: 38833, percentage: 3.64 },
        { kedeputianWilayah: 'KEDEPUTIAN WILAYAH II', romanId: 'II', 'PBI APBN': 8401, 'PBI APBD': 6122, 'PBPU': 19367, 'PPU PN': 4237, 'PPU': 12618, 'BP': 841, 'Belum Terdaftar': 886, total: 52472, percentage: 4.92 },
        { kedeputianWilayah: 'KEDEPUTIAN WILAYAH III', romanId: 'III', 'PBI APBN': 14290, 'PBI APBD': 7584, 'PBPU': 18239, 'PPU PN': 5044, 'PPU': 9518, 'BP': 1097, 'Belum Terdaftar': 266, total: 56038, percentage: 5.26 },
        { kedeputianWilayah: 'KEDEPUTIAN WILAYAH IV', romanId: 'IV', 'PBI APBN': 29053, 'PBI APBD': 32345, 'PBPU': 82266, 'PPU PN': 12592, 'PPU': 75807, 'BP': 4088, 'Belum Terdaftar': 1816, total: 237967, percentage: 22.33 },
        { kedeputianWilayah: 'KEDEPUTIAN WILAYAH V', romanId: 'V', 'PBI APBN': 47459, 'PBI APBD': 31055, 'PBPU': 117284, 'PPU PN': 14499, 'PPU': 79681, 'BP': 4651, 'Belum Terdaftar': 902, total: 295531, percentage: 27.74 },
        { kedeputianWilayah: 'KEDEPUTIAN WILAYAH VI', romanId: 'VI', 'PBI APBN': 33244, 'PBI APBD': 14088, 'PBPU': 71499, 'PPU PN': 12427, 'PPU': 39242, 'BP': 3389, 'Belum Terdaftar': 7426, total: 181315, percentage: 17.02 },
        { kedeputianWilayah: 'KEDEPUTIAN WILAYAH VII', romanId: 'VII', 'PBI APBN': 22671, 'PBI APBD': 14774, 'PBPU': 38669, 'PPU PN': 6681, 'PPU': 25425, 'BP': 2213, 'Belum Terdaftar': 290, total: 110723, percentage: 10.39 },
        { kedeputianWilayah: 'KEDEPUTIAN WILAYAH VIII', romanId: 'VIII', 'PBI APBN': 4150, 'PBI APBD': 4197, 'PBPU': 7293, 'PPU PN': 2364, 'PPU': 7317, 'BP': 366, 'Belum Terdaftar': 47, total: 25734, percentage: 2.42 },
        { kedeputianWilayah: 'KEDEPUTIAN WILAYAH IX', romanId: 'IX', 'PBI APBN': 4203, 'PBI APBD': 3262, 'PBPU': 8448, 'PPU PN': 3325, 'PPU': 4869, 'BP': 768, 'Belum Terdaftar': 57, total: 24932, percentage: 2.34 },
        { kedeputianWilayah: 'KEDEPUTIAN WILAYAH X', romanId: 'X', 'PBI APBN': 1578, 'PBI APBD': 1258, 'PBPU': 4323, 'PPU PN': 2044, 'PPU': 3053, 'BP': 249, 'Belum Terdaftar': 20, total: 12525, percentage: 1.18 },
        { kedeputianWilayah: 'KEDEPUTIAN WILAYAH XI', romanId: 'XI', 'PBI APBN': 2937, 'PBI APBD': 2427, 'PBPU': 9413, 'PPU PN': 2324, 'PPU': 7812, 'BP': 474, 'Belum Terdaftar': 92, total: 25479, percentage: 2.39 },
        { kedeputianWilayah: 'KEDEPUTIAN WILAYAH XII', romanId: 'XII', 'PBI APBN': 874, 'PBI APBD': 195, 'PBPU': 1088, 'PPU PN': 832, 'PPU': 816, 'BP': 90, 'Belum Terdaftar': 16, total: 3911, percentage: 0.37 }
      ],
      grandTotal: 1065460
    };
  }
}

export const DEFAULT_SATISFACTION_SURVEY_DATA: SatisfactionSurveyData = {
  monthly: [
    {
      bulan: 'Januari 2026',
      kecepatanPuas: 7968,
      kecepatanTidakPuas: 466,
      persenKecepatan: '94,47%',
      persenKecepatanVal: 94.47,
      keramahanPuas: 7889,
      keramahanTidakPuas: 545,
      persenKeramahan: '93,54%',
      persenKeramahanVal: 93.54,
      kebutuhanPuas: 7359,
      kebutuhanTidakPuas: 1075,
      persenKebutuhan: '87,25%',
      persenKebutuhanVal: 87.25,
      totalSurvei: 8434,
    },
    {
      bulan: 'Februari 2026',
      kecepatanPuas: 8140,
      kecepatanTidakPuas: 557,
      persenKecepatan: '93,60%',
      persenKecepatanVal: 93.60,
      keramahanPuas: 7960,
      keramahanTidakPuas: 737,
      persenKeramahan: '91,53%',
      persenKeramahanVal: 91.53,
      kebutuhanPuas: 7504,
      kebutuhanTidakPuas: 1193,
      persenKebutuhan: '86,28%',
      persenKebutuhanVal: 86.28,
      totalSurvei: 8697,
    },
    {
      bulan: 'Maret 2026',
      kecepatanPuas: 5568,
      kecepatanTidakPuas: 320,
      persenKecepatan: '94,57%',
      persenKecepatanVal: 94.57,
      keramahanPuas: 5579,
      keramahanTidakPuas: 309,
      persenKeramahan: '94,75%',
      persenKeramahanVal: 94.75,
      kebutuhanPuas: 5248,
      kebutuhanTidakPuas: 640,
      persenKebutuhan: '89,13%',
      persenKebutuhanVal: 89.13,
      totalSurvei: 5888,
    },
    {
      bulan: 'April 2026',
      kecepatanPuas: 7085,
      kecepatanTidakPuas: 380,
      persenKecepatan: '94,91%',
      persenKecepatanVal: 94.91,
      keramahanPuas: 7046,
      keramahanTidakPuas: 419,
      persenKeramahan: '94,39%',
      persenKeramahanVal: 94.39,
      kebutuhanPuas: 6600,
      kebutuhanTidakPuas: 865,
      persenKebutuhan: '88,41%',
      persenKebutuhanVal: 88.41,
      totalSurvei: 7465,
    },
    {
      bulan: 'Mei 2026',
      kecepatanPuas: 6512,
      kecepatanTidakPuas: 399,
      persenKecepatan: '94,23%',
      persenKecepatanVal: 94.23,
      keramahanPuas: 6480,
      keramahanTidakPuas: 431,
      persenKeramahan: '93,76%',
      persenKeramahanVal: 93.76,
      kebutuhanPuas: 6007,
      kebutuhanTidakPuas: 904,
      persenKebutuhan: '86,92%',
      persenKebutuhanVal: 86.92,
      totalSurvei: 6911,
    },
    {
      bulan: 'Juni 2026',
      kecepatanPuas: 6418,
      kecepatanTidakPuas: 377,
      persenKecepatan: '94,45%',
      persenKecepatanVal: 94.45,
      keramahanPuas: 6377,
      keramahanTidakPuas: 418,
      persenKeramahan: '93,85%',
      persenKeramahanVal: 93.85,
      kebutuhanPuas: 5970,
      kebutuhanTidakPuas: 825,
      persenKebutuhan: '87,86%',
      persenKebutuhanVal: 87.86,
      totalSurvei: 6795,
    },
    {
      bulan: 'Juli 2026',
      kecepatanPuas: 6317,
      kecepatanTidakPuas: 357,
      persenKecepatan: '94,65%',
      persenKecepatanVal: 94.65,
      keramahanPuas: 6270,
      keramahanTidakPuas: 404,
      persenKeramahan: '93,95%',
      persenKeramahanVal: 93.95,
      kebutuhanPuas: 5857,
      kebutuhanTidakPuas: 817,
      persenKebutuhan: '87,76%',
      persenKebutuhanVal: 87.76,
      totalSurvei: 6674,
    },
    {
      bulan: 'Agustus 2026',
      kecepatanPuas: 6139,
      kecepatanTidakPuas: 359,
      persenKecepatan: '94,48%',
      persenKecepatanVal: 94.48,
      keramahanPuas: 6102,
      keramahanTidakPuas: 396,
      persenKeramahan: '93,91%',
      persenKeramahanVal: 93.91,
      kebutuhanPuas: 5726,
      kebutuhanTidakPuas: 772,
      persenKebutuhan: '88,12%',
      persenKebutuhanVal: 88.12,
      totalSurvei: 6498,
    },
    {
      bulan: 'September 2026',
      kecepatanPuas: 5921,
      kecepatanTidakPuas: 371,
      persenKecepatan: '94,10%',
      persenKecepatanVal: 94.10,
      keramahanPuas: 5905,
      keramahanTidakPuas: 387,
      persenKeramahan: '93,85%',
      persenKeramahanVal: 93.85,
      kebutuhanPuas: 5477,
      kebutuhanTidakPuas: 815,
      persenKebutuhan: '87,05%',
      persenKebutuhanVal: 87.05,
      totalSurvei: 6292,
    },
  ],
  summary: {
    bulan: 'Total/Rata-Rata',
    kecepatanPuas: 60068,
    kecepatanTidakPuas: 3586,
    persenKecepatan: '94,37%',
    persenKecepatanVal: 94.37,
    keramahanPuas: 59608,
    keramahanTidakPuas: 4046,
    persenKeramahan: '93,64%',
    persenKeramahanVal: 93.64,
    kebutuhanPuas: 55748,
    kebutuhanTidakPuas: 7906,
    persenKebutuhan: '87,58%',
    persenKebutuhanVal: 87.58,
    totalSurvei: 63654,
  }
};

export async function fetchSatisfactionSurveyData(): Promise<SatisfactionSurveyData> {
  try {
    const res = await fetch(CSV_URL_SURVEY);
    if (!res.ok) return DEFAULT_SATISFACTION_SURVEY_DATA;

    const csvText = await res.text();
    const parsed = Papa.parse<string[]>(csvText, { skipEmptyLines: true });

    const monthly: SatisfactionSurveyRow[] = [];
    let summary: SatisfactionSurveyRow | null = null;

    const parseNumber = (val: string) => parseInt((val || '0').replace(/[^0-9-]/g, ''), 10) || 0;
    const parsePct = (val: string, puas: number, total: number) => {
      const cleaned = (val || '').replace('%', '').replace(',', '.').trim();
      const num = parseFloat(cleaned);
      const finalVal = !isNaN(num) && num > 0 ? Number(num.toFixed(2)) : (total > 0 ? Number(((puas / total) * 100).toFixed(2)) : 0);
      const formatted = finalVal.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '%';
      return { val: finalVal, formatted };
    };

    for (const row of parsed.data) {
      if (!row || row.length < 11) continue;
      const col0 = (row[0] || '').trim();
      if (!col0 || col0.toLowerCase() === 'bulan') continue;

      const kecepatanPuas = parseNumber(row[1]);
      const kecepatanTidakPuas = parseNumber(row[2]);
      const keramahanPuas = parseNumber(row[4]);
      const keramahanTidakPuas = parseNumber(row[5]);
      const kebutuhanPuas = parseNumber(row[7]);
      const kebutuhanTidakPuas = parseNumber(row[8]);
      const totalSurvei = parseNumber(row[10]) || (kecepatanPuas + kecepatanTidakPuas);

      if (totalSurvei === 0 && kecepatanPuas === 0) continue;

      const kecPct = parsePct(row[3], kecepatanPuas, totalSurvei);
      const kerPct = parsePct(row[6], keramahanPuas, totalSurvei);
      const kebPct = parsePct(row[9], kebutuhanPuas, totalSurvei);

      const item: SatisfactionSurveyRow = {
        bulan: col0,
        kecepatanPuas,
        kecepatanTidakPuas,
        persenKecepatan: kecPct.formatted,
        persenKecepatanVal: kecPct.val,
        keramahanPuas,
        keramahanTidakPuas,
        persenKeramahan: kerPct.formatted,
        persenKeramahanVal: kerPct.val,
        kebutuhanPuas,
        kebutuhanTidakPuas,
        persenKebutuhan: kebPct.formatted,
        persenKebutuhanVal: kebPct.val,
        totalSurvei,
      };

      if (col0.toLowerCase().includes('total') || col0.toLowerCase().includes('rata')) {
        summary = item;
      } else {
        monthly.push(item);
      }
    }

    if (monthly.length === 0) {
      return DEFAULT_SATISFACTION_SURVEY_DATA;
    }

    return {
      monthly,
      summary: summary || DEFAULT_SATISFACTION_SURVEY_DATA.summary,
    };
  } catch (error) {
    console.warn("Could not fetch satisfaction survey data from Google Sheets, using fallback:", error);
    return DEFAULT_SATISFACTION_SURVEY_DATA;
  }
}

export const DEFAULT_SOCIAL_MEDIA_DATA: SocialMediaData = {
  monthly: [
    {
      bulan: "Januari 2026",
      facebook: 5609,
      instagram: 31723,
      x: 2620,
      tiktok: 1488,
      threads: 0,
      email: 204,
      youtube: 59,
      whatsapp: 2621,
      jumlah: 44324,
      responTime: "0:03:07",
      responTimeSeconds: 187,
      vikaStatusKepesertaan: 43871,
      vikaTagihanIuran: 9814,
      vikaTotal: 53685
    },
    {
      bulan: "Februari 2026",
      facebook: 9368,
      instagram: 43570,
      x: 2455,
      tiktok: 1615,
      threads: 0,
      email: 334,
      youtube: 131,
      whatsapp: 3982,
      jumlah: 61455,
      responTime: "0:19:18",
      responTimeSeconds: 1158,
      vikaStatusKepesertaan: 61175,
      vikaTagihanIuran: 10889,
      vikaTotal: 72064
    },
    {
      bulan: "Maret 2026",
      facebook: 3505,
      instagram: 22986,
      x: 1951,
      tiktok: 1102,
      threads: 0,
      email: 221,
      youtube: 80,
      whatsapp: 2300,
      jumlah: 32145,
      responTime: "0:05:51",
      responTimeSeconds: 351,
      vikaStatusKepesertaan: 28302,
      vikaTagihanIuran: 7404,
      vikaTotal: 35706
    },
    {
      bulan: "April 2026",
      facebook: 5481,
      instagram: 30458,
      x: 1885,
      tiktok: 1885,
      threads: 0,
      email: 318,
      youtube: 81,
      whatsapp: 1855,
      jumlah: 41963,
      responTime: "0:04:08",
      responTimeSeconds: 248,
      vikaStatusKepesertaan: 26587,
      vikaTagihanIuran: 6952,
      vikaTotal: 33539
    },
    {
      bulan: "Mei 2026",
      facebook: 5264,
      instagram: 29137,
      x: 2113,
      tiktok: 1910,
      threads: 0,
      email: 342,
      youtube: 78,
      whatsapp: 1764,
      jumlah: 40608,
      responTime: "0:09:39",
      responTimeSeconds: 579,
      vikaStatusKepesertaan: 26744,
      vikaTagihanIuran: 6092,
      vikaTotal: 32836
    },
    {
      bulan: "Juni 2026",
      facebook: 4053,
      instagram: 27383,
      x: 1964,
      tiktok: 1515,
      threads: 301,
      email: 348,
      youtube: 68,
      whatsapp: 1796,
      jumlah: 37428,
      responTime: "0:04:36",
      responTimeSeconds: 276,
      vikaStatusKepesertaan: 22467,
      vikaTagihanIuran: 5983,
      vikaTotal: 28450
    },
    {
      bulan: "Juli 2026",
      facebook: 3448,
      instagram: 27568,
      x: 1639,
      tiktok: 1324,
      threads: 116,
      email: 401,
      youtube: 83,
      whatsapp: 1537,
      jumlah: 36116,
      responTime: "0:05:21",
      responTimeSeconds: 321,
      vikaStatusKepesertaan: 21200,
      vikaTagihanIuran: 5704,
      vikaTotal: 26904
    },
    {
      bulan: "Agustus 2026",
      facebook: 3085,
      instagram: 25100,
      x: 1623,
      tiktok: 1231,
      threads: 656,
      email: 341,
      youtube: 128,
      whatsapp: 1410,
      jumlah: 33574,
      responTime: "0:03:10",
      responTimeSeconds: 190,
      vikaStatusKepesertaan: 20965,
      vikaTagihanIuran: 5358,
      vikaTotal: 26323
    },
    {
      bulan: "September 2026",
      facebook: 3301,
      instagram: 23034,
      x: 1708,
      tiktok: 1310,
      threads: 752,
      email: 276,
      youtube: 55,
      whatsapp: 1342,
      jumlah: 31778,
      responTime: "0:04:02",
      responTimeSeconds: 242,
      vikaStatusKepesertaan: 22047,
      vikaTagihanIuran: 5617,
      vikaTotal: 27664
    }
  ],
  totals: {
    facebook: 43114,
    instagram: 260959,
    x: 17958,
    tiktok: 13380,
    threads: 1825,
    email: 2785,
    youtube: 763,
    whatsapp: 18607,
    jumlah: 359391,
    avgResponTime: "0:06:35",
    avgResponTimeSeconds: 395,
    vikaStatusKepesertaan: 273358,
    vikaTagihanIuran: 63813,
    vikaTotal: 337171,
    grandTotalDigital: 696562
  },
  percentages: {
    instagram: "72.61%",
    facebook: "12.00%",
    whatsapp: "5.18%",
    x: "5.00%",
    tiktok: "3.72%",
    email: "0.77%",
    threads: "0.51%",
    youtube: "0.21%",
    vikaStatusKepesertaan: "81.07%",
    vikaTagihanIuran: "18.93%"
  },
  channelSummary: [
    { name: 'Instagram', key: 'instagram', count: 260959, pct: '72.61%', pctVal: 72.61, color: '#e1306c' },
    { name: 'Facebook', key: 'facebook', count: 43114, pct: '12.00%', pctVal: 12.00, color: '#1877f2' },
    { name: 'WhatsApp', key: 'whatsapp', count: 18607, pct: '5.18%', pctVal: 5.18, color: '#25d366' },
    { name: 'X (Twitter)', key: 'x', count: 17958, pct: '5.00%', pctVal: 5.00, color: '#0f172a' },
    { name: 'TikTok', key: 'tiktok', count: 13380, pct: '3.72%', pctVal: 3.72, color: '#000000' },
    { name: 'Email', key: 'email', count: 2785, pct: '0.77%', pctVal: 0.77, color: '#ea4335' },
    { name: 'Threads', key: 'threads', count: 1825, pct: '0.51%', pctVal: 0.51, color: '#6366f1' },
    { name: 'YouTube', key: 'youtube', count: 763, pct: '0.21%', pctVal: 0.21, color: '#ff0000' }
  ],
  topics: {
    informasi: [
      { rank: 1, topik: 'Kanal Layanan', jumlah: 39014, formattedJumlah: '39.014', persen: '16,05%', persenVal: 16.05 },
      { rank: 2, topik: 'Status Kepesertaan', jumlah: 31139, formattedJumlah: '31.139', persen: '12,81%', persenVal: 12.81 },
      { rank: 3, topik: 'Prosedur Perubahan Segmen Kepesertaan', jumlah: 23394, formattedJumlah: '23.394', persen: '9,63%', persenVal: 9.63 },
      { rank: 4, topik: 'Tata Cara Pembayaran Iuran', jumlah: 16249, formattedJumlah: '16.249', persen: '6,69%', persenVal: 6.69 },
      { rank: 5, topik: 'Perbaikan data identitas peserta (NIK, nama, tanggal lahir, jenis kelamin dan alamat)', jumlah: 14178, formattedJumlah: '14.178', persen: '5,83%', persenVal: 5.83 }
    ],
    pengaduan: [
      { rank: 1, topik: 'Aplikasi Mobile JKN sulit diakses (registrasi)', jumlah: 2249, formattedJumlah: '2.249', persen: '40,62%', persenVal: 40.62 },
      { rank: 2, topik: 'Non-aktif karena Iuran dengan status pembayaran lunas', jumlah: 406, formattedJumlah: '406', persen: '7,33%', persenVal: 7.33 },
      { rank: 3, topik: 'Gangguan antrean melalui aplikasi mobile JKN', jumlah: 392, formattedJumlah: '392', persen: '7,08%', persenVal: 7.08 },
      { rank: 4, topik: 'Data pembayaran iuran belum masuk FTP', jumlah: 245, formattedJumlah: '245', persen: '4,42%', persenVal: 4.42 },
      { rank: 5, topik: 'Obat tidak tersedia dan pasien diminta mencari obat sendiri', jumlah: 241, formattedJumlah: '241', persen: '4,35%', persenVal: 4.35 }
    ]
  }
};

export const DEFAULT_SOCIAL_MEDIA_TOPICS: SocialMediaTopicsData = DEFAULT_SOCIAL_MEDIA_DATA.topics!;

export async function fetchSocialMediaTopics(): Promise<SocialMediaTopicsData> {
  try {
    const response = await fetch(GVIZ_URL_SOCIAL_TOPICS);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const text = await response.text();
    const match = text.match(/google\.visualization\.Query\.setResponse\((.*)\);/s);
    if (!match || !match[1]) throw new Error('Format respon sheet tidak valid');
    const data = JSON.parse(match[1]);
    const rows = data.table?.rows || [];
    if (rows.length === 0) return DEFAULT_SOCIAL_MEDIA_TOPICS;

    const infoList: SocialMediaTopicItem[] = [];
    const pengaduanList: SocialMediaTopicItem[] = [];
    let currentCategory: 'informasi' | 'pengaduan' = 'informasi';

    for (const r of rows) {
      const c = r.c || [];
      const col0 = c[0]?.v ? String(c[0].v).trim() : '';
      if (!col0) continue;

      if (col0.toLowerCase().includes('pengaduan')) {
        currentCategory = 'pengaduan';
        continue;
      }
      if (col0.toLowerCase().includes('informasi')) {
        currentCategory = 'informasi';
        continue;
      }

      let rawVal = c[1]?.v;
      let jumlah = 0;
      if (typeof rawVal === 'number') {
        if (rawVal > 0 && rawVal < 100 && String(c[1]?.f || '').includes('.')) {
          jumlah = Math.round(rawVal * 1000);
        } else {
          jumlah = Math.round(rawVal);
        }
      } else if (typeof rawVal === 'string') {
        jumlah = parseInt(rawVal.replace(/\./g, '').replace(/,/g, ''), 10) || 0;
      }

      const persenStr = c[2]?.v ? String(c[2].v).trim() : (c[2]?.f ? String(c[2].f).trim() : '');
      const persenClean = persenStr.replace('%', '').replace(',', '.').trim();
      const persenVal = parseFloat(persenClean) || 0;

      const item: SocialMediaTopicItem = {
        rank: (currentCategory === 'informasi' ? infoList.length : pengaduanList.length) + 1,
        topik: col0,
        jumlah,
        formattedJumlah: new Intl.NumberFormat('id-ID').format(jumlah),
        persen: persenStr.includes('%') ? persenStr : `${persenStr}%`,
        persenVal
      };

      if (currentCategory === 'informasi') {
        infoList.push(item);
      } else {
        pengaduanList.push(item);
      }
    }

    return {
      informasi: infoList.length > 0 ? infoList.slice(0, 5) : DEFAULT_SOCIAL_MEDIA_TOPICS.informasi,
      pengaduan: pengaduanList.length > 0 ? pengaduanList.slice(0, 5) : DEFAULT_SOCIAL_MEDIA_TOPICS.pengaduan
    };
  } catch (err) {
    console.warn("Could not fetch topics from Google Sheet, using fallback:", err);
    return DEFAULT_SOCIAL_MEDIA_TOPICS;
  }
}

function parseTimeToSeconds(timeStr: string): number {
  if (!timeStr) return 0;
  const parts = timeStr.trim().split(':');
  if (parts.length === 3) {
    const h = parseInt(parts[0], 10) || 0;
    const m = parseInt(parts[1], 10) || 0;
    const s = parseInt(parts[2], 10) || 0;
    return h * 3600 + m * 60 + s;
  }
  if (parts.length === 2) {
    const m = parseInt(parts[0], 10) || 0;
    const s = parseInt(parts[1], 10) || 0;
    return m * 60 + s;
  }
  return 0;
}

export async function fetchSocialMediaData(): Promise<SocialMediaData> {
  try {
    const [response, topics] = await Promise.all([
      fetch(GVIZ_URL_SOCIAL),
      fetchSocialMediaTopics().catch(() => DEFAULT_SOCIAL_MEDIA_TOPICS)
    ]);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const text = await response.text();
    const match = text.match(/google\.visualization\.Query\.setResponse\((.*)\);/s);
    if (!match || !match[1]) throw new Error('Format respon Google Sheet tidak valid');

    const data = JSON.parse(match[1]);
    const rows = data.table?.rows || [];
    if (rows.length === 0) return { ...DEFAULT_SOCIAL_MEDIA_DATA, topics };

    const monthly: MonthlySocialMediaRow[] = [];
    let totalsRow: any = null;

    for (const r of rows) {
      const c = r.c || [];
      const monthLabel = c[0]?.v ? String(c[0].v).trim() : '';
      if (!monthLabel) continue;

      if (monthLabel.toLowerCase().includes('total') || monthLabel.toLowerCase().includes('rata')) {
        totalsRow = c;
        continue;
      }
      if (monthLabel === '%') {
        continue;
      }

      const fb = Math.round(Number(c[1]?.v) || 0);
      const ig = Math.round(Number(c[2]?.v) || 0);
      const xVal = Math.round(Number(c[3]?.v) || 0);
      const tiktok = Math.round(Number(c[4]?.v) || 0);
      const threads = Math.round(Number(c[5]?.v) || 0);
      const email = Math.round(Number(c[6]?.v) || 0);
      const youtube = Math.round(Number(c[7]?.v) || 0);
      const wa = Math.round(Number(c[8]?.v) || 0);
      const totalMedsos = Math.round(Number(c[9]?.v) || (fb + ig + xVal + tiktok + threads + email + youtube + wa));
      const responTimeStr = c[10]?.f || '0:00:00';
      const responTimeSeconds = parseTimeToSeconds(responTimeStr);

      const vikaStatus = Math.round(Number(c[13]?.v) || 0);
      const vikaTagihan = Math.round(Number(c[14]?.v) || 0);
      const vikaTotal = Math.round(Number(c[15]?.v) || (vikaStatus + vikaTagihan));

      monthly.push({
        bulan: monthLabel,
        facebook: fb,
        instagram: ig,
        x: xVal,
        tiktok,
        threads,
        email,
        youtube,
        whatsapp: wa,
        jumlah: totalMedsos,
        responTime: responTimeStr,
        responTimeSeconds,
        vikaStatusKepesertaan: vikaStatus,
        vikaTagihanIuran: vikaTagihan,
        vikaTotal: vikaTotal
      });
    }

    if (monthly.length === 0) {
      return DEFAULT_SOCIAL_MEDIA_DATA;
    }

    // Compute or read totals
    const totalFb = totalsRow ? Math.round(Number(totalsRow[1]?.v) || 0) : monthly.reduce((s, m) => s + m.facebook, 0);
    const totalIg = totalsRow ? Math.round(Number(totalsRow[2]?.v) || 0) : monthly.reduce((s, m) => s + m.instagram, 0);
    const totalX = totalsRow ? Math.round(Number(totalsRow[3]?.v) || 0) : monthly.reduce((s, m) => s + m.x, 0);
    const totalTiktok = totalsRow ? Math.round(Number(totalsRow[4]?.v) || 0) : monthly.reduce((s, m) => s + m.tiktok, 0);
    const totalThreads = totalsRow ? Math.round(Number(totalsRow[5]?.v) || 0) : monthly.reduce((s, m) => s + m.threads, 0);
    const totalEmail = totalsRow ? Math.round(Number(totalsRow[6]?.v) || 0) : monthly.reduce((s, m) => s + m.email, 0);
    const totalYoutube = totalsRow ? Math.round(Number(totalsRow[7]?.v) || 0) : monthly.reduce((s, m) => s + m.youtube, 0);
    const totalWa = totalsRow ? Math.round(Number(totalsRow[8]?.v) || 0) : monthly.reduce((s, m) => s + m.whatsapp, 0);
    const totalMedsos = totalsRow ? Math.round(Number(totalsRow[9]?.v) || 0) : (totalFb + totalIg + totalX + totalTiktok + totalThreads + totalEmail + totalYoutube + totalWa);

    const avgResponTime = totalsRow && totalsRow[10]?.f ? totalsRow[10].f : '0:06:35';
    const avgResponTimeSeconds = parseTimeToSeconds(avgResponTime);

    const totalVikaStatus = totalsRow ? Math.round(Number(totalsRow[13]?.v) || 0) : monthly.reduce((s, m) => s + m.vikaStatusKepesertaan, 0);
    const totalVikaTagihan = totalsRow ? Math.round(Number(totalsRow[14]?.v) || 0) : monthly.reduce((s, m) => s + m.vikaTagihanIuran, 0);
    const totalVika = totalsRow ? Math.round(Number(totalsRow[15]?.v) || 0) : (totalVikaStatus + totalVikaTagihan);

    const calcPct = (val: number, tot: number) => tot > 0 ? ((val / tot) * 100).toFixed(2) + '%' : '0.00%';
    const calcPctVal = (val: number, tot: number) => tot > 0 ? Number(((val / tot) * 100).toFixed(2)) : 0;

    const channelSummary: SocialMediaChannelSummary[] = [
      { name: 'Instagram', key: 'instagram', count: totalIg, pct: calcPct(totalIg, totalMedsos), pctVal: calcPctVal(totalIg, totalMedsos), color: '#e1306c' },
      { name: 'Facebook', key: 'facebook', count: totalFb, pct: calcPct(totalFb, totalMedsos), pctVal: calcPctVal(totalFb, totalMedsos), color: '#1877f2' },
      { name: 'WhatsApp', key: 'whatsapp', count: totalWa, pct: calcPct(totalWa, totalMedsos), pctVal: calcPctVal(totalWa, totalMedsos), color: '#25d366' },
      { name: 'X (Twitter)', key: 'x', count: totalX, pct: calcPct(totalX, totalMedsos), pctVal: calcPctVal(totalX, totalMedsos), color: '#0f172a' },
      { name: 'TikTok', key: 'tiktok', count: totalTiktok, pct: calcPct(totalTiktok, totalMedsos), pctVal: calcPctVal(totalTiktok, totalMedsos), color: '#000000' },
      { name: 'Email', key: 'email', count: totalEmail, pct: calcPct(totalEmail, totalMedsos), pctVal: calcPctVal(totalEmail, totalMedsos), color: '#ea4335' },
      { name: 'Threads', key: 'threads', count: totalThreads, pct: calcPct(totalThreads, totalMedsos), pctVal: calcPctVal(totalThreads, totalMedsos), color: '#6366f1' },
      { name: 'YouTube', key: 'youtube', count: totalYoutube, pct: calcPct(totalYoutube, totalMedsos), pctVal: calcPctVal(totalYoutube, totalMedsos), color: '#ff0000' },
    ];

    return {
      monthly,
      totals: {
        facebook: totalFb,
        instagram: totalIg,
        x: totalX,
        tiktok: totalTiktok,
        threads: totalThreads,
        email: totalEmail,
        youtube: totalYoutube,
        whatsapp: totalWa,
        jumlah: totalMedsos,
        avgResponTime,
        avgResponTimeSeconds,
        vikaStatusKepesertaan: totalVikaStatus,
        vikaTagihanIuran: totalVikaTagihan,
        vikaTotal: totalVika,
        grandTotalDigital: totalMedsos + totalVika
      },
      percentages: {
        instagram: calcPct(totalIg, totalMedsos),
        facebook: calcPct(totalFb, totalMedsos),
        whatsapp: calcPct(totalWa, totalMedsos),
        x: calcPct(totalX, totalMedsos),
        tiktok: calcPct(totalTiktok, totalMedsos),
        email: calcPct(totalEmail, totalMedsos),
        threads: calcPct(totalThreads, totalMedsos),
        youtube: calcPct(totalYoutube, totalMedsos),
        vikaStatusKepesertaan: calcPct(totalVikaStatus, totalVika),
        vikaTagihanIuran: calcPct(totalVikaTagihan, totalVika)
      },
      channelSummary,
      topics
    };
  } catch (error) {
    console.warn("Could not fetch social media data from Google Sheets, using fallback:", error);
    return DEFAULT_SOCIAL_MEDIA_DATA;
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
