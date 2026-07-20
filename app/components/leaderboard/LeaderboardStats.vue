<script setup lang="ts">
import { Users, Flame, TrendingUp, Activity } from 'lucide-vue-next'
import type { LeaderboardStats } from '~/types/leaderboard'
import { formatCalories } from '~/utils/leaderboard'

const props = defineProps<{
  stats: LeaderboardStats
  embedded?: boolean
}>()

const cards = computed(() => [
  {
    key: 'total',
    label: 'Participants',
    value: props.stats.totalParticipants,
    icon: Users,
    glow: 'lb-card--green',
    iconClass: 'text-green-500',
    valueClass: 'lb-stat-green',
    format: 'number',
  },
  {
    key: 'average',
    label: 'Avg. Calories',
    value: props.stats.averageCalories,
    icon: TrendingUp,
    glow: 'lb-card--sky',
    iconClass: 'text-sky-600',
    valueClass: 'lb-stat-sky',
    format: 'calories',
  },
  {
    key: 'total-cal',
    label: "Today's Total",
    value: props.stats.totalCalories,
    icon: Flame,
    glow: 'lb-card--orange',
    iconClass: 'text-amber-500',
    valueClass: 'lb-stat-orange',
    format: 'calories',
  },
  {
    key: 'male',
    label: 'Male',
    value: props.stats.maleParticipants,
    icon: Activity,
    glow: 'lb-card--blue',
    iconClass: 'text-blue-600',
    valueClass: 'lb-stat-blue',
    format: 'number',
  },
])

function formatValue(value: number, format: string) {
  return format === 'calories' ? formatCalories(value) : value.toLocaleString('en-US')
}
</script>

<template>
  <section
    :aria-labelledby="embedded ? undefined : 'stats-heading'"
    :class="embedded ? '' : 'mx-auto w-full max-w-7xl px-3 sm:px-5 lg:px-6'"
  >
    <h2 v-if="!embedded" id="stats-heading" class="sr-only">
      Challenge overview
    </h2>

    <div class="grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-3">
      <article
        v-for="(card, index) in cards"
        :key="card.key"
        data-stat-card
        class="lb-card group relative overflow-hidden rounded-2xl px-4 py-4 opacity-0 shadow-sm transition-all duration-300 ease-out hover:scale-[1.02] hover:shadow-lg motion-safe:animate-[lb-stat-enter_600ms_ease-out_forwards] sm:px-4 sm:py-4"
        :class="card.glow"
        :style="{ animationDelay: `${index * 80}ms` }"
      >
        <div class="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent" />
        <div class="flex items-start gap-3">
          <div class="mt-0.5 shrink-0 rounded-xl bg-slate-50 p-2 ring-1 ring-slate-200 transition-all duration-300 group-hover:bg-green-50 group-hover:ring-green-100">
            <component :is="card.icon" class="h-5 w-5" :class="card.iconClass" aria-hidden="true" />
          </div>
          <div class="min-w-0">
            <p class="truncate text-[10px] font-medium uppercase tracking-wide text-slate-500 sm:text-2xs">
              {{ card.label }}
            </p>
            <p class="font-display text-xl font-bold leading-tight tabular-nums sm:text-2xl" :class="card.valueClass">
              {{ formatValue(card.value, card.format) }}
            </p>
          </div>
        </div>
      </article>
    </div>
  </section>
</template>
