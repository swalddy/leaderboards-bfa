<script setup lang="ts">
import { BarChart3, Flame } from 'lucide-vue-next'
import type { LeaderboardEntry, LeaderboardStats } from '~/types/leaderboard'

defineProps<{
  stats: LeaderboardStats
  tickerEntries: LeaderboardEntry[]
}>()

type OverviewTab = 'stats' | 'hot'

const rootRef = ref<HTMLElement | null>(null)
const statsPanelRef = ref<HTMLElement | null>(null)
const hotPanelRef = ref<HTMLElement | null>(null)
const { scaleIn, staggerIn, fadeSlideUp, runAfterPaint } = useLeaderboardAnimations()

const activeTab = ref<OverviewTab>('stats')

const tabs: { id: OverviewTab, label: string, icon: typeof BarChart3 }[] = [
  { id: 'stats', label: 'Statistik', icon: BarChart3 },
  { id: 'hot', label: 'Hot Performers', icon: Flame },
]

function animateActivePanel(tab: OverviewTab) {
  nextTick(() => {
    const panel = tab === 'stats' ? statsPanelRef.value : hotPanelRef.value
    if (!panel) return
    fadeSlideUp(panel, { y: 10, duration: 0.35 })
    staggerIn(panel, '[data-stat-card], [data-ticker-card]', {
      y: 14,
      stagger: 0.04,
      duration: 0.45,
      delay: 0.1,
    })
  })
}

watch(activeTab, (tab) => {
  animateActivePanel(tab)
})

runAfterPaint(() => {
  if (rootRef.value) {
    scaleIn(rootRef.value.querySelector('[data-overview-card]'), {
      delay: 0.25,
      scale: 0.96,
      duration: 0.6,
    })
  }
  animateActivePanel('stats')
})
</script>

<template>
  <section
    ref="rootRef"
    aria-label="Challenge overview"
    class="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8"
  >
    <div
      data-overview-card
      class="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-soft"
    >
      <div
        class="flex border-b border-slate-100"
        role="tablist"
        aria-label="Overview sections"
      >
        <button
          v-for="tab in tabs"
          :key="tab.id"
          type="button"
          role="tab"
          class="flex flex-1 cursor-pointer items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-semibold transition-all duration-200 sm:text-sm"
          :class="activeTab === tab.id
            ? 'border-b-2 border-kalbe-green bg-kalbe-mint/40 text-kalbe-green-deep'
            : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'"
          :aria-selected="activeTab === tab.id"
          @click="activeTab = tab.id"
        >
          <component :is="tab.icon" class="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden="true" />
          {{ tab.label }}
        </button>
      </div>

      <div class="p-3 sm:p-4">
        <div
          v-show="activeTab === 'stats'"
          ref="statsPanelRef"
          role="tabpanel"
          aria-label="Statistics"
        >
          <LeaderboardStats :stats="stats" embedded />
        </div>

        <div
          v-show="activeTab === 'hot'"
          ref="hotPanelRef"
          role="tabpanel"
          aria-label="Hot performers"
        >
          <LeaderboardTicker :entries="tickerEntries" embedded />
        </div>
      </div>
    </div>
  </section>
</template>
