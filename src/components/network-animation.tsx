"use client"

import { useRef, useEffect, useCallback } from 'react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
}

export function NetworkAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const animationFrameRef = useRef<number | undefined>(undefined)
  const particlesRef = useRef<Particle[]>([])
  const reducedMotionRef = useRef(false)
  
  // Optimized particle count based on screen size
  const getParticleCount = useCallback((width: number, height: number) => {
    const area = width * height
    // Mobile: fewer particles, Desktop: more particles
    if (width < 768) {
      return Math.floor(area / 25000) // ~15-20 particles on mobile
    } else if (width < 1024) {
      return Math.floor(area / 20000) // ~30-40 particles on tablet
    } else {
      return Math.floor(area / 15000) // ~50-60 particles on desktop
    }
  }, [])
  
  // Optimized distance calculation
  const distanceSquared = useCallback((p1: Particle, p2: Particle) => {
    const dx = p1.x - p2.x
    const dy = p1.y - p2.y
    return dx * dx + dy * dy
  }, [])
  
  const initParticles = useCallback((width: number, height: number) => {
    const particleCount = getParticleCount(width, height)
    const particles: Particle[] = []
    
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        radius: Math.random() * 2 + 1
      })
    }
    
    particlesRef.current = particles
  }, [getParticleCount])
  
  const drawStatic = useCallback((canvas: HTMLCanvasElement, container: HTMLDivElement) => {
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    canvas.width = container.offsetWidth
    canvas.height = container.offsetHeight
    
    const particleCount = getParticleCount(canvas.width, canvas.height)
    const particles: Array<{x: number, y: number, radius: number}> = []
    
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2 + 1
      })
    }
    
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    // Draw particles
    particles.forEach(particle => {
      ctx.beginPath()
      ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(24, 199, 122, 0.3)'
      ctx.fill()
    })
    
    // Draw connections
    const maxDistanceSquared = 120 * 120
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x
        const dy = particles[i].y - particles[j].y
        const distSq = dx * dx + dy * dy
        
        if (distSq < maxDistanceSquared) {
          const distance = Math.sqrt(distSq)
          ctx.beginPath()
          ctx.strokeStyle = `rgba(24, 199, 122, ${0.08 * (1 - distance / 120)})`
          ctx.lineWidth = 0.5
          ctx.moveTo(particles[i].x, particles[i].y)
          ctx.lineTo(particles[j].x, particles[j].y)
          ctx.stroke()
        }
      }
    }
  }, [getParticleCount, distanceSquared])
  
  const animate = useCallback((canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
    const particles = particlesRef.current
    const maxDistanceSquared = 150 * 150
    
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    // Update and draw particles
    particles.forEach(particle => {
      particle.x += particle.vx
      particle.y += particle.vy
      
      // Bounce off walls
      if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1
      if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1
      
      ctx.beginPath()
      ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(24, 199, 122, 0.3)'
      ctx.fill()
    })
    
    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x
        const dy = particles[i].y - particles[j].y
        const distSq = dx * dx + dy * dy
        
        if (distSq < maxDistanceSquared) {
          const distance = Math.sqrt(distSq)
          ctx.beginPath()
          ctx.strokeStyle = `rgba(24, 199, 122, ${0.1 * (1 - distance / 150)})`
          ctx.lineWidth = 0.5
          ctx.moveTo(particles[i].x, particles[i].y)
          ctx.lineTo(particles[j].x, particles[j].y)
          ctx.stroke()
        }
      }
    }
    
    animationFrameRef.current = requestAnimationFrame(() => animate(canvas, ctx))
  }, [])
  
  const handleResize = useCallback(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return
    
    canvas.width = container.offsetWidth
    canvas.height = container.offsetHeight
    
    if (reducedMotionRef.current) {
      drawStatic(canvas, container)
    } else {
      initParticles(canvas.width, canvas.height)
    }
  }, [drawStatic, initParticles])
  
  const handleReducedMotionChange = useCallback((e: MediaQueryListEvent) => {
    reducedMotionRef.current = e.matches
    const canvas = canvasRef.current
    const container = containerRef.current
    
    if (!canvas || !container) return
    
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
    }
    
    if (e.matches) {
      drawStatic(canvas, container)
    } else {
      const ctx = canvas.getContext('2d')
      if (ctx) {
        initParticles(canvas.width, canvas.height)
        animate(canvas, ctx)
      }
    }
  }, [drawStatic, initParticles, animate])
  
  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    // Check initial reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    reducedMotionRef.current = mediaQuery.matches
    
    // Handle initial setup
    canvas.width = container.offsetWidth
    canvas.height = container.offsetHeight
    
    if (mediaQuery.matches) {
      drawStatic(canvas, container)
    } else {
      initParticles(canvas.width, canvas.height)
      animate(canvas, ctx)
    }
    
    // Event listeners
    const resizeObserver = new ResizeObserver(() => handleResize())
    resizeObserver.observe(container)
    
    mediaQuery.addEventListener('change', handleReducedMotionChange)
    
    // Cleanup
    return () => {
      resizeObserver.disconnect()
      mediaQuery.removeEventListener('change', handleReducedMotionChange)
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [drawStatic, initParticles, animate, handleResize, handleReducedMotionChange])
  
  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 overflow-hidden pointer-events-none"
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  )
}