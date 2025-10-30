"use client"

import Link from "next/link"
import { useEffect } from "react"
import { useSocket } from "@/hooks/use-socket"

export default function Home() {
  const { isConnected, connect } = useSocket()

  useEffect(() => {
    if (!isConnected) connect()
  }, [isConnected, connect])

  return (
    <main className="min-h-screen bg-transparent">
      <section className="max-w-2xl mx-auto py-16 px-6">
        <h1 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">QuizMaster</h1>
        <p className="text-cyan-200 mb-10">Multiplayer Quiz Battle</p>

        <div className="grid gap-4 sm:grid-cols-2">
          <Link
            href="/create-room"
            className="block text-center rounded-2xl p-6 bg-gradient-to-r from-blue-500/80 via-cyan-500/80 to-purple-500/80 border border-white/20 text-white font-semibold hover:opacity-95"
          >
            ✨ Create Room
          </Link>
          <Link
            href="/join-room"
            className="block text-center rounded-2xl p-6 bg-gradient-to-r from-indigo-500/80 via-purple-500/80 to-pink-500/80 border border-white/20 text-white font-semibold hover:opacity-95"
          >
            🎯 Join Room
          </Link>
        </div>

        <div className="mt-8 text-cyan-300 text-sm">
          Or open an existing quiz directly: <code className="text-cyan-200">/quiz/ROOMCODE</code>
        </div>
      </section>
    </main>
  )
}
