<script setup lang="ts">
import { Search, X, SlidersHorizontal } from 'lucide-vue-next'
import { ALLOWED_COMPANIES, COMPANY_SHORT_LABELS } from '~/constants/leaderboard'
import type { CompanyFilter, GenderFilter, SortBy } from '~/types/leaderboard'

withDefaults(defineProps<{ hideCompanyFilter?: boolean }>(), { hideCompanyFilter: false })

const genderFilter = defineModel<GenderFilter>('gender', { required: true })
const companyFilter = defineModel<CompanyFilter>('company')
const searchQuery = defineModel<string>('search', { required: true })
const sortBy = defineModel<SortBy>('sort', { required: true })

const rootRef = ref<HTMLElement | null>(null)
const { scaleIn, runAfterPaint } = useLeaderboardAnimations()

const localSearch = ref(searchQuery.value)
const debounced = useDebounceFn((v: string) => { searchQuery.value = v }, 200)

watch(localSearch, v => debounced(v))
watch(searchQuery, (v) => { if (v !== localSearch.value) localSearch.value = v })

const genderOptions: { value: GenderFilter, label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
]

const companyOptions: { value: CompanyFilter, label: string }[] = [
  { value: 'all', label: 'All' },
  ...ALLOWED_COMPANIES.map(c => ({ value: c, label: COMPANY_SHORT_LABELS[c] })),
]

const sortOptions: { value: SortBy, label: string }[] = [
  { value: 'points', label: 'Calories' },
  { value: 'alpha', label: 'A–Z' },
  { value: 'rank', label: 'Rank' },
]

function clearSearch() {
  localSearch.value = ''
  searchQuery.value = ''
}

runAfterPaint(() => {
  if (!rootRef.value) return
  scaleIn(rootRef.value.querySelector('[data-filter-bar]'), { delay: 0.15, scale: 0.97, duration: 0.55 })
})
</script>

<template>
  <section
    ref="rootRef"
    aria-labelledby="filter-heading"
    class="sticky top-[52px] z-30 mx-auto w-full max-w-7xl px-3 sm:top-[57px] sm:px-5 lg:px-6"
  >
    <h2 id="filter-heading" class="sr-only">Filter and sort leaderboard</h2>

    <div data-filter-bar class="lb-filter overflow-hidden rounded-2xl">
      <!-- Row 1: Gender + Search + Sort -->
      <div class="flex items-center gap-2 px-3 py-2.5 sm:gap-2.5 sm:px-3.5">
        <!-- Gender segmented -->
        <div class="flex items-center gap-0.5 rounded-xl bg-slate-100 p-0.5" role="group" aria-label="Gender filter">
          <button
            v-for="option in genderOptions"
            :key="option.value"
            type="button"
            class="flex-1 cursor-pointer rounded-md px-3 py-1 text-xs font-medium transition-all duration-200 sm:flex-none sm:px-2.5"
            :class="genderFilter === option.value
              ? 'bg-green-500 text-white shadow-sm shadow-green-500/30'
              : 'text-slate-500 hover:bg-white hover:text-slate-900'"
            :aria-pressed="genderFilter === option.value"
            @click="genderFilter = option.value"
          >
            {{ option.label }}
          </button>
        </div>

        <div class="ml-auto flex items-center gap-2">
          <!-- Search -->
          <div class="relative">
            <Search class="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" aria-hidden="true" />
            <input
              id="employee-search"
              v-model="localSearch"
              type="search"
              placeholder="Search…"
              class="lb-input w-32 rounded-xl py-1.5 pl-8 pr-7 text-xs transition-all duration-200 focus:w-44 sm:w-36 lg:w-48"
              autocomplete="off"
              aria-label="Search employee"
            >
            <button
              v-if="localSearch"
              type="button"
              class="absolute right-2 top-1/2 flex h-4 w-4 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full text-slate-400 hover:text-slate-600"
              aria-label="Clear search"
              @click="clearSearch"
            >
              <X class="h-2.5 w-2.5" />
            </button>
          </div>

          <!-- Sort -->
          <div class="relative shrink-0">
            <SlidersHorizontal class="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" aria-hidden="true" />
            <select
              id="sort-by"
              v-model="sortBy"
              class="lb-input cursor-pointer appearance-none rounded-xl py-1.5 pl-8 pr-6 text-xs font-medium"
              aria-label="Sort by"
            >
              <option v-for="option in sortOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <!-- Row 2: Company tabs -->
      <div
        v-if="!hideCompanyFilter && companyFilter !== undefined"
        class="border-t border-slate-200"
      >
        <div class="flex overflow-x-auto scrollbar-none" role="group" aria-label="Filter by company">
          <button
            v-for="option in companyOptions"
            :key="option.value"
            type="button"
            class="shrink-0 cursor-pointer border-b-2 px-3.5 py-2 text-xs font-medium whitespace-nowrap transition-all duration-200"
            :class="companyFilter === option.value
              ? 'border-green-500 text-green-600'
              : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-900'"
            :aria-pressed="companyFilter === option.value"
            @click="companyFilter = option.value"
          >
            {{ option.label }}
          </button>
        </div>
      </div>
    </div>
  </section>
</template>
