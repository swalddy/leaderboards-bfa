import { ALLOWED_COMPANIES, DEVELOPER_EMPLOYEE_NAMES } from '~/constants/leaderboard'
import type {
  CompanyFilter,
  Gender,
  GenderFilter,
  LeaderboardEntry,
  LeaderboardStats,
  RawLeaderboardRow,
  SortBy,
} from '~/types/leaderboard'

export function parseRow(row: RawLeaderboardRow, gender: Gender): Omit<LeaderboardEntry, 'rank' | 'percentOfLeader' | 'gapFromPrevious'> {
  const [, employeeName, employeeId, company, category, currentPoints, totalPoints, salesId] = row
  return {
    employeeName: employeeName.trim(),
    employeeId: String(employeeId),
    company: company.trim(),
    category: category.trim(),
    currentPoints: Number(currentPoints) || 0,
    totalPoints: Number(totalPoints) || 0,
    salesId: String(salesId),
    gender,
  }
}

export function filterByAllowedCompanies<T extends { company: string }>(entries: T[]): T[] {
  const allowed = new Set<string>(ALLOWED_COMPANIES)
  return entries.filter(entry => allowed.has(entry.company))
}

export function applyCompanyFilter<T extends { company: string }>(
  entries: T[],
  company: CompanyFilter,
): T[] {
  if (company === 'all') return entries
  return entries.filter(entry => entry.company === company)
}

export function applyGenderFilter<T extends { gender: Gender }>(
  entries: T[],
  gender: GenderFilter,
): T[] {
  if (gender === 'all') return entries
  return entries.filter(entry => entry.gender === gender)
}

export function applySearch(
  entries: LeaderboardEntry[],
  query: string,
): LeaderboardEntry[] {
  const q = query.trim().toLowerCase()
  if (!q) return entries
  return entries.filter(entry =>
    entry.employeeName.toLowerCase().includes(q)
    || entry.employeeId.toLowerCase().includes(q)
    || entry.salesId.toLowerCase().includes(q),
  )
}

export function sortEntries(entries: LeaderboardEntry[], sortBy: SortBy): LeaderboardEntry[] {
  const sorted = [...entries]
  switch (sortBy) {
    case 'alpha':
      return sorted.sort((a, b) => a.employeeName.localeCompare(b.employeeName, 'en', { sensitivity: 'base' }))
    case 'rank':
      return sorted.sort((a, b) => a.rank - b.rank)
    case 'points':
    default:
      return sorted.sort((a, b) => b.currentPoints - a.currentPoints || a.employeeName.localeCompare(b.employeeName))
  }
}

/** Assign ranks 1..n based on currentPoints descending. */
export function recalculateRanks(
  entries: Array<Omit<LeaderboardEntry, 'rank' | 'percentOfLeader' | 'gapFromPrevious'> | LeaderboardEntry>,
): LeaderboardEntry[] {
  const byPoints = [...entries].sort(
    (a, b) => b.currentPoints - a.currentPoints || a.employeeName.localeCompare(b.employeeName),
  )

  return byPoints.map((entry, index) => ({
    ...entry,
    rank: index + 1,
    percentOfLeader: 0,
    gapFromPrevious: null,
  }))
}

export function enrichEntries(entries: LeaderboardEntry[]): LeaderboardEntry[] {
  if (entries.length === 0) return []

  const leaderPoints = Math.max(...entries.map(e => e.currentPoints), 1)

  return entries.map((entry, index) => {
    const previous = index > 0 ? entries[index - 1] : null
    return {
      ...entry,
      percentOfLeader: Math.min(100, (entry.currentPoints / leaderPoints) * 100),
      gapFromPrevious: previous ? previous.currentPoints - entry.currentPoints : null,
    }
  })
}

export function processLeaderboard(
  entries: Array<Omit<LeaderboardEntry, 'rank' | 'percentOfLeader' | 'gapFromPrevious'>>,
  options: {
    gender: GenderFilter
    company: CompanyFilter
    search: string
    sortBy: SortBy
  },
): LeaderboardEntry[] {
  let result = filterByAllowedCompanies(entries)
  result = applyCompanyFilter(result, options.company)
  result = applyGenderFilter(result, options.gender)

  const ranked = recalculateRanks(result)
  const searched = applySearch(ranked, options.search)
  const sorted = sortEntries(searched, options.sortBy)

  // Keep rank from points-based ranking; enrich in display order
  return enrichEntries(sorted)
}

export function computeStats(
  companyScopedEntries: Array<{ gender: Gender, company: string, currentPoints: number }>,
  filteredBeforeSearch: Array<{ company: string, currentPoints: number }>,
): LeaderboardStats {
  // Gender counts follow the active company (not gender tab), so both stay visible and accurate
  const maleParticipants = companyScopedEntries.filter(e => e.gender === 'male').length
  const femaleParticipants = companyScopedEntries.filter(e => e.gender === 'female').length

  const points = filteredBeforeSearch.map(e => e.currentPoints)
  const totalParticipants = filteredBeforeSearch.length
  const totalCalories = points.reduce((sum, p) => sum + p, 0)
  const averageCalories = points.length
    ? Math.round(totalCalories / points.length)
    : 0

  return {
    totalParticipants,
    totalCalories,
    averageCalories,
    maleParticipants,
    femaleParticipants,
  }
}

export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase()
  return `${parts[0]![0]}${parts[parts.length - 1]![0]}`.toUpperCase()
}

export function avatarColorFromName(name: string): string {
  const hues = [142, 155, 168, 130, 175, 120, 145]
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  const hue = hues[Math.abs(hash) % hues.length]
  return `hsl(${hue} 52% 38%)`
}

export function isDeveloperEmployee(name: string): boolean {
  const normalized = name.trim()
  return (DEVELOPER_EMPLOYEE_NAMES as readonly string[]).includes(normalized)
}

export function formatCalories(value: number): string {
  return new Intl.NumberFormat('en-US').format(value)
}

export function entryKey(entry: { employeeId: string, gender: Gender }): string {
  return `${entry.gender}-${entry.employeeId}`
}
