<script setup lang="ts">
import {
  Users,
  ChartNoAxesColumn,
  Mars,
  Venus,
} from 'lucide-vue-next'
import type { LeaderboardStats } from '~/types/leaderboard'

const props = defineProps<{
  stats: LeaderboardStats
  embedded?: boolean
}>()

const cards = computed(() => [
  { key: 'total', label: 'Participants', value: props.stats.totalParticipants, icon: Users, bg: 'bg-emerald-50', tone: 'text-kalbe-green' },
  { key: 'average', label: 'Average', value: props.stats.averageCalories, icon: ChartNoAxesColumn, bg: 'bg-sky-50', tone: 'text-sky-600' },
  { key: 'male', label: 'Male', value: props.stats.maleParticipants, icon: Mars, bg: 'bg-blue-50', tone: 'text-blue-600' },
  { key: 'female', label: 'Female', value: props.stats.femaleParticipants, icon: Venus, bg: 'bg-pink-50', tone: 'text-pink-600' },
])
</script>

<template>
  <section
    :aria-labelledby="embedded ? undefined : 'stats-heading'"
    :class="embedded ? '' : 'mx-auto w-full max-w-7xl px-3 sm:px-5 lg:px-6'"
  >
    <h2 v-if="!embedded" id="stats-heading" class="sr-only">
      Challenge overview
    </h2>

    <div class="grid grid-cols-2 gap-1.5 sm:grid-cols-4 sm:gap-2">
      <article
        v-for="card in cards"
        :key="card.key"
        data-stat-card
        class="flex items-center gap-1.5 rounded-lg border border-slate-100 bg-slate-50/50 px-2 py-1.5 sm:gap-2 sm:px-2"
      >
        <div
          class="flex h-7 w-7 shrink-0 items-center justify-center rounded-md sm:h-7 sm:w-7"
          :class="[card.bg, card.tone]"
        >
          <component :is="card.icon" class="h-3.5 w-3.5 sm:h-3.5 sm:w-3.5" aria-hidden="true" />
        </div>
        <div class="min-w-0">
          <p class="truncate text-[10px] font-medium leading-tight text-slate-400 sm:text-2xs">
            {{ card.label }}
          </p>
          <p class="stat-value text-sm text-kalbe-green-dark sm:text-sm">
            <LeaderboardAnimatedCounter :value="card.value" />
          </p>
        </div>
      </article>
    </div>
  </section>
</template>
