"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useSocket } from "@/hooks/use-socket"

interface RoomLobbyProps {
  room: any
  currentPlayerId: string
}

export function RoomLobby({ room, currentPlayerId }: RoomLobbyProps) {
  const { startQuiz } = useSocket()
  const isAdmin = currentPlayerId === room.adminId

  const handleStartQuiz = () => {
    startQuiz()
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 py-6 sm:py-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 opacity-90"></div>
      <div className="absolute top-0 left-0 w-48 sm:w-96 h-48 sm:h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute bottom-0 right-0 w-48 sm:w-96 h-48 sm:h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

      <div className="w-full max-w-5xl relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Room Info */}
          <Card className="p-4 sm:p-6 bg-gradient-to-br from-slate-900/80 to-slate-800/60 backdrop-blur-xl border border-slate-600/40 shadow-2xl rounded-xl sm:rounded-2xl shadow-purple-500/20">
            <h2 className="text-lg sm:text-2xl font-bold text-gray-100 mb-3 sm:mb-4 flex items-center gap-2 drop-shadow-lg">
              <span className="text-2xl sm:text-3xl">🏠</span> Room Info
            </h2>
            <div className="space-y-3 sm:space-y-4">
              <div>
                <p className="text-xs sm:text-sm text-cyan-300 drop-shadow-sm">Room Code</p>
                <p className="text-2xl sm:text-3xl font-bold text-transparent bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text drop-shadow-lg">
                  {room.code}
                </p>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-cyan-300 drop-shadow-sm">Players</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-100 drop-shadow-lg">{room.players.length}</p>
              </div>
            </div>
          </Card>

          {/* Players List */}
          <Card className="p-4 sm:p-6 bg-gradient-to-br from-slate-900/80 to-slate-800/60 backdrop-blur-xl border border-slate-600/40 shadow-2xl rounded-xl sm:rounded-2xl shadow-blue-500/20">
            <h2 className="text-lg sm:text-2xl font-bold text-gray-100 mb-3 sm:mb-4 flex items-center gap-2 drop-shadow-lg">
              <span className="text-2xl sm:text-3xl">👥</span> Players
            </h2>
            <div className="space-y-2">
              {room.players.map((player: any) => (
                <div
                  key={player.id}
                  className="flex items-center justify-between p-2 sm:p-3 bg-slate-700/40 backdrop-blur-sm rounded-lg border border-slate-500/30 hover:bg-slate-700/60 transition-all duration-200"
                >
                  <span className="text-gray-100 font-medium text-sm sm:text-base truncate drop-shadow-sm">{player.name}</span>
                  {player.id === room.adminId && (
                    <span className="text-xs bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-2 py-1 rounded-full font-semibold whitespace-nowrap ml-2 shadow-lg">
                      👑 Admin
                    </span>
                  )}
                </div>
              ))}
            </div>
          </Card>

          {/* Quiz Settings */}
          <Card className="p-4 sm:p-6 bg-gradient-to-br from-slate-900/80 to-slate-800/60 backdrop-blur-xl border border-slate-600/40 shadow-2xl rounded-xl sm:rounded-2xl shadow-green-500/20">
            <h2 className="text-lg sm:text-2xl font-bold text-gray-100 mb-3 sm:mb-4 flex items-center gap-2 drop-shadow-lg">
              <span className="text-2xl sm:text-3xl">⚙️</span> Quiz Settings
            </h2>
            <div className="space-y-3 sm:space-y-4">
              <div>
                <p className="text-xs sm:text-sm text-cyan-300 drop-shadow-sm">Topic</p>
                <p className="text-base sm:text-lg font-semibold text-gray-100 capitalize drop-shadow-md">{room.topic || 'Science'}</p>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-cyan-300 drop-shadow-sm">Difficulty</p>
                <p className="text-base sm:text-lg font-semibold text-gray-100 capitalize drop-shadow-md">{room.difficulty || 'Medium'}</p>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-cyan-300 drop-shadow-sm">Questions</p>
                <p className="text-base sm:text-lg font-semibold text-gray-100 drop-shadow-md">{room.questionCount || 5}</p>
              </div>

              {isAdmin && (
                <Button
                  onClick={handleStartQuiz}
                  className="w-full bg-gradient-to-r from-green-500/80 via-emerald-500/80 to-cyan-500/80 hover:from-green-600/90 hover:via-emerald-600/90 hover:to-cyan-600/90 text-white py-4 sm:py-6 font-semibold text-sm sm:text-base mt-4 sm:mt-6 backdrop-blur-sm border border-white/30 shadow-lg shadow-green-500/30"
                >
                  🚀 Start Quiz
                </Button>
              )}
            </div>
          </Card>

          {!isAdmin && (
            <Card className="p-4 sm:p-6 bg-gradient-to-br from-slate-900/80 to-slate-800/60 backdrop-blur-xl border border-slate-600/40 shadow-2xl rounded-xl sm:rounded-2xl shadow-purple-500/20 md:col-span-2 lg:col-span-1 flex items-center justify-center">
              <div className="text-center">
                <p className="text-cyan-200 mb-4 text-sm sm:text-lg font-medium drop-shadow-md">
                  ⏳ Waiting for admin to start the quiz...
                </p>
                <div className="flex justify-center gap-3">
                  <div className="w-3 sm:w-4 h-3 sm:h-4 bg-cyan-400 rounded-full animate-bounce shadow-lg shadow-cyan-400/50"></div>
                  <div className="w-3 sm:w-4 h-3 sm:h-4 bg-purple-400 rounded-full animate-bounce animation-delay-100 shadow-lg shadow-purple-400/50"></div>
                  <div className="w-3 sm:w-4 h-3 sm:h-4 bg-pink-400 rounded-full animate-bounce animation-delay-200 shadow-lg shadow-pink-400/50"></div>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
