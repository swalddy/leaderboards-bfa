<script setup lang="ts">
import type { LeaderboardEntry } from '~/types/leaderboard'
import { COMPANY_SHORT_LABELS, type AllowedCompany } from '~/constants/leaderboard'
import { avatarColorFromName, formatCalories, getInitials, isDeveloperEmployee } from '~/utils/leaderboard'

const props = defineProps<{ entry: LeaderboardEntry }>()

const isDeveloper = computed(() => isDeveloperEmployee(props.entry.employeeName))
const initials = computed(() => getInitials(props.entry.employeeName))
const avatarBg = computed(() => avatarColorFromName(props.entry.employeeName))

const companyShort = computed(() => {
  if (props.entry.company in COMPANY_SHORT_LABELS)
    return COMPANY_SHORT_LABELS[props.entry.company as AllowedCompany]
  return props.entry.company
})

const gapLabel = computed(() => {
  if (props.entry.gapFromPrevious == null) return null
  if (props.entry.gapFromPrevious === 0) return 'Tied'
  return `−${formatCalories(props.entry.gapFromPrevious)}`
})

const accentBar = computed(() => {
  if (props.entry.rank === 1) return 'bg-gradient-to-b from-amber-300 via-yellow-300 to-amber-500 shadow-[0_0_14px_rgba(251,191,36,0.55)]'
  if (props.entry.rank === 2) return 'bg-gradient-to-b from-slate-300 via-slate-400 to-slate-500 shadow-[0_0_10px_rgba(148,163,184,0.35)]'
  if (props.entry.rank === 3) return 'bg-gradient-to-b from-orange-300 via-orange-400 to-orange-500 shadow-[0_0_10px_rgba(251,146,60,0.4)]'
  return ''
})
</script>

<template>
  <article
    data-list-row
    class="group relative flex items-center gap-3 overflow-hidden px-3 py-3 transition-all duration-300 ease-out hover:z-10 hover:scale-[1.005] hover:bg-slate-50 sm:gap-4 sm:px-4 sm:py-3.5"
    :class="[
      entry.rank === 1 && 'bg-gradient-to-r from-amber-50/90 via-white to-white shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_12px_30px_rgba(245,158,11,0.08)]',
      entry.rank === 2 && 'bg-gradient-to-r from-slate-50/90 via-white to-white shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_10px_24px_rgba(100,116,139,0.06)]',
      entry.rank === 3 && 'bg-gradient-to-r from-orange-50/90 via-white to-white shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_10px_24px_rgba(251,146,60,0.06)]',
    ]"
    :aria-label="`Rank ${entry.rank}, ${entry.employeeName.trim()}, ${entry.currentPoints} calories`"
  >
    <div
      class="pointer-events-none absolute inset-y-0 left-0 w-1/3 -translate-x-full bg-gradient-to-r from-transparent via-white/80 to-transparent opacity-0 transition-opacity duration-300 group-hover:animate-[lb-row-shimmer_900ms_ease-out] group-hover:opacity-100"
      aria-hidden="true"
    />
    <div
      v-if="entry.rank <= 3"
      class="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      :class="entry.rank === 1 ? 'bg-[radial-gradient(circle_at_top_left,rgba(251,191,36,0.12),transparent_35%)]' : entry.rank === 2 ? 'bg-[radial-gradient(circle_at_top_left,rgba(148,163,184,0.10),transparent_35%)]' : 'bg-[radial-gradient(circle_at_top_left,rgba(251,146,60,0.10),transparent_35%)]'"
      aria-hidden="true"
    />
    <!-- Left accent bar top 3 -->
    <div
      v-if="entry.rank <= 3"
      class="absolute inset-y-0 left-0 w-1 rounded-r-full"
      :class="accentBar"
      aria-hidden="true"
    />

    <!-- Rank -->
    <div class="w-7 shrink-0 text-center sm:w-8">
      <LeaderboardRankBadge :rank="entry.rank" size="sm" />
    </div>

    <!-- Avatar -->
    <div
      class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white shadow-sm ring-2 ring-white transition-transform duration-300 group-hover:scale-105 sm:h-9 sm:w-9 sm:text-xs"
      :class="entry.rank === 1 ? 'shadow-[0_0_18px_rgba(251,191,36,0.28)] ring-amber-200' : entry.rank === 2 ? 'shadow-[0_0_14px_rgba(148,163,184,0.18)] ring-slate-200' : entry.rank === 3 ? 'shadow-[0_0_14px_rgba(251,146,60,0.18)] ring-orange-200' : ''"
      :style="{ background: avatarBg }"
      aria-hidden="true"
    >
      {{ initials }}
    </div>

    <!-- Name + meta -->
    <div class="min-w-0 flex-1">
      <div class="flex flex-wrap items-center gap-x-1.5 gap-y-0.5">
        <LeaderboardEmployeeName :name="entry.employeeName" class="text-[13px] leading-snug [&_span]:!text-slate-900" />
        <span
          v-if="isDeveloper"
          class="inline-flex items-center rounded-md bg-sky-50 px-1.5 py-0.5 text-[9px] font-semibold text-sky-600 ring-1 ring-sky-200"
        >IT</span>
      </div>
      <p class="mt-0.5 truncate text-[10px] text-slate-500">
        {{ companyShort }} · {{ entry.category }}
      </p>
      <div class="mt-1.5">
        <LeaderboardProgressBar
          :percent="entry.percentOfLeader"
          :class="entry.rank <= 3 ? 'shadow-[0_0_18px_rgba(34,197,94,0.14)]' : ''"
        />
      </div>
    </div>

    <!-- Score -->
    <div class="shrink-0 text-right">
      <div
        class="inline-flex items-center gap-1 rounded-full px-2 py-1 shadow-sm"
        :class="entry.rank === 1 ? 'bg-amber-100 text-amber-700 shadow-[0_0_0_1px_rgba(251,191,36,0.15)]' : entry.rank === 2 ? 'bg-slate-100 text-slate-700 shadow-[0_0_0_1px_rgba(148,163,184,0.12)]' : entry.rank === 3 ? 'bg-orange-100 text-orange-700 shadow-[0_0_0_1px_rgba(251,146,60,0.12)]' : 'bg-slate-50 text-green-600'"
      >
        <p class="font-display text-sm font-bold tabular-nums sm:text-base">
          {{ formatCalories(entry.currentPoints) }}
        </p>
      </div>
      <p class="text-[9px] text-slate-400 sm:text-[10px]">
        <span v-if="gapLabel" class="text-slate-400">{{ gapLabel }} · </span>kcal
      </p>
    </div>
  </article>
</template>
