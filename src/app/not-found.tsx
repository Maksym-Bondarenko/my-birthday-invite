"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function NotFound() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to main page after a short delay
    const timer = setTimeout(() => {
      router.push("/");
    }, 2000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 flex items-center justify-center p-6">
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold text-white mb-4">404 - Page Not Found</h1>
        <p className="text-white/90 text-lg mb-8">
          Redirecting you to the main page...
        </p>
        <motion.div
          className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full mx-auto"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </motion.div>
    </div>
  );
} 