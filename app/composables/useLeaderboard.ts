import {
  COMPANY_SHORT_LABELS,
  REFRESH_INTERVAL_MS,
  type CompanySlug,
} from '~/constants/leaderboard'
import type {
  CompanyFilter,
  GenderFilter,
  LeaderboardApiResponse,
  LeaderboardLoadStage,
  SortBy,
} from '~/types/leaderboard'
import {
  companyShortLabel,
  resolveCompanyFromSlug,
} from '~/utils/companies'
import {
  applyCompanyFilter,
  applyGenderFilter,
  applyNameAllowlist,
  computeStats,
  enrichEntries,
  filterByAllowedCompanies,
  parseRow,
  processLeaderboard,
  recalculateRanks,
  applySearch,
} from '~/utils/leaderboard'

function sleep(ms: number) {
  return new Promise<void>(resolve => setTimeout(resolve, ms))
}

async function runInitialProgressRamp(
  setProgress: (value: number) => void,
  setStage: (stage: LeaderboardLoadStage) => void,
) {
  setProgress(0)
  setStage('connecting')
  await sleep(550)

  setProgress(6)
  await sleep(400)

  setStage('fetching')
  setProgress(14)
  await sleep(350)

  setProgress(22)
  await sleep(300)

  setProgress(30)
}

export interface UseLeaderboardOptions {
  companySlug?: CompanySlug
  nameAllowlist?: readonly string[]
  companyLabelOverride?: string
  stateKey?: string
}

export function useLeaderboard(options: UseLeaderboardOptions) {
  const { companySlug, nameAllowlist, companyLabelOverride, stateKey } = options
  const isCompanyLocked = companySlug !== undefined
  const lockedCompany = companySlug ? resolveCompanyFromSlug(companySlug) : undefined
  const filterStateKey = stateKey ?? companySlug ?? 'all'

  const genderFilter = useState<GenderFilter>(`lb-gender-${filterStateKey}`, () => 'all')
  const companyFilter = useState<CompanyFilter>(
    `lb-company-${filterStateKey}`,
    () => (isCompanyLocked ? lockedCompany! : 'all'),
  )
  const searchQuery = useState<string>(`lb-search-${filterStateKey}`, () => '')
  const sortBy = useState<SortBy>(`lb-sort-${filterStateKey}`, () => 'points')

  const companyLabel = computed(() => {
    if (companyLabelOverride) return companyLabelOverride
    if (isCompanyLocked && companySlug) return companyShortLabel(companySlug)
    const filter = companyFilter.value
    if (filter === 'all') return 'Biopharma'
    return COMPANY_SHORT_LABELS[filter] ?? filter
  })
  const lastUpdatedAt = useState<Date | null>('lb-updated', () => null)
  const loadProgress = ref(0)
  const loadStage = ref<LeaderboardLoadStage>('idle')

  const { data, pending, error, refresh, status } = useAsyncData(
    'leaderboard',
    async () => {
      loadProgress.value = 0
      loadStage.value = 'connecting'

      let maleResolved = false
      let femaleResolved = false

      function bumpFetchProgress() {
        if (maleResolved && femaleResolved) loadProgress.value = Math.max(loadProgress.value, 68)
        else if (maleResolved || femaleResolved) loadProgress.value = Math.max(loadProgress.value, 48)
      }

      const fetchPromise = Promise.all([
        $fetch<LeaderboardApiResponse>('/api/leaderboard/male', { timeout: 60_000 })
          .then((response) => {
            maleResolved = true
            bumpFetchProgress()
            return response
          }),
        $fetch<LeaderboardApiResponse>('/api/leaderboard/female', { timeout: 60_000 })
          .then((response) => {
            femaleResolved = true
            bumpFetchProgress()
            return response
          }),
      ])

      await runInitialProgressRamp(
        (value) => { loadProgress.value = value },
        (stage) => { loadStage.value = stage },
      )

      const [male, female] = await fetchPromise

      loadStage.value = 'processing'
      loadProgress.value = Math.max(loadProgress.value, 84)

      const maleEntries = (male.data ?? []).map(row => parseRow(row, 'male'))
      const femaleEntries = (female.data ?? []).map(row => parseRow(row, 'female'))
      const all = [...maleEntries, ...femaleEntries]
      const base = filterByAllowedCompanies(all)

      loadProgress.value = 94
      lastUpdatedAt.value = new Date()
      await sleep(200)
      loadProgress.value = 100
      loadStage.value = 'complete'

      return { base }
    },
    {
      server: false,
      lazy: false,
    },
  )

  // Auto-refresh every 60s (client only)
  onMounted(() => {
    const { pause, resume } = useIntervalFn(() => {
      refresh()
    }, REFRESH_INTERVAL_MS, { immediate: false })

    resume()

    useEventListener(document, 'visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        refresh()
        resume()
      }
      else {
        pause()
      }
    })
  })

  const baseEntries = computed(() => data.value?.base ?? [])

  const hasLoaded = computed(() => data.value !== null && data.value !== undefined)
  const isLoading = computed(() => !hasLoaded.value && !error.value)
  const hasError = computed(() => !!error.value)

  // When company is locked, always enforce the locked value
  watch(companyFilter, (val) => {
    if (isCompanyLocked && lockedCompany && val !== lockedCompany) {
      companyFilter.value = lockedCompany
    }
  })

  const filteredBeforeSearch = computed(() => {
    let result = [...baseEntries.value]
    result = applyCompanyFilter(result, companyFilter.value)
    result = applyNameAllowlist(result, nameAllowlist)
    result = applyGenderFilter(result, genderFilter.value)
    return recalculateRanks(result)
  })

  // Company-only scope (ignore gender tab) so Male/Female metrics stay per-company
  const companyScopedEntries = computed(() => {
    let result = applyCompanyFilter(baseEntries.value, companyFilter.value)
    result = applyNameAllowlist(result, nameAllowlist)
    return result
  })

  const filteredEntries = computed(() => {
    return processLeaderboard(baseEntries.value, {
      gender: genderFilter.value,
      company: companyFilter.value,
      search: searchQuery.value,
      sortBy: sortBy.value,
      nameAllowlist,
    })
  })

  const topThree = computed(() => {
    const ranked = filteredBeforeSearch.value
    const searched = applySearch(ranked, searchQuery.value)
    return enrichEntries(recalculateRanks(searched)).slice(0, 3)
  })

  const restEntries = computed(() => {
    const topKeys = new Set(topThree.value.map(e => `${e.gender}-${e.employeeId}`))
    return filteredEntries.value.filter(e => !topKeys.has(`${e.gender}-${e.employeeId}`))
  })

  const stats = computed(() =>
    computeStats(companyScopedEntries.value, filteredBeforeSearch.value),
  )

  const isEmpty = computed(
    () => hasLoaded.value && filteredEntries.value.length === 0,
  )

  watch(error, (err) => {
    if (err) {
      loadStage.value = 'error'
      loadProgress.value = 100
    }
  })

  return {
    companySlug,
    companyLabel,
    companyFullName: lockedCompany,
    isCompanyLocked,
    genderFilter,
    companyFilter,
    searchQuery,
    sortBy,
    lastUpdatedAt,
    pending,
    error,
    status,
    refresh,
    baseEntries,
    filteredEntries,
    topThree,
    restEntries,
    stats,
    isEmpty,
    hasError,
    hasLoaded,
    isLoading,
    loadProgress,
    loadStage,
  }
}

export type UseLeaderboardReturn = ReturnType<typeof useLeaderboard>
