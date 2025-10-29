"use client"

import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface Room {
  id: string
  code: string
  adminId: string
  players: Player[]
  status: "waiting" | "quiz" | "finished"
  currentQuestion: number
  totalQuestions: number
  questions: Question[]
  topic?: string
  difficulty?: string
  questionCount?: number
}

interface Player {
  id: string
  name: string
  score: number
  answered: boolean
  selectedAnswer?: number | null
  answerTime?: number | null
}

interface Question {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  difficulty: "easy" | "medium" | "hard"
}

interface SocketContextType {
  socket: Socket | null;
  room: Room | null;
  currentPlayerId: string | null;
  isConnected: boolean;
  connect: () => void;
  disconnect: () => void;
  createRoom: (playerName: string, topic: string, difficulty: string, questionCount: number) => Promise<{room: Room, playerId: string}>;
  joinRoom: (roomCode: string, playerName: string) => void;
  startQuiz: () => void;
  selectAnswer: (answer: number, timeRemaining: number) => void;
  nextQuestion: () => void;
}

const SocketContext = createContext<SocketContextType | null>(null);

export function useSocket() {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
}

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [room, setRoom] = useState<Room | null>(null);
  const [currentPlayerId, setCurrentPlayerId] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const isConnectedRef = useRef(false);
  const socketRef = useRef<Socket | null>(null);

  const connect = () => {
    if (isConnectedRef.current) return;

    const newSocket = io(process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001', {
      autoConnect: true,
    });

    newSocket.on('connect', () => {
      console.log('Connected to server');
      setIsConnected(true);
      isConnectedRef.current = true;
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from server');
      setIsConnected(false);
      isConnectedRef.current = false;
    });

    // Room events
    newSocket.on('roomCreated', (data: { room: Room; playerId: string }) => {
      setRoom(data.room);
      setCurrentPlayerId(data.playerId);
    });

    newSocket.on('roomJoined', (data: { room: Room; playerId: string }) => {
      setRoom(data.room);
      setCurrentPlayerId(data.playerId);
    });

    newSocket.on('roomUpdated', (updatedRoom: Room) => {
      setRoom(updatedRoom);
    });

    // Quiz events
    newSocket.on('quizStarted', (updatedRoom: Room) => {
      setRoom(updatedRoom);
    });

    newSocket.on('questionUpdated', (updatedRoom: Room) => {
      setRoom(updatedRoom);
    });

    newSocket.on('allAnswered', (updatedRoom: Room) => {
      setRoom(updatedRoom);
    });

    newSocket.on('timeUp', (updatedRoom: Room) => {
      setRoom(updatedRoom);
    });

    // Score updates - update scores when room updates
    newSocket.on('roomUpdated', (updatedRoom: Room) => {
      setRoom(updatedRoom);
    });

    newSocket.on('quizFinished', (updatedRoom: Room) => {
      setRoom(updatedRoom);
    });

    // Error handling
    newSocket.on('error', (error: { message: string }) => {
      alert(error.message);
    });

    setSocket(newSocket);
    socketRef.current = newSocket;
  };

  const disconnect = () => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      setSocket(null);
      socketRef.current = null;
      setIsConnected(false);
      isConnectedRef.current = false;
      setRoom(null);
      setCurrentPlayerId(null);
    }
  };

  const createRoom = (playerName: string, topic: string, difficulty: string, questionCount: number): Promise<{room: Room, playerId: string}> => {
    if (!socketRef.current) {
      throw new Error('Socket not connected');
    }

    return new Promise((resolve, reject) => {
      socketRef.current!.emit('createRoom', {
        playerName,
        topic: topic.toLowerCase(),
        difficulty,
        questionCount
      });

      socketRef.current!.once('roomCreated', (data: { room: Room; playerId: string }) => {
        resolve(data);
      });

      socketRef.current!.once('error', (error) => {
        reject(error);
      });
    });
  };

  const joinRoom = (roomCode: string, playerName: string) => {
    if (!socketRef.current) {
      throw new Error('Socket not connected');
    }

    socketRef.current.emit('joinRoom', { roomCode, playerName });
  };

  const startQuiz = () => {
    if (!socketRef.current) return;
    socketRef.current.emit('startQuiz');
  };

  const selectAnswer = (answer: number, timeRemaining: number) => {
    if (!socketRef.current) return;
    socketRef.current.emit('selectAnswer', { answer, timeRemaining });
  };

  const nextQuestion = () => {
    if (!socketRef.current) return;
    socketRef.current.emit('nextQuestion');
  };

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, []);

  const value: SocketContextType = {
    socket,
    room,
    currentPlayerId,
    isConnected,
    connect,
    disconnect,
    createRoom,
    joinRoom,
    startQuiz,
    selectAnswer,
    nextQuestion,
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
}
