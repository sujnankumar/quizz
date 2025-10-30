"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useSocket } from "@/hooks/use-socket"
import { useRouter } from "next/navigation"

interface FinalResultsProps {
  room: any
}

export function FinalResults({ room }: FinalResultsProps) {
  const { playAgain, leaveRoom } = useSocket()
  const router = useRouter()
  const sortedPlayers = [...room.players].sort((a, b) => b.score - a.score)
  const topThree = sortedPlayers.slice(0, 3)

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 py-6 sm:py-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 opacity-90"></div>
      <div className="absolute top-0 left-0 w-48 sm:w-96 h-48 sm:h-96 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 right-0 w-48 sm:w-96 h-48 sm:h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-0 left-1/2 w-48 sm:w-96 h-48 sm:h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

      <div className="w-full max-w-5xl relative z-10">
        <div className="text-center mb-6 sm:mb-12">
          <h1 className="text-3xl sm:text-5xl font-bold text-gray-100 mb-1 sm:mb-2 drop-shadow-lg">🎉 Quiz Complete!</h1>
          <p className="text-cyan-300 text-sm sm:text-lg font-semibold drop-shadow-md">Final Results</p>
        </div>

        {/* Podium */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6 mb-6 sm:mb-12">
          {topThree.map((player, index) => (
            <Card
              key={player.id}
              className={`p-4 sm:p-8 text-center border-2 backdrop-blur-xl bg-gradient-to-br from-slate-900/80 to-slate-800/60 transition-all transform hover:scale-105 rounded-xl sm:rounded-2xl ${
                index === 0
                  ? "shadow-2xl shadow-yellow-500/30"
                  : index === 1
                    ? "shadow-2xl shadow-gray-400/30"
                    : "shadow-2xl shadow-orange-500/30"
              }`}
            >
              <div className="text-4xl sm:text-6xl mb-2 sm:mb-4">{index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}</div>
              <h3 className="text-lg sm:text-2xl font-bold text-gray-100 mb-1 sm:mb-2 truncate drop-shadow-md">{player.name}</h3>
              <p className="text-2xl sm:text-4xl font-bold text-transparent bg-gradient-to-r from-yellow-300 to-yellow-500 bg-clip-text mb-1 sm:mb-2 drop-shadow-lg">
                {player.score}
              </p>
              <p className="text-xs sm:text-sm text-cyan-300 font-semibold drop-shadow-sm">
                {index === 0 ? "🏆 1st Place" : index === 1 ? "🎖️ 2nd Place" : "🏅 3rd Place"}
              </p>
            </Card>
          ))}
        </div>

        {/* Full Leaderboard */}
        <Card className="p-4 sm:p-8 bg-gradient-to-br from-slate-900/90 to-slate-800/70 backdrop-blur-xl border border-slate-600/40 shadow-2xl mb-4 sm:mb-8 rounded-xl sm:rounded-2xl shadow-purple-500/20">
          <h2 className="text-xl sm:text-3xl font-bold text-gray-100 mb-4 sm:mb-6 flex items-center gap-2 drop-shadow-lg">
            <span className="text-2xl sm:text-3xl">📊</span> Final Leaderboard
          </h2>
          <div className="space-y-2 sm:space-y-3">
            {sortedPlayers.map((player, index) => (
              <div
                key={player.id}
                className="flex items-center justify-between p-3 sm:p-4 bg-slate-700/50 backdrop-blur-sm rounded-lg border border-slate-500/40 hover:bg-slate-700/60 transition-all text-sm sm:text-base"
              >
                <div className="flex items-center gap-2 sm:gap-4 min-w-0">
                  <span className="text-xl sm:text-2xl font-bold text-transparent bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text w-6 sm:w-8 flex-shrink-0 drop-shadow-md">
                    {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : `#${index + 1}`}
                  </span>
                  <span className="text-gray-100 font-semibold truncate drop-shadow-sm">{player.name}</span>
                </div>
                <span className="text-xl sm:text-2xl font-bold text-cyan-300 flex-shrink-0 ml-2 drop-shadow-md">{player.score}</span>
              </div>
            ))}
          </div>
        </Card>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Button
            onClick={() => {
              playAgain()
              // Stay on the same room route; page will switch back to lobby
              router.push(`/quiz/${room.code}`)
            }}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-4 sm:py-6 text-base sm:text-lg font-semibold shadow-lg rounded-xl"
          >
            🔄 Play Again
          </Button>
          <Button
            onClick={() => {
              leaveRoom()
              router.push("/")
            }}
            className="w-full bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white py-4 sm:py-6 text-base sm:text-lg font-semibold shadow-lg rounded-xl"
          >
            🚪 Exit
          </Button>
        </div>
      </div>
    </div>
  )
}
