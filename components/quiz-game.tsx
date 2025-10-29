"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useSocket } from "@/hooks/use-socket"

interface QuizGameProps {
  room: any
  currentPlayerId: string
}

export function QuizGame({ room, currentPlayerId }: QuizGameProps) {
  const { selectAnswer, nextQuestion } = useSocket()
  const isAdmin = currentPlayerId === room.adminId
  const [timeLeft, setTimeLeft] = useState(30)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showAnswerModal, setShowAnswerModal] = useState(false)
  const [showLeaderboard, setShowLeaderboard] = useState(false)
  const [scores, setScores] = useState(room.players.reduce((acc: any, p: any) => ({ ...acc, [p.id]: p.score }), {}))
  const [playerAnswers, setPlayerAnswers] = useState<{ [key: string]: number | null }>({})
  const [currentQuestionPoints, setCurrentQuestionPoints] = useState(0)
  const [currentQuestionTime, setCurrentQuestionTime] = useState(0)

  // Use server's currentQuestion instead of local state
  const currentQuestion = room.questions[room.currentQuestion] || room.questions[0]
  const currentPlayer = room.players.find((p: any) => p.id === currentPlayerId)
  const hasAnswered = currentPlayer?.answered
  const allPlayersAnswered = room.players.every((p: any) => p.answered)

  // Calculate points for current question
  const calculateQuestionPoints = (answer: number, timeTaken: number) => {
    const isCorrect = answer === currentQuestion.correctAnswer
    if (!isCorrect) return 0

    const basePoints = 10
    const timeBonus = Math.floor(((30 - timeTaken) / 30) * 10)
    return Math.max(basePoints + timeBonus, basePoints)
  }

  // Show answer modal when all players have answered OR time is up
  useEffect(() => {
    if (allPlayersAnswered && !showAnswerModal) {
      setShowAnswerModal(true)
      // Store player answers for the answer modal
      setPlayerAnswers(room.players.reduce((acc: any, p: any) => {
        acc[p.id] = p.selectedAnswer
        return acc
      }, {}))
    }
  }, [allPlayersAnswered, showAnswerModal, room.players])

  // Reset states when new question starts
  useEffect(() => {
    setShowAnswerModal(false)
    setShowLeaderboard(false)
    setSelectedAnswer(null)
    setPlayerAnswers({})
  }, [room.currentQuestion])

  const handleSelectAnswer = (index: number) => {
    if (hasAnswered) return
    setSelectedAnswer(index)
  }

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return
    const timeAtSubmit = timeLeft
    const pointsEarned = calculateQuestionPoints(selectedAnswer, 30 - timeAtSubmit)

    setCurrentQuestionTime(30 - timeAtSubmit)
    setCurrentQuestionPoints(pointsEarned)

    selectAnswer(selectedAnswer, timeAtSubmit)
  }

  const handleNextQuestionClick = () => {
    nextQuestion()
    setShowAnswerModal(false)
    setShowLeaderboard(false)
    setSelectedAnswer(null)
  }

  const isLastQuestion = room.currentQuestion === room.questions.length - 1

  if (showLeaderboard) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 py-6 sm:py-8 relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-48 sm:w-72 h-48 sm:h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
          <div className="absolute bottom-20 right-10 w-48 sm:w-72 h-48 sm:h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        </div>

        <div className="w-full max-w-2xl relative z-10">
          <Card className="p-4 sm:p-8 bg-gradient-to-br from-slate-900/90 to-slate-800/70 backdrop-blur-xl border border-slate-600/40 shadow-2xl rounded-xl sm:rounded-2xl shadow-purple-500/20">
            <h2 className="text-2xl sm:text-4xl font-bold text-gray-100 mb-4 sm:mb-8 text-center drop-shadow-lg">Leaderboard</h2>
            <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-8">
              {room.players
                .map((p: any) => ({ ...p, score: scores[p.id] || 0 }))
                .sort((a: any, b: any) => b.score - a.score)
                .map((player: any, index: number) => (
                  <div
                    key={player.id}
                    className={`flex items-center justify-between p-3 sm:p-4 rounded-xl transition-all backdrop-blur-sm ${
                      player.id === currentPlayerId
                        ? "bg-gradient-to-r from-blue-500/30 to-purple-500/30 border border-blue-400/60 drop-shadow-md"
                        : "bg-slate-700/50 border border-slate-500/40"
                    }`}
                  >
                    <div className="flex items-center gap-2 sm:gap-4">
                      <span className="text-lg sm:text-2xl font-bold w-6 sm:w-8 text-gray-100 drop-shadow-md">
                        {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : `#${index + 1}`}
                      </span>
                      <span className="text-gray-100 font-semibold text-sm sm:text-lg truncate drop-shadow-md">{player.name}</span>
                    </div>
                    <span className="text-lg sm:text-xl font-bold text-cyan-300 drop-shadow-md">{player.score}</span>
                  </div>
                ))}
            </div>

            {isAdmin && (
              <Button
                onClick={() => setShowLeaderboard(false)}
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white py-4 sm:py-6 font-semibold text-sm sm:text-base"
              >
                Back to Answer
              </Button>
            )}

            {!isAdmin && (
              <Button
                onClick={() => setShowLeaderboard(false)}
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white py-4 sm:py-6 font-semibold text-sm sm:text-base"
              >
                Back to Answers
              </Button>
            )}
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 py-6 sm:py-8 relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-48 sm:w-72 h-48 sm:h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="absolute bottom-20 right-10 w-48 sm:w-72 h-48 sm:h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      </div>

      <div className="w-full max-w-5xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Question Card */}
          <Card className="lg:col-span-2 p-4 sm:p-8 bg-gradient-to-br from-slate-900/80 to-slate-800/60 backdrop-blur-xl border border-slate-600/40 shadow-2xl rounded-xl sm:rounded-2xl">
            <div className="mb-4 sm:mb-6">
              <div className="flex justify-between items-center mb-2 sm:mb-4">
                <span className="text-xs sm:text-sm text-cyan-300 font-semibold drop-shadow-sm">
                  Question {room.currentQuestion + 1} of {room.questions.length}
                </span>
                <div
                  className={`text-2xl sm:text-3xl font-bold font-mono ${timeLeft > 10 ? "text-green-400" : "text-red-400"} drop-shadow-lg`}
                >
                  {timeLeft}s
                </div>
              </div>
              <div className="w-full bg-slate-700/60 rounded-full h-2 overflow-hidden backdrop-blur-sm">
                <div
                  className="bg-gradient-to-r from-blue-400 to-cyan-400 h-2 rounded-full transition-all shadow-inner"
                  style={{ width: `${(timeLeft / 30) * 100}%` }}
                ></div>
              </div>
            </div>

            <h2 className="text-lg sm:text-2xl font-bold text-gray-100 mb-4 sm:mb-8 drop-shadow-lg">{currentQuestion.question}</h2>

            <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-8">
              {currentQuestion.options.map((option: string, index: number) => (
                <button
                  key={index}
                  onClick={() => handleSelectAnswer(index)}
                  className={`w-full p-3 sm:p-4 text-left rounded-xl border-2 transition-all transform text-sm sm:text-base backdrop-blur-sm ${
                    selectedAnswer === index
                      ? "border-blue-400 bg-blue-500/30 text-gray-100 shadow-lg shadow-blue-500/40 drop-shadow-md"
                      : "border-slate-500/40 bg-slate-700/40 text-gray-100 hover:border-cyan-400/60 hover:bg-slate-700/50 drop-shadow-sm"
                  } ${hasAnswered ? "cursor-not-allowed opacity-60" : "cursor-pointer hover:scale-105"}`}
                >
                  <div className="flex items-center">
                    <div
                      className={`w-5 sm:w-6 h-5 sm:h-6 rounded-full border-2 mr-2 sm:mr-3 flex items-center justify-center transition-all flex-shrink-0 ${
                        selectedAnswer === index ? "border-blue-300 bg-blue-400" : "border-white border-opacity-40"
                      }`}
                    >
                      {selectedAnswer === index && <div className="w-2 h-2 bg-white rounded-full"></div>}
                    </div>
                    <span className="truncate">{option}</span>
                  </div>
                </button>
              ))}
            </div>

            {hasAnswered && !showAnswerModal && (
              <div className="text-center text-cyan-200 py-3 sm:py-4 bg-slate-700/50 backdrop-blur-sm rounded-xl border border-slate-500/40 font-medium drop-shadow-md shadow-inner">
                ✅ Submitted - Waiting for others to finish...
              </div>
            )}

            {!hasAnswered && (
              <Button
                onClick={handleSubmitAnswer}
                disabled={selectedAnswer === null}
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white py-4 sm:py-6 font-semibold rounded-xl text-sm sm:text-base"
              >
                Submit Answer
              </Button>
            )}
          </Card>

          {/* Leaderboard Sidebar */}
          <Card className="lg:col-span-1 p-4 sm:p-6 bg-gradient-to-br from-slate-900/80 to-slate-800/60 backdrop-blur-xl border border-slate-600/40 shadow-2xl rounded-xl sm:rounded-2xl">
            <h2 className="text-lg sm:text-xl font-bold text-gray-100 mb-3 sm:mb-4 drop-shadow-lg">Leaderboard</h2>
            <div className="space-y-1 sm:space-y-2">
              {room.players
                .map((p: any) => ({ ...p, score: scores[p.id] || 0 }))
                .sort((a: any, b: any) => b.score - a.score)
                .map((player: any, index: number) => (
                  <div
                    key={player.id}
                    className={`flex items-center justify-between p-2 sm:p-3 rounded-lg transition-all backdrop-blur-sm text-sm sm:text-base ${
                      player.id === currentPlayerId
                        ? "bg-gradient-to-r from-blue-500/30 to-purple-500/30 border border-blue-400/60 drop-shadow-md"
                        : "bg-slate-700/50 border border-slate-500/40"
                    }`}
                  >
                    <div className="flex items-center gap-1 sm:gap-2 min-w-0">
                      <span className="text-base sm:text-lg font-bold w-5 sm:w-6 flex-shrink-0 text-gray-100 drop-shadow-md">
                        {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : `#${index + 1}`}
                      </span>
                      <span className="text-gray-100 font-medium truncate drop-shadow-sm">{player.name}</span>
                    </div>
                    <span className="text-lg sm:text-xl font-bold text-cyan-300 flex-shrink-0 ml-2 drop-shadow-md">
                      {player.score}
                    </span>
                  </div>
                ))}
            </div>
          </Card>
        </div>
      </div>

      {showAnswerModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl p-4 sm:p-8 bg-gradient-to-br from-slate-900/90 to-slate-800/70 backdrop-blur-xl border border-slate-600/50 shadow-2xl rounded-xl sm:rounded-2xl max-h-[90vh] overflow-y-auto shadow-purple-500/30 shadow-cyan-500/30">
            {/* Personal Results */}
            <div className="bg-gradient-to-r from-slate-800/60 to-slate-700/60 backdrop-blur-sm p-3 sm:p-4 rounded-xl border border-slate-500/40 mb-4 sm:mb-6 shadow-inner">
              <h3 className="text-lg sm:text-xl font-bold text-cyan-300 mb-2 sm:mb-3 drop-shadow-md">Your Result</h3>
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div className="text-center">
                  <div className="text-xl sm:text-2xl font-bold text-gray-100 drop-shadow-sm">⏱️ {currentQuestionTime.toFixed(1)}s</div>
                  <div className="text-xs sm:text-sm text-cyan-300 font-medium">Time Taken</div>
                </div>
                <div className="text-center">
                  <div className="text-xl sm:text-2xl font-bold text-yellow-300 drop-shadow-sm">{currentQuestionPoints} pts</div>
                  <div className="text-xs sm:text-sm text-cyan-300 font-medium">Points Earned</div>
                </div>
              </div>
            </div>

            <div className="mb-4 sm:mb-6">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-100 mb-3 sm:mb-4 drop-shadow-lg">Answer Revealed</h3>
              <div className="bg-slate-700/60 backdrop-blur-sm p-3 sm:p-4 rounded-xl border border-slate-500/40 mb-3 sm:mb-4 shadow-inner">
                <p className="text-gray-100 font-semibold mb-3 sm:mb-4 text-sm sm:text-base drop-shadow-md">{currentQuestion.question}</p>
                <div className="space-y-2">
                  {currentQuestion.options.map((option: string, index: number) => {
                    const isCorrect = index === currentQuestion.correctAnswer
                    const playerSelected = playerAnswers[currentPlayerId] === index
                    const playerCorrect = playerSelected && isCorrect

                    return (
                      <div
                        key={index}
                        className={`p-2 sm:p-3 rounded-lg border-2 transition-all text-sm sm:text-base backdrop-blur-sm ${
                          isCorrect
                            ? "border-green-400 bg-green-500/30 text-gray-100 drop-shadow-sm"
                            : playerSelected
                              ? "border-red-400 bg-red-500/30 text-gray-100 drop-shadow-sm"
                              : "border-slate-500/40 bg-slate-700/50 text-gray-200 drop-shadow-sm"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-gray-100 truncate drop-shadow-sm">{option}</span>
                          <span className="text-sm sm:text-lg ml-2 flex-shrink-0 drop-shadow-sm">
                            {isCorrect && "✓ Correct"}
                            {playerSelected && !isCorrect && "✗ Your Answer"}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            <div className="space-y-2 sm:space-y-3">
              <Button
                onClick={() => setShowLeaderboard(true)}
                className="w-full bg-gradient-to-r from-purple-500/80 via-pink-500/80 to-indigo-500/80 hover:from-purple-600/90 hover:via-pink-600/90 hover:to-indigo-600/90 text-white py-4 sm:py-6 font-semibold rounded-xl text-sm sm:text-base backdrop-blur-md border border-white/30 shadow-lg shadow-purple-500/30"
              >
                Show Leaderboard
              </Button>

              {isAdmin && (
                <Button
                  onClick={handleNextQuestionClick}
                  className="w-full bg-gradient-to-r from-green-500/80 via-emerald-500/80 to-cyan-500/80 hover:from-green-600/90 hover:via-emerald-600/90 hover:to-cyan-600/90 text-white py-4 sm:py-6 font-semibold rounded-xl text-sm sm:text-base backdrop-blur-md border border-white/30 shadow-lg shadow-green-500/30"
                >
                  {isLastQuestion ? "View Final Results" : "Next Question"}
                </Button>
              )}

              {!isAdmin && (
                <div className="text-center text-cyan-200 py-3 sm:py-4 bg-slate-700/50 backdrop-blur-sm rounded-lg border border-slate-500/40 text-xs sm:text-base font-medium drop-shadow-md shadow-inner">
                  Waiting for admin to continue...
                </div>
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
