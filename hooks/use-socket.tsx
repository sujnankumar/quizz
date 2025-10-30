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
  hiddenScores?: boolean // Flag to indicate if scores should be hidden
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
  playerSubmissions: string[];
  connect: () => void;
  disconnect: () => void;
  clearSubmissions: () => void;
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
  const [playerSubmissions, setPlayerSubmissions] = useState<string[]>([]);

  const isConnectedRef = useRef(false);
  const socketRef = useRef<Socket | null>(null);
  const connectingRef = useRef(false);

  const connect = () => {
    // Prevent parallel connection attempts and duplicate sockets
    if (isConnectedRef.current || connectingRef.current) return;
    connectingRef.current = true;

    const newSocket = io(process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001', {
      path: '/socket.io',
      autoConnect: true,
      withCredentials: true,
      // Prefer WebSocket on Render; fallback to polling
      transports: ['websocket', 'polling'],
      upgrade: true,
      rememberUpgrade: true,
      timeout: 10000,
      reconnection: true,
      reconnectionAttempts: 3,
      reconnectionDelay: 2000
    });

    newSocket.on('connect', () => {
      console.log('Connected to server');
      setIsConnected(true);
      isConnectedRef.current = true;
      connectingRef.current = false;
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from server');
      setIsConnected(false);
      isConnectedRef.current = false;
      connectingRef.current = false;
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

    newSocket.on('playerSubmitted', (data: { playerId: string, playerName: string }) => {
      setPlayerSubmissions(prev => [...prev, data.playerName]);
    });

    // Quiz events
    newSocket.on('quizStarted', (updatedRoom: Room) => {
      setRoom(updatedRoom);
      setPlayerSubmissions([]); // Clear submissions when quiz starts
    });

    newSocket.on('questionUpdated', (updatedRoom: Room) => {
      setRoom(updatedRoom);
      setPlayerSubmissions([]); // Clear submissions for new question
    });

    newSocket.on('allAnswered', (updatedRoom: Room) => {
      setRoom(updatedRoom);
    });

    newSocket.on('timeUp', (updatedRoom: Room) => {
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
      setPlayerSubmissions([]);
    }
  };

  const clearSubmissions = () => {
    setPlayerSubmissions([]);
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
    playerSubmissions,
    connect,
    disconnect,
    clearSubmissions,
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
