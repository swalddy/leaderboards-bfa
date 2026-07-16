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

const first = computed(() => props.entries.find(e => e.rank === 1) ?? props.entries[0])
const second = computed(() => props.entries.find(e => e.rank === 2) ?? props.entries[1])
const third = computed(() => props.entries.find(e => e.rank === 3) ?? props.entries[2])

function playEntrance() {
  if (!import.meta.client || !rootRef.value || props.entries.length === 0) return

  nextTick(() => {
    requestAnimationFrame(() => {
      if (!rootRef.value) return

      podiumTimeline?.kill()
      podiumCtx?.revert()
      podiumCtx = gsap.context(() => {
        podiumTimeline = playPodiumEntrance(rootRef.value)
      }, rootRef.value)
      hasPlayed = true
    })
  })
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
    class="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8"
  >
    <div data-podium-heading class="mb-4 text-center sm:mb-5">
      <h2 id="podium-heading" class="text-base font-bold text-kalbe-green-dark sm:text-lg">
        Top Performers
      </h2>
      <p class="mt-0.5 text-xs text-slate-400">
        Burn for Good champions
      </p>
    </div>

    <div
      v-if="entries.length > 0"
      data-podium-arena
      class="podium-arena px-3 pb-4 pt-6 sm:px-6 sm:pb-6 sm:pt-8"
    >
      <div class="relative flex items-end justify-center gap-2 px-0.5 sm:gap-4 lg:gap-6">
        <div
          v-if="second"
          data-podium-card
          class="min-w-0 flex-1 basis-0 sm:max-w-[220px]"
        >
          <LeaderboardPodiumCard :entry="second" :place="2" :score-delay="0.55" />
        </div>

        <div
          v-if="first"
          data-podium-card
          data-podium-champion
          class="min-w-0 flex-[1.15] basis-0 sm:max-w-[260px]"
        >
          <LeaderboardPodiumCard :entry="first" :place="1" :score-delay="0.7" />
        </div>

        <div
          v-if="third"
          data-podium-card
          class="min-w-0 flex-1 basis-0 sm:max-w-[220px]"
        >
          <LeaderboardPodiumCard :entry="third" :place="3" :score-delay="0.85" />
        </div>
      </div>
    </div>
  </section>
</template>
