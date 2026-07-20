export const ALLOWED_COMPANIES = [
  'PT Bifarma Adiluhung',
  'PT Innolab Sains Internasional',
  'PT Kalbio Global Medika',
  'Stem Cell & Cancer Institute',
  'Innogene Kalbiotech Pte Ltd',
  'PT Pharma Metric Labs',
  'PT Kalbe Genexine Biologics',
  'PT Kalgen DNA',
] as const

export type AllowedCompany = (typeof ALLOWED_COMPANIES)[number]

export const COMPANY_ROUTES = {
  BFA: 'PT Bifarma Adiluhung',
  ISI: 'PT Innolab Sains Internasional',
  KGM: 'PT Kalbio Global Medika',
  SCI: 'Stem Cell & Cancer Institute',
  IGK: 'Innogene Kalbiotech Pte Ltd',
  PML: 'PT Pharma Metric Labs',
  KGBio: 'PT Kalbe Genexine Biologics',
  KDNA: 'PT Kalgen DNA',
} as const

export type CompanySlug = keyof typeof COMPANY_ROUTES

export const COMPANY_SLUGS = Object.keys(COMPANY_ROUTES) as CompanySlug[]

export const API_URLS = {
  male: 'https://event.cause.id/kalbedonorkalori/leaderboard-top-male.php',
  female: 'https://event.cause.id/kalbedonorkalori/leaderboard-top-female.php',
} as const

export const REFRESH_INTERVAL_MS = 60_000

/** Minimum time splash stays visible so progress/enter animations are visible */
export const MIN_SPLASH_MS = 3_000

export const COMPANY_SHORT_LABELS: Record<AllowedCompany, string> = {
  'PT Bifarma Adiluhung': 'BFA',
  'PT Innolab Sains Internasional': 'ISI',
  'PT Kalbio Global Medika': 'KGM',
  'Stem Cell & Cancer Institute': 'SCI',
  'Innogene Kalbiotech Pte Ltd': 'IGK',
  'PT Pharma Metric Labs': 'PML',
  'PT Kalbe Genexine Biologics': 'KGBio',
  'PT Kalgen DNA': 'KDNA',
}

/** Label for calories calculated from heart rate data (API `total_points`). */
export const HEART_RATE_CALORIES_LABEL = 'Kalori HR'

/** Employees who get the IT badge on the leaderboard */
export const DEVELOPER_EMPLOYEE_NAMES = [
  'Daud Tri Bakti Purba',
  'Donny Christiawan',
] as const

/** Corporate Function participants shown on the Corporate IT (/corp-it) leaderboard */
export const CORP_IT_EMPLOYEE_NAMES = [
  'THEODORUS ARRY WIBOWO',
  'DADDY KADARSAN',
  'YUNI ARISANTI',
  'CHRISTINE WIDJAJA',
  'RUDI SUATDI',
  'Rini Ang',
  'Gunarto Gunarto',
  'Martin Solihin',
  'Rahmawati Ilyas',
  'DWI MUGI RAHAYU',
  'CHRISNA WILLIAM',
  'DAVID KALAM ARIANTO',
  'LIE, HERY SUTARYO',
  'AHMAD NIAMILLAH',
  'JOHAN RISHAMDANI',
  'FIRMAN LESMANA',
  'HENDRY EVANDY',
  'IR. BAMBANG WIDYAPRADHANA',
  'MIKAEL YOGA PRANANTA',
  'PRAMITHA WIDYASARI',
  'ARIO YUNANTO',
  'JOHAN DARIUS KURNIAWIDJAJA',
  'MOH ANWARI',
  'HILMAN ADITYA RAMA',
  'SANTI SAVITRI',
  'ELTA ROSINTA CHRISTINA',
  'YOHANES HOFMANN PARULIAN',
  'TEGUH MARGARETHA VALENCIA',
  'MOHAMMAD FAIZAL AMIRRUDIN',
  'YOSEP DIO DEWANTARA',
  'WAHYU EKO SUDIYATMOKO',
  'ANDRE WIRAWAN',
  'Widianty Oey',
  'LUTHFI GALANG KHARISMA',
  'AGNES CEXARIANA',
  'DANNY NATALIES',
  'RENDY TRIHERMAWAN',
  'RIZKY HARTAWAN W',
  'MOCHAMAD FACHRUDIN',
  'Mariana Saragi',
  'FAUZI RACHMAN',
  'FELIX DERMAWAN',
  'MELATI WAHYU RIZKI PRATAMI',
  'RIZKI SLAMET NUGROHO',
  'MUHAMMAD FAJAR ADYTHIA',
  'AHMAD KHOIRUL FAIZIN',
  'SENDY ARIS GUSTIANSYAH',
  'GERHARD FELIX SITORUS',
  'M. LUHUNG PANANJUNG',
  'BIANCA VIOLITA HARYANTO',
  'EMIR HAIKAL',
  'Efendi Herman',
  'FAIZ SATRIA SYUKRI',
  'ALIF EGY SEMBADA',
  'TOMMY ALEXANDER CHANDRA',
  'HENDRI KHEMIKO',
  'SALMADEA FAHIRA RISYANI',
  'GREGORIUS AGUNG NARINDRA ADITANTYO',
  'VICKY JENDRA NUGRAHA DANUR',
  'DWI YANTO',
  'ZULFIKAR RANGGADINATA',
  'HELEN ANGELICA',
  'AGUS HERMAWAN',
  'DWI HARYANTO',
  'MUHAMMAD EDO JAROT',
  'DWI RENDRAGRAHA',
  'REYHAN NATHANAEL',
  'Rhenalza Maulana Wongso',
  'HAZEL GABRIELLA SETIAWAN',
  'WILDAN NITI PARANPARA',
  'AAREY HANDOKO ZETHLINEAR ESGE',
  'LEONARDO NEVLIN DARMANTO',
  'Mutiara Rahmah',
  'MARCELINO JETSEN',
  'JUSTIN OKTOVIAN THEJASUKMANA',
  'DENNIS ALBERT LEONARDO',
  'Calvin Khian',
  'REYHAN PHILLIES WIJAYA',
  'PRIHATNO SETYOBEKTI',
  'Sunarly Sui Kiat',
] as const
