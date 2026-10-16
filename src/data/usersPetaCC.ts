/**
 * Data Pengguna PETA Care Center 165
 * Sumber: Spreadsheet Google Sheet "User PETA CC"
 * URL: https://docs.google.com/spreadsheets/d/1MjFAlH-fl2Y5acLWgNqQcX6E7nYfEol2gi6bHHfvH0U/edit?usp=sharing
 * 
 * Mencakup pembaruan baris A28:E39 (Kedeputian Wilayah I - XII, Level User):
 * - KW0100 s/d KW1200
 */

export type UserLevel = 'Administrator' | 'User';

export interface UserPetaCC {
  unitKerja: string;
  kode: string;
  level: UserLevel;
  username: string;
  password: string;
}

export const USERS_PETA_CC: UserPetaCC[] = [
  {
    "unitKerja": "Administrator",
    "kode": "0000",
    "level": "Administrator",
    "username": "ADMIN0000",
    "password": "CC_165"
  },
  {
    "unitKerja": "User",
    "kode": "9999",
    "level": "User",
    "username": "USER9999",
    "password": "CC165_"
  },
  {
    "unitKerja": "Satuan Pengawasan Internal",
    "kode": "0011",
    "level": "User",
    "username": "SPI0011",
    "password": "8711ZR"
  },
  {
    "unitKerja": "Sekretaris Badan",
    "kode": "0012",
    "level": "User",
    "username": "SESBAN0012",
    "password": "1077CX"
  },
  {
    "unitKerja": "Sekretaris Dewan Pengawas",
    "kode": "0013",
    "level": "User",
    "username": "SESDEWAS0013",
    "password": "4321AL"
  },
  {
    "unitKerja": "Bidang Komunikasi Organisasi",
    "kode": "0003",
    "level": "User",
    "username": "KOMSI0003",
    "password": "4593BE"
  },
  {
    "unitKerja": "Bidang Perluasan dan Kepatuhan Peserta",
    "kode": "0071",
    "level": "User",
    "username": "PKP0071",
    "password": "9715NZ"
  },
  {
    "unitKerja": "Bidang Kebijakan dan Data Kepesertaan",
    "kode": "0072",
    "level": "User",
    "username": "KDK0072",
    "password": "1077IZ"
  },
  {
    "unitKerja": "Bidang Manajemen Mutu Layanan",
    "kode": "0073",
    "level": "User",
    "username": "MML0073",
    "password": "2433SL"
  },
  {
    "unitKerja": "Bidang Kebijakan Penjaminan Manfaat",
    "kode": "0031",
    "level": "User",
    "username": "KPM0031",
    "password": "8483YX"
  },
  {
    "unitKerja": "Bidang Manajemen Mutu Layanan dan Kerjasama Fasilitas Kesehatan",
    "kode": "0032",
    "level": "User",
    "username": "MMKFK0032",
    "password": "5317ZL"
  },
  {
    "unitKerja": "Bidang Manajemen Klaim dan Utilisasi",
    "kode": "0009",
    "level": "User",
    "username": "MKU0009",
    "password": "8101BZ"
  },
  {
    "unitKerja": "Bidang Manajemen Iuran",
    "kode": "0041",
    "level": "User",
    "username": "MIUR0041",
    "password": "8479DA"
  },
  {
    "unitKerja": "Bidang Treasuri dan Investasi",
    "kode": "0042",
    "level": "User",
    "username": "TINVES0042",
    "password": "8135MF"
  },
  {
    "unitKerja": "Bidang Akuntansi",
    "kode": "0043",
    "level": "User",
    "username": "AKUN0043",
    "password": "3114WQ"
  },
  {
    "unitKerja": "Bidang Hukum, Pencegahan, dan Penanganan Kecurangan",
    "kode": "0081",
    "level": "User",
    "username": "HPPK0081",
    "password": "1104RA"
  },
  {
    "unitKerja": "Bidang Hubungan Antar Lembaga dan Regulasi",
    "kode": "0082",
    "level": "User",
    "username": "HALREG0082",
    "password": "4686DO"
  },
  {
    "unitKerja": "Bidang Tata Kelola, Risiko, dan Kepatuhan Internal",
    "kode": "0053",
    "level": "User",
    "username": "TARKI0053",
    "password": "5196HE"
  },
  {
    "unitKerja": "Bidang Aktuaria",
    "kode": "0064",
    "level": "User",
    "username": "AKTUARIA0064",
    "password": "9788EQ"
  },
  {
    "unitKerja": "Bidang Perencanaan dan Evaluasi Organisasi",
    "kode": "0051",
    "level": "User",
    "username": "PEO0051",
    "password": "6189OQ"
  },
  {
    "unitKerja": "Bidang Riset, Inovasi, dan Pengembangan",
    "kode": "0052",
    "level": "User",
    "username": "RISNOVBANG0052",
    "password": "7818SS"
  },
  {
    "unitKerja": "Bidang Manajemen Sumber Daya Manusia",
    "kode": "0061",
    "level": "User",
    "username": "MSDM0061",
    "password": "5959ZR"
  },
  {
    "unitKerja": "Bidang Sumber Daya Sarana dan Umum",
    "kode": "0062",
    "level": "User",
    "username": "SDSU0062",
    "password": "2467NI"
  },
  {
    "unitKerja": "Bidang Strategi, Perencanaan, dan Pengembangan Teknologi Informasi",
    "kode": "0021",
    "level": "User",
    "username": "SPPTI0021",
    "password": "1420CV"
  },
  {
    "unitKerja": "Bidang Operasional dan Keamanan Teknologi Informasi",
    "kode": "0023",
    "level": "User",
    "username": "OKTI0023",
    "password": "6900DA"
  },
  {
    "unitKerja": "Bidang Manajemen Data dan Informasi",
    "kode": "0022",
    "level": "User",
    "username": "MDI0022",
    "password": "3991IV"
  },
  {
    "unitKerja": "Kedeputian Wilayah I",
    "kode": "0100",
    "level": "User",
    "username": "KW0100",
    "password": "8001GP"
  },
  {
    "unitKerja": "Kedeputian Wilayah II",
    "kode": "0200",
    "level": "User",
    "username": "KW0200",
    "password": "7557KS"
  },
  {
    "unitKerja": "Kedeputian Wilayah III",
    "kode": "0300",
    "level": "User",
    "username": "KW0300",
    "password": "9485UX"
  },
  {
    "unitKerja": "Kedeputian Wilayah IV",
    "kode": "0400",
    "level": "User",
    "username": "KW0400",
    "password": "6319FC"
  },
  {
    "unitKerja": "Kedeputian Wilayah V",
    "kode": "0500",
    "level": "User",
    "username": "KW0500",
    "password": "6728EI"
  },
  {
    "unitKerja": "Kedeputian Wilayah VI",
    "kode": "0600",
    "level": "User",
    "username": "KW0600",
    "password": "7558EN"
  },
  {
    "unitKerja": "Kedeputian Wilayah VII",
    "kode": "0700",
    "level": "User",
    "username": "KW0700",
    "password": "5914HD"
  },
  {
    "unitKerja": "Kedeputian Wilayah VIII",
    "kode": "0800",
    "level": "User",
    "username": "KW0800",
    "password": "4120RK"
  },
  {
    "unitKerja": "Kedeputian Wilayah IX",
    "kode": "0900",
    "level": "User",
    "username": "KW0900",
    "password": "4534BA"
  },
  {
    "unitKerja": "Kedeputian Wilayah X",
    "kode": "1000",
    "level": "User",
    "username": "KW1000",
    "password": "3442FS"
  },
  {
    "unitKerja": "Kedeputian Wilayah XI",
    "kode": "1100",
    "level": "User",
    "username": "KW1100",
    "password": "6023GF"
  },
  {
    "unitKerja": "Kedeputian Wilayah XII",
    "kode": "1200",
    "level": "User",
    "username": "KW1200",
    "password": "1104GU"
  },
  {
    "unitKerja": "Cabang Medan",
    "kode": "0201",
    "level": "User",
    "username": "KC0201",
    "password": "4770PB"
  },
  {
    "unitKerja": "Cabang Lubuk Pakam",
    "kode": "0206",
    "level": "User",
    "username": "KC0206",
    "password": "7806NF"
  },
  {
    "unitKerja": "Cabang Pematangsiantar",
    "kode": "0202",
    "level": "User",
    "username": "KC0202",
    "password": "3102XZ"
  },
  {
    "unitKerja": "Cabang Kisaran",
    "kode": "0207",
    "level": "User",
    "username": "KC0207",
    "password": "6130GS"
  },
  {
    "unitKerja": "Cabang Kabanjahe",
    "kode": "0203",
    "level": "User",
    "username": "KC0203",
    "password": "4811FJ"
  },
  {
    "unitKerja": "Cabang Gunungsitoli",
    "kode": "0208",
    "level": "User",
    "username": "KC0208",
    "password": "2613FI"
  },
  {
    "unitKerja": "Cabang Sibolga",
    "kode": "0204",
    "level": "User",
    "username": "KC0204",
    "password": "7231AM"
  },
  {
    "unitKerja": "Cabang Padangsidimpuan",
    "kode": "0205",
    "level": "User",
    "username": "KC0205",
    "password": "9231JR"
  },
  {
    "unitKerja": "Cabang Banda Aceh",
    "kode": "0101",
    "level": "User",
    "username": "KC0101",
    "password": "1746RS"
  },
  {
    "unitKerja": "Cabang Langsa",
    "kode": "0102",
    "level": "User",
    "username": "KC0102",
    "password": "7034HN"
  },
  {
    "unitKerja": "Cabang Lhokseumawe",
    "kode": "0103",
    "level": "User",
    "username": "KC0103",
    "password": "3471MA"
  },
  {
    "unitKerja": "Cabang Meulaboh",
    "kode": "0104",
    "level": "User",
    "username": "KC0104",
    "password": "5060UL"
  },
  {
    "unitKerja": "Cabang Tapaktuan",
    "kode": "0105",
    "level": "User",
    "username": "KC0105",
    "password": "1874UG"
  },
  {
    "unitKerja": "Cabang Pekanbaru",
    "kode": "0401",
    "level": "User",
    "username": "KC0401",
    "password": "9872QZ"
  },
  {
    "unitKerja": "Cabang Dumai",
    "kode": "0404",
    "level": "User",
    "username": "KC0404",
    "password": "8630XN"
  },
  {
    "unitKerja": "Cabang Rengat",
    "kode": "0407",
    "level": "User",
    "username": "KC0407",
    "password": "5791OO"
  },
  {
    "unitKerja": "Cabang Batam",
    "kode": "0405",
    "level": "User",
    "username": "KC0405",
    "password": "9286JY"
  },
  {
    "unitKerja": "Cabang Tanjung Pinang",
    "kode": "0406",
    "level": "User",
    "username": "KC0406",
    "password": "8704AP"
  },
  {
    "unitKerja": "Cabang Padang",
    "kode": "0301",
    "level": "User",
    "username": "KC0301",
    "password": "9591DW"
  },
  {
    "unitKerja": "Cabang Bukittinggi",
    "kode": "0302",
    "level": "User",
    "username": "KC0302",
    "password": "2832IF"
  },
  {
    "unitKerja": "Cabang Payakumbuh",
    "kode": "0304",
    "level": "User",
    "username": "KC0304",
    "password": "9948MS"
  },
  {
    "unitKerja": "Cabang Solok",
    "kode": "0303",
    "level": "User",
    "username": "KC0303",
    "password": "2072AM"
  },
  {
    "unitKerja": "Cabang Jambi",
    "kode": "0501",
    "level": "User",
    "username": "KC0501",
    "password": "5385OS"
  },
  {
    "unitKerja": "Cabang Muara Bungo",
    "kode": "0502",
    "level": "User",
    "username": "KC0502",
    "password": "2131FR"
  },
  {
    "unitKerja": "Cabang Palembang",
    "kode": "0601",
    "level": "User",
    "username": "KC0601",
    "password": "6265FF"
  },
  {
    "unitKerja": "Cabang Lubuklinggau",
    "kode": "0605",
    "level": "User",
    "username": "KC0605",
    "password": "6059ZI"
  },
  {
    "unitKerja": "Cabang Prabumulih",
    "kode": "0604",
    "level": "User",
    "username": "KC0604",
    "password": "6414LB"
  },
  {
    "unitKerja": "Cabang Pangkalpinang",
    "kode": "0602",
    "level": "User",
    "username": "KC0602",
    "password": "4634UC"
  },
  {
    "unitKerja": "Cabang Bengkulu",
    "kode": "0701",
    "level": "User",
    "username": "KC0701",
    "password": "4145LJ"
  },
  {
    "unitKerja": "Cabang Curup",
    "kode": "0702",
    "level": "User",
    "username": "KC0702",
    "password": "4284EK"
  },
  {
    "unitKerja": "Cabang Bandar Lampung",
    "kode": "0801",
    "level": "User",
    "username": "KC0801",
    "password": "8329OY"
  },
  {
    "unitKerja": "Cabang Kotabumi",
    "kode": "0802",
    "level": "User",
    "username": "KC0802",
    "password": "4311LR"
  },
  {
    "unitKerja": "Cabang Metro",
    "kode": "0803",
    "level": "User",
    "username": "KC0803",
    "password": "5100GR"
  },
  {
    "unitKerja": "Cabang Jakarta Pusat",
    "kode": "0901",
    "level": "User",
    "username": "KC0901",
    "password": "9731GH"
  },
  {
    "unitKerja": "Cabang Jakarta Selatan",
    "kode": "0902",
    "level": "User",
    "username": "KC0902",
    "password": "7241UM"
  },
  {
    "unitKerja": "Cabang Jakarta Timur",
    "kode": "0903",
    "level": "User",
    "username": "KC0903",
    "password": "2369WN"
  },
  {
    "unitKerja": "Cabang Jakarta Barat",
    "kode": "0904",
    "level": "User",
    "username": "KC0904",
    "password": "5905KM"
  },
  {
    "unitKerja": "Cabang Jakarta Utara",
    "kode": "0905",
    "level": "User",
    "username": "KC0905",
    "password": "1984CC"
  },
  {
    "unitKerja": "Kabupaten Administrasi Kepulauan Seribu",
    "kode": "1003",
    "level": "User",
    "username": "KC1003",
    "password": "3002UR"
  },
  {
    "unitKerja": "Cabang Tigaraksa",
    "kode": "1018",
    "level": "User",
    "username": "KC1018",
    "password": "2609FH"
  },
  {
    "unitKerja": "Cabang Serang",
    "kode": "1004",
    "level": "User",
    "username": "KC1004",
    "password": "9783SO"
  },
  {
    "unitKerja": "Cabang Pontianak",
    "kode": "1501",
    "level": "User",
    "username": "KC1501",
    "password": "6282MJ"
  },
  {
    "unitKerja": "Cabang Singkawang",
    "kode": "1502",
    "level": "User",
    "username": "KC1502",
    "password": "8365JS"
  },
  {
    "unitKerja": "Cabang Sintang",
    "kode": "1504",
    "level": "User",
    "username": "KC1504",
    "password": "4455OV"
  },
  {
    "unitKerja": "Cabang Bandung",
    "kode": "1001",
    "level": "User",
    "username": "KC1001",
    "password": "6998XN"
  },
  {
    "unitKerja": "Cabang Banjar",
    "kode": "1013",
    "level": "User",
    "username": "KC1013",
    "password": "3368VX"
  },
  {
    "unitKerja": "Cabang Bekasi",
    "kode": "1011",
    "level": "User",
    "username": "KC1011",
    "password": "1854XD"
  },
  {
    "unitKerja": "Cabang Bogor",
    "kode": "1002",
    "level": "User",
    "username": "KC1002",
    "password": "3022CD"
  },
  {
    "unitKerja": "Cabang Cibinong",
    "kode": "1016",
    "level": "User",
    "username": "KC1016",
    "password": "5136BW"
  },
  {
    "unitKerja": "Cabang Cikarang",
    "kode": "1017",
    "level": "User",
    "username": "KC1017",
    "password": "5398FO"
  },
  {
    "unitKerja": "Cabang Cimahi",
    "kode": "1014",
    "level": "User",
    "username": "KC1014",
    "password": "8180HL"
  },
  {
    "unitKerja": "Cabang Cirebon",
    "kode": "1008",
    "level": "User",
    "username": "KC1008",
    "password": "2564PB"
  },
  {
    "unitKerja": "Cabang Depok",
    "kode": "1012",
    "level": "User",
    "username": "KC1012",
    "password": "3197DB"
  },
  {
    "unitKerja": "Cabang Karawang",
    "kode": "1006",
    "level": "User",
    "username": "KC1006",
    "password": "1183FD"
  },
  {
    "unitKerja": "Cabang Soreang",
    "kode": "1010",
    "level": "User",
    "username": "KC1010",
    "password": "9003QC"
  },
  {
    "unitKerja": "Cabang Sukabumi",
    "kode": "1005",
    "level": "User",
    "username": "KC1005",
    "password": "5931LG"
  },
  {
    "unitKerja": "Cabang Sumedang",
    "kode": "1007",
    "level": "User",
    "username": "KC1007",
    "password": "1972VS"
  },
  {
    "unitKerja": "Cabang Tasikmalaya",
    "kode": "1009",
    "level": "User",
    "username": "KC1009",
    "password": "2755OL"
  },
  {
    "unitKerja": "Cabang Semarang",
    "kode": "1101",
    "level": "User",
    "username": "KC1101",
    "password": "5764TX"
  },
  {
    "unitKerja": "Cabang Boyolali",
    "kode": "1107",
    "level": "User",
    "username": "KC1107",
    "password": "2079CB"
  },
  {
    "unitKerja": "Cabang Kebumen",
    "kode": "1113",
    "level": "User",
    "username": "KC1113",
    "password": "5933RK"
  },
  {
    "unitKerja": "Cabang Kudus",
    "kode": "1110",
    "level": "User",
    "username": "KC1110",
    "password": "8688BF"
  },
  {
    "unitKerja": "Cabang Magelang",
    "kode": "1106",
    "level": "User",
    "username": "KC1106",
    "password": "7224DA"
  },
  {
    "unitKerja": "Cabang Pati",
    "kode": "1111",
    "level": "User",
    "username": "KC1111",
    "password": "1378WG"
  },
  {
    "unitKerja": "Cabang Pekalongan",
    "kode": "1103",
    "level": "User",
    "username": "KC1103",
    "password": "3161NZ"
  },
  {
    "unitKerja": "Cabang Purwokerto",
    "kode": "1104",
    "level": "User",
    "username": "KC1104",
    "password": "2790MJ"
  },
  {
    "unitKerja": "Cabang Surakarta",
    "kode": "1108",
    "level": "User",
    "username": "KC1108",
    "password": "4232UB"
  },
  {
    "unitKerja": "Cabang Tegal",
    "kode": "1112",
    "level": "User",
    "username": "KC1112",
    "password": "2356EP"
  },
  {
    "unitKerja": "Cabang Ungaran",
    "kode": "1114",
    "level": "User",
    "username": "KC1114",
    "password": "1559LT"
  },
  {
    "unitKerja": "Cabang Yogyakarta",
    "kode": "1201",
    "level": "User",
    "username": "KC1201",
    "password": "4612PM"
  },
  {
    "unitKerja": "Cabang Sleman",
    "kode": "1202",
    "level": "User",
    "username": "KC1202",
    "password": "7045HS"
  },
  {
    "unitKerja": "Cabang Surabaya",
    "kode": "1301",
    "level": "User",
    "username": "KC1301",
    "password": "7625XV"
  },
  {
    "unitKerja": "Cabang Sidoarjo",
    "kode": "1314",
    "level": "User",
    "username": "KC1314",
    "password": "9785SB"
  },
  {
    "unitKerja": "Cabang Tulungagung",
    "kode": "1313",
    "level": "User",
    "username": "KC1313",
    "password": "4881IW"
  },
  {
    "unitKerja": "Cabang Gresik",
    "kode": "1315",
    "level": "User",
    "username": "KC1315",
    "password": "1379JI"
  },
  {
    "unitKerja": "Cabang Jember",
    "kode": "1310",
    "level": "User",
    "username": "KC1310",
    "password": "4071RW"
  },
  {
    "unitKerja": "Cabang Kediri",
    "kode": "1306",
    "level": "User",
    "username": "KC1306",
    "password": "1028ZY"
  },
  {
    "unitKerja": "Cabang Madiun",
    "kode": "1303",
    "level": "User",
    "username": "KC1303",
    "password": "2233KY"
  },
  {
    "unitKerja": "Cabang Malang",
    "kode": "1308",
    "level": "User",
    "username": "KC1308",
    "password": "2121PH"
  },
  {
    "unitKerja": "Cabang Mojokerto",
    "kode": "1307",
    "level": "User",
    "username": "KC1307",
    "password": "1942VC"
  },
  {
    "unitKerja": "Cabang Pamekasan",
    "kode": "1312",
    "level": "User",
    "username": "KC1312",
    "password": "8869SQ"
  },
  {
    "unitKerja": "Cabang Pasuruan",
    "kode": "1309",
    "level": "User",
    "username": "KC1309",
    "password": "2672QW"
  },
  {
    "unitKerja": "Cabang Bojonegoro",
    "kode": "1302",
    "level": "User",
    "username": "KC1302",
    "password": "6381NA"
  },
  {
    "unitKerja": "Cabang Banyuwangi",
    "kode": "1311",
    "level": "User",
    "username": "KC1311",
    "password": "6238GH"
  },
  {
    "unitKerja": "Cabang Samarinda",
    "kode": "1601",
    "level": "User",
    "username": "KC1601",
    "password": "1096IP"
  },
  {
    "unitKerja": "Cabang Balikpapan",
    "kode": "1602",
    "level": "User",
    "username": "KC1602",
    "password": "9956YY"
  },
  {
    "unitKerja": "Cabang Banjarmasin",
    "kode": "1701",
    "level": "User",
    "username": "KC1701",
    "password": "1285OR"
  },
  {
    "unitKerja": "Cabang Barabai",
    "kode": "1703",
    "level": "User",
    "username": "KC1703",
    "password": "8798HC"
  },
  {
    "unitKerja": "Cabang Palangka Raya",
    "kode": "1401",
    "level": "User",
    "username": "KC1401",
    "password": "3392RD"
  },
  {
    "unitKerja": "Cabang Muara Teweh",
    "kode": "1403",
    "level": "User",
    "username": "KC1403",
    "password": "3549KI"
  },
  {
    "unitKerja": "Cabang Sampit",
    "kode": "1402",
    "level": "User",
    "username": "KC1402",
    "password": "6601IA"
  },
  {
    "unitKerja": "Cabang Tarakan",
    "kode": "1603",
    "level": "User",
    "username": "KC1603",
    "password": "2684DD"
  },
  {
    "unitKerja": "Cabang Makassar",
    "kode": "1801",
    "level": "User",
    "username": "KC1801",
    "password": "4385JM"
  },
  {
    "unitKerja": "Cabang Bulukumba",
    "kode": "1803",
    "level": "User",
    "username": "KC1803",
    "password": "4001CG"
  },
  {
    "unitKerja": "Cabang Makale",
    "kode": "1809",
    "level": "User",
    "username": "KC1809",
    "password": "3917PQ"
  },
  {
    "unitKerja": "Cabang Palopo",
    "kode": "1808",
    "level": "User",
    "username": "KC1808",
    "password": "9891YX"
  },
  {
    "unitKerja": "Cabang Parepare",
    "kode": "1806",
    "level": "User",
    "username": "KC1806",
    "password": "3544JS"
  },
  {
    "unitKerja": "Cabang Watampone",
    "kode": "1804",
    "level": "User",
    "username": "KC1804",
    "password": "5513ZP"
  },
  {
    "unitKerja": "Cabang Polewali",
    "kode": "1807",
    "level": "User",
    "username": "KC1807",
    "password": "8756QP"
  },
  {
    "unitKerja": "Cabang Mamuju",
    "kode": "1805",
    "level": "User",
    "username": "KC1805",
    "password": "8054IV"
  },
  {
    "unitKerja": "Cabang Kendari",
    "kode": "1901",
    "level": "User",
    "username": "KC1901",
    "password": "4890PN"
  },
  {
    "unitKerja": "Cabang Baubau",
    "kode": "1902",
    "level": "User",
    "username": "KC1902",
    "password": "9076LL"
  },
  {
    "unitKerja": "Cabang Ambon",
    "kode": "2501",
    "level": "User",
    "username": "KC2501",
    "password": "3549YU"
  },
  {
    "unitKerja": "Cabang Manado",
    "kode": "2101",
    "level": "User",
    "username": "KC2101",
    "password": "8700HZ"
  },
  {
    "unitKerja": "Cabang Tondano",
    "kode": "2103",
    "level": "User",
    "username": "KC2103",
    "password": "8448CP"
  },
  {
    "unitKerja": "Cabang Palu",
    "kode": "2001",
    "level": "User",
    "username": "KC2001",
    "password": "5932WX"
  },
  {
    "unitKerja": "Cabang Luwuk",
    "kode": "2002",
    "level": "User",
    "username": "KC2002",
    "password": "1995FB"
  },
  {
    "unitKerja": "Cabang Gorontalo",
    "kode": "2102",
    "level": "User",
    "username": "KC2102",
    "password": "1649PA"
  },
  {
    "unitKerja": "Cabang Ternate",
    "kode": "2503",
    "level": "User",
    "username": "KC2503",
    "password": "9777HO"
  },
  {
    "unitKerja": "Cabang Denpasar",
    "kode": "2201",
    "level": "User",
    "username": "KC2201",
    "password": "7155IK"
  },
  {
    "unitKerja": "Cabang Klungkung",
    "kode": "2202",
    "level": "User",
    "username": "KC2202",
    "password": "7846VR"
  },
  {
    "unitKerja": "Cabang Singaraja",
    "kode": "2203",
    "level": "User",
    "username": "KC2203",
    "password": "8503BY"
  },
  {
    "unitKerja": "Cabang Kupang",
    "kode": "2401",
    "level": "User",
    "username": "KC2401",
    "password": "9807DV"
  },
  {
    "unitKerja": "Cabang Maumere",
    "kode": "2403",
    "level": "User",
    "username": "KC2403",
    "password": "1943NI"
  },
  {
    "unitKerja": "Cabang Waingapu",
    "kode": "2405",
    "level": "User",
    "username": "KC2405",
    "password": "7638CF"
  },
  {
    "unitKerja": "Cabang Atambua",
    "kode": "2407",
    "level": "User",
    "username": "KC2407",
    "password": "3657BY"
  },
  {
    "unitKerja": "Cabang Ende",
    "kode": "2404",
    "level": "User",
    "username": "KC2404",
    "password": "8563TB"
  },
  {
    "unitKerja": "Cabang Mataram",
    "kode": "2301",
    "level": "User",
    "username": "KC2301",
    "password": "8739CC"
  },
  {
    "unitKerja": "Cabang Selong",
    "kode": "2406",
    "level": "User",
    "username": "KC2406",
    "password": "2378KP"
  },
  {
    "unitKerja": "Cabang Bima",
    "kode": "2302",
    "level": "User",
    "username": "KC2302",
    "password": "7019NI"
  },
  {
    "unitKerja": "Cabang Jayapura",
    "kode": "2601",
    "level": "User",
    "username": "KC2601",
    "password": "6195UN"
  },
  {
    "unitKerja": "Cabang Biak Numfor",
    "kode": "2603",
    "level": "User",
    "username": "KC2603",
    "password": "7471ID"
  },
  {
    "unitKerja": "Cabang Merauke",
    "kode": "2604",
    "level": "User",
    "username": "KC2604",
    "password": "4631FZ"
  },
  {
    "unitKerja": "Cabang Wamena",
    "kode": "2606",
    "level": "User",
    "username": "KC2606",
    "password": "5580ZV"
  },
  {
    "unitKerja": "Cabang Sorong",
    "kode": "2602",
    "level": "User",
    "username": "KC2602",
    "password": "1005KU"
  },
  {
    "unitKerja": "Cabang Manokwari",
    "kode": "2605",
    "level": "User",
    "username": "KC2605",
    "password": "2210KG"
  }
];

