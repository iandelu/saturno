'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { LockIcon, UnlockIcon, Rocket } from 'lucide-react'

const DecryptingText = ({ text, isDecrypting }: { text: string, isDecrypting: boolean }) => {
    const [decryptedText, setDecryptedText] = useState('')
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+'

    useEffect(() => {
        if (isDecrypting) {
            let iteration = 0
            const interval = setInterval(() => {
                setDecryptedText(() =>
                    text.split('').map((char, index) => {
                        if (index < iteration) {
                            return char
                        }
                        return characters[Math.floor(Math.random() * characters.length)]
                    }).join('')
                )

                if (iteration >= text.length) {
                    clearInterval(interval)
                }

                iteration += 1 / 3
            }, 30)

            return () => clearInterval(interval)
        } else {
            setDecryptedText(text.replace(/./g, '*'))
        }
    }, [isDecrypting, text])

    return <span className="font-mono">{decryptedText}</span>
}

export default function Component() {
    const searchParams = useSearchParams()
    const [accessCode, setAccessCode] = useState('')
    const [isUnlocked, setIsUnlocked] = useState(false)
    const [isDecrypting, setIsDecrypting] = useState(false)
    const [easterEggActivated, setEasterEggActivated] = useState(false)
    const correctCode = 'saturno-23-11'
    const easterEggCode = 'sala-tempo'
    const secretMessage = "HAS SIDO SELECCIONADO COMO TRIPULANTE VIP"
    const secretCode = searchParams?.get('code') || '000-000';
    const easterEggMessage = "¡La fuerza te acompaña! Has descubierto la sala secreta de Saturno. Que la fuerza te acompañe, joven Jedi."

    const handleUnlock = () => {
        if (accessCode === correctCode) {
            setIsUnlocked(true)
            setTimeout(() => setIsDecrypting(true), 1000)
        } else if (accessCode === easterEggCode) {
            setEasterEggActivated(true)
        } else {
            alert('Código incorrecto. Acceso denegado.')
        }
    }

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Enter') {
                handleUnlock()
            }
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [accessCode])

    return (
        <div className="min-h-screen flex items-center justify-center bg-black p-4">
            <Card className="w-full max-w-md md:max-w-lg bg-black border-green-500 text-green-500 shadow-lg shadow-green-500/20 backdrop-blur-sm relative overflow-hidden">
                <CardHeader>
                    <CardTitle className="text-2xl md:text-3xl font-bold text-center">
                        Saturno Top Secret
                    </CardTitle>
                    <CardDescription className="text-green-500/70 text-center">
                        Acceso restringido. Solo personal autorizado.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="crt-screen p-4 rounded-md">
                        <Input
                            type="password"
                            placeholder="Ingrese código de acceso"
                            value={accessCode}
                            onChange={(e) => setAccessCode(e.target.value)}
                            className="bg-black border-green-500/50 text-green-500 placeholder-green-500/50"
                        />
                        <Button onClick={handleUnlock} className="mt-2 w-full bg-green-500 text-black hover:bg-green-400">
                            {isUnlocked ? <UnlockIcon className="mr-2" /> : <LockIcon className="mr-2" />}
                            {isUnlocked ? 'Desbloqueado' : 'Desbloquear'}
                        </Button>
                    </div>
                    {isUnlocked && (
                        <div className="mt-4 p-4 bg-green-900/20 border border-green-500/50 rounded-md text-center space-y-4">
                            <div className="text-base md:text-lg">
                                <DecryptingText text={secretMessage} isDecrypting={isDecrypting} />
                            </div>
                            <div className="text-xl md:text-2xl font-bold">
                                Código secreto: <DecryptingText text={secretCode} isDecrypting={isDecrypting} />
                            </div>
                        </div>
                    )}
                    {easterEggActivated && (
                        <div className="mt-4 p-4 bg-green-900/20 border border-green-500/30 rounded-md text-center space-y-4">
                            <div className="lightsaber-animation">
                                <Rocket className="w-16 h-16 mx-auto text-green-500" />
                            </div>
                            <div className="text-base md:text-lg text-green-500 font-bold">
                                {easterEggMessage}
                            </div>
                        </div>
                    )}
                </CardContent>
                <CardFooter className="text-center text-green-500/60 text-xs">
                    Esta información está clasificada. La divulgación no autorizada está penada por la ley.
                </CardFooter>
            </Card>
            <style jsx global>{`
        .crt-screen {
          background: #000;
          border: 2px solid #00ff00;
          box-shadow: 0 0 5px #00ff00, inset 0 0 5px #00ff00;
          animation: flicker 0.15s infinite;
        }

        .crt-screen::before {
          content: " ";
          display: block;
          position: absolute;
          top: 0;
          left: 0;
          bottom: 0;
          right: 0;
          background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(0, 255, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 255, 0, 0.06));
          z-index: 2;
          background-size: 100% 2px, 3px 100%;
          pointer-events: none;
        }

        @keyframes flicker {
          0% {
            opacity: 0.97;
          }
          5% {
            opacity: 0.95;
          }
          10% {
            opacity: 0.9;
          }
          15% {
            opacity: 0.95;
          }
          20% {
            opacity: 0.9;
          }
          25% {
            opacity: 0.95;
          }
          30% {
            opacity: 1;
          }
        }

        .lightsaber-animation {
          animation: lightsaber 2s ease-in-out infinite;
        }

        @keyframes lightsaber {
          0%, 100% {
            transform: translateX(0) rotate(0deg);
          }
          50% {
            transform: translateX(10px) rotate(180deg);
          }
        }

        @media (max-width: 640px) {
          .crt-screen {
            padding: 1rem;
          }
        }
      `}</style>
        </div>
    )
}