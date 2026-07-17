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
    const arena = root.querySelector('[data-podium-arena]')
    const cards = root.querySelectorAll('[data-podium-card]')
    const medals = root.querySelectorAll('[data-podium-medal]')
    const avatars = root.querySelectorAll('[data-podium-avatar]')
    const infos = root.querySelectorAll('[data-podium-info]')
    const blocks = root.querySelectorAll('[data-podium-block]')
    const floor = root.querySelector('[data-podium-floor]')

    const tl = gsap.timeline({ defaults: { ease: 'power2.out' } })

    if (heading) {
      tl.fromTo(
        heading,
        { opacity: 0, y: -12 },
        { opacity: 1, y: 0, duration: duration(0.55), immediateRender: true },
      )
    }

    if (arena) {
      tl.fromTo(
        arena,
        { opacity: 0, scale: 0.98 },
        {
          opacity: 1,
          scale: 1,
          duration: duration(0.7),
          ease: 'power2.out',
          immediateRender: true,
          clearProps: 'transform,opacity',
        },
        heading ? '-=0.25' : 0,
      )
    }

    if (cards.length) {
      tl.fromTo(
        cards,
        { opacity: 0, y: 28 },
        {
          opacity: 1,
          y: 0,
          duration: duration(0.85),
          stagger: 0.1,
          ease: 'power3.out',
          immediateRender: true,
          clearProps: 'transform,opacity',
        },
        '-=0.45',
      )
    }

    if (medals.length) {
      tl.fromTo(
        medals,
        { opacity: 0, scale: 0.4, y: -8 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: duration(0.55),
          stagger: 0.1,
          ease: 'back.out(2.2)',
          immediateRender: true,
          clearProps: 'transform,opacity',
        },
        '-=0.55',
      )
    }

    if (avatars.length) {
      tl.fromTo(
        avatars,
        { opacity: 0, scale: 0.55 },
        {
          opacity: 1,
          scale: 1,
          duration: duration(0.6),
          stagger: 0.1,
          ease: 'back.out(1.8)',
          immediateRender: true,
          clearProps: 'transform,opacity',
        },
        '-=0.45',
      )
    }

    if (infos.length) {
      tl.fromTo(
        infos,
        { opacity: 0, y: 14 },
        {
          opacity: 1,
          y: 0,
          duration: duration(0.55),
          stagger: 0.1,
          ease: 'power2.out',
          immediateRender: true,
          clearProps: 'transform,opacity',
        },
        '-=0.4',
      )
    }

    if (blocks.length) {
      tl.fromTo(
        blocks,
        { scaleY: 0, opacity: 0.6 },
        {
          scaleY: 1,
          opacity: 1,
          duration: duration(0.85),
          stagger: 0.1,
          ease: 'power3.out',
          transformOrigin: 'bottom center',
          immediateRender: true,
          clearProps: 'transform,opacity',
        },
        '-=0.35',
      )
    }

    if (floor) {
      tl.fromTo(
        floor,
        { scaleX: 0, opacity: 0 },
        {
          scaleX: 1,
          opacity: 1,
          duration: duration(0.5),
          ease: 'power2.out',
          transformOrigin: 'center center',
          immediateRender: true,
          clearProps: 'transform,opacity',
        },
        '-=0.5',
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
    if (!tl) return null

    const championSlot = root.querySelector<HTMLElement>('[data-podium-champion]')
    const championCard = championSlot?.querySelector<HTMLElement>('.podium-card--champion')
    const championMedal = championSlot?.querySelector<HTMLElement>('[data-podium-medal]')
    const championAura = championSlot?.querySelector<HTMLElement>('.podium-champion-aura')
    const championCrown = championSlot?.querySelector<HTMLElement>('[data-podium-crown]')
    const championRays = championSlot?.querySelector<HTMLElement>('[data-podium-rays]')
    const championSparkles = championSlot?.querySelectorAll<HTMLElement>('.podium-champion-sparkle')
    const spotlight = root.querySelector<HTMLElement>('[data-podium-spotlight]')
    const hasFiredConfetti = useState('podium-confetti-fired', () => false)

    if (!prefersReducedMotion.value && spotlight) {
      tl.fromTo(
        spotlight,
        { opacity: 0, scaleY: 0.4 },
        {
          opacity: 1,
          scaleY: 1,
          duration: duration(0.9),
          ease: 'power2.out',
          transformOrigin: 'top center',
          clearProps: 'opacity,transform',
        },
        0.2,
      )
    }

    if (!prefersReducedMotion.value && !hasFiredConfetti.value) {
      hasFiredConfetti.value = true
      tl.call(() => {
        confetti({
          origin: { y: 0.32 },
          zIndex: 40,
          particleCount: 48,
          spread: 62,
          startVelocity: 26,
          ticks: 140,
          disableForReducedMotion: true,
          colors: ['#15803D', '#84CC16', '#CA8A04', '#FACC15', '#ffffff'],
        })
      }, undefined, 0.7)

      tl.call(() => {
        if (!championSlot) return
        const rect = championSlot.getBoundingClientRect()
        const x = (rect.left + rect.width / 2) / window.innerWidth
        const y = (rect.top + rect.height * 0.22) / window.innerHeight
        confetti({
          origin: { x, y },
          zIndex: 40,
          particleCount: 42,
          spread: 70,
          startVelocity: 22,
          ticks: 130,
          scalar: 1.05,
          disableForReducedMotion: true,
          colors: ['#CA8A04', '#FACC15', '#FDE047', '#FEF08A', '#FEF9C3', '#ffffff'],
        })
        confetti({
          origin: { x, y: Math.min(0.95, y + 0.08) },
          zIndex: 40,
          particleCount: 18,
          spread: 360,
          startVelocity: 12,
          ticks: 90,
          scalar: 0.8,
          disableForReducedMotion: true,
          colors: ['#FDE047', '#FACC15', '#ffffff'],
        })
      }, undefined, 1.05)
    }

    if (!prefersReducedMotion.value && championCard) {
      const liftY = window.matchMedia('(min-width: 640px)').matches ? -16 : -4

      tl.to(
        championCard,
        {
          scale: 1.08,
          y: liftY,
          duration: duration(0.4),
          ease: 'power2.out',
        },
        '-=0.2',
      )
      tl.to(championCard, {
        scale: 1,
        y: liftY,
        duration: duration(0.5),
        ease: 'back.out(2)',
      })

      if (championCrown) {
        tl.fromTo(
          championCrown,
          { opacity: 0, y: 12, scale: 0.4, rotation: -20 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            rotate: 0,
            duration: duration(0.55),
            ease: 'back.out(2.6)',
            clearProps: 'opacity,transform',
          },
          '-=0.55',
        )
      }

      if (championMedal) {
        tl.fromTo(
          championMedal,
          { scale: 1 },
          {
            scale: 1.2,
            duration: duration(0.3),
            yoyo: true,
            repeat: 1,
            ease: 'back.out(2.8)',
          },
          '<',
        )
      }

      if (championAura) {
        tl.fromTo(
          championAura,
          { opacity: 0, scale: 0.45 },
          {
            opacity: 1,
            scale: 1,
            duration: duration(0.65),
            ease: 'power2.out',
            clearProps: 'opacity,transform',
          },
          '-=0.6',
        )
      }

      if (championRays) {
        tl.fromTo(
          championRays,
          { opacity: 0, scale: 0.5 },
          {
            opacity: 0.85,
            scale: 1,
            duration: duration(0.8),
            ease: 'power2.out',
            clearProps: 'opacity,transform',
          },
          '-=0.7',
        )
      }

      if (championSparkles?.length) {
        tl.fromTo(
          championSparkles,
          { opacity: 0, scale: 0 },
          {
            opacity: 1,
            scale: 1,
            duration: duration(0.4),
            stagger: 0.08,
            ease: 'back.out(2)',
            clearProps: 'opacity,transform',
          },
          '-=0.45',
        )
      }

      tl.to(championCard, {
        y: liftY - 6,
        duration: 2.6,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      })
    }

    return tl
  }

  type ChampionSprintEggOptions = {
    name?: string
    onComplete?: () => void
  }

  let sprintEggTimeline: gsap.core.Timeline | null = null
  const SPRINT_EGG_COOLDOWN_MS = 4000

  function playChampionSprintEgg(
    overlayRoot: HTMLElement | null,
    originEl: HTMLElement | null,
    options: ChampionSprintEggOptions = {},
  ) {
    if (!import.meta.client || !overlayRoot) {
      options.onComplete?.()
      return null
    }

    const cooldownUntil = useState('champion-sprint-egg-cooldown', () => 0)
    const now = Date.now()
    if (now < cooldownUntil.value) {
      return null
    }
    cooldownUntil.value = now + SPRINT_EGG_COOLDOWN_MS

    sprintEggTimeline?.kill()

    const runners = overlayRoot.querySelectorAll<HTMLElement>('[data-sprint-runner]')
    const cals = overlayRoot.querySelectorAll<HTMLElement>('[data-sprint-cal]')
    const caption = overlayRoot.querySelector<HTMLElement>('[data-sprint-caption]')
    const reduced = prefersReducedMotion.value

    const originRect = originEl?.getBoundingClientRect()
    const originX = originRect
      ? (originRect.left + originRect.width / 2) / window.innerWidth
      : 0.5
    const originY = originRect
      ? (originRect.top + originRect.height * 0.25) / window.innerHeight
      : 0.35

    if (originEl && !reduced) {
      const pulseTarget =
        originEl.querySelector<HTMLElement>('[data-podium-avatar]') ?? originEl
      gsap.fromTo(
        pulseTarget,
        { scale: 1 },
        {
          scale: 1.12,
          duration: duration(0.22),
          yoyo: true,
          repeat: 1,
          ease: 'power2.out',
          clearProps: 'transform',
        },
      )
    }
    else if (originEl && reduced) {
      const pulseTarget =
        originEl.querySelector<HTMLElement>('[data-podium-avatar]') ?? originEl
      gsap.fromTo(
        pulseTarget,
        { scale: 1 },
        {
          scale: 1.06,
          duration: 0.2,
          yoyo: true,
          repeat: 1,
          ease: 'power1.out',
          clearProps: 'transform',
        },
      )
    }

    if (!reduced) {
      confetti({
        origin: { x: originX, y: originY },
        zIndex: 80,
        particleCount: 56,
        spread: 78,
        startVelocity: 28,
        ticks: 150,
        scalar: 1.05,
        disableForReducedMotion: true,
        colors: ['#15803D', '#84CC16', '#CA8A04', '#FACC15', '#FDE047', '#ffffff'],
      })
      confetti({
        origin: { x: originX, y: Math.min(0.95, originY + 0.06) },
        zIndex: 80,
        particleCount: 24,
        spread: 360,
        startVelocity: 14,
        ticks: 100,
        scalar: 0.85,
        disableForReducedMotion: true,
        colors: ['#FDE047', '#FACC15', '#84CC16', '#ffffff'],
      })
    }

    const tl = gsap.timeline({
      onComplete: () => {
        sprintEggTimeline = null
        options.onComplete?.()
      },
    })
    sprintEggTimeline = tl

    if (caption) {
      tl.fromTo(
        caption,
        { opacity: 0, y: reduced ? 0 : -12, scale: reduced ? 1 : 0.92, xPercent: -50 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          xPercent: -50,
          duration: duration(reduced ? 0.25 : 0.45),
          ease: 'back.out(1.8)',
        },
        0,
      )
      tl.to(
        caption,
        {
          opacity: 0,
          y: reduced ? 0 : -8,
          xPercent: -50,
          duration: duration(0.35),
          ease: 'power2.in',
        },
        reduced ? 1.4 : 2.6,
      )
    }

    if (!reduced && runners.length) {
      const vw = window.innerWidth
      runners.forEach((runner, i) => {
        const lane = Number(runner.dataset.lane ?? i)
        const startX = -80 - i * 40
        const endX = vw + 80
        const dur = 1.6 + (i % 3) * 0.22
        const delay = 0.08 + i * 0.12

        gsap.set(runner, {
          x: startX,
          y: 0,
          opacity: 1,
          scale: 0.85 + (lane % 3) * 0.08,
        })

        tl.to(
          runner,
          {
            x: endX,
            duration: duration(dur),
            ease: 'power1.in',
            opacity: 1,
          },
          delay,
        )
      })
    }
    else if (runners.length) {
      gsap.set(runners, { opacity: 0 })
    }

    if (!reduced && cals.length) {
      const baseLeft = originRect
        ? originRect.left + originRect.width / 2
        : window.innerWidth / 2
      const baseTop = originRect
        ? originRect.top + originRect.height * 0.2
        : window.innerHeight * 0.35

      cals.forEach((chip, i) => {
        const angle = (i / cals.length) * Math.PI * 2
        const radius = 28 + (i % 4) * 18
        const startX = baseLeft + Math.cos(angle) * radius - 24
        const startY = baseTop + Math.sin(angle) * (radius * 0.35)
        const driftX = (i % 2 === 0 ? 1 : -1) * (20 + (i % 5) * 12)

        gsap.set(chip, {
          left: startX,
          top: startY,
          x: 0,
          y: 0,
          opacity: 0,
          scale: 0.6,
        })

        tl.to(
          chip,
          {
            opacity: 1,
            scale: 1,
            duration: duration(0.25),
            ease: 'back.out(2)',
          },
          0.15 + i * 0.05,
        )
        tl.to(
          chip,
          {
            y: -(90 + (i % 4) * 28),
            x: driftX,
            opacity: 0,
            duration: duration(1.4 + (i % 3) * 0.15),
            ease: 'power2.out',
          },
          0.2 + i * 0.05,
        )
      })
    }
    else if (cals.length) {
      gsap.set(cals, { opacity: 0 })
    }

    if (!caption && reduced) {
      tl.to({}, { duration: 0.4 })
    }
    else if (!caption) {
      tl.to({}, { duration: 3.4 })
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
    playChampionSprintEgg,
    revealListRows,
    crossfadePanel,
    floatElement,
    animateProgress,
    parallaxBlobs,
  }
}
