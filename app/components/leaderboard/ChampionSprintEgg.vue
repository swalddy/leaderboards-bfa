<script setup lang="ts">
const props = defineProps<{
  active: boolean
  championName: string
}>()

const emit = defineEmits<{
  complete: []
}>()

const rootRef = ref<HTMLElement | null>(null)
const { playChampionSprintEgg } = useLeaderboardAnimations()

const displayName = computed(() => {
  const name = props.championName.trim()
  if (!name) return 'Champion'
  const first = name.split(/\s+/)[0]
  return first || name
})

const calorieValues = [42, 88, 120, 56, 99, 75, 110, 64, 130, 48]
const runnerCount = 5

defineExpose({ rootRef })

watch(
  () => props.active,
  (active) => {
    if (!active) return
    nextTick(() => {
      requestAnimationFrame(() => {
        const origin = document.querySelector<HTMLElement>('[data-podium-champion] .podium-card--champion')
        const tl = playChampionSprintEgg(rootRef.value, origin, {
          name: props.championName,
          onComplete: () => emit('complete'),
        })
        if (!tl) emit('complete')
      })
    })
  },
)
</script>

<template>
  <Teleport to="body">
    <div
      v-if="active"
      ref="rootRef"
      class="champion-sprint-egg"
      aria-hidden="true"
    >
      <p data-sprint-caption class="champion-sprint-caption">
        <span class="champion-sprint-caption__fire">{{ displayName }} is on fire!</span>
        <span class="champion-sprint-caption__sub">Calorie sprint · Burn for Good</span>
      </p>

      <div
        v-for="i in runnerCount"
        :key="`runner-${i}`"
        class="champion-sprint-runner"
        data-sprint-runner
        :data-lane="i - 1"
        :style="{ top: `${18 + (i - 1) * 11}%` }"
      >
        <svg
          class="champion-sprint-runner__svg"
          viewBox="0 0 48 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="28" cy="10" r="6" fill="currentColor" />
          <path
            d="M26 16 L22 32 L12 28 M22 32 L18 48 L10 58 M22 32 L30 46 L38 42 M26 18 L36 26 L42 22"
            stroke="currentColor"
            stroke-width="3.2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>

      <span
        v-for="(val, i) in calorieValues"
        :key="`cal-${i}`"
        class="champion-sprint-cal"
        data-sprint-cal
        :class="i % 2 === 0 ? 'champion-sprint-cal--gold' : 'champion-sprint-cal--green'"
      >
        +{{ val }}
      </span>
    </div>
  </Teleport>
</template>
