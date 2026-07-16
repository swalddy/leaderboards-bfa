import confetti from 'canvas-confetti'
import gsap from 'gsap'

type RevealOptions = {
  delay?: number
  stagger?: number
  y?: number
  x?: number
  scale?: number
  duration?: number
  ease?: string
  clearProps?: string | boolean
}

export function useLeaderboardAnimations() {
  const prefersReducedMotion = usePreferredReducedMotion()

  const duration = (sec: number) => {
    if (!import.meta.client) return 0
    if (prefersReducedMotion.value) return Math.min(sec, 0.3)
    return sec
  }

  function canAnimate() {
    return import.meta.client
  }

  function runAfterPaint(callback: () => void) {
    onMounted(() => {
      nextTick(() => {
        requestAnimationFrame(() => {
          requestAnimationFrame(callback)
        })
      })
    })
  }

  function revealFrom(
    targets: gsap.TweenTarget,
    from: gsap.TweenVars,
    to: gsap.TweenVars,
    options: RevealOptions = {},
  ) {
    if (!import.meta.client) return
    if (!targets || (targets instanceof NodeList && targets.length === 0)) return

    const dur = duration(options.duration ?? 0.7)

    gsap.fromTo(
      targets,
      from,
      {
        ...to,
        duration: dur,
        delay: options.delay ?? 0,
        stagger: options.stagger ?? 0,
        ease: options.ease ?? 'power3.out',
        immediateRender: true,
        clearProps: options.clearProps ?? 'transform,opacity',
        overwrite: 'auto',
      },
    )
  }

  function fadeSlideUp(
    targets: gsap.TweenTarget,
    options: RevealOptions = {},
  ) {
    revealFrom(
      targets,
      { opacity: 0, y: options.y ?? 24 },
      { opacity: 1, y: 0 },
      { ...options, ease: options.ease ?? 'power3.out' },
    )
  }

  function fadeSlideDown(
    targets: gsap.TweenTarget,
    options: RevealOptions = {},
  ) {
    revealFrom(
      targets,
      { opacity: 0, y: options.y ?? -16 },
      { opacity: 1, y: 0 },
      { ...options, ease: options.ease ?? 'power3.out' },
    )
  }

  function scaleIn(
    targets: gsap.TweenTarget,
    options: RevealOptions = {},
  ) {
    revealFrom(
      targets,
      { opacity: 0, scale: options.scale ?? 0.94 },
      { opacity: 1, scale: 1 },
      { ...options, ease: options.ease ?? 'power2.out' },
    )
  }

  function staggerIn(
    container: HTMLElement | null,
    selector: string,
    options: RevealOptions = {},
  ) {
    if (!container) return
    const items = container.querySelectorAll(selector)
    if (!items.length) return

    fadeSlideUp(items, {
      y: options.y ?? 18,
      stagger: options.stagger ?? 0.05,
      delay: options.delay ?? 0,
      duration: options.duration ?? 0.55,
      ...options,
    })
  }

  function revealPodium(root: HTMLElement | null) {
    if (!import.meta.client || !root) return null

    const heading = root.querySelector('[data-podium-heading]')
    const cards = root.querySelectorAll('[data-podium-card]')

    const tl = gsap.timeline({ defaults: { ease: 'power2.out' } })

    if (heading) {
      tl.fromTo(
        heading,
        { opacity: 0, y: -10 },
        { opacity: 1, y: 0, duration: duration(0.55), immediateRender: true },
      )
    }

    if (cards.length) {
      tl.fromTo(
        cards,
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: duration(0.9),
          stagger: 0.12,
          ease: 'power2.out',
          immediateRender: true,
          clearProps: 'transform,opacity',
        },
        heading ? '-=0.2' : 0,
      )
    }

    return tl
  }

  function revealListRows(
    container: HTMLElement | null,
    selector = '[data-list-row]',
  ) {
    if (!container) return
    const rows = container.querySelectorAll(selector)
    if (!rows.length) return

    revealFrom(
      rows,
      { opacity: 0, y: 16, scale: 0.98 },
      { opacity: 1, y: 0, scale: 1 },
      {
        stagger: 0.04,
        duration: 0.5,
        ease: 'power2.out',
      },
    )
  }

  function crossfadePanel(
    outgoing: HTMLElement | null,
    incoming: HTMLElement | null,
  ) {
    if (!canAnimate() || !outgoing || !incoming) return

    const tl = gsap.timeline({ defaults: { duration: 0.28, ease: 'power2.inOut' } })
    tl.to(outgoing, { opacity: 0, y: -6 })
    tl.fromTo(incoming, { opacity: 0, y: 8 }, { opacity: 1, y: 0 }, 0)
  }

  function floatElement(el: gsap.TweenTarget) {
    if (!canAnimate() || prefersReducedMotion.value) return null

    return gsap.to(el, {
      y: -6,
      duration: 2.8,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
    })
  }

  function animateProgress(el: HTMLElement | null, percent: number) {
    if (!el || !import.meta.client) return

    gsap.to(el, {
      width: `${Math.min(100, Math.max(0, percent))}%`,
      duration: duration(0.8),
      ease: 'power2.out',
    })
  }

  function playPodiumEntrance(root: HTMLElement | null) {
    if (!root) return null

    const tl = revealPodium(root)
    const hasFiredConfetti = useState('podium-confetti-fired', () => false)

    if (!prefersReducedMotion.value && !hasFiredConfetti.value) {
      hasFiredConfetti.value = true
      tl?.call(() => {
        confetti({
          origin: { y: 0.35 },
          zIndex: 40,
          particleCount: 36,
          spread: 48,
          startVelocity: 22,
          ticks: 120,
          disableForReducedMotion: true,
          colors: ['#15803D', '#84CC16', '#CA8A04', '#ffffff'],
        })
      }, undefined, 0.75)
    }

    return tl
  }

  function parallaxBlobs(
    blobs: HTMLElement[],
    mouseX: Ref<number>,
    mouseY: Ref<number>,
  ) {
    if (!canAnimate() || prefersReducedMotion.value) return

    const setters = blobs.map((blob, i) => ({
      x: gsap.quickSetter(blob, 'x', 'px'),
      y: gsap.quickSetter(blob, 'y', 'px'),
      factor: 10 + i * 6,
    }))

    watchEffect(() => {
      const cx = window.innerWidth / 2
      const cy = window.innerHeight / 2
      const dx = (mouseX.value - cx) / cx
      const dy = (mouseY.value - cy) / cy

      setters.forEach(({ x, y, factor }) => {
        x(dx * factor)
        y(dy * factor)
      })
    })
  }

  return {
    gsap,
    prefersReducedMotion,
    duration,
    canAnimate,
    runAfterPaint,
    fadeSlideUp,
    fadeSlideDown,
    scaleIn,
    staggerIn,
    revealPodium,
    playPodiumEntrance,
    revealListRows,
    crossfadePanel,
    floatElement,
    animateProgress,
    parallaxBlobs,
  }
}
