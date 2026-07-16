<script setup lang="ts">
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'

const props = defineProps<{
  currentPage: number
  totalPages: number
  totalItems: number
  pageSize: number
}>()

const emit = defineEmits<{
  'update:currentPage': [page: number]
}>()

const rootRef = ref<HTMLElement | null>(null)
const { fadeSlideUp, runAfterPaint } = useLeaderboardAnimations()

const rangeStart = computed(() =>
  props.totalItems === 0 ? 0 : (props.currentPage - 1) * props.pageSize + 1,
)
const rangeEnd = computed(() =>
  Math.min(props.currentPage * props.pageSize, props.totalItems),
)

const visiblePages = computed(() => {
  const total = props.totalPages
  const current = props.currentPage
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }

  const pages = new Set<number>([1, total, current])
  if (current > 1) pages.add(current - 1)
  if (current < total) pages.add(current + 1)
  if (current <= 3) { pages.add(2); pages.add(3) }
  if (current >= total - 2) { pages.add(total - 1); pages.add(total - 2) }

  return [...pages].sort((a, b) => a - b)
})

function goTo(page: number) {
  if (page < 1 || page > props.totalPages) return
  emit('update:currentPage', page)
}

runAfterPaint(() => {
  if (rootRef.value) {
    fadeSlideUp(rootRef.value, { y: 12, delay: 0.55, duration: 0.45 })
  }
})
</script>

<template>
  <nav
    v-if="totalPages > 1"
    ref="rootRef"
    class="flex flex-col items-center gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:justify-between"
    aria-label="Leaderboard pagination"
  >
    <p class="text-xs text-slate-400">
      Menampilkan <span class="font-semibold text-slate-600">{{ rangeStart }}–{{ rangeEnd }}</span>
      dari <span class="font-semibold text-slate-600">{{ totalItems }}</span> peserta
    </p>

    <div class="flex items-center gap-1">
      <button
        type="button"
        class="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition-colors hover:border-kalbe-green/30 hover:text-kalbe-green disabled:cursor-not-allowed disabled:opacity-40"
        :disabled="currentPage <= 1"
        aria-label="Previous page"
        @click="goTo(currentPage - 1)"
      >
        <ChevronLeft class="h-4 w-4" />
      </button>

      <template v-for="(page, idx) in visiblePages" :key="page">
        <span
          v-if="idx > 0 && page - visiblePages[idx - 1]! > 1"
          class="px-1 text-xs text-slate-300"
          aria-hidden="true"
        >…</span>
        <button
          type="button"
          class="flex h-8 min-w-8 cursor-pointer items-center justify-center rounded-lg px-2 text-xs font-semibold transition-colors"
          :class="currentPage === page
            ? 'bg-kalbe-green text-white shadow-glow'
            : 'border border-slate-200 bg-white text-slate-600 hover:border-kalbe-green/30 hover:text-kalbe-green'"
          :aria-label="`Page ${page}`"
          :aria-current="currentPage === page ? 'page' : undefined"
          @click="goTo(page)"
        >
          {{ page }}
        </button>
      </template>

      <button
        type="button"
        class="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition-colors hover:border-kalbe-green/30 hover:text-kalbe-green disabled:cursor-not-allowed disabled:opacity-40"
        :disabled="currentPage >= totalPages"
        aria-label="Next page"
        @click="goTo(currentPage + 1)"
      >
        <ChevronRight class="h-4 w-4" />
      </button>
    </div>
  </nav>
</template>
