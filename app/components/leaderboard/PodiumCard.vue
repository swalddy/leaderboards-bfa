<script setup lang="ts">
import { Activity, Crown, Medal, TrendingUp } from 'lucide-vue-next'
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

const displayName = computed(() => props.entry.employeeName.trim())
const isDeveloper = computed(() => isDeveloperEmployee(props.entry.employeeName))
const initials = computed(() => getInitials(props.entry.employeeName))
const avatarBg = computed(() => avatarColorFromName(props.entry.employeeName))
const scoreStartDelay = computed(() => props.scoreDelay ?? 0.5)
const hrScoreStartDelay = computed(() => props.hrScoreDelay ?? scoreStartDelay.value + 0.45)
const countersReady = computed(() => (props.animationKey ?? 0) > 0)
const mainCounterKey = computed(() => `main-${props.animationKey}-${props.entry.employeeId}`)
const hrCounterKey = computed(() => `hr-${props.animationKey}-${props.entry.employeeId}`)
const isChampion = computed(() => props.place === 1)

const emit = defineEmits<{
  'easter-egg': []
}>()

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
  if (props.place === 1) {
    return {
      block: 'podium-block--gold',
      ring: 'podium-avatar-ring--gold',
      avatar: 'h-12 w-12 text-sm sm:h-[4.5rem] sm:w-[4.5rem] sm:text-xl md:h-20 md:w-20 md:text-2xl',
      medal: 'podium-medal--gold',
      label: '1st',
      lift: 'sm:-translate-y-4',
      info: 'podium-info-card--gold',
      score: 'text-sm sm:text-lg md:text-xl',
    }
  }
  if (props.place === 2) {
    return {
      block: 'podium-block--silver',
      ring: 'podium-avatar-ring--silver',
      avatar: 'h-8 w-8 text-[9px] sm:h-12 sm:w-12 sm:text-sm md:h-14 md:w-14 md:text-base',
      medal: 'podium-medal--silver',
      label: '2nd',
      lift: '',
      info: 'podium-info-card--silver',
      score: 'text-[11px] sm:text-sm md:text-base',
    }
  }
  return {
    block: 'podium-block--bronze',
    ring: 'podium-avatar-ring--bronze',
    avatar: 'h-8 w-8 text-[9px] sm:h-12 sm:w-12 sm:text-sm md:h-14 md:w-14 md:text-base',
    medal: 'podium-medal--bronze',
    label: '3rd',
    lift: '',
    info: 'podium-info-card--bronze',
    score: 'text-[11px] sm:text-sm md:text-base',
  }
})
</script>

