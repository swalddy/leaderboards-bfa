<script setup lang="ts">
import { Search, X, SlidersHorizontal } from 'lucide-vue-next'
import type { CompanyFilter, GenderFilter, SortBy } from '~/types/leaderboard'

const genderFilter = defineModel<GenderFilter>('gender', { required: true })
const companyFilter = defineModel<CompanyFilter>('company', { required: true })
const searchQuery = defineModel<string>('search', { required: true })
const sortBy = defineModel<SortBy>('sort', { required: true })

const rootRef = ref<HTMLElement | null>(null)
const { scaleIn, runAfterPaint } = useLeaderboardAnimations()

const localSearch = ref(searchQuery.value)

const debounced = useDebounceFn((value: string) => {
  searchQuery.value = value
}, 200)

watch(localSearch, (value) => {
  debounced(value)
})

watch(searchQuery, (value) => {
  if (value !== localSearch.value) localSearch.value = value
})

const genderOptions: { value: GenderFilter, label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
]

const companyOptions: { value: CompanyFilter, label: string, short: string }[] = [
  { value: 'all', label: 'All', short: 'All' },
  { value: 'PT Agroveta Husada Dharma', label: 'PT Agroveta Husada Dharma', short: 'Agroveta' },
  { value: 'Corporate Function', label: 'Corporate Function', short: 'Corporate' },
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
  scaleIn(rootRef.value.querySelector('[data-filter-bar]'), {
    delay: 0.15,
    scale: 0.97,
    duration: 0.55,
  })
})
</script>

<template>
  <section
    ref="rootRef"
    aria-labelledby="filter-heading"
    class="sticky top-[57px] z-30 mx-auto w-full max-w-7xl px-4 sm:top-[65px] sm:px-6 lg:px-8"
  >
    <h2 id="filter-heading" class="sr-only">
      Filter and sort leaderboard
    </h2>

    <div
      data-filter-bar
      class="flex flex-wrap items-center gap-2 rounded-2xl border border-slate-100 bg-white/90 px-2.5 py-2 shadow-soft backdrop-blur-xl sm:gap-2.5 sm:px-3"
    >
      <div class="flex items-center gap-0.5 rounded-xl bg-slate-50 p-0.5" role="group" aria-label="Gender filter">
        <button
          v-for="option in genderOptions"
          :key="option.value"
          type="button"
          class="cursor-pointer rounded-lg px-2.5 py-1 text-xs font-medium transition-all duration-200"
          :class="genderFilter === option.value ? 'chip-active' : 'bg-transparent text-slate-500 hover:text-kalbe-green-deep'"
          :aria-pressed="genderFilter === option.value"
          @click="genderFilter = option.value"
        >
          {{ option.label }}
        </button>
      </div>

      <div class="flex items-center gap-0.5 rounded-xl bg-slate-50 p-0.5" role="group" aria-label="Company filter">
        <button
          v-for="option in companyOptions"
          :key="option.value"
          type="button"
          class="cursor-pointer rounded-lg px-2.5 py-1 text-xs font-medium transition-all duration-200"
          :class="companyFilter === option.value ? 'chip-lime' : 'bg-transparent text-slate-500 hover:text-kalbe-green-deep'"
          :aria-pressed="companyFilter === option.value"
          :title="option.label"
          @click="companyFilter = option.value"
        >
          {{ option.short }}
        </button>
      </div>

      <div class="ml-auto flex items-center gap-1.5">
        <div class="relative">
          <Search class="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" aria-hidden="true" />
          <input
            id="employee-search"
            v-model="localSearch"
            type="search"
            placeholder="Search…"
            class="w-28 rounded-xl border-0 bg-slate-50 py-1.5 pl-8 pr-7 text-xs text-slate-700 placeholder:text-slate-400 transition-all duration-200 focus:bg-white focus:ring-2 focus:ring-kalbe-green/20 sm:w-40 lg:w-48"
            autocomplete="off"
            aria-label="Search employee"
          >
          <button
            v-if="localSearch"
            type="button"
            class="absolute right-1.5 top-1/2 flex h-4 w-4 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full text-slate-400 hover:text-slate-600"
            aria-label="Clear search"
            @click="clearSearch"
          >
            <X class="h-3 w-3" />
          </button>
        </div>

        <div class="relative">
          <SlidersHorizontal class="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" aria-hidden="true" />
          <select
            id="sort-by"
            v-model="sortBy"
            class="cursor-pointer appearance-none rounded-xl border-0 bg-slate-50 py-1.5 pl-8 pr-6 text-xs font-medium text-slate-700 transition-all duration-200 focus:bg-white focus:ring-2 focus:ring-kalbe-green/20"
            aria-label="Sort by"
          >
            <option
              v-for="option in sortOptions"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </option>
          </select>
        </div>
      </div>
    </div>
  </section>
</template>
