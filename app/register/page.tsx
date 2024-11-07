"use client"

import React, { useState, useEffect, useRef, Suspense } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Points, PointMaterial, Text, PerspectiveCamera, useTexture } from "@react-three/drei"
import * as THREE from "three"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

// Error Boundary Component
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong. Please try refreshing the page.</h1>
    }

    return this.props.children
  }
}

const useCountdown = (targetDate: string) => {
  const calculateTimeLeft = () => {
    const difference = +new Date(targetDate) - +new Date()
    let timeLeft: { [key: string]: number } = {}

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      }
    }

    return timeLeft
  }

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft())

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    return () => clearInterval(timer)
  }, [calculateTimeLeft])

  return timeLeft
}

function MysteriousBackground() {
  const points = useRef<THREE.Points>(null!)
  const { camera } = useThree()
  const [positions] = useState(() => {
    const pos = new Float32Array(2000 * 3)
    for (let i = 0; i < 2000; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 10
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10
    }
    return pos
  })

  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    points.current.rotation.x = time * 0.05
    points.current.rotation.y = time * 0.075
    camera.position.x = Math.sin(time * 0.1) * 0.2
    camera.position.y = Math.cos(time * 0.1) * 0.2
    camera.lookAt(0, 0, 0)
  })

  return (
    <Points ref={points} positions={positions} stride={3}>
      <PointMaterial
        transparent
        color="#3B82F6"
        size={0.02}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  )
}

const CountdownUnit = ({ value, label, maxValue }: { value: number; label: string; maxValue: number }) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [prevValue, setPrevValue] = useState(value)
  const [animatedValue, setAnimatedValue] = useState(value)

  useEffect(() => {
    setPrevValue(value)
    const animationFrame = requestAnimationFrame(() => setAnimatedValue(value))
    return () => cancelAnimationFrame(animationFrame)
  }, [value])

  const progress = (animatedValue / maxValue) * 100

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-20 h-20 mb-2">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle
            className="text-gray-700"
            strokeWidth="4"
            stroke="currentColor"
            fill="transparent"
            r="48"
            cx="50"
            cy="50"
          />
          <circle
            className="text-[#33ff33] transition-all duration-1000 ease-linear"
            strokeWidth="4"
            stroke="currentColor"
            fill="transparent"
            r="48"
            cx="50"
            cy="50"
            strokeDasharray={2 * Math.PI * 48}
            strokeDashoffset={(2 * Math.PI * 48 * (100 - progress)) / 100}
          />
        </svg>
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-3xl font-bold">
          {value}
        </div>
      </div>
      <span className="text-sm uppercase">{label}</span>
    </div>
  )
}

const ProgressiveLoading = ({ progress }: { progress: number }) => {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-black z-50">
      <div className="w-3/4 h-2 bg-gray-700 rounded-full mb-4">
        <div
          className="h-full bg-[#33ff33] rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <span className="text-[#33ff33] text-2xl font-bold">{Math.round(progress)}%</span>
    </div>
  )
}

function CIATicketCard({ code, isRevealed, onReveal }: { code: string; isRevealed: boolean; onReveal: () => void }) {
  const meshRef = useRef<THREE.Mesh>(null!)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [hovered, setHovered] = useState(false)
  const texture = useTexture("/placeholder.svg?height=512&width=512")

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.1
      meshRef.current.position.y = Math.sin(state.clock.getElapsedTime()) * 0.05
    }
  })

  return (
    <mesh
      ref={meshRef}
      onClick={onReveal}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <planeGeometry args={[4, 2.5]} />
      <meshStandardMaterial color="#f0f0f0" map={texture} />
      <Text
        position={[0, 0.8, 0.01]}
        fontSize={0.2}
        color="#000000"
        anchorX="center"
        anchorY="middle"
        font="/fonts/Inter_Bold.json"
      >
        TOP SECRET
      </Text>
      <Text
        position={[0, 0.4, 0.01]}
        fontSize={0.15}
        color="#000000"
        anchorX="center"
        anchorY="middle"
        font="/fonts/Inter_Regular.json"
      >
        CENTRAL INTELLIGENCE AGENCY
      </Text>
      <Text
        position={[0, 0, 0.01]}
        fontSize={0.18}
        color="#000000"
        anchorX="center"
        anchorY="middle"
        font="/fonts/Inter_Bold.json"
      >
        {isRevealed ? code : "Click to Reveal Your Code"}
      </Text>
      <Text
        position={[0, -0.4, 0.01]}
        fontSize={0.1}
        color="#000000"
        anchorX="center"
        anchorY="middle"
        font="/fonts/Inter_Regular.json"
      >
        AUTHORIZED ACCESS ONLY
      </Text>
      {/* CIA Logo (simplified) */}
      <mesh position={[-1.5, 0.8, 0.01]}>
        <circleGeometry args={[0.2, 32]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
      {/* Lock Icon */}
      <Text
        position={[1.5, 0.8, 0.01]}
        fontSize={0.2}
        color="#000000"
        anchorX="center"
        anchorY="middle"
        font="/fonts/Inter_Regular.json"
      >
        🔒
      </Text>
      {/* Edge details */}
      <lineSegments>
        <edgesGeometry args={[new THREE.PlaneGeometry(4, 2.5)]} />
        <lineBasicMaterial color="#000000" linewidth={2} />
      </lineSegments>
    </mesh>
  )
}

