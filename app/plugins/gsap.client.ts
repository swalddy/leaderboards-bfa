import gsap from 'gsap'
import { Flip } from 'gsap/Flip'

export default defineNuxtPlugin(() => {
  gsap.registerPlugin(Flip)
  gsap.config({ nullTargetWarn: false })

  return {
    provide: {
      gsap,
      Flip,
    },
  }
})