export const SHEET_URL = 'https://docs.google.com/spreadsheets/d/1MjFAlH-fl2Y5acLWgNqQcX6E7nYfEol2gi6bHHfvH0U/edit?usp=sharing';

/**
 * Akun Khusus Baris A28:E39 (Kedeputian Wilayah I s/d XII - Level User)
 */
export const USER_A28_E39: UserPetaCC[] = [
  {
    "unitKerja": "Kedeputian Wilayah I",
    "kode": "0100",
    "level": "User",
    "username": "KW0100",
    "password": "8001GP"
  },
  {
    "unitKerja": "Kedeputian Wilayah II",
    "kode": "0200",
    "level": "User",
    "username": "KW0200",
    "password": "7557KS"
  },
  {
    "unitKerja": "Kedeputian Wilayah III",
    "kode": "0300",
    "level": "User",
    "username": "KW0300",
    "password": "9485UX"
  },
  {
    "unitKerja": "Kedeputian Wilayah IV",
    "kode": "0400",
    "level": "User",
    "username": "KW0400",
    "password": "6319FC"
  },
  {
    "unitKerja": "Kedeputian Wilayah V",
    "kode": "0500",
    "level": "User",
    "username": "KW0500",
    "password": "6728EI"
  },
  {
    "unitKerja": "Kedeputian Wilayah VI",
    "kode": "0600",
    "level": "User",
    "username": "KW0600",
    "password": "7558EN"
  },
  {
    "unitKerja": "Kedeputian Wilayah VII",
    "kode": "0700",
    "level": "User",
    "username": "KW0700",
    "password": "5914HD"
  },
  {
    "unitKerja": "Kedeputian Wilayah VIII",
    "kode": "0800",
    "level": "User",
    "username": "KW0800",
    "password": "4120RK"
  },
  {
    "unitKerja": "Kedeputian Wilayah IX",
    "kode": "0900",
    "level": "User",
    "username": "KW0900",
    "password": "4534BA"
  },
  {
    "unitKerja": "Kedeputian Wilayah X",
    "kode": "1000",
    "level": "User",
    "username": "KW1000",
    "password": "3442FS"
  },
  {
    "unitKerja": "Kedeputian Wilayah XI",
    "kode": "1100",
    "level": "User",
    "username": "KW1100",
    "password": "6023GF"
  },
  {
    "unitKerja": "Kedeputian Wilayah XII",
    "kode": "1200",
    "level": "User",
    "username": "KW1200",
    "password": "1104GU"
  }
];

