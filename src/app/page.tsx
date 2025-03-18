"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Howl } from "howler";
import confetti from "canvas-confetti";
import "./globals.css";
import { ChangeEvent, FormEvent } from "react";

const photoPaths = Array.from({ length: 50 }, (_, i) => `/images/photo_${i + 1}.jpg`);

const soundEffect = new Howl({ src: ["https://assets.mixkit.co/sfx/preview/mixkit-arcade-game-jump-coin-216.wav"] });
const hoverEffect = new Howl({ src: ["https://assets.mixkit.co/sfx/preview/mixkit-video-game-retro-click-237.wav"] });
const linkClickEffect = new Howl({ src: ["https://assets.mixkit.co/sfx/preview/mixkit-classic-click-1117.wav"] });

export default function Home() {
  const [formData, setFormData] = useState({ name: "", guests: "", diet: "meat", drinks: [] as string[], funFact: "" });
  const [currentPhoto, setCurrentPhoto] = useState(photoPaths[0]);
  const [hypeLevel, setHypeLevel] = useState(0);
  const [countdown, setCountdown] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const playHoverSound = () => hoverEffect.play();
  const playClickSound = () => linkClickEffect.play();

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

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setHypeLevel(Number(formData.guests) * 10);
    setSubmitted(true);
    soundEffect.play();
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

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 text-white p-6">
      <motion.h1 
        initial={{ opacity: 0, y: -50 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 1.5 }}
        className="text-5xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-yellow-200 to-pink-400 drop-shadow-lg"
        onMouseEnter={playHoverSound}
      >
        🎂 You're Invited to My Birthday Party! 🎉
      </motion.h1>
      <motion.h2 
        className="text-2xl font-semibold bg-black/50 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-white/20"
        initial={{ opacity: 0, scale: 0.9 }} 
        animate={{ opacity: 1, scale: 1 }} 
        transition={{ duration: 1.5, delay: 0.5 }}
        onMouseEnter={playHoverSound}
      >
        ⏳ Countdown: {countdown}
      </motion.h2>
      <motion.img 
        src={currentPhoto} 
        alt="Random Photo" 
        className="w-48 h-48 rounded-full border-4 border-white/30 shadow-2xl mb-6 hover:scale-110 transition-transform duration-300"
        animate={{ 
          rotate: 360, 
          scale: [1, 1.1, 1],
          boxShadow: ["0 0 0 0 rgba(255,255,255,0.3)", "0 0 20px 10px rgba(255,255,255,0.5)", "0 0 0 0 rgba(255,255,255,0.3)"]
        }} 
        transition={{ 
          duration: 3, 
          repeat: Infinity, 
          ease: "linear",
          boxShadow: { duration: 2, repeat: Infinity }
        }}
        onMouseEnter={playHoverSound}
      />
      <motion.div 
        className="w-full max-w-lg bg-white/90 backdrop-blur-sm text-black rounded-2xl p-8 shadow-2xl border border-white/20"
        initial={{ opacity: 0, scale: 0.9, y: 20 }} 
        animate={{ opacity: 1, scale: 1, y: 0 }} 
        transition={{ duration: 1, delay: 0.8 }}
      >
        <h2 className="text-3xl font-bold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600"
          onMouseEnter={playHoverSound}>
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
            onMouseEnter={playHoverSound}
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
            onMouseEnter={playHoverSound}
          />
          <fieldset className="space-y-2">
            <legend className="text-lg font-semibold mb-2" onMouseEnter={playHoverSound}>Preferred Meal:</legend>
            <div className="flex gap-4">
              {['meat', 'fish', 'vegan'].map((diet) => (
                <motion.label 
                  key={diet} 
                  className="flex items-center gap-2 cursor-pointer hover:text-purple-600 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onMouseEnter={playHoverSound}
                  onClick={playClickSound}
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
            <legend className="text-lg font-semibold mb-2" onMouseEnter={playHoverSound}>Preferred Beverage:</legend>
            <div className="grid grid-cols-2 gap-4">
              {['non-alco', 'beer', 'wine/liquer/coctails', 'else'].map((drink) => (
                <motion.label 
                  key={drink} 
                  className="flex items-center gap-2 cursor-pointer hover:text-purple-600 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onMouseEnter={playHoverSound}
                  onClick={playClickSound}
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
          <motion.input 
            type="text" 
            name="funFact" 
            placeholder="Your Fun Fact" 
            value={formData.funFact} 
            onChange={handleChange} 
            className="p-3 border-2 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-300" 
            required 
            whileFocus={{ scale: 1.02 }}
            onMouseEnter={playHoverSound}
          />
          <motion.button 
            type="submit" 
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white p-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onMouseEnter={playHoverSound}
            onClick={playClickSound}
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
          onMouseEnter={playHoverSound}>
          Useful Links
        </h2>
        <ul className="space-y-4">
          <motion.li 
            whileHover={{ scale: 1.02 }}
            onMouseEnter={playHoverSound}
          >
            <a 
              href="https://maps.app.goo.gl/vUcwL9DXNeLvsvht6" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-purple-600 hover:text-purple-800 transition-colors"
              onClick={playClickSound}
            >
              📍 Party Location
            </a>
          </motion.li>
          <motion.li 
            whileHover={{ scale: 1.02 }}
            onMouseEnter={playHoverSound}
          >
            <a 
              href="https://open.spotify.com/playlist/0O7BRkw348UB22qorXSAO3?si=fsUdkQ8vQBacuA-w7OMI_w&pt=6ef8266ae4768c74c4566ca1241f9627&pi=54BSKKneQtazn" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-purple-600 hover:text-purple-800 transition-colors"
              onClick={playClickSound}
            >
              🎵 Party Playlist
            </a>
          </motion.li>
          <motion.li 
            whileHover={{ scale: 1.02 }}
            onMouseEnter={playHoverSound}
          >
            <a 
              href="https://drive.google.com/drive/folders/1e2No5NzSNcy24GuHfvMV4f25-tmG52V6?usp=sharing" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-purple-600 hover:text-purple-800 transition-colors"
              onClick={playClickSound}
            >
              📸 Party Photos
            </a>
          </motion.li>
          <motion.li 
            whileHover={{ scale: 1.02 }}
            onMouseEnter={playHoverSound}
          >
            <a 
              href="https://t.me/+mrxjhlZATLBiZDAy" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-purple-600 hover:text-purple-800 transition-colors"
              onClick={playClickSound}
            >
              💬 Party Chat
            </a>
          </motion.li>
          <motion.li 
            whileHover={{ scale: 1.02 }}
            onMouseEnter={playHoverSound}
          >
            <a 
              href="https://docs.google.com/spreadsheets/d/1jV6Q_1kVZw27qNA0AMKgdsQcfdMZXWd5y5BbxB27K7A/edit?gid=0#gid=0" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-purple-600 hover:text-purple-800 transition-colors"
              onClick={playClickSound}
            >
              🎁 Birthday Wishlist
            </a>
          </motion.li>
        </ul>
      </motion.div>
    </div>
  );
}
