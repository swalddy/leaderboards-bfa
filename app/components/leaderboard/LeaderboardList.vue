<script setup lang="ts">
import type { LeaderboardEntry } from '~/types/leaderboard'
import { entryKey } from '~/utils/leaderboard'

const PAGE_SIZE = 15

const props = defineProps<{ entries: LeaderboardEntry[] }>()

const rootRef = ref<HTMLElement | null>(null)
const listRef = ref<HTMLElement | null>(null)
const { fadeSlideUp, revealListRows, runAfterPaint } = useLeaderboardAnimations()

const currentPage = ref(1)
const hasAnimatedInitial = ref(false)

watch(
  () => props.entries.map(e => entryKey(e)).join(','),
  () => { currentPage.value = 1 },
)

function onPageChange(page: number) {
  currentPage.value = page
  nextTick(() => {
    revealListRows(listRef.value)
    document.getElementById('list-heading')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  })
}

const totalPages = computed(() => Math.max(1, Math.ceil(props.entries.length / PAGE_SIZE)))
const paginatedEntries = computed(() => {
  const start = (currentPage.value - 1) * PAGE_SIZE
  return props.entries.slice(start, start + PAGE_SIZE)
})

watch(totalPages, (total) => { if (currentPage.value > total) currentPage.value = total })

function animateListEntrance() {
  if (!rootRef.value) return
  fadeSlideUp(rootRef.value.querySelectorAll('[data-list-header]'), { y: 16, stagger: 0.06, delay: 0.35, duration: 0.5 })
  revealListRows(listRef.value)
}

runAfterPaint(() => {
  animateListEntrance()
  hasAnimatedInitial.value = true
})

watch(paginatedEntries, () => {
  if (!hasAnimatedInitial.value) return
  nextTick(() => revealListRows(listRef.value))
}, { flush: 'post' })
</script>

<template>
  <section
    ref="rootRef"
    aria-labelledby="list-heading"
    class="mx-auto w-full max-w-7xl px-3 pb-10 sm:px-5 lg:px-6"
  >
    <div data-list-header class="mb-3 flex items-center justify-between gap-2">
      <div>
        <p class="text-[9px] font-semibold uppercase tracking-[0.2em] text-green-400/60 sm:text-2xs">
          Rankings
        </p>
        <h2 id="list-heading" class="mt-0.5 text-base font-bold text-white sm:text-lg">
          All Rankings
        </h2>
      </div>
      <span class="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-semibold text-white/50 sm:text-xs">
        {{ entries.length }} competitors
      </span>
    </div>

    <div
      ref="listRef"
      class="lb-card overflow-hidden rounded-xl divide-y divide-white/5"
    >
      <LeaderboardRow
        v-for="entry in paginatedEntries"
        :key="entryKey(entry)"
        :entry="entry"
      />
    </div>

    <LeaderboardPagination
      :current-page="currentPage"
      :total-pages="totalPages"
      :total-items="entries.length"
      :page-size="PAGE_SIZE"
      @update:current-page="onPageChange"
    />
  </section>
</template>