/**
 * Akun Khusus Baris A4:E6 (Level User)
 */
export const USER_A4_E6 = {
  spi: {
    unitKerja: 'Satuan Pengawasan Internal',
    kode: '0011',
    level: 'User' as UserLevel,
    username: 'SPI0011',
    password: '8711ZR'
  },
  sesban: {
    unitKerja: 'Sekretaris Badan',
    kode: '0012',
    level: 'User' as UserLevel,
    username: 'SESBAN0012',
    password: '1077CX'
  },
  sesdewas: {
    unitKerja: 'Sekretaris Dewan Pengawas',
    kode: '0013',
    level: 'User' as UserLevel,
    username: 'SESDEWAS0013',
    password: '4321AL'
  }
};

/**
 * Mencari pengguna berdasarkan username (case-insensitive) dan password (case-sensitive)
 */
export function authenticateUser(usernameInput: string, passwordInput: string, customUsers?: UserPetaCC[]): UserPetaCC | null {
  const cleanUser = usernameInput.trim().toUpperCase();
  const cleanPass = passwordInput.trim();
  
  const userList = customUsers && customUsers.length > 0 ? customUsers : USERS_PETA_CC;
  
  const found = userList.find(
    (u) => u.username.trim().toUpperCase() === cleanUser && u.password.trim() === cleanPass
  );

  return found || null;
}

