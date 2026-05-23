"use client";

import { useState } from "react";
import { useUserStore } from "@/store/useUserStore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AnimatedButton } from "@/components/ui/button";
import { User, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function PlayerOnboarding() {
  const { playerName, setPlayerName } = useUserStore();
  const [inputValue, setInputValue] = useState("");

  if (playerName) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim().length > 0) {
      setPlayerName(inputValue.trim());
    }
  };

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="w-full max-w-md"
        >
          <Card className="border-0 shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-sky-400 to-indigo-500 p-8 text-center text-white">
              <div className="mx-auto bg-white/20 w-20 h-20 rounded-full flex items-center justify-center mb-4">
                <User className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-black mb-2">Welcome to MathQuest!</h2>
              <p className="text-sky-100 font-medium text-lg">Your adventure begins here.</p>
            </div>
            <CardContent className="p-8 bg-white">
              <form onSubmit={handleSubmit} className="space-y-6 text-center">
                <div className="space-y-2">
                  <label htmlFor="playerName" className="text-sm font-bold text-slate-500 uppercase tracking-wider">
                    What is your name?
                  </label>
                  <input
                    id="playerName"
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Enter your hero name..."
                    className="w-full text-center text-2xl font-bold text-slate-800 border-b-4 border-slate-200 bg-slate-50 px-4 py-4 rounded-xl focus:outline-none focus:border-sky-500 focus:bg-white transition-colors"
                    autoFocus
                    maxLength={15}
                  />
                </div>
                <AnimatedButton 
                  type="submit" 
                  size="lg" 
                  className="w-full text-xl gap-2"
                  disabled={inputValue.trim().length === 0}
                >
                  <Sparkles className="w-5 h-5" /> Start Playing
                </AnimatedButton>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
