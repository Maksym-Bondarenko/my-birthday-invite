"use client";

import { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import { motion } from "framer-motion";
import Link from "next/link";
import { db } from "@/lib/firebase";
import { collection, addDoc, query, orderBy, onSnapshot, setDoc, doc } from "firebase/firestore";

export default function ClickGame() {
  const [nickname, setNickname] = useState("");
  const [clicks, setClicks] = useState(0);
  const [leaderboard, setLeaderboard] = useState<{ name: string; score: number }[]>([]);
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    // Listen to Firestore updates in real-time
    const q = query(collection(db, "leaderboard"), orderBy("score", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const leaderboardData = snapshot.docs.map(doc => ({ name: doc.id, score: doc.data().score }));
      setLeaderboard(leaderboardData);
    });
    return () => unsubscribe();
  }, []);

  const startGame = async () => {
    if (!nickname.trim()) return;
    setGameStarted(true);
    
    // Fetch existing score from Firestore
    const existingUser = leaderboard.find(entry => entry.name === nickname);
    setClicks(existingUser ? existingUser.score : 0);
  };

  const handleClick = async () => {
    if (!gameStarted) return;
    const newClicks = clicks + 1;
    setClicks(newClicks);

    // Fire confetti effect every 10 clicks
    if (newClicks % 10 === 0) {
      confetti({ particleCount: 100, spread: 50 });
    }

    // Save or update user score in Firestore
    await setDoc(doc(db, "leaderboard", nickname), { score: newClicks });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 text-white p-6">
      <motion.h1 
        initial={{ opacity: 0, y: -50 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 1.5 }}
        className="text-5xl font-bold mb-6 text-center"
      >
        🎂 Birthday Click Challenge! 🎉
      </motion.h1>

      {!gameStarted ? (
        <div className="flex flex-col items-center">
          <input
            type="text"
            placeholder="Enter your nickname"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className="p-3 rounded-xl text-black focus:ring-2 focus:ring-yellow-400"
          />
          <button
            onClick={startGame}
            className="mt-4 bg-yellow-400 px-4 py-2 rounded-xl font-semibold text-black shadow-md hover:bg-yellow-500"
          >
            Start Game
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <motion.div 
            className="text-8xl cursor-pointer select-none"
            whileTap={{ scale: 1.2 }}
            animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 1 }}
            onClick={handleClick}
          >
            🎂
          </motion.div>
          <p className="text-2xl font-bold mt-4">Clicks: {clicks}</p>
        </div>
      )}

      {/* Leaderboard */}
      <div className="mt-8 bg-white text-black rounded-xl p-6 w-80 shadow-xl">
        <h2 className="text-2xl font-bold text-center mb-4">🏆 Leaderboard</h2>
        <ul className="list-none text-lg">
          {leaderboard.map((entry, index) => (
            <li key={index} className="flex justify-between py-1 border-b border-gray-300">
              <span>{entry.name}</span>
              <span>{entry.score}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Navigation Buttons */}
      <div className="mt-6 flex gap-4">
        <Link href="/" className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-600 transition-all">
          🔙 Back to Main Page
        </Link>
      </div>
    </div>
  );
}
