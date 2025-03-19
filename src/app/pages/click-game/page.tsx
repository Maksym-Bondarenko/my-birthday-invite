"use client";

import { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import { motion } from "framer-motion";
import Link from "next/link";
import "../../globals.css";

export default function ClickGame() {
  const [nickname, setNickname] = useState("");
  const [clicks, setClicks] = useState(0);
  const [leaderboard, setLeaderboard] = useState<{ name: string; score: number }[]>([]);
  const [gameStarted, setGameStarted] = useState(false);

  // Load leaderboard from localStorage on mount
  useEffect(() => {
    const savedLeaderboard = JSON.parse(localStorage.getItem("leaderboard") || "[]");
    setLeaderboard(savedLeaderboard);
  }, []);

  const startGame = () => {
    if (!nickname.trim()) return;
    setGameStarted(true);
    const savedClicks = localStorage.getItem(`clicks_${nickname}`);
    setClicks(savedClicks ? parseInt(savedClicks) : 0);
  };

  const handleClick = () => {
    if (!gameStarted) return;
    const newClicks = clicks + 1;
    setClicks(newClicks);
    localStorage.setItem(`clicks_${nickname}`, newClicks.toString());

    // Fire confetti effect every 10 clicks
    if (newClicks % 10 === 0) {
      confetti({ particleCount: 100, spread: 50 });
    }

    // Update leaderboard
    const updatedLeaderboard = [...leaderboard.filter((entry) => entry.name !== nickname), { name: nickname, score: newClicks }].sort(
      (a, b) => b.score - a.score
    );
    setLeaderboard(updatedLeaderboard);
    localStorage.setItem("leaderboard", JSON.stringify(updatedLeaderboard));
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
        <Link href="/pages/photos_page" className="bg-yellow-400 text-black px-4 py-2 rounded-lg shadow-lg hover:bg-yellow-500 transition-all">
          📸 View Party Photos
        </Link>
      </div>
    </div>
  );
}
