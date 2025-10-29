"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { useSocket } from "@/hooks/use-socket"

interface RoomCreationProps {
  onConnect?: () => void
}

export function RoomCreation({ onConnect }: RoomCreationProps) {
  const { createRoom, joinRoom, connect, isConnected } = useSocket()
  const [mode, setMode] = useState<"home" | "create" | "join">("home")
  const [playerName, setPlayerName] = useState("")
  const [roomCode, setRoomCode] = useState("")
  const [topic, setTopic] = useState<string>("Science")
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium")
  const [questionCount, setQuestionCount] = useState(5)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!isConnected) {
      connect()
    }
  }, [connect, isConnected])

  const handleCreateRoom = async () => {
    if (!playerName.trim() || loading) return

    setLoading(true)
    try {
      await createRoom(playerName, topic, difficulty, questionCount)
      onConnect?.()
    } catch (error) {
      console.error('Failed to create room:', error)
      setLoading(false)
    }
  }

  const handleJoinRoom = () => {
    if (!playerName.trim() || !roomCode.trim() || loading) return

    setLoading(true)
    try {
      joinRoom(roomCode.toUpperCase(), playerName)
    } catch (error) {
      console.error('Failed to join room:', error)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 py-8 sm:py-12 relative overflow-hidden" style={{
      background: `
        radial-gradient(circle at 25% 25%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
        radial-gradient(circle at 75% 75%, rgba(255, 70, 128, 0.3) 0%, transparent 50%),
        radial-gradient(circle at 40% 70%, rgba(59, 130, 246, 0.2) 0%, transparent 50%),
        linear-gradient(45deg, #0f0f23, #1a1a2e, #16213e, #0f0f23)
      `
    }}>
      {/* Animated SVG Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <svg
          className="absolute inset-0 w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1000 1000"
        >
          <defs>
            <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5"/>
            </pattern>
            <radialGradient id="glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(120, 119, 198, 0.4)" />
              <stop offset="100%" stopColor="rgba(255, 70, 128, 0.1)" />
            </radialGradient>
            <radialGradient id="glow2" cx="30%" cy="70%" r="40%">
              <stop offset="0%" stopColor="rgba(59, 130, 246, 0.3)" />
              <stop offset="100%" stopColor="rgba(16, 185, 129, 0.1)" />
            </radialGradient>
          </defs>
          {/* Floating geometric shapes */}
          <g className="animate-pulse">
            <circle cx="200" cy="150" r="8" fill="url(#glow)" opacity="0.6" className="animate-bounce">
              <animateMotion dur="20s" repeatCount="indefinite" path="M0,0 Q100,50 200,0" />
            </circle>
            <rect x="700" y="300" width="15" height="15" fill="url(#glow2)" opacity="0.5" transform="rotate(45)">
              <animateMotion dur="15s" repeatCount="indefinite" path="M0,0 Q-50,100 0,200" />
            </rect>
            <polygon points="850,100 860,120 840,120" fill="url(#glow)" opacity="0.4">
              <animateMotion dur="25s" repeatCount="indefinite" path="M0,0 Q200,-50 400,0" />
            </polygon>
          </g>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Enhanced blur overlays */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-cyan-400/8 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {mode === "home" && (
          <Card className="p-6 sm:p-8 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl border border-white/20 shadow-2xl rounded-3xl shadow-purple-500/20 shadow-cyan-500/20">
            <div className="text-center mb-6 sm:mb-8 relative">
              {/* Animated brain icon with glow effect */}
              <div className="relative mb-4">
                <div className="text-6xl sm:text-7xl mb-2 animate-pulse">🧠</div>
                <div className="absolute inset-0 text-6xl sm:text-7xl text-blue-400/30 animate-pulse blur-sm">🧠</div>
              </div>
              <h1 className="text-3xl sm:text-5xl font-bold text-white mb-2 text-shadow-lg drop-shadow-lg text-shadow-purple-500/50 text-shadow-cyan-500/50">QuizMaster</h1>
              <p className="text-blue-200 text-base sm:text-lg font-semibold drop-shadow-md">Multiplayer Quiz Battle</p>
            </div>

            <div className="space-y-4 sm:space-y-6">
              <Button
                onClick={() => setMode("create")}
                className="w-full bg-gradient-to-r from-blue-500/80 via-cyan-500/80 to-purple-500/80 hover:from-blue-600/90 hover:via-cyan-600/90 hover:to-purple-600/90 backdrop-blur-md border border-white/30 text-white py-4 sm:py-6 text-base sm:text-lg font-semibold rounded-2xl shadow-lg shadow-blue-500/30 shadow-cyan-500/30 transition-all duration-300 hover:scale-105 hover:shadow-xl"
              >
                <span className="flex items-center justify-center gap-2">
                  ✨ Create Room
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </span>
              </Button>
              <Button
                onClick={() => setMode("join")}
                className="w-full bg-gradient-to-r from-blue-500/80 via-cyan-500/80 to-purple-500/80 hover:from-blue-600/90 hover:via-cyan-600/90 hover:to-purple-600/90 backdrop-blur-md border border-white/30 text-blue-50 py-4 sm:py-6 text-base sm:text-lg font-semibold rounded-2xl shadow-lg shadow-blue-500/30 shadow-cyan-500/30 transition-all duration-300 hover:scale-105 hover:shadow-xl"
              >
                <span className="flex items-center justify-center gap-2">
                  🎯 Join Room
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </span>
              </Button>
            </div>
          </Card>
        )}

        {mode === "create" && (
          <Card className="p-6 sm:p-8 bg-gradient-to-br from-white/15 to-white/10 backdrop-blur-2xl border border-white/25 shadow-2xl rounded-3xl shadow-green-500/20">
            <div className="text-center mb-4">
              <div className="text-4xl mb-2">🏗️</div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 drop-shadow-lg">Create Room</h2>
              <div className="w-16 h-1 bg-gradient-to-r from-green-400 to-cyan-400 rounded-full mx-auto"></div>
            </div>
            <div className="space-y-4 sm:space-y-5">
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-blue-200 mb-2 drop-shadow-sm flex items-center gap-2">
                  <span>👤</span> Your Name
                </label>
                <Input
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  placeholder="Enter your name"
                  className="bg-gradient-to-r from-white/20 to-white/15 backdrop-blur-md border border-white/30 text-white placeholder:text-blue-200 rounded-xl text-sm sm:text-base shadow-lg focus:shadow-cyan-500/30 focus:border-cyan-400/50 transition-all duration-300"
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-blue-200 mb-2 drop-shadow-sm flex items-center gap-2">
                  <span>📚</span> Topic
                </label>
                <select
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full p-3 bg-gradient-to-r from-white/20 to-white/15 backdrop-blur-md border border-white/30 text-white rounded-xl shadow-lg focus:border-cyan-400/50 transition-all duration-300"
                  aria-label="Select quiz topic"
                >
                  <option value="Science">🔬 Science</option>
                  <option value="History">📚 History</option>
                  <option value="Geography">🌍 Geography</option>
                </select>
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-blue-200 mb-2 drop-shadow-sm flex items-center gap-2">
                  <span>⚡</span> Difficulty
                </label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as "easy" | "medium" | "hard")}
                  className="w-full p-3 bg-gradient-to-r from-white/20 to-white/15 backdrop-blur-md border border-white/30 text-white rounded-xl shadow-lg focus:border-cyan-400/50 transition-all duration-300"
                  aria-label="Select difficulty level"
                >
                  <option value="easy">⭐ Easy</option>
                  <option value="medium">⭐⭐ Medium</option>
                  <option value="hard">⭐⭐⭐ Hard</option>
                </select>
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-blue-200 mb-2 drop-shadow-sm flex items-center gap-2">
                  <span>🔢</span> Number of Questions
                </label>
                <Input
                  type="number"
                  value={questionCount}
                  onChange={(e) => setQuestionCount(Math.max(1, parseInt(e.target.value) || 1))}
                  min="1"
                  max="10"
                  className="bg-gradient-to-r from-white/20 to-white/15 backdrop-blur-md border border-white/30 text-white text-center font-bold rounded-xl shadow-lg focus:border-cyan-400/50 transition-all duration-300"
                />
              </div>
              <Button
                onClick={handleCreateRoom}
                disabled={!playerName.trim() || loading}
                className="w-full bg-gradient-to-r from-green-500/80 via-emerald-500/80 to-cyan-500/80 hover:from-green-600/90 hover:via-emerald-600/90 hover:to-cyan-600/90 backdrop-blur-md border border-white/30 text-white py-4 sm:py-6 font-semibold rounded-2xl shadow-lg shadow-green-500/30 transition-all duration-300 hover:scale-105 hover:shadow-xl"
              >
                <span className="flex items-center justify-center gap-2">
                  {loading ? "⏳ Creating..." : "✨ Create & Enter Room"}
                </span>
              </Button>
              <Button
                onClick={() => {
                  setMode("home")
                  setPlayerName("")
                }}
                className="w-full bg-gradient-to-r from-gray-700/60 to-gray-800/60 hover:from-gray-600/70 hover:to-gray-700/70 backdrop-blur-xl border border-gray-500/50 text-gray-200 hover:text-gray-100 rounded-2xl shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
              >
                <span className="flex items-center justify-center gap-2">
                  ← Back
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                </span>
              </Button>
            </div>
          </Card>
        )}

        {mode === "join" && (
          <Card className="p-6 sm:p-8 bg-gradient-to-br from-white/15 to-white/10 backdrop-blur-2xl border border-white/25 shadow-2xl rounded-3xl shadow-blue-500/20">
            <div className="text-center mb-4">
              <div className="text-4xl mb-2">🚪</div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 drop-shadow-lg">Join Room</h2>
              <div className="w-16 h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mx-auto"></div>
            </div>
            <div className="space-y-4 sm:space-y-5">
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-blue-200 mb-2 drop-shadow-sm flex items-center gap-2">
                  <span>👤</span> Your Name
                </label>
                <Input
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  placeholder="Enter your name"
                  className="bg-gradient-to-r from-white/20 to-white/15 backdrop-blur-md border border-white/30 text-white placeholder:text-blue-200 rounded-xl text-sm sm:text-base shadow-lg focus:shadow-cyan-500/30 focus:border-cyan-400/50 transition-all duration-300"
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-blue-200 mb-2 drop-shadow-sm flex items-center gap-2">
                  <span>🔑</span> Room Code
                </label>
                <Input
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                  placeholder="Enter 6-digit code"
                  maxLength={6}
                  className="bg-gradient-to-r from-white/20 to-white/15 backdrop-blur-md border border-white/30 text-white placeholder:text-blue-200 uppercase text-center text-xl sm:text-2xl tracking-widest font-bold rounded-xl shadow-lg focus:shadow-purple-500/30 focus:border-purple-400/50 transition-all duration-300"
                  style={{
                    letterSpacing: '0.3em',
                    textShadow: '0 0 10px rgba(255,255,255,0.3)',
                    WebkitTextStroke: '0.5px rgba(255,255,255,0.1)'
                  }}
                />
              </div>
              <Button
                onClick={handleJoinRoom}
                disabled={!playerName.trim() || !roomCode.trim()}
                className="w-full bg-gradient-to-r from-blue-500/80 via-purple-500/80 to-indigo-500/80 hover:from-blue-600/90 hover:via-purple-600/90 hover:to-indigo-600/90 backdrop-blur-md border border-white/30 text-white py-4 sm:py-6 font-semibold rounded-2xl shadow-lg shadow-blue-500/30 transition-all duration-300 hover:scale-105 hover:shadow-xl"
              >
                <span className="flex items-center justify-center gap-2">
                  🎯 Join Room
                </span>
              </Button>
              <Button
                onClick={() => {
                  setMode("home")
                  setPlayerName("")
                  setRoomCode("")
                }}
                className="w-full bg-gradient-to-r from-gray-700/60 to-gray-800/60 hover:from-gray-600/70 hover:to-gray-700/70 backdrop-blur-xl border border-gray-500/50 text-gray-200 hover:text-gray-100 rounded-2xl shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
              >
                <span className="flex items-center justify-center gap-2">
                  ← Back
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                </span>
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
