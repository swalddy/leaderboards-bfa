<script setup lang="ts">
import { Crown, Medal, TrendingUp } from 'lucide-vue-next'
import type { LeaderboardEntry } from '~/types/leaderboard'
import { avatarColorFromName, formatCalories, getInitials } from '~/utils/leaderboard'

const props = defineProps<{
  entry: LeaderboardEntry
  place: 1 | 2 | 3
  scoreDelay?: number
}>()

const initials = computed(() => getInitials(props.entry.employeeName))
const avatarBg = computed(() => avatarColorFromName(props.entry.employeeName))
const scoreStartDelay = computed(() => props.scoreDelay ?? 1.2)

const theme = computed(() => {
  if (props.place === 1) {
    return {
      block: 'podium-block--gold',
      ring: 'podium-avatar-ring--gold',
      avatar: 'h-14 w-14 text-base sm:h-20 sm:w-20 sm:text-xl',
      medal: 'bg-gradient-to-br from-amber-400 to-amber-600 text-white',
      label: '1st',
      lift: 'sm:-translate-y-2',
    }
  }
  if (props.place === 2) {
    return {
      block: 'podium-block--silver',
      ring: 'podium-avatar-ring--silver',
      avatar: 'h-12 w-12 text-sm sm:h-16 sm:w-16 sm:text-lg',
      medal: 'bg-gradient-to-br from-slate-300 to-slate-500 text-white',
      label: '2nd',
      lift: '',
    }
  }
  return {
    block: 'podium-block--bronze',
    ring: 'podium-avatar-ring--bronze',
    avatar: 'h-12 w-12 text-sm sm:h-16 sm:w-16 sm:text-lg',
    medal: 'bg-gradient-to-br from-orange-400 to-orange-600 text-white',
    label: '3rd',
    lift: '',
  }
})
</script>

<template>
  <article
    class="podium-card w-full min-w-0"
    :class="theme.lift"
    :aria-label="`Rank ${entry.rank}, ${entry.employeeName}, ${entry.currentPoints} calories`"
  >
    <!-- Rank badge -->
    <div data-podium-medal class="mb-2 flex justify-center">
      <div
        class="inline-flex h-6 items-center gap-1 rounded-full px-2 text-2xs font-bold shadow-sm sm:h-7 sm:px-2.5 sm:text-xs"
        :class="theme.medal"
      >
        <Crown v-if="place === 1" class="h-3 w-3 shrink-0 sm:h-3.5 sm:w-3.5" aria-hidden="true" />
        <Medal v-else class="h-3 w-3 shrink-0 sm:h-3.5 sm:w-3.5" aria-hidden="true" />
        {{ theme.label }}
      </div>
    </div>

    <!-- Avatar -->
    <div
      data-podium-avatar
      class="mx-auto mb-2.5 flex shrink-0 items-center justify-center rounded-full font-bold text-white sm:mb-3"
      :class="[theme.avatar, theme.ring]"
      :style="{ background: avatarBg }"
      aria-hidden="true"
    >
      {{ initials }}
    </div>

    <!-- Info card -->
    <div
      data-podium-info
      class="mb-2 w-full rounded-xl border border-slate-100 bg-white px-2 py-1.5 shadow-md sm:mb-2.5 sm:px-3 sm:py-2.5"
    >
      <p class="line-clamp-2 text-[10px] font-bold leading-snug text-slate-800 sm:text-xs">
        {{ entry.employeeName }}
      </p>
      <p
        data-podium-score
        class="score-text mt-1 flex items-center justify-center gap-0.5 text-xs sm:gap-1 sm:text-base"
      >
        <TrendingUp class="h-3 w-3 shrink-0 text-kalbe-lime sm:h-3.5 sm:w-3.5" aria-hidden="true" />
        <LeaderboardAnimatedCounter
          :value="entry.currentPoints"
          :start-delay="scoreStartDelay"
          :duration="0.9"
        />
      </p>
      <p class="mt-0.5 hidden text-2xs text-slate-400 sm:block">
        Total {{ formatCalories(entry.totalPoints) }}
      </p>
      <div class="mt-1 flex flex-wrap items-center justify-center gap-0.5 sm:mt-1.5 sm:gap-1">
        <LeaderboardCompanyBadge :company="entry.company" compact />
        <LeaderboardCategoryBadge :category="entry.category" />
      </div>
    </div>

    <!-- Podium pedestal -->
    <div
      data-podium-block-wrap
      class="w-full overflow-hidden rounded-b-xl"
    >
      <div
        data-podium-block
        class="podium-block w-full origin-bottom"
        :class="theme.block"
        aria-hidden="true"
      >
        <span class="font-display text-xl font-extrabold text-white/40 sm:text-3xl">
          {{ place }}
        </span>
      </div>
    </div>
  </article>
</template>
