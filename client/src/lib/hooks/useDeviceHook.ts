'use client'
import { useEffect, useRef, useState } from 'react'

type DeviceType = 'mobile' | 'tablet' | 'desktop'

interface DeviceInfo {
  device: DeviceType
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
}

function getDeviceFromWidth(width: number): DeviceInfo {
  if (width < 640) {
    return {
      device: 'mobile',
      isMobile: true,
      isTablet: false,
      isDesktop: false,
    }
  }
  if (width < 1024) {
    return {
      device: 'tablet',
      isMobile: false,
      isTablet: true,
      isDesktop: false,
    }
  }
  return {
    device: 'desktop',
    isMobile: false,
    isTablet: false,
    isDesktop: true,
  }
}
export function useDeviceType(): DeviceInfo {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>(() =>
    typeof window === 'undefined'
      ? { device: 'desktop', isMobile: false, isTablet: false, isDesktop: true }
      : getDeviceFromWidth(window.innerWidth),
  )
  const [mounted, setMounted] = useState(false)

  const currentDevice = useRef<DeviceType>(deviceInfo.device)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    setMounted(true) // ✅ only show after mount

    const next = getDeviceFromWidth(window.innerWidth)
    currentDevice.current = next.device
    setDeviceInfo(next)

    const onResize = () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(() => {
        const next = getDeviceFromWidth(window.innerWidth)
        if (next.device !== currentDevice.current) {
          currentDevice.current = next.device
          setDeviceInfo(next)
        }
      })
    }

    window.addEventListener('resize', onResize, { passive: true })
    return () => {
      window.removeEventListener('resize', onResize)
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  // ✅ don’t render device info until mounted
  if (!mounted) {
    return {
      device: 'desktop',
      isMobile: false,
      isTablet: false,
      isDesktop: true,
    }
  }

  return deviceInfo
}
