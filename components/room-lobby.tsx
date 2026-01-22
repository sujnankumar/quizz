
"use client"
import * as React from "react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useSocket } from "@/hooks/use-socket"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog"

interface RoomLobbyProps {
  room: any
  currentPlayerId: string
}

export function RoomLobby({ room, currentPlayerId }: RoomLobbyProps) {
  const { startQuiz, updateSettings, generateQuestions, isGenerating, leaveRoom, playAgain } = useSocket()
  const router = useRouter()
  const isAdmin = currentPlayerId === room.adminId
  const me = room.players.find((p: any) => p.id === currentPlayerId)
  const readyCount = room.players.filter((p: any) => p.ready).length
  const allReady = readyCount === room.players.length
  const inRematch = !!room.rematch
  const [isSettingsOpen, setIsSettingsOpen] = React.useState(false)

  const handleStartQuiz = () => {
    startQuiz()
  }

  const questionStatusIndicator = React.useMemo(() => {
    if (isGenerating) {
      return <span className="text-yellow-400">Generating...</span>;
    }
    if (room.questionsReady) {
      return <span className="text-green-400">Questions ready</span>;
    }
    if (room.generationFailed) {
      return <span className="text-red-400">Generation failed</span>;
    }
    return <span className="text-cyan-300">Questions not ready</span>;
  }, [room.questionsReady, isGenerating, room.generationFailed]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 py-6 sm:py-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-br from-indigo-900 via-purple-900 to-blue-900 opacity-90"></div>
      <div className="absolute top-0 left-0 w-48 sm:w-96 h-48 sm:h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute bottom-0 right-0 w-48 sm:w-96 h-48 sm:h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

      <div className="w-full max-w-5xl relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Room Info */}
          <Card className="p-4 sm:p-6 bg-linear-to-br from-slate-900/80 to-slate-800/60 backdrop-blur-xl border border-slate-600/40 shadow-2xl rounded-xl sm:rounded-2xl shadow-purple-500/20">
            <h2 className="text-lg sm:text-2xl font-bold text-gray-100 mb-3 sm:mb-4 flex items-center gap-2 drop-shadow-lg">
              <span className="text-2xl sm:text-3xl">🏠</span> Room Info
            </h2>
            <div className="space-y-3 sm:space-y-4">
              <div>
                <p className="text-xs sm:text-sm text-cyan-300 drop-shadow-sm">Room Code</p>
                <p className="text-2xl sm:text-3xl font-bold text-transparent bg-linear-to-r from-blue-400 to-cyan-400 bg-clip-text drop-shadow-lg">
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
          <Card className="p-4 sm:p-6 bg-linear-to-br from-slate-900/80 to-slate-800/60 backdrop-blur-xl border border-slate-600/40 shadow-2xl rounded-xl sm:rounded-2xl shadow-blue-500/20">
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
                  {player.ready ? (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-600/70 text-white ml-2">Ready</span>
                  ) : (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-600/70 text-white ml-2">Not ready</span>
                  )}
                  {player.id === room.adminId && (
                    <span className="text-xs bg-linear-to-r from-yellow-400 to-orange-400 text-white px-2 py-1 rounded-full font-semibold whitespace-nowrap ml-2 shadow-lg">
                      👑 Admin
                    </span>
                  )}
                </div>
              ))}
            </div>
          </Card>

          {/* Quiz Settings */}
          <Card className="p-4 sm:p-6 bg-linear-to-br from-slate-900/80 to-slate-800/60 backdrop-blur-xl border border-slate-600/40 shadow-2xl rounded-xl sm:rounded-2xl shadow-green-500/20">
            <h2 className="text-lg sm:text-2xl font-bold text-gray-100 mb-3 sm:mb-4 flex items-center gap-2 drop-shadow-lg">
              <span className="text-2xl sm:text-3xl">⚙️</span> Quiz Settings
            </h2>
            <div className="space-y-3 sm:space-y-4">
              <div>
                <p className="text-xs sm:text-sm text-cyan-300 drop-shadow-sm">Topic</p>
                <p className="text-base sm:text-lg font-semibold text-gray-100 capitalize drop-shadow-md">{room.topic || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-cyan-300 drop-shadow-sm">Difficulty</p>
                <p className="text-base sm:text-lg font-semibold text-gray-100 capitalize drop-shadow-md">{room.difficulty || 'Medium'}</p>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-cyan-300 drop-shadow-sm">Questions</p>
                <p className="text-base sm:text-lg font-semibold text-gray-100 drop-shadow-md">{room.questionCount || 5}</p>
              </div>

              {isAdmin ? (
                <div className="space-y-3 sm:space-y-4">
                  <SettingsDialog
                    isOpen={isSettingsOpen}
                    onOpenChange={setIsSettingsOpen}
                    room={room}
                    isGenerating={isGenerating}
                    updateSettings={updateSettings}
                    generateQuestions={generateQuestions}
                    questionStatusIndicator={questionStatusIndicator}
                  />

                  {/* Actions outside modal */}
                  <div className="flex flex-col sm:flex-row gap-3 mt-3">
                    {isAdmin && (
                      <div className="w-full sm:w-1/2">
                        <Button
                          onClick={handleStartQuiz}
                          className="w-full bg-linear-to-r from-green-500/80 via-emerald-500/80 to-cyan-500/80 hover:from-green-600/90 hover:via-emerald-600/90 hover:to-cyan-600/90 text-white py-3 font-semibold backdrop-blur-sm border border-white/30 shadow-lg shadow-green-500/30 disabled:opacity-60"
                          disabled={!room.questionsReady || isGenerating || (room.rematch && !allReady)}
                        >
                          🚀 Start Quiz
                        </Button>
                      </div>
                    )}
                    <div className={`${isAdmin ? "w-full sm:w-1/2" : "w-full"}`}>
                      <Button
                        onClick={() => {
                          leaveRoom()
                          router.push("/")
                        }}
                        className="w-full bg-linear-to-r from-red-500/80 to-pink-600/80 hover:from-red-600/90 hover:to-pink-700/90 text-white py-3 font-semibold backdrop-blur-sm border border-white/30 shadow-lg"
                      >
                        🚪 Exit Room
                      </Button>
                    </div>
                  </div>
                  {room.rematch && (
                    <div className="mt-2">
                      {me?.ready ? (
                        <span className="text-xs text-green-300">✓ You are ready</span>
                      ) : (
                        <Button
                          onClick={() => playAgain()}
                          className="bg-blue-600/80 hover:bg-blue-600 text-white px-3 py-2 rounded-md text-xs border border-white/20"
                        >
                          I'm Ready
                        </Button>
                      )}
                    </div>
                  )}
                  {isAdmin && (
                    <div className="mt-1 text-xs">
                      {questionStatusIndicator} · Ready {readyCount}/{room.players.length}{inRematch ? " (rematch)" : ""}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-cyan-200 text-sm font-medium">
                  Waiting for admin to generate questions and start the quiz...
                </div>
              )}
            </div>
          </Card>

          {!isAdmin && (
            <Card className="p-4 sm:p-6 bg-linear-to-br from-slate-900/80 to-slate-800/60 backdrop-blur-xl border border-slate-600/40 shadow-2xl rounded-xl sm:rounded-2xl shadow-purple-500/20 md:col-span-2 lg:col-span-1 flex items-center justify-center">
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


interface SettingsDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  room: any;
  isGenerating: boolean;
  updateSettings: (settings: any) => void;
  generateQuestions: () => void;
  questionStatusIndicator: React.ReactNode;
}

function SettingsDialog({ isOpen, onOpenChange, room, isGenerating, updateSettings, generateQuestions, questionStatusIndicator }: SettingsDialogProps) {
  const [localSettings, setLocalSettings] = React.useState({
    topic: room.topic || '',
    difficulty: (room.difficulty || 'medium').toLowerCase(),
    questionCount: room.questionCount || 5,
    questionTime: room.questionTime || 30,
  });

  React.useEffect(() => {
    setLocalSettings({
      topic: room.topic || '',
      difficulty: (room.difficulty || 'medium').toLowerCase(),
      questionCount: room.questionCount || 5,
      questionTime: room.questionTime || 30,
    });
  }, [room.topic, room.difficulty, room.questionCount, room.questionTime]);

  const topicChanged = localSettings.topic !== room.topic;

  const handleGenerate = () => {
    updateSettings(localSettings);
    generateQuestions();
  };

  const handleSaveChanges = () => {
    updateSettings(localSettings);
    onOpenChange(false);
  }

  const renderButton = () => {
    if (isGenerating) {
      return (
        <Button disabled className="w-full sm:w-auto bg-yellow-500/80 text-white">
          ⏳ Generating...
        </Button>
      );
    }

    if (room.questionsReady && !topicChanged) {
      return (
        <Button onClick={handleSaveChanges} className="w-full sm:w-auto bg-green-500/80 text-white">
          ✅ OK
        </Button>
      );
    }

    if (room.questionsReady && topicChanged) {
      return (
        <Button onClick={handleGenerate} className="w-full sm:w-auto bg-orange-500/80 text-white">
          🔁 Generate Again
        </Button>
      );
    }

    return (
      <Button onClick={handleGenerate} disabled={!localSettings.topic} className="w-full sm:w-auto bg-cyan-500/80 text-white">
        🔁 Generate Questions
      </Button>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="secondary"
          className="w-full bg-slate-800/60 hover:bg-slate-700/70 border border-slate-600/50 text-white"
          aria-label="Open quiz settings"
          title="Open quiz settings"
        >
          ⚙️ Open Settings
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-xl bg-slate-900/95 border border-slate-700/60">
        <DialogHeader>
          <DialogTitle className="text-gray-100">Quiz Settings</DialogTitle>
          <DialogDescription className="text-cyan-300">
            Edit settings, generate questions, then start the quiz.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
          <div>
            <p className="text-xs sm:text-sm text-cyan-300 drop-shadow-sm mb-2">Topic</p>
            <Input
              value={localSettings.topic}
              onChange={e => setLocalSettings(s => ({ ...s, topic: e.target.value }))}
              placeholder="Enter topic (e.g., 'space exploration')"
              className="bg-slate-800/60 border border-slate-600/50 text-white"
            />
          </div>
          <div>
            <p className="text-xs sm:text-sm text-cyan-300 drop-shadow-sm mb-2">Difficulty</p>
            <select
              aria-label="Select difficulty"
              title="Select difficulty"
              value={localSettings.difficulty}
              onChange={e => setLocalSettings(s => ({ ...s, difficulty: e.target.value }))}
              className="w-full p-3 bg-slate-800/60 border border-slate-600/50 text-white rounded-md"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
          <div>
            <p className="text-xs sm:text-sm text-cyan-300 drop-shadow-sm mb-2">Number of Questions</p>
            <Input
              type="number"
              min={1}
              max={20}
              value={localSettings.questionCount}
              onChange={e => {
                const v = Math.max(1, Math.min(20, parseInt(e.target.value || '1')));
                setLocalSettings(s => ({ ...s, questionCount: v }));
              }}
              className="bg-slate-800/60 border border-slate-600/50 text-white"
            />
          </div>
          <div>
            <p className="text-xs sm:text-sm text-cyan-300 drop-shadow-sm mb-2">Time per Question (sec)</p>
            <select
              aria-label="Select time per question"
              title="Select time per question"
              value={localSettings.questionTime}
              onChange={e => setLocalSettings(s => ({ ...s, questionTime: parseInt(e.target.value) }))}
              className="w-full p-3 bg-slate-800/60 border border-slate-600/50 text-white rounded-md"
            >
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={20}>20</option>
              <option value={25}>25</option>
              <option value={30}>30</option>
            </select>
          </div>
        </div>
        <DialogFooter className="mt-4 flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="text-xs">{questionStatusIndicator}</div>
          {renderButton()}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
