"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import "./globals.css";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChangeEvent, FormEvent } from "react";

export default function Home() {
  const [formData, setFormData] = useState({ name: "", guests: "", food: "" });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert("RSVP submitted! 🎉"); // Later, this will send data to a backend
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6">
      <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.5 }}
        className="text-4xl font-bold mb-4 text-center">
        🎂 You're Invited to My Birthday Party! 🎉
      </motion.h1>
      <Card className="w-full max-w-lg bg-white text-black rounded-xl p-6 shadow-lg">
        <CardContent>
          <h2 className="text-2xl font-semibold text-center mb-4">RSVP Here</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input type="text" name="name" placeholder="Your Name" value={formData.name} 
              onChange={handleChange} className="p-2 border rounded-lg" required />
            <input type="number" name="guests" placeholder="Number of Guests" value={formData.guests} 
              onChange={handleChange} className="p-2 border rounded-lg" required />
            <input type="text" name="food" placeholder="Food Preference" value={formData.food} 
              onChange={handleChange} className="p-2 border rounded-lg" required />
            <Button type="submit" className="w-full bg-purple-500 hover:bg-purple-600 text-white p-2 rounded-lg">
              Submit RSVP
            </Button>
          </form>
        </CardContent>
      </Card>
      <div className="mt-6 text-center">
        <h3 className="text-2xl font-semibold">🎁 Wishlist 🎁</h3>
        <ul className="mt-2 space-y-2">
          <li><a href="#" className="underline">Cool Gadget</a></li>
          <li><a href="#" className="underline">Funny Socks</a></li>
          <li><a href="#" className="underline">Gift Card</a></li>
        </ul>
      </div>
    </div>
  );
}