<template>
  <article
    class="podium-card w-full min-w-0"
    :class="[
      theme.lift,
      isChampion && 'podium-card--champion cursor-pointer select-none',
    ]"
    :role="isChampion ? 'button' : undefined"
    :tabindex="isChampion ? 0 : undefined"
    :title="isChampion ? 'Psst… tap the champion' : undefined"
    :aria-label="`Rank ${entry.rank}, ${displayName}${isDeveloper ? ' IT' : ''}, ${entry.currentPoints} calories`"
    @click="onChampionActivate"
    @keydown="onChampionKeydown"
  >
    <div
      v-if="isChampion"
      data-podium-crown
      class="podium-champion-crown"
      aria-hidden="true"
    >
      <Crown class="podium-champion-crown__icon" />
    </div>

    <div data-podium-medal class="mb-1 flex justify-center sm:mb-1.5">
      <div
        class="podium-medal inline-flex items-center gap-0.5 rounded-full font-bold"
        :class="[
          theme.medal,
          isChampion
            ? 'h-6 gap-1 px-2.5 text-[9px] sm:h-8 sm:gap-1.5 sm:px-3.5 sm:text-xs'
            : 'h-5 gap-0.5 px-1.5 text-[8px] sm:h-7 sm:gap-1 sm:px-2.5 sm:text-2xs',
        ]"
      >
        <Crown v-if="isChampion" class="h-3 w-3 shrink-0 sm:h-4 sm:w-4" aria-hidden="true" />
        <Medal v-else class="h-2.5 w-2.5 shrink-0 sm:h-3.5 sm:w-3.5" aria-hidden="true" />
        <span v-if="isChampion" class="tracking-wide">Champion</span>
        <span v-else>{{ theme.label }}</span>
      </div>
    </div>

    <div
      class="relative mx-auto mb-1.5 w-fit sm:mb-2.5"
      :class="isChampion && 'podium-champion-avatar-wrap'"
    >
      <template v-if="isChampion">
        <span class="podium-champion-rays" data-podium-rays aria-hidden="true" />
        <span class="podium-champion-aura" aria-hidden="true" />
        <span class="podium-champion-sparkle podium-champion-sparkle--1" aria-hidden="true" />
        <span class="podium-champion-sparkle podium-champion-sparkle--2" aria-hidden="true" />
        <span class="podium-champion-sparkle podium-champion-sparkle--3" aria-hidden="true" />
        <span class="podium-champion-sparkle podium-champion-sparkle--4" aria-hidden="true" />
      </template>

      <div
        data-podium-avatar
        class="podium-avatar relative z-[1] flex shrink-0 items-center justify-center rounded-full font-bold text-white"
        :class="[theme.avatar, theme.ring, isChampion && 'podium-avatar--champion']"
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
        class="absolute -bottom-0.5 -right-1 z-10 sm:-bottom-1 sm:-right-1"
      />
    </div>

    <div
      data-podium-info
      class="podium-info-card mb-1.5 w-full rounded-lg sm:mb-2.5 sm:rounded-xl sm:px-2.5 sm:py-2"
      :class="[theme.info, isChampion && 'podium-info-card--champion']"
    >
      <div class="flex justify-center px-0.5">
        <LeaderboardEmployeeName
          :name="entry.employeeName"
          size="podium"
          multiline
          centered
          hide-badge
        />
      </div>

      <p
        data-podium-score
        class="score-text mt-1 flex items-center justify-center gap-0.5 font-bold sm:mt-1.5 sm:gap-1"
        :class="theme.score"
      >
        <TrendingUp
          class="h-2.5 w-2.5 shrink-0 sm:h-3.5 sm:w-3.5"
          :class="isChampion ? 'text-amber-500' : 'text-kalbe-lime'"
          aria-hidden="true"
        />
        <span :class="isChampion && 'podium-score--champion'">
          <LeaderboardAnimatedCounter
            :key="mainCounterKey"
            :value="entry.currentPoints"
            :play="countersReady"
            :start-delay="scoreStartDelay"
            :duration="2.4"
          />
        </span>
      </p>

      <p class="mt-1 flex items-center justify-center gap-0.5 text-[8px] text-slate-400 sm:text-[10px]">
        <Activity class="h-2 w-2 shrink-0 text-slate-300 sm:h-2.5 sm:w-2.5" aria-hidden="true" />
        <span class="sm:hidden">HR</span>
        <span class="hidden sm:inline">{{ HEART_RATE_CALORIES_LABEL }}</span>
        <LeaderboardAnimatedCounter
          :key="hrCounterKey"
          :value="entry.totalPoints"
          :play="countersReady"
          :start-delay="hrScoreStartDelay"
          :duration="1.8"
        />
      </p>

      <div class="mt-1 hidden flex-wrap items-center justify-center gap-1 sm:mt-1.5 sm:flex">
        <LeaderboardCompanyBadge :company="entry.company" compact />
        <LeaderboardCategoryBadge :category="entry.category" />
      </div>
    </div>

    <div
      data-podium-block-wrap
      class="w-full overflow-hidden rounded-b-xl"
      :class="isChampion && 'podium-block-wrap--champion'"
    >
      <div
        data-podium-block
        class="podium-block w-full origin-bottom"
        :class="theme.block"
        aria-hidden="true"
      >
        <span
          class="podium-block-rank font-display font-extrabold"
          :class="isChampion ? 'text-xl sm:text-3xl md:text-4xl' : 'text-base sm:text-xl md:text-2xl'"
        >{{ place }}</span>
      </div>
    </div>
  </article>
</template>
