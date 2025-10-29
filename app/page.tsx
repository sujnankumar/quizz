"use client"

import { useEffect, useState } from "react"
import { RoomCreation } from "@/components/room-creation"
import { RoomLobby } from "@/components/room-lobby"
import { QuizGame } from "@/components/quiz-game"
import { FinalResults } from "@/components/final-results"
import { useSocket } from "@/hooks/use-socket"

type GameState = "home" | "lobby" | "quiz" | "results"

export default function Home() {
  const { room, currentPlayerId, isConnected, connect, disconnect } = useSocket()
  const [gameState, setGameState] = useState<GameState>("home")

  useEffect(() => {
    if (isConnected && room) {
      switch (room.status) {
        case "waiting":
          setGameState("lobby")
          break
        case "quiz":
          setGameState("quiz")
          break
        case "finished":
          setGameState("results")
          break
      }
    } else {
      setGameState("home")
    }
  }, [room, isConnected])

  const handlePlayAgain = () => {
    disconnect()
    setGameState("home")
  }

  if (!isConnected && gameState !== "home") {
    connect()
  }

  return (
    <main className="min-h-screen bg-transparent">
      {gameState === "home" && (
        <RoomCreation
          onConnect={() => connect()}
        />
      )}
      {gameState === "lobby" && room && currentPlayerId && (
        <RoomLobby
          room={room}
          currentPlayerId={currentPlayerId}
        />
      )}
      {gameState === "quiz" && room && currentPlayerId && (
        <QuizGame
          room={room}
          currentPlayerId={currentPlayerId}
        />
      )}
      {gameState === "results" && room && <FinalResults room={room} onPlayAgain={handlePlayAgain} />}
    </main>
  )
}
