<script setup lang="ts">
import { Flame, Leaf } from 'lucide-vue-next'

defineProps<{
  lastUpdatedAt?: Date | null
}>()

const rootRef = ref<HTMLElement | null>(null)
const { fadeSlideDown, runAfterPaint } = useLeaderboardAnimations()

function formatTime(value: Date | null | undefined) {
  if (!value) return null
  return new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(value)
}

runAfterPaint(() => {
  if (!rootRef.value) return
  fadeSlideDown(rootRef.value.querySelectorAll('[data-enter]'), {
    stagger: 0.08,
    y: -14,
    duration: 0.55,
  })
})
</script>

<template>
  <header
    ref="rootRef"
    class="sticky top-0 z-40 border-b border-slate-100 bg-white/80 backdrop-blur-2xl backdrop-saturate-150"
  >
    <div class="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
      <div data-enter class="flex min-w-0 items-center gap-3">
        <div
          class="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-kalbe-lime to-kalbe-green shadow-lime"
          aria-hidden="true"
        >
          <Leaf class="h-5 w-5 text-white" stroke-width="2.5" />
        </div>
        <div class="min-w-0">
          <p class="text-2xs font-semibold uppercase tracking-widest text-kalbe-green">
            Donor Kalori
          </p>
          <h1 class="text-lg font-bold text-kalbe-green-dark sm:text-xl">
            Leaderboard
          </h1>
        </div>
      </div>

      <div data-enter class="flex shrink-0 items-center gap-2.5">
        <p
          v-if="lastUpdatedAt"
          class="hidden text-xs text-slate-400 sm:block"
        >
          {{ formatTime(lastUpdatedAt) }}
        </p>
        <span
          class="inline-flex items-center gap-1.5 rounded-full bg-kalbe-mint px-3 py-1.5 text-2xs font-semibold text-kalbe-green-deep ring-1 ring-kalbe-green/10"
        >
          <span class="relative flex h-1.5 w-1.5">
            <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-kalbe-green opacity-50" />
            <span class="relative inline-flex h-1.5 w-1.5 rounded-full bg-kalbe-green" />
          </span>
          <Flame class="h-3 w-3 text-kalbe-green" aria-hidden="true" />
          Live
        </span>
      </div>
    </div>
  </header>
</template>
