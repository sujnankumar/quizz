"use client"

import Link from "next/link"
import { RoomCreation } from "@/components/room-creation"

export default function CreateRoomPage() {
  return (
    <main className="min-h-screen bg-transparent">
      <nav className="w-full p-4 flex justify-between items-center">
        <Link href="/" className="text-cyan-300 hover:text-cyan-200 text-sm">&larr; Home</Link>
        <Link href="/join-room" className="text-cyan-300 hover:text-cyan-200 text-sm">Join Room</Link>
      </nav>
      <RoomCreation initialMode="create" />
    </main>
  )
}
