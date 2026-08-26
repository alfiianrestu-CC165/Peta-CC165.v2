export interface DataRow {
  rowNumber?: number;
  bulan: string;
  panggilanMasuk: number;
  panggilanDijawab: number;
  persenDijawab: string;
  rataWaktu: string;
  dijawabKurang20: string;
  informasi: number;
  permintaan: number;
  pengaduan: number;
  total: number;
  tuntas: number;
  persenTuntas: string;
  disposisi: number;
  persenDisposisi: string;
}

export interface CategoryTopicItem {
  topik: string;
  jumlah: number;
  persen: string;
  persenVal: number;
}

export interface CategoryBreakdownData {
  informasi: CategoryTopicItem[];
  pengaduan: CategoryTopicItem[];
  permintaan: CategoryTopicItem[];
  totals?: {
    informasi: number;
    permintaan: number;
    pengaduan: number;
    total: number;
  };
}

export interface BranchOfficeData {
  kantorCabang: string;
  kedeputianWilayah: string;
  provinsi: string;
  januari: number;
  februari: number;
  maret: number;
  april: number;
  mei: number;
  juni: number;
  juli: number;
  total: number;
}

export interface RegionalSummaryItem {
  kedeputianWilayah: string;
  romanId: string;
  provinces: string[];
  branchCount: number;
  januari: number;
  februari: number;
  maret: number;
  april: number;
  mei: number;
  juni: number;
  juli: number;
  total: number;
  percentage: number;
  branches: BranchOfficeData[];
}

export interface RegionalData {
  regions: RegionalSummaryItem[];
  branches: BranchOfficeData[];
  provinces: { name: string; total: number; region: string }[];
  totals: {
    januari: number;
    februari: number;
    maret: number;
    april: number;
    mei: number;
    juni: number;
    juli: number;
    total: number;
  };
}

// Data Pemanfaatan Berdasarkan Segmen Peserta
export interface SegmentItem {
  segmentName: string;
  fullName: string;
  description: string;
  color: string;
  total: number;
  percentage: number;
  monthly: {
    januari: number;
    februari: number;
    maret: number;
    april: number;
    mei: number;
    juni: number;
    juli: number;
  };
}

export interface MonthlySegmentSummary {
  bulan: string;
  'PBI APBN': number;
  'PBI APBD': number;
  'PBPU': number;
  'PPU PN': number;
  'PPU': number;
  'BP': number;
  'Belum Terdaftar': number;
  total: number;
}

export interface RegionalSegmentItem {
  kedeputianWilayah: string;
  romanId: string;
  'PBI APBN': number;
  'PBI APBD': number;
  'PBPU': number;
  'PPU PN': number;
  'PPU': number;
  'BP': number;
  'Belum Terdaftar': number;
  total: number;
  percentage: number;
}

export interface ParticipantSegmentData {
  segments: SegmentItem[];
  monthlyData: MonthlySegmentSummary[];
  regionalSegments: RegionalSegmentItem[];
  grandTotal: number;
}
