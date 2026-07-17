<script setup lang="ts">
import type { LeaderboardEntry } from '~/types/leaderboard'

const props = defineProps<{
  entries: LeaderboardEntry[]
}>()

const rootRef = ref<HTMLElement | null>(null)
const { playPodiumEntrance, gsap } = useLeaderboardAnimations()
let podiumCtx: ReturnType<typeof gsap.context> | null = null
let podiumTimeline: gsap.core.Timeline | null = null
let hasPlayed = false
const animationKey = ref(0)

const eggActive = ref(false)
const eggName = ref('')

const first = computed(() => props.entries[0])
const second = computed(() => props.entries[1])
const third = computed(() => props.entries[2])

function playEntrance() {
  if (!import.meta.client || !rootRef.value || props.entries.length === 0) return

  nextTick(() => {
    requestAnimationFrame(() => {
      if (!rootRef.value) return

      podiumTimeline?.kill()
      podiumCtx?.revert()
      animationKey.value += 1

      nextTick(() => {
        if (!rootRef.value) return
        podiumCtx = gsap.context(() => {
          podiumTimeline = playPodiumEntrance(rootRef.value)
        }, rootRef.value)
        hasPlayed = true
      })
    })
  })
}

function onChampionEasterEgg() {
  if (eggActive.value || !first.value) return
  const cooldownUntil = useState('champion-sprint-egg-cooldown', () => 0)
  if (Date.now() < cooldownUntil.value) return
  eggName.value = first.value.employeeName
  eggActive.value = true
}

function onEggComplete() {
  eggActive.value = false
}

defineExpose({ playEntrance })

onMounted(() => {
  playEntrance()
})

watch(
  () => props.entries.map(e => `${e.gender}-${e.employeeId}`).join(','),
  () => {
    if (hasPlayed) playEntrance()
  },
)

onUnmounted(() => {
  podiumTimeline?.kill()
  podiumCtx?.revert()
})
</script>

<template>
  <section
    ref="rootRef"
    data-podium-root
    aria-labelledby="podium-heading"
    class="mx-auto w-full max-w-7xl px-3 sm:px-5 lg:px-6"
  >
    <div data-podium-heading class="mb-3 text-center sm:mb-4">
      <p class="text-[9px] font-semibold uppercase tracking-[0.2em] text-kalbe-green/70 sm:text-2xs">
        Podium
      </p>
      <h2 id="podium-heading" class="mt-0.5 text-base font-bold text-kalbe-green-dark sm:text-lg">
        Top Performers
      </h2>
      <p class="mt-1 text-[10px] text-slate-400 sm:text-2xs">
        Burn for Good champions
      </p>
    </div>

    <div
      v-if="entries.length > 0"
      data-podium-arena
      class="podium-arena px-1.5 pb-0 pt-4 sm:px-5 sm:pt-7"
    >
      <div class="podium-spotlight" data-podium-spotlight aria-hidden="true" />

      <div
        class="podium-grid relative px-0.5 sm:px-1"
        :class="{
          'podium-grid--solo': entries.length === 1,
          'podium-grid--duo': entries.length === 2,
        }"
      >
        <div
          v-if="second"
          data-podium-card
          class="podium-card-slot"
        >
          <LeaderboardPodiumCard
            :entry="second"
            :place="2"
            :score-delay="0.45"
            :hr-score-delay="0.9"
            :animation-key="animationKey"
          />
        </div>

        <div
          v-if="first"
          data-podium-card
          data-podium-champion
          class="podium-card-slot podium-card-slot--champion"
        >
          <LeaderboardPodiumCard
            :entry="first"
            :place="1"
            :score-delay="0.55"
            :hr-score-delay="1"
            :animation-key="animationKey"
            @easter-egg="onChampionEasterEgg"
          />
        </div>

        <div
          v-if="third"
          data-podium-card
          class="podium-card-slot"
        >
          <LeaderboardPodiumCard
            :entry="third"
            :place="3"
            :score-delay="0.65"
            :hr-score-delay="1.1"
            :animation-key="animationKey"
          />
        </div>
      </div>

      <div data-podium-floor class="podium-floor" aria-hidden="true" />
    </div>

    <LeaderboardChampionSprintEgg
      :active="eggActive"
      :champion-name="eggName"
      @complete="onEggComplete"
    />
  </section>
</template>
