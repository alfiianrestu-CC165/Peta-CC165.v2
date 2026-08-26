// Geolocation coordinates (Latitude, Longitude) for all 126 Kantor Cabang BPJS Kesehatan across Indonesia

export interface BranchCoord {
  lat: number;
  lng: number;
}

export const BRANCH_COORDINATES: Record<string, BranchCoord> = {
  // KW I - Aceh & Sumut
  "BANDA ACEH": { lat: 5.5483, lng: 95.3238 },
  "GUNUNG SITOLI": { lat: 1.2825, lng: 97.6167 },
  "KABANJAHE": { lat: 3.1774, lng: 98.4908 },
  "KISARAN": { lat: 2.9841, lng: 99.6264 },
  "LANGSA": { lat: 4.4719, lng: 97.9683 },
  "LHOKSEUMAWE": { lat: 5.1801, lng: 97.1507 },
  "LUBUK PAKAM": { lat: 3.5606, lng: 98.8744 },
  "MEDAN": { lat: 3.5952, lng: 98.6722 },
  "MEULABOH": { lat: 4.1447, lng: 96.1285 },
  "PADANG SIDEMPUAN": { lat: 1.3734, lng: 99.2734 },
  "PEMATANG SIANTAR": { lat: 2.9592, lng: 99.0687 },
  "SIBOLGA": { lat: 1.7408, lng: 98.7844 },
  "TAPAKTUAN": { lat: 3.2575, lng: 97.1802 },

  // KW II - Riau, Kepri, Sumbar, Jambi
  "BATAM": { lat: 1.1301, lng: 104.0529 },
  "BUKITTINGGI": { lat: -0.3055, lng: 100.3692 },
  "DUMAI": { lat: 1.6667, lng: 101.4500 },
  "JAMBI": { lat: -1.6101, lng: 103.6131 },
  "MUARA BUNGO": { lat: -1.4989, lng: 102.1158 },
  "PADANG": { lat: -0.9471, lng: 100.4172 },
  "PAYAKUMBUH": { lat: -0.2244, lng: 100.6319 },
  "PEKANBARU": { lat: 0.5071, lng: 101.4478 },
  "RENGAT": { lat: -0.3778, lng: 102.5486 },
  "SOLOK": { lat: -0.7986, lng: 100.6538 },
  "TANJUNG PINANG": { lat: 0.9169, lng: 104.4667 },

  // KW III - Sumsel, Babel, Bengkulu, Lampung
  "BANDAR LAMPUNG": { lat: -5.3971, lng: 105.2668 },
  "BENGKULU": { lat: -3.8004, lng: 102.2655 },
  "CURUP": { lat: -3.4686, lng: 102.5297 },
  "KOTA BUMI": { lat: -4.8219, lng: 104.8814 },
  "LUBUKLINGGAU": { lat: -3.2936, lng: 102.8624 },
  "METRO": { lat: -5.1136, lng: 105.3069 },
  "PALEMBANG": { lat: -2.9761, lng: 104.7754 },
  "PANGKAL PINANG": { lat: -2.1290, lng: 106.1129 },
  "PRABUMULIH": { lat: -3.4319, lng: 104.2344 },

  // KW IV - Jabodetabek, Banten, Kalbar
  "JAKARTA BARAT": { lat: -6.1683, lng: 106.7588 },
  "JAKARTA PUSAT": { lat: -6.1805, lng: 106.8284 },
  "JAKARTA SELATAN": { lat: -6.2615, lng: 106.8106 },
  "JAKARTA TIMUR": { lat: -6.2250, lng: 106.9004 },
  "JAKARTA UTARA": { lat: -6.1214, lng: 106.8827 },
  "PONTIANAK": { lat: -0.0263, lng: 109.3425 },
  "SERANG": { lat: -6.1200, lng: 106.1503 },
  "SINGKAWANG": { lat: 0.9071, lng: 108.9858 },
  "SINTANG": { lat: 0.0700, lng: 111.4981 },
  "TANGERANG": { lat: -6.1783, lng: 106.6319 },
  "TIGARAKSA": { lat: -6.2606, lng: 106.4831 },

  // KW V - Jawa Barat
  "BANDUNG": { lat: -6.9175, lng: 107.6191 },
  "BANJAR": { lat: -7.3697, lng: 108.5331 },
  "BEKASI": { lat: -6.2383, lng: 106.9756 },
  "BOGOR": { lat: -6.5971, lng: 106.8060 },
  "CIBINONG": { lat: -6.4833, lng: 106.8500 },
  "CIKARANG": { lat: -6.3056, lng: 107.1528 },
  "CIMAHI": { lat: -6.8722, lng: 107.5422 },
  "CIREBON": { lat: -6.7320, lng: 108.5523 },
  "DEPOK": { lat: -6.4025, lng: 106.7942 },
  "KARAWANG": { lat: -6.3078, lng: 107.3078 },
  "SOREANG": { lat: -7.0278, lng: 107.5186 },
  "SUKABUMI": { lat: -6.9277, lng: 106.9300 },
  "SUMEDANG": { lat: -6.8589, lng: 107.9269 },
  "TASIKMALAYA": { lat: -7.3274, lng: 108.2207 },

  // KW VI - Jateng & DIY
  "BOYOLALI": { lat: -7.5342, lng: 110.5947 },
  "KEBUMEN": { lat: -7.6686, lng: 109.6528 },
  "KUDUS": { lat: -6.8048, lng: 110.8405 },
  "MAGELANG": { lat: -7.4797, lng: 110.2178 },
  "PATI": { lat: -6.7561, lng: 111.0381 },
  "PEKALONGAN": { lat: -6.8886, lng: 109.6753 },
  "PURWOKERTO": { lat: -7.4244, lng: 109.2303 },
  "SEMARANG": { lat: -6.9667, lng: 110.4167 },
  "SLEMAN": { lat: -7.7167, lng: 110.3556 },
  "SURAKARTA": { lat: -7.5755, lng: 110.8243 },
  "TEGAL": { lat: -6.8694, lng: 109.1403 },
  "UNGARAN": { lat: -7.1394, lng: 110.4047 },
  "YOGYAKARTA": { lat: -7.7956, lng: 110.3695 },

  // KW VII - Jawa Timur
  "BANYUWANGI": { lat: -8.2192, lng: 114.3691 },
  "BOJONEGORO": { lat: -7.1500, lng: 111.8819 },
  "GRESIK": { lat: -7.1567, lng: 112.6556 },
  "JEMBER": { lat: -8.1724, lng: 113.7007 },
  "KEDIRI": { lat: -7.8480, lng: 112.0178 },
  "MADIUN": { lat: -7.6298, lng: 111.5239 },
  "MALANG": { lat: -7.9666, lng: 112.6326 },
  "MOJOKERTO": { lat: -7.4726, lng: 112.4381 },
  "PAMEKASAN": { lat: -7.1606, lng: 113.4739 },
  "PASURUAN": { lat: -7.6453, lng: 112.9075 },
  "SIDOARJO": { lat: -7.4478, lng: 112.7183 },
  "SURABAYA": { lat: -7.2575, lng: 112.7521 },
  "TULUNGAGUNG": { lat: -8.0667, lng: 111.9000 },

  // KW VIII - Kalimantan Timur, Kalsel, Kalteng, Kaltara
  "BALIKPAPAN": { lat: -1.2379, lng: 116.8289 },
  "BANJARMASIN": { lat: -3.3194, lng: 114.5908 },
  "BARABAI": { lat: -2.5833, lng: 115.3833 },
  "MUARA TEWEH": { lat: -0.9500, lng: 114.9000 },
  "PALANGKARAYA": { lat: -2.2161, lng: 113.9140 },
  "SAMARINDA": { lat: -0.5022, lng: 117.1536 },
  "SAMPIT": { lat: -2.5333, lng: 112.9500 },
  "TARAKAN": { lat: 3.3278, lng: 117.5786 },

  // KW IX - Sulsel, Sulbar, Sultra, Maluku
  "AMBON": { lat: -3.6547, lng: 128.1906 },
  "BAU BAU": { lat: -5.4636, lng: 122.6014 },
  "BULUKUMBA": { lat: -5.5583, lng: 120.1972 },
  "KENDARI": { lat: -3.9985, lng: 122.5126 },
  "MAKALE": { lat: -3.1000, lng: 119.8500 },
  "MAKASSAR": { lat: -5.1477, lng: 119.4327 },
  "MAMUJU": { lat: -2.6775, lng: 118.8897 },
  "PALOPO": { lat: -2.9925, lng: 120.1969 },
  "PARE PARE": { lat: -4.0131, lng: 119.6264 },
  "POLEWALI": { lat: -3.4325, lng: 119.3436 },
  "WATAMPONE": { lat: -4.5419, lng: 120.3297 },

  // KW X - Sulut, Sulteng, Gorontalo, Maluku Utara
  "GORONTALO": { lat: 0.5435, lng: 123.0568 },
  "LUWUK": { lat: -0.9517, lng: 122.7875 },
  "MANADO": { lat: 1.4748, lng: 124.8421 },
  "PALU": { lat: -0.9003, lng: 119.8779 },
  "TERNATE": { lat: 0.7903, lng: 127.3806 },
  "TONDANO": { lat: 1.3056, lng: 124.9125 },

  // KW XI - Bali, NTB, NTT
  "ATAMBUA": { lat: -9.1067, lng: 124.8925 },
  "BIMA": { lat: -8.4539, lng: 118.7275 },
  "DENPASAR": { lat: -8.6705, lng: 115.2126 },
  "ENDE": { lat: -8.8431, lng: 121.6622 },
  "KLUNGKUNG": { lat: -8.5372, lng: 115.4042 },
  "KUPANG": { lat: -10.1772, lng: 123.6070 },
  "MATARAM": { lat: -8.5833, lng: 116.1167 },
  "MAUMERE": { lat: -8.6197, lng: 122.2111 },
  "SELONG": { lat: -8.6500, lng: 116.5333 },
  "SINGARAJA": { lat: -8.1120, lng: 115.0882 },
  "WAINGAPU": { lat: -9.6567, lng: 120.2642 },

  // KW XII - Papua, Papua Barat, Papua Tengah, Pegunungan, Selatan, BD
  "BIAK NUMFOR": { lat: -1.1783, lng: 136.0847 },
  "JAYAPURA": { lat: -2.5337, lng: 140.7181 },
  "MANOKWARI": { lat: -0.8615, lng: 134.0620 },
  "MERAUKE": { lat: -8.4991, lng: 140.4047 },
  "SORONG": { lat: -0.8762, lng: 131.2558 },
  "WAMENA": { lat: -4.0983, lng: 138.9439 }
};

export function getBranchCoordinate(branchName: string): BranchCoord {
  const normalized = branchName.toUpperCase().trim();
  if (BRANCH_COORDINATES[normalized]) {
    return BRANCH_COORDINATES[normalized];
  }

  // Fuzzy check
  for (const key of Object.keys(BRANCH_COORDINATES)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return BRANCH_COORDINATES[key];
    }
  }

  // Fallback to center of Indonesia (Nusantara)
  return { lat: -2.5489, lng: 118.0149 };
}
