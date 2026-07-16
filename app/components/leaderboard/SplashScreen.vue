<script setup lang="ts">
import { Flame, Leaf, Loader2 } from 'lucide-vue-next'
import { MIN_SPLASH_MS } from '~/constants/leaderboard'
import type { LeaderboardLoadStage } from '~/types/leaderboard'

const props = defineProps<{
  progress: number
  stage: LeaderboardLoadStage
  finished: boolean
}>()

const emit = defineEmits<{
  exitComplete: []
}>()

const rootRef = ref<HTMLElement | null>(null)
const logoRef = ref<HTMLElement | null>(null)
const statusRef = ref<HTMLElement | null>(null)

const { gsap, prefersReducedMotion, canAnimate } = useLeaderboardAnimations()

const displayedProgress = ref(0)
const displayedStage = ref<LeaderboardLoadStage>('connecting')
const minTimeElapsed = ref(false)

const progressState = { value: 0, target: 0 }
let tickerCallback: (() => void) | null = null
let exitStarted = false
let hasEntered = false
let mountTime = 0

const STAGE_MESSAGES: Record<LeaderboardLoadStage, string> = {
  idle: 'Menyiapkan leaderboard…',
  connecting: 'Menghubungkan ke server live…',
  fetching: 'Mengambil data peserta…',
  processing: 'Memproses peringkat…',
  complete: 'Siap! Membuka leaderboard…',
  error: 'Gagal memuat, membuka halaman…',
}

const statusMessage = computed(() => STAGE_MESSAGES[displayedStage.value] ?? STAGE_MESSAGES.idle)

function cappedTarget(raw: number) {
  if (!minTimeElapsed.value) return Math.min(raw, 88)
  return raw
}

function setProgressTarget(target: number) {
  const capped = cappedTarget(target)
  progressState.target = Math.max(progressState.target, capped)
}

function setStage(stage: LeaderboardLoadStage) {
  displayedStage.value = stage
}

function sleep(ms: number) {
  return new Promise<void>(resolve => setTimeout(resolve, ms))
}

function startSmoothProgress() {
  if (tickerCallback) return

  tickerCallback = () => {
    const { value, target } = progressState
    if (target <= value) return

    const delta = target - value
    const step = value < 12 ? 0.022 : value < 40 ? 0.035 : 0.05
    let next = value + Math.max(delta * step, step * 0.35)

    if (next >= target - 0.05) next = target

    progressState.value = next
    displayedProgress.value = Math.round(next)
  }

  gsap.ticker.add(tickerCallback)
}

function stopSmoothProgress() {
  if (tickerCallback) {
    gsap.ticker.remove(tickerCallback)
    tickerCallback = null
  }
}

function playEnter() {
  if (!rootRef.value || !canAnimate()) return

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

  tl.fromTo(
    rootRef.value.querySelector('[data-splash-bg]'),
    { opacity: 0 },
    { opacity: 1, duration: 0.55 },
  )

  if (logoRef.value) {
    tl.fromTo(
      logoRef.value,
      { opacity: 0, scale: 0.6, y: 20 },
      { opacity: 1, scale: 1, y: 0, duration: 0.8, ease: 'back.out(1.6)' },
      '-=0.25',
    )
  }

  tl.fromTo(
    rootRef.value.querySelectorAll('[data-splash-text]'),
    { opacity: 0, y: 16 },
    { opacity: 1, y: 0, duration: 0.55, stagger: 0.08 },
    '-=0.4',
  )

  tl.fromTo(
    rootRef.value.querySelector('[data-splash-progress]'),
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.5 },
    '-=0.3',
  )

  rootRef.value.querySelectorAll('[data-splash-ring]').forEach((ring, i) => {
    gsap.fromTo(
      ring,
      { opacity: 0, scale: 0.85 },
      { opacity: 1, scale: 1, duration: 0.9, delay: 0.2 + i * 0.12, ease: 'power2.out' },
    )
  })
}

async function waitForMinTime() {
  const elapsed = Date.now() - mountTime
  const remaining = MIN_SPLASH_MS - elapsed
  if (remaining > 0) await sleep(remaining)
  minTimeElapsed.value = true
}

async function waitForProgressComplete() {
  setProgressTarget(100)
  setStage(props.stage === 'error' ? 'error' : 'complete')

  if (!canAnimate()) {
    progressState.value = 100
    displayedProgress.value = 100
    return
  }

  await new Promise<void>((resolve) => {
    const finish = () => {
      gsap.ticker.remove(tick)
      clearTimeout(fallback)
      progressState.value = 100
      displayedProgress.value = 100
      resolve()
    }

    const tick = () => {
      if (progressState.value >= 99.5) finish()
    }

    const fallback = setTimeout(finish, 1400)
    gsap.ticker.add(tick)
  })
}

