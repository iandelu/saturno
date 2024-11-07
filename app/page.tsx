/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import React, { useState, useEffect, useRef, Suspense } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Points, PointMaterial, Text, PerspectiveCamera, useTexture } from "@react-three/drei"
import * as THREE from "three"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { saveEmail } from "./actions/saveEmail"

// Error Boundary Component
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error) {
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
  }, [])

  return timeLeft
}

function MysteriousBackground() {
  const points = useRef<THREE.Points>(null!)
  const { size, camera } = useThree()
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
      <div className="relative w-14 h-14 md:w-20 md:h-20 mb-1 md:mb-2">
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
      <span className="text-xs md:text-sm uppercase">{label}</span>
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

const MatrixRain = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const columns = canvas.width / 20
    const drops: number[] = []

    for (let i = 0; i < columns; i++) {
      drops[i] = 1
    }

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.fillStyle = '#0F0'
      ctx.font = '15px monospace'

      for (let i = 0; i < drops.length; i++) {
        const text = String.fromCharCode(Math.random() * 128)
        ctx.fillText(text, i * 20, drops[i] * 20)

        if (drops[i] * 20 > canvas.height && Math.random() > 0.975) {
          drops[i] = 0
        }

        drops[i]++
      }
    }

    const interval = setInterval(draw, 33)

    return () => clearInterval(interval)
  }, [])

  return <canvas ref={canvasRef} className="fixed inset-0 z-40" />
}

export default function Component() {
  console.log("Component rendering started")
  const timeLeft = useCountdown("2024-11-10T21:00:00")
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
  const [showMatrixRain, setShowMatrixRain] = useState(false)
  const [showPills, setShowPills] = useState(false)
  const [pillChoice, setPillChoice] = useState<'blue' | 'red' | null>(null)
  const [version] = useState(() => {
    const major = Math.floor(Math.random() * 10)
    const minor = Math.floor(Math.random() * 10)
    const patch = Math.floor(Math.random() * 10)
    return `v${major}.${minor}.${patch}`
  })

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
          setTimeout(() => setIsCRTOn(true), 1000)
          return 100
        }
        return prev + 1
      })
    }, 30)

    return () => clearInterval(loadingInterval)
  }, [])

  const handleSubmit = async (e:  React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrorMessage("")
    console.log(e)

    try {
      // Call the server action to save the email
      await saveEmail(email)
      setSubmitted(true)
    } catch (error) {
      console.error("Error saving email:", error)
      setErrorMessage("An error occurred. Please try again.")
    }
  }

  const maxValues = {
    days: 365,
    hours: 24,
    minutes: 60,
    seconds: 60,
  }

  const toggleMatrixRain = () => {
    setShowMatrixRain(!showMatrixRain)
    setShowPills(false)
  }

  const togglePills = () => {
    setShowPills(!showPills)
    setShowMatrixRain(false)
  }

  const handlePillChoice = (choice: 'blue' | 'red') => {
    setPillChoice(choice)
    setShowPills(false)
    if (choice === 'red') {
      handleSubmit(new Event('submit') as unknown as React.FormEvent)
    } else {
      // Do nothing for blue pill, just close the modal
    }
  }

  console.log("Component rendering completed")

  return (
    <ErrorBoundary>
      <div className={`relative min-h-screen flex flex-col items-center justify-center bg-[#001100] text-[#33ff33] p-6 md:p-8 overflow-hidden ${isCRTOn ? 'animate-[crtOn_0.5s_ease-in-out]' : ''}`}>
        {/* CRT overlay */}
        <div className="absolute inset-0 pointer-events-none z-50">
          <div className="w-full h-full bg-[#001100] opacity-[0.03] animate-[flicker_0.15s_infinite]"></div>
          <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,rgba(0,0,0,0.15),rgba(0,0,0,0.15)_1px,transparent_1px,transparent_2px)]"></div>
        </div>
        <div className="absolute top-4 left-4 text-[#33ff33] text-xs font-mono z-50">
          <p>{version}</p>
        </div>
        <div className="absolute top-4 right-4 text-[#33ff33] text-xs font-mono z-50">
          <p>Mensaje Interceptado: XJ7-92</p>
          <p className="text-[0.6rem] mt-1">Despierta... <span className="cursor-pointer hover:text-[#66ff66]" onClick={toggleMatrixRain}>¿Realidad o simulación?</span></p>
        </div>
        {showMatrixRain && <MatrixRain />}
        {showPills && (
          <div className="fixed inset-0 flex items-center justify-center z-40 bg-black bg-opacity-80">
            <div className="flex space-x-8">
              <div className="cursor-pointer transform transition-transform hover:scale-110" onClick={() => handlePillChoice('blue')}>
                <div className="w-16 h-32 bg-blue-500 rounded-full"></div>
                <p className="text-center mt-2 text-blue-500">Ignorar</p>
              </div>
              <div className="cursor-pointer transform transition-transform hover:scale-110" onClick={() => handlePillChoice('red')}>
                <div className="w-16 h-32 bg-red-500 rounded-full"></div>
                <p className="text-center mt-2 text-red-500">Despertar</p>
              </div>
            </div>
          </div>
        )}
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
            La Experiencia Comienza
          </h1>
          {!submitted && (
            <div className={`flex flex-row gap-4 text-center mb-12 transition-all duration-1000 ${
              showContent ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-10'
            }`}>
              {Object.entries(timeLeft).map(([unit, value]) => (
                <CountdownUnit 
                  key={unit} 
                  value={value as number} 
                  label={unit === 'days' ? 'días' : 
                         unit === 'hours' ? 'horas' : 
                         unit === 'minutes' ? 'min' : 'seg'} 
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
                placeholder="Tu email para el viaje"
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
                onClick={togglePills}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Desconectando...
                  </>
                ) : (
                  "Empezar el viaje"
                )}
              </Button>
            </form>
          ) : (
            <div className={`text-center transition-all duration-1000 ${
              showContent ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-10'
            }`}>
              <p className="text-xl font-bold text-[#33ff33] mb-2">Bienvenido al Despertar</p>
              <p className="text-sm text-gray-400 mb-4">Tu código de acceso espera...</p>
              <div className="w-full h-64">
                <Suspense fallback={<div>Cargando código secreto...</div>}>
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