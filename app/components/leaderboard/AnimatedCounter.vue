<script setup lang="ts">
import { CountUp } from 'countup.js'

const props = withDefaults(defineProps<{
  value: number
  duration?: number
  startDelay?: number
  decimals?: number
  prefix?: string
  suffix?: string
  separator?: string
}>(), {
  duration: 1.4,
  startDelay: 0,
  decimals: 0,
  prefix: '',
  suffix: '',
  separator: ',',
})

const el = ref<HTMLElement | null>(null)
const prefersReducedMotion = usePreferredReducedMotion()
let countUp: CountUp | null = null

function run(to: number) {
  if (!el.value) return

  if (prefersReducedMotion.value) {
    el.value.textContent = `${props.prefix}${new Intl.NumberFormat('en-US').format(to)}${props.suffix}`
    return
  }

  if (!countUp) {
    countUp = new CountUp(el.value, to, {
      duration: props.duration,
      decimalPlaces: props.decimals,
      prefix: props.prefix,
      suffix: props.suffix,
      separator: props.separator,
      useEasing: true,
    })
    if (!countUp.error) countUp.start()
    return
  }

  countUp.update(to)
}

onMounted(() => {
  if (props.startDelay > 0) {
    setTimeout(() => run(props.value), props.startDelay * 1000)
    return
  }

  run(props.value)
})

watch(() => props.value, (next) => {
  run(next)
})
</script>

<template>
  <span ref="el">0</span>
</template>
