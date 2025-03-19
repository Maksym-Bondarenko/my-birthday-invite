"use client";

import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Howl } from "howler";
import confetti from "canvas-confetti";
import "./globals.css";
import { ChangeEvent, FormEvent } from "react";
import Link from "next/link";

// Extend Window interface to include our sound properties
declare global {
  interface Window {
    hoverSound?: Howl;
    clickSound?: Howl;
    successSound?: Howl;
  }
}

const photoPaths = Array.from({ length: 50 }, (_, i) => `/images/photo_${i + 1}.jpg`);

// Sound effects configuration
const SOUND_URLS = {
  hover: "https://assets.mixkit.co/sfx/preview/mixkit-video-game-retro-click-237.wav",
  click: "https://assets.mixkit.co/sfx/preview/mixkit-classic-click-1117.wav",
  success: "https://assets.mixkit.co/sfx/preview/mixkit-arcade-game-jump-coin-216.wav"
};

// Animation helper functions
const createSparkles = () => {
  confetti({
    particleCount: 15,
    spread: 30,
    origin: { y: 0.8 },
    colors: ['#FFD700', '#FFA500', '#FF69B4'],
    gravity: 0.5,
    scalar: 0.7,
    ticks: 50
  });
};

const createMiniConfetti = (event: React.MouseEvent) => {
  const rect = (event.target as HTMLElement).getBoundingClientRect();
  const x = (rect.left + rect.width / 2) / window.innerWidth;
  const y = (rect.top + rect.height / 2) / window.innerHeight;
  
  confetti({
    particleCount: 8,
    spread: 20,
    origin: { x, y },
    colors: ['#FFD700', '#FFA500', '#FF69B4'],
    gravity: 0.3,
    scalar: 0.5,
    ticks: 30
  });
};

