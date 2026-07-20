<script setup lang="ts">
import { ArrowLeft, Leaf } from 'lucide-vue-next'

defineProps<{
  lastUpdatedAt?: Date | null
  companyLabel?: string
}>()

const rootRef = ref<HTMLElement | null>(null)
const { fadeSlideDown, runAfterPaint } = useLeaderboardAnimations()

function formatTime(value: Date | null | undefined) {
  if (!value) return null
  return new Intl.DateTimeFormat('id-ID', { hour: '2-digit', minute: '2-digit' }).format(value)
}

runAfterPaint(() => {
  if (!rootRef.value) return
  fadeSlideDown(rootRef.value.querySelectorAll('[data-enter]'), {
    stagger: 0.06,
    y: -10,
    duration: 0.45,
  })
})
</script>

<template>
  <header
    ref="rootRef"
    class="lb-header sticky top-0 z-40"
  >
    <div class="mx-auto flex max-w-7xl items-center justify-between gap-2 px-3 py-3 sm:gap-3 sm:px-5 sm:py-3.5 lg:px-6">
      <div data-enter class="flex min-w-0 items-center gap-2.5 sm:gap-3">
        <div
          class="lb-logo-icon flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
          aria-hidden="true"
        >
          <img src="/bio_logo.png" class="h-[18px] w-[18px] object-contain" />
        </div>
        <div class="min-w-0">
          <p class="text-[9px] font-semibold uppercase tracking-[0.2em] text-green-600 sm:text-2xs">
            Kalbe Donor Kalori
          </p>
          <h1 class="truncate text-sm font-bold text-slate-900 sm:text-base">
            Leaderboard
            <span v-if="companyLabel" class="font-normal text-green-600">
              · {{ companyLabel }}
            </span>
          </h1>
        </div>
      </div>

      <div data-enter class="flex shrink-0 items-center gap-1.5 sm:gap-2.5">
        <p v-if="lastUpdatedAt" class="hidden text-[10px] text-slate-500 sm:block">
          Updated {{ formatTime(lastUpdatedAt) }}
        </p>
        
        <span class="lb-live-badge inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold sm:text-2xs">
          <span class="relative flex h-1.5 w-1.5">
            <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
            <span class="relative inline-flex h-1.5 w-1.5 rounded-full bg-green-400" />
          </span>
          Live
        </span>
      </div>
    </div>
  </header>
</template>
