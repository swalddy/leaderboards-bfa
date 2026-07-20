<script setup lang="ts">
const props = withDefaults(defineProps<{
  rank: number
  size?: 'sm' | 'md' | 'lg'
}>(), { size: 'md' })

const sizeClass = computed(() => {
  if (props.size === 'lg') return 'h-10 w-10 text-sm'
  if (props.size === 'sm') return 'h-6 w-6 text-[10px]'
  return 'h-8 w-8 text-xs'
})

const styleClass = computed(() => {
  if (props.rank === 1) return 'bg-[linear-gradient(110deg,#FCD34D_0%,#FDE047_40%,#F59E0B_55%,#FCD34D_100%)] bg-[length:220%_100%] text-amber-900 font-bold shadow-sm ring-1 ring-amber-300 motion-safe:animate-[lb-badge-shimmer_4s_ease-in-out_infinite]'
  if (props.rank === 2) return 'bg-[linear-gradient(110deg,#F8FAFC_0%,#CBD5E1_44%,#94A3B8_58%,#F8FAFC_100%)] bg-[length:220%_100%] text-slate-700 font-bold shadow-sm ring-1 ring-slate-300 motion-safe:animate-[lb-badge-shimmer_4.4s_ease-in-out_infinite]'
  if (props.rank === 3) return 'bg-[linear-gradient(110deg,#FED7AA_0%,#FDBA74_42%,#FB923C_58%,#FED7AA_100%)] bg-[length:220%_100%] text-orange-900 font-bold shadow-sm ring-1 ring-orange-200 motion-safe:animate-[lb-badge-shimmer_4.8s_ease-in-out_infinite]'
  return 'bg-slate-100 text-slate-600 font-semibold ring-1 ring-slate-200'
})
</script>

<template>
  <div
    class="inline-flex shrink-0 items-center justify-center rounded-full font-display tabular-nums"
    :class="[sizeClass, styleClass]"
    :aria-label="`Rank ${rank}`"
  >
    {{ rank }}
  </div>
</template>