export default function Home() {
  const [formData, setFormData] = useState({ 
    name: "", 
    guests: "", 
    diet: "meat", 
    drinks: [] as string[], 
    funFact: "",
    arrivalTime: "14:00" // Default to party start time
  });
  const [currentPhoto, setCurrentPhoto] = useState(photoPaths[0]);
  const [hypeLevel, setHypeLevel] = useState(0);
  const [countdown, setCountdown] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [soundsLoaded, setSoundsLoaded] = useState(false);
  const [photoScale, setPhotoScale] = useState(1);
  const [lastClickTime, setLastClickTime] = useState(Date.now());

  // Initialize sound effects
  useEffect(() => {
    // Only initialize sounds after component mounts (client-side)
    const hoverSound = new Howl({
      src: [SOUND_URLS.hover],
      preload: true,
      volume: 0.5
    });

    const clickSound = new Howl({
      src: [SOUND_URLS.click],
      preload: true,
      volume: 0.5
    });

    const successSound = new Howl({
      src: [SOUND_URLS.success],
      preload: true,
      volume: 0.7
    });

    // Wait for all sounds to load
    Promise.all([
      new Promise(resolve => hoverSound.once('load', resolve)),
      new Promise(resolve => clickSound.once('load', resolve)),
      new Promise(resolve => successSound.once('load', resolve))
    ]).then(() => {
      setSoundsLoaded(true);
      window.hoverSound = hoverSound;
      window.clickSound = clickSound;
      window.successSound = successSound;
    });

    return () => {
      // Cleanup sounds on unmount
      hoverSound.unload();
      clickSound.unload();
      successSound.unload();
    };
  }, []);

  // Sound effect functions
  const playHoverSound = () => {
    if (typeof window !== 'undefined' && window.hoverSound) {
      window.hoverSound.play();
    }
  };

  const playClickSound = () => {
    if (typeof window !== 'undefined' && window.clickSound) {
      window.clickSound.play();
    }
  };

  const playSuccessSound = () => {
    if (typeof window !== 'undefined' && window.successSound) {
      window.successSound.play();
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhoto(photoPaths[Math.floor(Math.random() * photoPaths.length)]);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const eventDate = new Date("2025-03-29T14:00:00").getTime();
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const timeLeft = eventDate - now;
      if (timeLeft <= 0) {
        setCountdown("🎉 The Party Has Started! 🎉");
        clearInterval(interval);
      } else {
        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
        setCountdown(`${days}d ${hours}h ${minutes}m ${seconds}s`);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setHypeLevel(Number(formData.guests) * 10);
    setSubmitted(true);
    playSuccessSound();
    confetti({ particleCount: 300, spread: 150, origin: { y: 0.6 } });
    
    try {
      // Submit to FormSubmit.co
      const formData = new FormData(e.currentTarget);
      const response = await fetch("https://formsubmit.co/max.druppy@gmail.com", {
        method: "POST",
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Form submission failed');
      }

      alert(`RSVP submitted! 🎉\nFun Fact: ${formData.get('funFact')}`);
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('There was an error submitting your RSVP. Please try again.');
    }
  };

  const handleHover = (event: React.MouseEvent) => {
    playHoverSound();
    createSparkles();
  };

  // Handle photo scaling
  useEffect(() => {
    const checkAndResetScale = () => {
      const now = Date.now();
      const timeSinceLastClick = now - lastClickTime;
      
      if (timeSinceLastClick > 3000) { // Start reset after 3 seconds of no clicks
        const resetInterval = setInterval(() => {
          setPhotoScale(prevScale => {
            if (prevScale <= 1) {
              clearInterval(resetInterval);
              return 1;
            }
            return Math.max(1, prevScale - 0.05); // Decrease by 0.05 every 100ms
          });
        }, 100);

        return () => clearInterval(resetInterval);
      }
    };

    const interval = setInterval(checkAndResetScale, 1000);
    return () => clearInterval(interval);
  }, [lastClickTime]);

  const handlePhotoClick = (event: React.MouseEvent) => {
    event.preventDefault();
    setLastClickTime(Date.now());
    setPhotoScale(prevScale => Math.min(prevScale + 0.2, 2.5)); // Max scale of 2.5
    playClickSound();
    createMiniConfetti(event);
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 text-white p-6">
        <motion.h1 
          initial={{ opacity: 0, y: -50 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 1.5 }}
          className="text-5xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-yellow-200 to-pink-400 drop-shadow-lg"
          onMouseEnter={handleHover}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          🎂 You're Invited to My Birthday Party! 🎉
        </motion.h1>
        <motion.h2 
          className="text-2xl font-semibold bg-black/50 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-white/20"
          initial={{ opacity: 0, scale: 0.9 }} 
          animate={{ opacity: 1, scale: 1 }} 
          transition={{ duration: 1.5, delay: 0.5 }}
          onMouseEnter={handleHover}
        >
          ⏳ Countdown: {countdown}
        </motion.h2>
        <motion.div
          className="relative"
          style={{ scale: photoScale }}
          transition={{ duration: 0.3 }}
        >
          <motion.img 
            src={currentPhoto} 
            alt="Random Photo" 
            className="w-64 h-64 rounded-full border-4 border-white/30 shadow-2xl mb-6 cursor-pointer"
            animate={{ 
              rotate: 0, 
              scale: [1, 1.1, 1],
              boxShadow: ["0 0 0 0 rgba(255,255,255,0.3)", "0 0 20px 10px rgba(255,255,255,0.5)", "0 0 0 0 rgba(255,255,255,0.3)"]
            }} 
            transition={{ 
              duration: 3, 
              repeat: Infinity, 
              ease: "linear",
              boxShadow: { duration: 2, repeat: Infinity }
            }}
            onMouseEnter={handleHover}
            onClick={handlePhotoClick}
          />
          <motion.div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-white text-lg font-semibold bg-black/50 px-4 py-2 rounded-full">
              Click to make it bigger! (if you know what I mean...)
            </span>
          </motion.div>
        </motion.div>
        
        {/* <div className="flex gap-4">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onMouseEnter={handleHover}
          >
            <Link 
              href="/pages/photos" 
              className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:bg-white/30 transition-all duration-300 border border-white/30"
            >
              <span className="text-2xl">📸</span>
              View All Party Photos
              <span className="text-2xl">✨</span>
            </Link>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onMouseEnter={handleHover}
          >
            <Link 
              href="pages/click-game" 
              className="inline-flex items-center gap-2 bg-yellow-400 text-black px-6 py-3 rounded-full font-semibold shadow-lg hover:bg-yellow-500 transition-all duration-300 border border-yellow-500"
            >
              <span className="text-2xl">🏆</span>
              Leaderboard
              <span className="text-2xl">🔥</span>
            </Link>
          </motion.div>
        </div> */}

        <motion.div 
          className="w-full max-w-lg bg-white/90 backdrop-blur-sm text-black rounded-2xl p-8 shadow-2xl border border-white/20"
          initial={{ opacity: 0, scale: 0.9, y: 20 }} 
          animate={{ opacity: 1, scale: 1, y: 0 }} 
          transition={{ duration: 1, delay: 0.8 }}
        >
          <h2 className="text-3xl font-bold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600"
            onMouseEnter={handleHover}>
            RSVP Here
          </h2>
          <form 
            action="https://formsubmit.co/max.druppy@gmail.com" 
            method="POST" 
            onSubmit={handleSubmit} 
            className="flex flex-col gap-6"
          >
            <motion.input 
              type="text" 
              name="name" 
              placeholder="Your Name" 
              value={formData.name} 
              onChange={handleChange} 
              className="p-3 border-2 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-300" 
              required 
              whileFocus={{ scale: 1.02 }}
              onMouseEnter={handleHover}
            />
            <motion.input 
              type="number" 
              name="guests" 
              placeholder="Number of Guests" 
              value={formData.guests} 
              onChange={handleChange} 
              className="p-3 border-2 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-300" 
              required 
              whileFocus={{ scale: 1.02 }}
              onMouseEnter={handleHover}
            />
            <fieldset className="space-y-2">
              <legend className="text-lg font-semibold mb-2" onMouseEnter={handleHover}>Preferred Meal:</legend>
              <div className="flex gap-4">
                {['meat', 'fish', 'vegan'].map((diet) => (
                  <motion.label 
                    key={diet} 
                    className="flex items-center gap-2 cursor-pointer hover:text-purple-600 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onMouseEnter={handleHover}
                    onClick={handlePhotoClick}
                  >
                    <input 
                      type="radio" 
                      name="diet" 
                      value={diet} 
                      checked={formData.diet === diet} 
                      onChange={handleChange}
                      className="w-4 h-4 text-purple-600 focus:ring-purple-500"
                    /> 
                    {diet.charAt(0).toUpperCase() + diet.slice(1)}
                  </motion.label>
                ))}
              </div>
            </fieldset>
            <fieldset className="space-y-2">
              <legend className="text-lg font-semibold mb-2" onMouseEnter={handleHover}>Preferred Beverage:</legend>
              <div className="grid grid-cols-2 gap-4">
                {['non-alco', 'beer', 'wine/liquer/coctails', 'else'].map((drink) => (
                  <motion.label 
                    key={drink} 
                    className="flex items-center gap-2 cursor-pointer hover:text-purple-600 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onMouseEnter={handleHover}
                    onClick={handlePhotoClick}
                  >
                    <input 
                      type="checkbox" 
                      name="drinks" 
                      value={drink} 
                      checked={formData.drinks.includes(drink)} 
                      onChange={(e) => {
                        const newDrinks = e.target.checked 
                          ? [...formData.drinks, drink]
                          : formData.drinks.filter(d => d !== drink);
                        setFormData({ ...formData, drinks: newDrinks });
                      }}
                      className="w-4 h-4 text-purple-600 focus:ring-purple-500"
                    /> 
                    {drink.charAt(0).toUpperCase() + drink.slice(1)}
                  </motion.label>
                ))}
              </div>
            </fieldset>
            <div className="space-y-2">
              <label className="text-lg font-semibold block" onMouseEnter={handleHover}>
                Time of Arrival:
              </label>
              <motion.input 
                type="time" 
                name="arrivalTime" 
                value={formData.arrivalTime}
                onChange={handleChange}
                min="14:00"
                max="23:00"
                className="w-full p-3 border-2 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-300 text-gray-700" 
                required 
                whileFocus={{ scale: 1.02 }}
                onMouseEnter={handleHover}
              />
              <p className="text-sm text-gray-600 mt-1">Party starts at 14:00</p>
            </div>
            <motion.input 
              type="text" 
              name="funFact" 
              placeholder="Your Fun Fact" 
              value={formData.funFact} 
              onChange={handleChange} 
              className="p-3 border-2 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-300" 
              required 
              whileFocus={{ scale: 1.02 }}
              onMouseEnter={handleHover}
            />
            <motion.button 
              type="submit" 
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white p-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              whileHover={{ 
                scale: 1.02,
                boxShadow: "0 0 15px rgba(255,255,255,0.5)"
              }}
              whileTap={{ scale: 0.98 }}
              onMouseEnter={handleHover}
              onClick={handlePhotoClick}
            >
              Submit RSVP
            </motion.button>
          </form>
        </motion.div>

        <motion.div 
          className="w-full max-w-lg mt-8 bg-white/90 backdrop-blur-sm text-black rounded-2xl p-8 shadow-2xl border border-white/20"
          initial={{ opacity: 0, scale: 0.9, y: 20 }} 
          animate={{ opacity: 1, scale: 1, y: 0 }} 
          transition={{ duration: 1, delay: 1 }}
        >
          <h2 className="text-2xl font-bold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600"
            onMouseEnter={handleHover}>
            Useful Links
          </h2>
          <ul className="space-y-4">
            <motion.li 
              whileHover={{ 
                scale: 1.02,
                textShadow: "0 0 8px rgba(147,51,234,0.3)"
              }}
              onMouseEnter={handleHover}
              onClick={handlePhotoClick}
            >
              <a 
                href="https://maps.app.goo.gl/vUcwL9DXNeLvsvht6" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-purple-600 hover:text-purple-800 transition-colors"
              >
                📍 Party Location
              </a>
            </motion.li>
            <motion.li 
              whileHover={{ 
                scale: 1.02,
                textShadow: "0 0 8px rgba(147,51,234,0.3)"
              }}
              onMouseEnter={handleHover}
              onClick={handlePhotoClick}
            >
              <a 
                href="https://open.spotify.com/playlist/0O7BRkw348UB22qorXSAO3?si=fsUdkQ8vQBacuA-w7OMI_w&pt=6ef8266ae4768c74c4566ca1241f9627&pi=54BSKKneQtazn" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-purple-600 hover:text-purple-800 transition-colors"
              >
                🎵 Party Playlist
              </a>
            </motion.li>
            <motion.li 
              whileHover={{ 
                scale: 1.02,
                textShadow: "0 0 8px rgba(147,51,234,0.3)"
              }}
              onMouseEnter={handleHover}
              onClick={handlePhotoClick}
            >
              <a 
                href="https://t.me/+mrxjhlZATLBiZDAy" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-purple-600 hover:text-purple-800 transition-colors"
              >
                💬 Party Chat
              </a>
            </motion.li>
            <motion.li 
              whileHover={{ 
                scale: 1.02,
                textShadow: "0 0 8px rgba(147,51,234,0.3)"
              }}
              onMouseEnter={handleHover}
              onClick={handlePhotoClick}
            >
              <a 
                href="https://docs.google.com/spreadsheets/d/1jV6Q_1kVZw27qNA0AMKgdsQcfdMZXWd5y5BbxB27K7A/edit?gid=0#gid=0" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-purple-600 hover:text-purple-800 transition-colors"
              >
                🎁 Birthday Wishlist
              </a>
            </motion.li>
          </ul>
        </motion.div>
      </div>
      <Analytics />
      <SpeedInsights />
    </>
  );
}