export default function Component() {
  console.log("Component rendering started")
  const timeLeft = useCountdown("2024-12-31T23:59:59")
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(true)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [showBackground, setShowBackground] = useState(false)
  const [showTitle, setShowTitle] = useState(false)
  const [showContent, setShowContent] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [secretCode, setSecretCode] = useState("")
  const [isCodeRevealed, setIsCodeRevealed] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [isCRTOn, setIsCRTOn] = useState(false)


  useEffect(() => {
    console.log("Component mounted")
    const savedCode = localStorage.getItem("secretCode")
    if (savedCode) {
      setSecretCode(savedCode)
      setSubmitted(true)
    }

    const loadingInterval = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(loadingInterval)
          setLoading(false)
          setTimeout(() => setShowBackground(true), 500)
          setTimeout(() => setShowTitle(true), 1000)
          setTimeout(() => setShowContent(true), 2000)
          setTimeout(() => setIsCRTOn(true), 1000) // Add CRT power-on effect
          return 100
        }
        return prev + 1
      })
    }, 30)

    return () => clearInterval(loadingInterval)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrorMessage("")

    try {
      // Make the POST request to add the email
      const response = await fetch(`/api/accesses/add?email=${encodeURIComponent(email)}`, {
        method: 'POST',
      })

      if (!response.ok) {
        throw new Error('Network response was not ok')
      }

      const data = await response.json()
      console.log("API response:", data)

      if (data.message === "Access saved successfully.") {
        setSubmitted(true)
        // Generate a unique code (this could be returned from the API instead)
        const uniqueCode = Math.random().toString(36).substring(2, 8).toUpperCase()
        setSecretCode(uniqueCode)
        localStorage.setItem("secretCode", uniqueCode)
      } else if (data.message === "Access already exists.") {
        setErrorMessage("This email has already been registered.")
      }
    } catch (error) {
      console.error("Error submitting email:", error)
      setErrorMessage("An error occurred. Please try again later.")
    } finally {
      setIsSubmitting(false)
      setEmail("")
    }
  }

  const maxValues = {
    days: 365,
    hours: 24,
    minutes: 60,
    seconds: 60,
  }

  console.log("Component rendering completed")

  return (
    <ErrorBoundary>
      <div className={`relative min-h-screen flex flex-col items-center justify-center bg-[#001100] text-[#33ff33] p-4 overflow-hidden ${isCRTOn ? 'animate-[crtOn_0.5s_ease-in-out]' : ''}`}>
        {/* CRT overlay */}
        <div className="absolute inset-0 pointer-events-none z-50">
          <div className="w-full h-full bg-[#001100] opacity-[0.03] animate-[flicker_0.15s_infinite]"></div>
          <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,rgba(0,0,0,0.15),rgba(0,0,0,0.15)_1px,transparent_1px,transparent_2px)]"></div>
        </div>
        {loading && <ProgressiveLoading progress={loadingProgress} />}
        <div className={`absolute inset-0 transition-opacity duration-1000 ${showBackground ? 'opacity-100' : 'opacity-0'}`}>
          <Suspense fallback={<div>Loading 3D environment...</div>}>
            <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
              <MysteriousBackground />
            </Canvas>
          </Suspense>
        </div>
        <div className={`relative z-10 flex flex-col items-center`}>
          <h1 
            className={`text-4xl md:text-6xl font-bold mb-8 text-center transition-all duration-1000 ${
              showTitle ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform -translate-y-10'
            } font-mono`}
          >
            The Awakening is Coming
          </h1>
          {!submitted && (
            <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 text-center mb-12 transition-all duration-1000 ${
              showContent ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-10'
            }`}>
              {Object.entries(timeLeft).map(([unit, value]) => (
                <CountdownUnit 
                  key={unit} 
                  value={value as number} 
                  label={unit} 
                  maxValue={maxValues[unit as keyof typeof maxValues]}
                />
              ))}
            </div>
          )}
          {!submitted ? (
            <form onSubmit={handleSubmit} className={`w-full max-w-md flex flex-col items-center gap-4 transition-all duration-1000 ${
              showContent ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-10'
            }`}>
              <Input
                type="email"
                placeholder="Enter your email to join the revolution"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-[#001100] border-[#33ff33] text-[#33ff33] placeholder-[#33ff33]/50 font-mono"
                aria-label="Email address"
                disabled={isSubmitting}
              />
              {errorMessage && (
                <p className="text-red-500 text-sm">{errorMessage}</p>
              )}
              <Button 
                type="submit" 
                className="w-full bg-[#33ff33] text-[#001100] hover:bg-[#66ff66] disabled:opacity-50 font-mono"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Preparing...
                  </>
                ) : (
                  "Prepare for Enlightenment"
                )}
              </Button>
            </form>
          ) : (
            <div className={`text-center transition-all duration-1000 ${
              showContent ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-10'
            }`}>
              <p className="text-xl font-bold text-blue-500 mb-2">You are now part of the Awakening</p>
              <p className="text-sm text-gray-400 mb-4">Your secret code awaits...</p>
              <div className="w-full h-64">
                <Suspense fallback={<div>Loading secret code...</div>}>
                  <Canvas>
                    <ambientLight intensity={0.5} />
                    <pointLight position={[10, 10, 10]} />
                    <PerspectiveCamera makeDefault position={[0, 0, 3]} />
                    <CIATicketCard 
                      code={secretCode} 
                      isRevealed={isCodeRevealed} 
                      onReveal={() => setIsCodeRevealed(true)} 
                    />
                  </Canvas>
                </Suspense>
              </div>
            </div>
          )}
        </div>
      </div>
    </ErrorBoundary>
  )
}