async function playExit() {
  if (exitStarted || !rootRef.value) return
  exitStarted = true

  await waitForMinTime()
  await waitForProgressComplete()
  stopSmoothProgress()

  if (!canAnimate()) {
    emit('exitComplete')
    return
  }

  const tl = gsap.timeline({ onComplete: () => emit('exitComplete') })

  if (logoRef.value) {
    tl.to(logoRef.value, { scale: 1.06, duration: 0.25, ease: 'power2.out' })
  }

  tl.to(
    rootRef.value.querySelector('[data-splash-content]'),
    { opacity: 0, y: -16, scale: 0.98, duration: 0.45, ease: 'power2.in' },
    '-=0.05',
  )

  tl.to(rootRef.value, { opacity: 0, duration: 0.7, ease: 'power2.inOut' }, '-=0.3')
}

function tryExit() {
  if (!props.finished || !hasEntered || exitStarted) return
  playExit()
}

watch(
  () => props.progress,
  (value) => {
    if (!hasEntered) return
    setProgressTarget(value)
  },
)

watch(
  () => props.stage,
  (stage) => {
    if (!hasEntered || stage === 'idle') return
    setStage(stage)
    if (!statusRef.value || !canAnimate()) return
    gsap.fromTo(
      statusRef.value,
      { opacity: 0, y: 6 },
      { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' },
    )
  },
)

watch(() => props.finished, tryExit)

onMounted(() => {
  mountTime = Date.now()

  progressState.value = 0
  progressState.target = 0
  displayedProgress.value = 0
  setStage('connecting')

  nextTick(() => {
    playEnter()
    hasEntered = true
    startSmoothProgress()
    tryExit()
  })
})

onUnmounted(() => {
  stopSmoothProgress()
})
</script>

<template>
  <div
    ref="rootRef"
    class="splash-screen fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden"
    role="dialog"
    aria-modal="true"
    aria-busy="true"
    aria-label="Loading leaderboard"
  >
    <div data-splash-bg class="splash-screen__bg absolute inset-0" aria-hidden="true">
      <div class="splash-screen__gradient absolute inset-0" />
      <div data-splash-ring class="splash-ring splash-ring--1" />
      <div data-splash-ring class="splash-ring splash-ring--2" />
      <div data-splash-ring class="splash-ring splash-ring--3" />
      <div class="splash-orb splash-orb--1" />
      <div class="splash-orb splash-orb--2" />
    </div>

    <div data-splash-content class="relative z-10 flex w-full max-w-md flex-col items-center px-6">
      <div ref="logoRef" class="relative mb-8">
        <div class="splash-logo-glow absolute inset-0 scale-150 rounded-full blur-2xl" aria-hidden="true" />
        <div
          class="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-kalbe-lime via-kalbe-green to-kalbe-green-deep shadow-lime sm:h-24 sm:w-24"
        >
          <Leaf class="h-10 w-10 text-white sm:h-11 sm:w-11" stroke-width="2.5" aria-hidden="true" />
        </div>
        <div class="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-card ring-2 ring-kalbe-mint">
          <Flame class="h-4 w-4 text-kalbe-green" aria-hidden="true" />
        </div>
      </div>

      <div data-splash-text class="mb-1 text-center">
        <p class="text-2xs font-semibold uppercase tracking-[0.2em] text-kalbe-green">
          Donor Kalori
        </p>
        <h1 class="mt-1 text-2xl font-bold text-kalbe-green-dark sm:text-3xl">
          Leaderboard
        </h1>
      </div>

      <p data-splash-text class="mb-10 text-center text-sm text-slate-500">
        Burn for Good · Live data
      </p>

      <div data-splash-progress class="w-full">
        <div class="mb-3 flex items-end justify-between gap-3">
          <div class="flex items-center gap-2 text-kalbe-green-deep">
            <Loader2 class="h-4 w-4 animate-spin text-kalbe-green" aria-hidden="true" />
            <p ref="statusRef" class="text-sm font-medium">
              {{ statusMessage }}
            </p>
          </div>
          <p class="font-display text-2xl font-bold tabular-nums tracking-tight text-kalbe-green-dark">
            {{ displayedProgress }}<span class="text-base text-slate-400">%</span>
          </p>
        </div>

        <div
          class="splash-progress-track"
          role="progressbar"
          :aria-valuenow="displayedProgress"
          aria-valuemin="0"
          aria-valuemax="100"
          :aria-label="statusMessage"
        >
          <div
            class="splash-progress-fill"
            :style="{ width: `${displayedProgress}%` }"
          />
          <div class="splash-progress-shimmer" aria-hidden="true" />
        </div>

        <p class="mt-3 text-center text-2xs text-slate-400">
          Mohon tunggu, sedang sinkronisasi data terbaru…
        </p>
      </div>
    </div>
  </div>
</template>
