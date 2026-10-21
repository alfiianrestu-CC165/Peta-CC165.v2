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
  agustus: number;
  september: number;
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
  agustus: number;
  september: number;
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
    agustus: number;
    september: number;
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
    agustus: number;
    september: number;
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

export interface SatisfactionSurveyRow {
  bulan: string;
  kecepatanPuas: number;
  kecepatanTidakPuas: number;
  persenKecepatan: string;
  persenKecepatanVal: number;
  keramahanPuas: number;
  keramahanTidakPuas: number;
  persenKeramahan: string;
  persenKeramahanVal: number;
  kebutuhanPuas: number;
  kebutuhanTidakPuas: number;
  persenKebutuhan: string;
  persenKebutuhanVal: number;
  totalSurvei: number;
}

export interface SatisfactionSurveyData {
  monthly: SatisfactionSurveyRow[];
  summary: SatisfactionSurveyRow;
}

export interface MonthlySocialMediaRow {
  bulan: string;
  facebook: number;
  instagram: number;
  x: number;
  tiktok: number;
  threads: number;
  email: number;
  youtube: number;
  whatsapp: number;
  jumlah: number;
  responTime: string;
  responTimeSeconds: number;
  vikaStatusKepesertaan: number;
  vikaTagihanIuran: number;
  vikaTotal: number;
}

export interface SocialMediaChannelSummary {
  name: string;
  key: string;
  count: number;
  pct: string;
  pctVal: number;
  color: string;
}

export interface SocialMediaTopicItem {
  rank: number;
  topik: string;
  jumlah: number;
  formattedJumlah: string;
  persen: string;
  persenVal: number;
}

export interface SocialMediaTopicsData {
  informasi: SocialMediaTopicItem[];
  pengaduan: SocialMediaTopicItem[];
}

export interface SocialMediaData {
  monthly: MonthlySocialMediaRow[];
  totals: {
    facebook: number;
    instagram: number;
    x: number;
    tiktok: number;
    threads: number;
    email: number;
    youtube: number;
    whatsapp: number;
    jumlah: number;
    avgResponTime: string;
    avgResponTimeSeconds: number;
    vikaStatusKepesertaan: number;
    vikaTagihanIuran: number;
    vikaTotal: number;
    grandTotalDigital: number;
  };
  percentages: {
    facebook: string;
    instagram: string;
    x: string;
    tiktok: string;
    threads: string;
    email: string;
    youtube: string;
    whatsapp: string;
    vikaStatusKepesertaan: string;
    vikaTagihanIuran: string;
  };
  channelSummary: SocialMediaChannelSummary[];
  topics?: SocialMediaTopicsData;
}


