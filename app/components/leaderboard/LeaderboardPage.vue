<script setup lang="ts">
import type { CompanySlug } from '~/constants/leaderboard'

const props = defineProps<{
  companySlug?: CompanySlug
  nameAllowlist?: readonly string[]
  companyLabelOverride?: string
  stateKey?: string
}>()

const {
  companyLabel,
  genderFilter,
  companyFilter,
  isCompanyLocked,
  searchQuery,
  sortBy,
  lastUpdatedAt,
  error,
  refresh,
  filteredEntries,
  stats,
  topThree,
  isEmpty,
  hasError,
  hasLoaded,
  loadProgress,
  loadStage,
} = useLeaderboard({
  companySlug: props.companySlug,
  nameAllowlist: props.nameAllowlist,
  companyLabelOverride: props.companyLabelOverride,
  stateKey: props.stateKey,
})

const showSplash = ref(true)

const dataReady = computed(() => hasLoaded.value || hasError.value)
const splashFinished = computed(() => dataReady.value)
const showContent = computed(() => dataReady.value && !showSplash.value)

onMounted(() => {
  useState('podium-confetti-fired', () => false).value = false
})

function onSplashExitComplete() {
  showSplash.value = false
}
</script>

<template>
  <main class="relative min-h-screen overflow-x-hidden bg-[#F8FAFC] pb-8 text-slate-900">
    <LeaderboardSplashScreen
      v-if="showSplash"
      :progress="loadProgress"
      :stage="loadStage"
      :finished="splashFinished"
      @exit-complete="onSplashExitComplete"
    />

    <div v-if="showContent" class="lb-page-bg relative min-h-screen bg-[#F8FAFC]">
      <!-- Ambient glow orbs -->
      <div class="pointer-events-none fixed inset-0 z-0 overflow-hidden opacity-70" aria-hidden="true">
        <div class="lb-orb lb-orb--green" />
        <div class="lb-orb lb-orb--lime" />
        <div class="lb-orb lb-orb--gold" />
      </div>

      <div class="relative z-10 mx-auto w-full max-w-7xl px-3 sm:px-5 lg:px-6">
        <LeaderboardHeader
          :last-updated-at="lastUpdatedAt"
          :company-label="companyLabel"
        />

        <div v-if="hasError" class="px-0 py-8 sm:py-10">
          <LeaderboardErrorState
            :message="error?.message || 'Failed to fetch live leaderboard data.'"
            @retry="refresh()"
          />
        </div>

        <div v-else-if="hasLoaded" class="space-y-4 py-4 sm:space-y-5 sm:py-6">
          <LeaderboardFilter
            v-model:gender="genderFilter"
            v-model:search="searchQuery"
            v-model:sort="sortBy"
            v-model:company="companyFilter"
            :hide-company-filter="isCompanyLocked"
          />

          <LeaderboardOverviewTabs
            :stats="stats"
            :ticker-entries="topThree"
          />

          <div v-if="isEmpty" class="px-0 py-8 sm:py-10">
            <LeaderboardEmptyState />
          </div>

          <template v-else>
            <LeaderboardPodium
              v-if="filteredEntries.length >= 1"
              :entries="filteredEntries.slice(0, 3)"
            />
            <LeaderboardList
              v-if="filteredEntries.length"
              :entries="filteredEntries.slice(3)"
            />
          </template>
        </div>

        <LeaderboardFooter />
      </div>
    </div>
  </main>
</template>