/**
 * Mengambil data pengguna terbaru secara live dari Google Spreadsheet sheet "User PETA CC"
 */
export async function fetchLiveUsersFromSheet(): Promise<UserPetaCC[]> {
  const gvizUrl = 'https://docs.google.com/spreadsheets/d/1MjFAlH-fl2Y5acLWgNqQcX6E7nYfEol2gi6bHHfvH0U/gviz/tq?tqx=out:json&sheet=User%20PETA%20CC&headers=0';
  
  try {
    const response = await fetch(gvizUrl);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const text = await response.text();
    const match = text.match(/google\.visualization\.Query\.setResponse\((.*)\);/s);
    if (!match || !match[1]) throw new Error('Format respon Google Sheet tidak valid');
    
    const data = JSON.parse(match[1]);
    const rows = data.table?.rows || [];
    if (rows.length <= 1) return USERS_PETA_CC;
    
    const parsedUsers: UserPetaCC[] = [];
    // Baris 0 adalah header tabel
    for (let i = 1; i < rows.length; i++) {
      const r = rows[i];
      const c = r.c || [];
      const unitKerja = c[0]?.v ? String(c[0].v).trim() : '';
      const kode = c[1]?.v ? String(c[1].v).trim() : '';
      const rawLevel = c[2]?.v ? String(c[2].v).trim() : 'User';
      const level: UserLevel = rawLevel.toLowerCase() === 'administrator' ? 'Administrator' : 'User';
      const username = c[3]?.v ? String(c[3].v).trim() : '';
      const password = c[4]?.v ? String(c[4].v).trim() : '';

      if (username && password) {
        parsedUsers.push({
          unitKerja,
          kode,
          level,
          username,
          password
        });
      }
    }

    if (parsedUsers.length > 0) {
      return parsedUsers;
    }
    return USERS_PETA_CC;
  } catch (error) {
    console.warn('Gagal memuat pengguna live dari Google Sheet, menggunakan data terintegrasi:', error);
    return USERS_PETA_CC;
  }
}
