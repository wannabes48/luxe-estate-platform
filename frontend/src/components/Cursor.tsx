"use client"

import React, { useEffect, useRef } from 'react'

export default function ClientCursor() {
  const cursorRef = useRef<HTMLDivElement | null>(null)
  const pos = useRef({ x: 0, y: 0 })
  const mouse = useRef({ x: 0, y: 0 })
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX
      mouse.current.y = e.clientY
    }

    const onDown = () => {
      if (cursorRef.current) cursorRef.current.style.transform += ' scale(0.8)'
    }

    const onUp = () => {
      if (cursorRef.current) cursorRef.current.style.transform = cursorRef.current.style.transform.replace(' scale(0.8)', '')
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('pointerdown', onDown)
    window.addEventListener('pointerup', onUp)

    const render = () => {
      pos.current.x += (mouse.current.x - pos.current.x) * 0.15
      pos.current.y += (mouse.current.y - pos.current.y) * 0.15

      if (cursorRef.current) {
        cursorRef.current.style.left = `${pos.current.x}px`
        cursorRef.current.style.top = `${pos.current.y}px`
      }

      rafRef.current = requestAnimationFrame(render)
    }

    rafRef.current = requestAnimationFrame(render)

    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <div
      ref={cursorRef}
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        width: 20,
        height: 20,
        marginLeft: -10,
        marginTop: -10,
        borderRadius: '50%',
        pointerEvents: 'none',
        zIndex: 9999,
        background: 'rgba(0,0,0,0.7)',
        mixBlendMode: 'difference',
        transform: 'translate3d(0,0,0) scale(1)',
        transition: 'transform 120ms ease-out, background 120ms ease-out',
      }}
      aria-hidden
    />
  )
}
