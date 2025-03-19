"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Howl } from "howler";
import confetti from "canvas-confetti";
import Link from "next/link";
import TinderCard from "react-tinder-card";
import "../../globals.css";

// Extend Window interface to include our sound properties
declare global {
  interface Window {
    hoverSound?: Howl;
    clickSound?: Howl;
  }
}

// Sound effects configuration
const SOUND_URLS = {
  hover: "https://assets.mixkit.co/sfx/preview/mixkit-video-game-retro-click-237.wav",
  click: "https://assets.mixkit.co/sfx/preview/mixkit-classic-click-1117.wav"
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

export default function PhotosPage() {
  const [soundsLoaded, setSoundsLoaded] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [photos, setPhotos] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Initialize sound effects
  useEffect(() => {
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

    Promise.all([
      new Promise(resolve => hoverSound.once('load', resolve)),
      new Promise(resolve => clickSound.once('load', resolve))
    ]).then(() => {
      setSoundsLoaded(true);
      window.hoverSound = hoverSound;
      window.clickSound = clickSound;
    });

    return () => {
      hoverSound.unload();
      clickSound.unload();
    };
  }, []);

  // Load photos
  useEffect(() => {
    const photoPaths = Array.from({ length: 50 }, (_, i) => `/images/photo_${i + 1}.jpg`);
    setPhotos(photoPaths);
  }, []);

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

  const handleHover = (event: React.MouseEvent) => {
    playHoverSound();
    createSparkles();
  };

  const handleClick = (event: React.MouseEvent) => {
    playClickSound();
    createMiniConfetti(event);
  };

  const onSwipe = (direction: string) => {
    playClickSound();
    // Create a synthetic event for confetti
    const event = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window
    });
    createMiniConfetti(event as unknown as React.MouseEvent);
    setCurrentIndex(prevIndex => prevIndex + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="mb-8"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onMouseEnter={handleHover}
        >
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:bg-white/30 transition-all duration-300 border border-white/30"
          >
            <span className="text-2xl">←</span>
            Back to Invitation
            <span className="text-2xl">🎂</span>
          </Link>
        </motion.div>

        <motion.h1 
          className="text-4xl font-bold text-center mb-8 text-white bg-clip-text text-transparent bg-gradient-to-r from-yellow-200 to-pink-400 drop-shadow-lg"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Party Photos Gallery
        </motion.h1>

        {/* Tinder-like Swipe Interface */}
        <div className="relative h-[500px] mb-12 flex items-center justify-center">
          {photos.map((photo, index) => (
            <div
              key={photo}
              className="absolute w-full max-w-md"
              style={{
                display: index >= currentIndex ? 'block' : 'none',
                zIndex: photos.length - index
              }}
            >
              <TinderCard
                onSwipe={onSwipe}
                preventSwipe={['up', 'down']}
                className="swipe"
              >
                <motion.div
                  className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl cursor-grab active:cursor-grabbing"
                  whileTap={{ cursor: "grabbing" }}
                  onMouseEnter={handleHover}
                >
                  <img
                    src={photo}
                    alt={`Swipe photo ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                    <p className="text-white text-lg font-semibold">
                      Swipe left or right to see more photos
                    </p>
                  </div>
                </motion.div>
              </TinderCard>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {photos.map((photo, index) => (
            <motion.div
              key={photo}
              className="relative aspect-square rounded-lg overflow-hidden cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedPhoto(photo)}
              onMouseEnter={handleHover}
            >
              <img
                src={photo}
                alt={`Party photo ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <span className="text-white text-lg font-semibold">Click to view</span>
              </div>
            </motion.div>
          ))}
        </div>

        {selectedPhoto && (
          <motion.div
            className="fixed inset-0 bg-black/90 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.img
              src={selectedPhoto}
              alt="Selected photo"
              className="max-w-[90vw] max-h-[90vh] object-contain"
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.5 }}
            />
            <motion.button
              className="absolute top-4 right-4 text-white text-4xl hover:text-pink-400 transition-colors"
              onClick={() => setSelectedPhoto(null)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onMouseEnter={handleHover}
            >
              ✕
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
} 