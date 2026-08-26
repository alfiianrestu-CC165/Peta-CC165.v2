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
