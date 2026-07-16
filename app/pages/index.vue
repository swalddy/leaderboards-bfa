<script setup lang="ts">
definePageMeta({
  ssr: false,
})

useSeoMeta({
  title: 'Kalbe Donor Kalori Leaderboard',
  description: 'Track the best performers from PT Agroveta Husada Dharma and Corporate Function.',
})

const {
  genderFilter,
  companyFilter,
  searchQuery,
  sortBy,
  lastUpdatedAt,
  error,
  refresh,
  topThree,
  restEntries,
  filteredEntries,
  stats,
  isEmpty,
  hasError,
  hasLoaded,
  loadProgress,
  loadStage,
} = useLeaderboard()

const showSplash = ref(true)

const dataReady = computed(() => hasLoaded.value || hasError.value)
const splashFinished = computed(() => dataReady.value)
const showContent = computed(() => dataReady.value && !showSplash.value)

const tickerEntries = computed(() => {
  const ranked = filteredEntries.value.length
    ? filteredEntries.value
    : topThree.value
  return ranked.slice(0, 10)
})

onMounted(() => {
  useState('podium-confetti-fired', () => false).value = false
})

function onSplashExitComplete() {
  showSplash.value = false
}
</script>

<template>
  <main class="relative min-h-screen overflow-x-hidden pb-12">
    <LeaderboardSplashScreen
      v-if="showSplash"
      :progress="loadProgress"
      :stage="loadStage"
      :finished="splashFinished"
      @exit-complete="onSplashExitComplete"
    />

    <div v-if="showContent" class="relative">
      <LeaderboardBackgroundAnimatedBackground />
      <LeaderboardBackgroundFloatingParticles />

      <div class="relative z-10 mx-auto min-h-screen w-full max-w-7xl">
        <LeaderboardHeader :last-updated-at="lastUpdatedAt" />

        <div v-if="hasError" class="px-4 py-10 sm:px-6 lg:px-8">
          <LeaderboardErrorState
            :message="error?.message || 'Failed to fetch live leaderboard data.'"
            @retry="refresh()"
          />
        </div>

        <div v-else-if="hasLoaded" class="space-y-4 pt-2 sm:space-y-5">
          <LeaderboardFilter
            v-model:gender="genderFilter"
            v-model:company="companyFilter"
            v-model:search="searchQuery"
            v-model:sort="sortBy"
          />

          <LeaderboardOverviewTabs
            :stats="stats"
            :ticker-entries="tickerEntries"
          />

          <div v-if="isEmpty" class="px-4 py-8 sm:px-6 lg:px-8">
            <LeaderboardEmptyState />
          </div>

          <template v-else>
            <LeaderboardPodium
              v-if="topThree.length"
              :entries="topThree"
            />

            <LeaderboardList
              v-if="restEntries.length"
              :entries="restEntries"
            />
          </template>
        </div>
      </div>
    </div>
  </main>
</template>
