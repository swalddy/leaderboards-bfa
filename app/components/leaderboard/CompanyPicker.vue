<script setup lang="ts">
import { Building2, ChevronRight, Flame, Leaf } from 'lucide-vue-next'
import {
  COMPANY_ROUTES,
  COMPANY_SHORT_LABELS,
} from '~/constants/leaderboard'

const companies: {
  to: string
  shortLabel: string
  fullName: string
  description: string
}[] = [
  {
    to: '/bifarma',
    shortLabel: COMPANY_SHORT_LABELS[COMPANY_ROUTES.bifarma],
    fullName: COMPANY_ROUTES.bifarma,
    description: 'Leaderboard Donor Kalori untuk karyawan PT Bifarma Adiluhung.',
  },
  {
    to: '/innolab',
    shortLabel: COMPANY_SHORT_LABELS[COMPANY_ROUTES.innolab],
    fullName: COMPANY_ROUTES.innolab,
    description: 'Leaderboard Donor Kalori untuk karyawan PT Innolab Sains Internasional.',
  },
  {
    to: '/kalbio',
    shortLabel: COMPANY_SHORT_LABELS[COMPANY_ROUTES.kalbio],
    fullName: COMPANY_ROUTES.kalbio,
    description: 'Leaderboard Donor Kalori untuk karyawan PT Kalbio Global Medika.',
  },
  {
    to: '/stemcell',
    shortLabel: COMPANY_SHORT_LABELS[COMPANY_ROUTES.stemcell],
    fullName: COMPANY_ROUTES.stemcell,
    description: 'Leaderboard Donor Kalori untuk karyawan Stem Cell & Cancer Institute.',
  },
  {
    to: '/innogene',
    shortLabel: COMPANY_SHORT_LABELS[COMPANY_ROUTES.innogene],
    fullName: COMPANY_ROUTES.innogene,
    description: 'Leaderboard Donor Kalori untuk karyawan Innogene Kalbiotech Pte Ltd.',
  },
  {
    to: '/pharmalab',
    shortLabel: COMPANY_SHORT_LABELS[COMPANY_ROUTES.pharmalab],
    fullName: COMPANY_ROUTES.pharmalab,
    description: 'Leaderboard Donor Kalori untuk karyawan PT Pharma Metric Labs.',
  },
  {
    to: '/kgb',
    shortLabel: COMPANY_SHORT_LABELS[COMPANY_ROUTES.kgb],
    fullName: COMPANY_ROUTES.kgb,
    description: 'Leaderboard Donor Kalori untuk karyawan PT Kalbe Genexine Biologics.',
  },
  {
    to: '/kalgendna',
    shortLabel: COMPANY_SHORT_LABELS[COMPANY_ROUTES.kalgendna],
    fullName: COMPANY_ROUTES.kalgendna,
    description: 'Leaderboard Donor Kalori untuk karyawan PT Kalgen DNA.',
  },
]

const rootRef = ref<HTMLElement | null>(null)
const { fadeSlideUp, scaleIn, runAfterPaint } = useLeaderboardAnimations()

runAfterPaint(() => {
  if (!rootRef.value) return
  fadeSlideUp(rootRef.value.querySelectorAll('[data-enter-title]'), {
    y: 18,
    duration: 0.55,
  })
  scaleIn(rootRef.value.querySelectorAll('[data-enter-card]'), {
    delay: 0.12,
    stagger: 0.1,
    scale: 0.96,
    duration: 0.55,
  })
})
</script>

<template>
  <main
    ref="rootRef"
    class="relative flex min-h-screen items-center justify-center overflow-x-hidden px-4 py-12 sm:px-6 lg:px-8"
  >
    <LeaderboardBackgroundAnimatedBackground />
    <LeaderboardBackgroundFloatingParticles />

    <div class="relative z-10 mx-auto w-full max-w-5xl">
      <div data-enter-title class="mb-8 text-center sm:mb-10">
        <div
          class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-kalbe-lime to-kalbe-green shadow-lime"
          aria-hidden="true"
        >
          <Leaf class="h-7 w-7 text-white" stroke-width="2.5" />
        </div>
        <p class="text-2xs font-semibold uppercase tracking-widest text-kalbe-green">
          Kalbe Donor Kalori
        </p>
        <h1 class="mt-1 text-2xl font-bold text-kalbe-green-dark sm:text-3xl">
          Pilih Perusahaan
        </h1>
        <p class="mx-auto mt-2 max-w-md text-sm text-slate-500">
          Pilih perusahaan untuk melihat leaderboard Donor Kalori.
        </p>
      </div>

      <div class="grid gap-4 sm:grid-cols-2 sm:gap-5">
        <NuxtLink
          v-for="company in companies"
          :key="company.to"
          :to="company.to"
          data-enter-card
          class="group glass-card relative flex flex-col gap-4 p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-float sm:p-6"
        >
          <div class="flex items-start justify-between gap-3">
            <div
              class="flex h-11 w-11 items-center justify-center rounded-xl bg-kalbe-mint text-kalbe-green ring-1 ring-kalbe-green/10 transition-colors group-hover:bg-gradient-to-br group-hover:from-kalbe-lime group-hover:to-kalbe-green group-hover:text-white group-hover:ring-0"
              aria-hidden="true"
            >
              <Building2 class="h-5 w-5" stroke-width="2" />
            </div>
            <span
              class="inline-flex items-center gap-1 rounded-full bg-kalbe-mint px-2.5 py-1 text-2xs font-semibold text-kalbe-green-deep ring-1 ring-kalbe-green/10"
            >
              <Flame class="h-3 w-3 text-kalbe-green" aria-hidden="true" />
              Live
            </span>
          </div>

          <div class="min-w-0 flex-1">
            <h2 class="text-lg font-bold text-kalbe-green-dark">
              {{ company.shortLabel }}
            </h2>
            <p class="mt-0.5 truncate text-xs font-medium text-slate-400">
              {{ company.fullName }}
            </p>
            <p class="mt-2 text-sm leading-relaxed text-slate-500">
              {{ company.description }}
            </p>
          </div>

          <div
            class="mt-auto flex items-center gap-1 text-sm font-semibold text-kalbe-green transition-colors group-hover:text-kalbe-green-deep"
          >
            Buka leaderboard
            <ChevronRight
              class="h-4 w-4 transition-transform group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </div>
        </NuxtLink>
      </div>

      <LeaderboardFooter />
    </div>
  </main>
</template>
