<script setup lang="ts">
import { TrendingUp, Activity } from 'lucide-vue-next'
import type { LeaderboardEntry } from '~/types/leaderboard'
import { HEART_RATE_CALORIES_LABEL } from '~/constants/leaderboard'
import { avatarColorFromName, getInitials, isDeveloperEmployee } from '~/utils/leaderboard'

const props = defineProps<{
  entry: LeaderboardEntry
  place: 1 | 2 | 3
  scoreDelay?: number
  hrScoreDelay?: number
  animationKey?: number
}>()

const isDeveloper = computed(() => isDeveloperEmployee(props.entry.employeeName))
const initials = computed(() => getInitials(props.entry.employeeName))
const avatarBg = computed(() => avatarColorFromName(props.entry.employeeName))
const scoreStartDelay = computed(() => props.scoreDelay ?? 0.5)
const hrScoreStartDelay = computed(() => props.hrScoreDelay ?? scoreStartDelay.value + 0.45)
const countersReady = computed(() => (props.animationKey ?? 0) > 0)
const mainCounterKey = computed(() => `main-${props.animationKey}-${props.entry.employeeId}`)
const hrCounterKey = computed(() => `hr-${props.animationKey}-${props.entry.employeeId}`)
const isChampion = computed(() => props.place === 1)

const emit = defineEmits<{ 'easter-egg': [] }>()

function onChampionActivate() {
  if (!isChampion.value) return
  emit('easter-egg')
}

function onChampionKeydown(event: KeyboardEvent) {
  if (!isChampion.value) return
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    emit('easter-egg')
  }
}

const theme = computed(() => {
  if (props.place === 1) return {
    card: 'lb-podium-card--gold',
    border: 'border-[#F59E0B]',
    avatarSize: 'h-24 w-24 text-3xl sm:h-28 sm:w-28 sm:text-4xl',
    avatarRing: 'lb-avatar-ring--gold',
    medalClass: 'lb-medal--gold',
    rankLabel: 'Champion',
    scoreClass: 'lb-score--gold text-2xl sm:text-3xl',
    nameClass: 'text-base font-bold sm:text-lg',
    metaClass: 'text-xs',
    padding: 'px-5 pb-7 pt-5 sm:px-6',
  }
  if (props.place === 2) return {
    card: 'lb-podium-card--silver',
    border: 'border-[#94A3B8]',
    avatarSize: 'h-12 w-12 text-base sm:h-16 sm:w-16 sm:text-xl',
    avatarRing: 'lb-avatar-ring--silver',
    medalClass: 'lb-medal--silver',
    rankLabel: '2nd',
    scoreClass: 'lb-score--silver text-base sm:text-lg',
    nameClass: 'text-xs font-bold sm:text-sm',
    metaClass: 'text-[10px] sm:text-[11px]',
    padding: 'px-2.5 pb-3.5 pt-3 sm:px-4 sm:pb-5 sm:pt-4',
  }
  return {
    card: 'lb-podium-card--bronze',
    border: 'border-[#FB923C]',
    avatarSize: 'h-12 w-12 text-base sm:h-14 sm:w-14 sm:text-lg',
    avatarRing: 'lb-avatar-ring--bronze',
    medalClass: 'lb-medal--bronze',
    rankLabel: '3rd',
    scoreClass: 'lb-score--bronze text-base sm:text-lg',
    nameClass: 'text-xs font-bold sm:text-sm',
    metaClass: 'text-[10px] sm:text-[11px]',
    padding: 'px-2.5 pb-3.5 pt-3 sm:px-4 sm:pb-5 sm:pt-4',
  }
})
</script>

<template>
  <article
    class="podium-card w-full min-w-0"
    :class="isChampion && 'cursor-pointer select-none'"
    :role="isChampion ? 'button' : undefined"
    :tabindex="isChampion ? 0 : undefined"
    :title="isChampion ? 'Psst… tap the champion' : undefined"
    :aria-label="`Rank ${entry.rank}, ${entry.employeeName.trim()}${isDeveloper ? ' IT' : ''}, ${entry.currentPoints} calories`"
    @click="onChampionActivate"
    @keydown="onChampionKeydown"
  >
    <div
      class="relative overflow-hidden rounded-2xl text-center transition-all duration-300 ease-out"
      :class="[theme.card, theme.padding]"
    >
      <!-- Medal badge -->
      <div class="mb-4 flex justify-center">
        <span
          class="lb-medal inline-flex items-center gap-1.5 rounded-full font-bold shadow-sm"
          :class="[theme.medalClass, isChampion ? 'px-4 py-1.5 text-sm' : 'px-3 py-1 text-xs']"
        >
          <span v-if="isChampion" class="text-base">👑</span>
          <span v-else-if="place === 2" class="text-sm">🥈</span>
          <span v-else class="text-sm">🥉</span>
          {{ theme.rankLabel }}
        </span>
      </div>

      <!-- Avatar with laurel for champion -->
      <div class="mb-4 flex justify-center">
        <div class="relative">
          <!-- Laurel wreath for champion -->
          <div v-if="isChampion" class="lb-laurel-wrap" aria-hidden="true">
            <span class="lb-laurel lb-laurel--left">🌿</span>
            <span class="lb-laurel lb-laurel--right">🌿</span>
          </div>
          <div
            data-podium-avatar
            class="flex shrink-0 items-center justify-center rounded-full font-bold text-white"
            :class="[theme.avatarSize, theme.avatarRing]"
            :style="{ background: avatarBg }"
            aria-hidden="true"
          >
            {{ initials }}
          </div>
          <LeaderboardEmployeeName
            v-if="isDeveloper"
            :name="entry.employeeName"
            size="podium"
            badge-only
            class="absolute -bottom-0.5 -right-1 z-10"
          />
        </div>
      </div>

      <!-- Name -->
      <div :class="isChampion ? 'mb-4' : 'mb-3'">
        <p class="leading-snug text-slate-900" :class="[theme.nameClass, isChampion ? 'line-clamp-2' : 'truncate']">
          {{ entry.employeeName.trim() }}
        </p>
        <div class="mt-2 flex flex-wrap items-center justify-center gap-1">
          <LeaderboardCompanyBadge :company="entry.company" compact />
          <LeaderboardCategoryBadge :category="entry.category" />
        </div>
      </div>

      <!-- Score -->
      <div>
        <p
          data-podium-score
          class="flex items-center justify-center gap-1.5 font-display font-bold tabular-nums"
          :class="theme.scoreClass"
        >
          <TrendingUp class="h-4 w-4 shrink-0 text-kalbe-green" aria-hidden="true" />
          <LeaderboardAnimatedCounter
            :key="mainCounterKey"
            :value="entry.currentPoints"
            :play="countersReady"
            :start-delay="scoreStartDelay"
            :duration="2.4"
          />
        </p>
        <p class="mt-1 flex items-center justify-center gap-0.5 text-slate-400" :class="theme.metaClass">
          <Activity class="h-3 w-3 shrink-0" aria-hidden="true" />
          {{ HEART_RATE_CALORIES_LABEL }}
          <LeaderboardAnimatedCounter
            :key="hrCounterKey"
            :value="entry.totalPoints"
            :play="countersReady"
            :start-delay="hrScoreStartDelay"
            :duration="1.8"
          />
        </p>
      </div>
    </div>
  </article>
</template>
