export type Gender = 'male' | 'female'
export type GenderFilter = 'all' | Gender
export type CompanyFilter = 'all' | 'PT Agroveta Husada Dharma' | 'Corporate Function'
export type SortBy = 'points' | 'alpha' | 'rank'

export type LeaderboardLoadStage =
  | 'idle'
  | 'connecting'
  | 'fetching'
  | 'processing'
  | 'complete'
  | 'error'

/** [ranking, employee_name, employee_id, company, category, current_points, total_points, sales_id] */
export type RawLeaderboardRow = [
  number,
  string,
  string,
  string,
  string,
  number,
  number,
  string,
]

export interface LeaderboardApiResponse {
  data: RawLeaderboardRow[]
}

export interface LeaderboardEntry {
  rank: number
  employeeName: string
  employeeId: string
  company: string
  category: string
  currentPoints: number
  totalPoints: number
  salesId: string
  gender: Gender
  percentOfLeader: number
  gapFromPrevious: number | null
}

export interface LeaderboardStats {
  totalParticipants: number
  totalCalories: number
  highestCalories: number
  averageCalories: number
  companiesDisplayed: number
  maleParticipants: number
  femaleParticipants: number
}
