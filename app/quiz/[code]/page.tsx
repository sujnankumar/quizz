"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useSocket } from "@/hooks/use-socket"
import { RoomLobby } from "@/components/room-lobby"
import { QuizGame } from "@/components/quiz-game"
import { FinalResults } from "@/components/final-results"

type ViewState = "loading" | "lobby" | "quiz" | "results" | "error"

export default function QuizRoomPage() {
  const params = useParams<{ code: string }>()
  const router = useRouter()
  const roomCodeParam = (params?.code || "").toUpperCase()

  const {
    room,
    currentPlayerId,
    isConnected,
    connect,
    rejoinRoom,
  } = useSocket()

  const [view, setView] = useState<ViewState>("loading")
  const currentRoomCode = useMemo(() => (room?.code || "").toUpperCase(), [room?.code])

  // Connect socket on load
  useEffect(() => {
    if (!isConnected) {
      connect()
    }
  }, [isConnected, connect])

  // Attempt rejoin when connected or when route changes
  useEffect(() => {
    if (!isConnected || !roomCodeParam) return

    // If already in the same room, decide state from room.status
    if (room && currentRoomCode === roomCodeParam) {
      switch (room.status) {
        case "waiting":
          setView("lobby")
          break
        case "quiz":
          setView("quiz")
          break
        case "finished":
          setView("results")
          break
        default:
          setView("loading")
      }
      return
    }

    // Try rejoin using local storage identity (clientId is managed inside use-socket)
    try {
      const storedName = typeof window !== "undefined" ? localStorage.getItem("playerName") || undefined : undefined
      rejoinRoom(roomCodeParam, storedName)
      // show loading while waiting for roomJoined/roomUpdated
      setView("loading")
    } catch {
      setView("error")
    }
  }, [isConnected, roomCodeParam, room, currentRoomCode, rejoinRoom])

  // When room updates, recalc view
  useEffect(() => {
    if (!room) return
    if ((room.code || "").toUpperCase() !== roomCodeParam) return
    switch (room.status) {
      case "waiting":
        setView("lobby")
        break
      case "quiz":
        setView("quiz")
        break
      case "finished":
        setView("results")
        break
      default:
        setView("loading")
    }
  }, [room, roomCodeParam])

  const goHome = () => router.push("/")

  return (
    <main className="min-h-screen bg-transparent">
      <nav className="w-full p-4 flex justify-between items-center">
        <Link href="/" className="text-cyan-300 hover:text-cyan-200 text-sm">&larr; Home</Link>
        <div className="text-xs text-cyan-200 tracking-wider">Room: {roomCodeParam}</div>
      </nav>

      {view === "loading" && (
        <div className="flex items-center justify-center py-24 text-cyan-200">
          Reconnecting to room {roomCodeParam}...
        </div>
      )}

      {view === "error" && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="text-red-300 mb-2 font-semibold">Unable to rejoin the room.</div>
          <div className="text-cyan-200 mb-6">The quiz may have started or the room no longer exists.</div>
          <div className="flex gap-3">
            <Link href="/join-room" className="text-cyan-300 hover:text-cyan-200 underline">Join another room</Link>
            <button onClick={goHome} className="text-cyan-300 hover:text-cyan-200 underline">Go Home</button>
          </div>
        </div>
      )}

      {view === "lobby" && room && currentPlayerId && (
        <RoomLobby room={room} currentPlayerId={currentPlayerId} />
      )}

      {view === "quiz" && room && currentPlayerId && (
        <QuizGame room={room} currentPlayerId={currentPlayerId} />
      )}

      {view === "results" && room && (
        <FinalResults room={room} />
      )}
    </main>
  )
}
