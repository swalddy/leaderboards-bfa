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

function onEggComplete() { eggActive.value = false }

defineExpose({ playEntrance })
onMounted(() => { playEntrance() })

watch(
  () => props.entries.map(e => `${e.gender}-${e.employeeId}`).join(','),
  () => { if (hasPlayed) playEntrance() },
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
    <!-- Heading -->
    <div data-podium-heading class="mb-5 sm:mb-6">
      <p class="text-[9px] font-semibold uppercase tracking-[0.2em] text-kalbe-green sm:text-2xs">
        Top Performers
      </p>
      <h2 id="podium-heading" class="mt-0.5 text-base font-bold text-slate-900 sm:text-lg">
        Burn for Good Champions
      </h2>
    </div>

    <div v-if="entries.length > 0" class="lb-podium-scene relative overflow-hidden rounded-[2rem] border border-white/80 px-3 pb-5 pt-7 shadow-sm sm:px-6 sm:pb-7 sm:pt-8">
      <!-- Confetti dots -->
      <div class="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <span class="lb-confetti" style="top:8%;left:6%;background:#FBBF24;width:10px;height:10px;border-radius:2px;transform:rotate(20deg)" />
        <span class="lb-confetti" style="top:12%;left:14%;background:#34D399;width:7px;height:7px;border-radius:50%;animation-delay:.4s" />
        <span class="lb-confetti" style="top:5%;left:28%;background:#818CF8;width:8px;height:12px;border-radius:2px;transform:rotate(-15deg);animation-delay:.8s" />
        <span class="lb-confetti" style="top:18%;right:28%;background:#F472B6;width:7px;height:7px;border-radius:50%;animation-delay:.2s" />
        <span class="lb-confetti" style="top:7%;right:14%;background:#FB923C;width:10px;height:10px;border-radius:2px;transform:rotate(35deg);animation-delay:.6s" />
        <span class="lb-confetti" style="top:14%;right:6%;background:#A78BFA;width:7px;height:11px;border-radius:2px;transform:rotate(-25deg);animation-delay:1s" />
        <span class="lb-confetti" style="top:30%;left:3%;background:#34D399;width:8px;height:8px;border-radius:2px;transform:rotate(10deg);animation-delay:.3s" />
        <span class="lb-confetti" style="top:30%;right:3%;background:#FBBF24;width:8px;height:8px;border-radius:2px;transform:rotate(-10deg);animation-delay:.7s" />
      </div>
      <div class="lb-podium-atom lb-podium-atom--left" aria-hidden="true" />
      <div class="lb-podium-atom lb-podium-atom--right" aria-hidden="true" />
      <div class="lb-podium-aura" aria-hidden="true" />

      <!-- ── MOBILE layout ── -->
      <div class="relative z-10 sm:hidden">
        <!-- Champion card + platform NO.1 -->
        <div v-if="first" class="mb-3">
          <div data-podium-card data-podium-champion class="relative mx-auto max-w-[16rem]">
            <div class="lb-champion-spotlight" aria-hidden="true" />
            <LeaderboardPodiumCard
              :entry="first"
              :place="1"
              :score-delay="0.55"
              :hr-score-delay="1"
              :animation-key="animationKey"
              @easter-egg="onChampionEasterEgg"
            />
          </div>
          <!-- NO.1 platform langsung di bawah card champion -->
          <div class="mx-auto max-w-[16rem] flex flex-col" aria-hidden="true">
            <div class="lb-step-3d lb-step-3d--gold flex items-center justify-center gap-2 py-3">
              <span class="lb-step-laurel lb-step-laurel--gold">🌿</span>
              <span class="lb-step-label-3d lb-step-label-3d--gold">NO.1</span>
              <span class="lb-step-laurel lb-step-laurel--gold lb-step-laurel--flip">🌿</span>
            </div>
            <div class="lb-step-side lb-step-side--gold h-3" />
          </div>
        </div>

        <!-- Rank 2 & 3 cards + platforms -->
        <div class="grid grid-cols-2 items-end gap-2">
          <div v-if="second" data-podium-card>
            <LeaderboardPodiumCard
              :entry="second"
              :place="2"
              :score-delay="0.45"
              :hr-score-delay="0.9"
              :animation-key="animationKey"
            />
          </div>
          <div v-if="third" data-podium-card>
            <LeaderboardPodiumCard
              :entry="third"
              :place="3"
              :score-delay="0.65"
              :hr-score-delay="1.1"
              :animation-key="animationKey"
            />
          </div>
        </div>
        <div class="-mt-1 grid grid-cols-2 gap-2" aria-hidden="true">
          <div v-if="second" class="flex flex-col">
            <div class="lb-step-3d lb-step-3d--silver flex items-center justify-center gap-1.5 py-2.5">
              <span class="lb-step-laurel lb-step-laurel--silver">🏅</span>
              <span class="lb-step-label-3d lb-step-label-3d--silver text-sm">NO.2</span>
              <span class="lb-step-laurel lb-step-laurel--silver lb-step-laurel--flip">🏅</span>
            </div>
            <div class="lb-step-side lb-step-side--silver h-2.5" />
          </div>
          <div v-if="third" class="flex flex-col">
            <div class="lb-step-3d lb-step-3d--bronze flex items-center justify-center gap-1.5 py-2.5">
              <span class="lb-step-laurel lb-step-laurel--bronze">🏅</span>
              <span class="lb-step-label-3d lb-step-label-3d--bronze text-sm">NO.3</span>
              <span class="lb-step-laurel lb-step-laurel--bronze lb-step-laurel--flip">🏅</span>
            </div>
            <div class="lb-step-side lb-step-side--bronze h-2.5" />
          </div>
        </div>
      </div>

      <!-- ── DESKTOP layout: 3 columns ── -->
      <div
        class="relative z-10 hidden items-end gap-3 sm:grid sm:gap-4 lg:gap-5"
        :class="{
          'grid-cols-1 max-w-[15rem] mx-auto': entries.length === 1,
          'grid-cols-2 max-w-xl mx-auto': entries.length === 2,
          'grid-cols-3': entries.length >= 3,
        }"
      >
        <div
          v-if="second"
          data-podium-card
          class="order-1 flex items-end"
          :class="entries.length >= 3 ? 'pt-10 lg:pt-16' : 'order-2 pt-8'"
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
          class="relative"
          :class="entries.length >= 3 ? 'order-2 -translate-y-3 sm:-translate-y-5' : 'order-1'"
        >
          <div class="lb-champion-spotlight" aria-hidden="true" />
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
          class="order-3 flex items-end pt-12 lg:pt-20"
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

      <!-- Desktop platform steps -->
      <div
        class="relative z-0 mx-auto -mt-1 hidden items-end sm:grid"
        :class="{
          'grid-cols-1 max-w-[15rem]': entries.length === 1,
          'grid-cols-2 max-w-xl': entries.length === 2,
          'grid-cols-3': entries.length >= 3,
        }"
        aria-hidden="true"
      >
        <div v-if="second" class="order-1 flex flex-col" :class="entries.length >= 3 ? '' : 'order-2'">
          <div class="lb-step-3d lb-step-3d--silver flex items-center justify-center gap-2 py-3 sm:py-4">
            <span class="lb-step-laurel lb-step-laurel--silver">🏅</span>
            <span class="lb-step-label-3d lb-step-label-3d--silver">NO.2</span>
            <span class="lb-step-laurel lb-step-laurel--silver lb-step-laurel--flip">🏅</span>
          </div>
          <div class="lb-step-side lb-step-side--silver h-3" />
        </div>
        <div v-if="first" class="flex flex-col" :class="entries.length >= 3 ? 'order-2' : 'order-1'">
          <div class="lb-step-3d lb-step-3d--gold flex items-center justify-center gap-2 py-4 sm:py-5">
            <span class="lb-step-laurel lb-step-laurel--gold">🌿</span>
            <span class="lb-step-label-3d lb-step-label-3d--gold">NO.1</span>
            <span class="lb-step-laurel lb-step-laurel--gold lb-step-laurel--flip">🌿</span>
          </div>
          <div class="lb-step-side lb-step-side--gold h-4" />
        </div>
        <div v-if="third" class="order-3 flex flex-col">
          <div class="lb-step-3d lb-step-3d--bronze flex items-center justify-center gap-2 py-3 sm:py-4">
            <span class="lb-step-laurel lb-step-laurel--bronze">🏅</span>
            <span class="lb-step-label-3d lb-step-label-3d--bronze">NO.3</span>
            <span class="lb-step-laurel lb-step-laurel--bronze lb-step-laurel--flip">🏅</span>
          </div>
          <div class="lb-step-side lb-step-side--bronze h-3" />
        </div>
      </div>
    </div>

    <LeaderboardChampionSprintEgg
      :active="eggActive"
      :champion-name="eggName"
      @complete="onEggComplete"
    />
  </section>
</template>
