"use client";

import { useState, useEffect } from "react";
import { useGameStore } from "@/store/useGameStore";
import { useUserStore } from "@/store/useUserStore";
import { AnimatedButton, Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { Timer, Star, Puzzle, ChevronLeft, RotateCcw, Home, X, Trophy } from "lucide-react";
import Link from "next/link";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import confetti from "canvas-confetti";

type MatchCard = {
  id: string;
  type: "equation" | "answer";
  value: string;
  matchId: string;
  isMatched: boolean;
};

function generateBoard(): MatchCard[] {
  const pairs = [];
  for (let i = 0; i < 4; i++) {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    const answer = num1 + num2;
    const matchId = `match-${i}`;
    pairs.push({ id: `eq-${i}`, type: "equation", value: `${num1} + ${num2}`, matchId, isMatched: false });
    pairs.push({ id: `ans-${i}`, type: "answer", value: `${answer}`, matchId, isMatched: false });
  }
  return pairs.sort(() => Math.random() - 0.5) as MatchCard[];
}

export default function MatchingGame() {
  const { score, timeLeft, status, startGame, endGame, pauseGame, resumeGame, quitGame, addScore, decrementTime } = useGameStore();

  const handleQuit = () => {
    if (window.confirm("Are you sure you want to quit? You will lose your current progress.")) {
      quitGame();
    }
  };
  const { addXP, addCoins, incrementStreak, unlockAchievement } = useUserStore();

  const [board, setBoard] = useState<MatchCard[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [mistakeIds, setMistakeIds] = useState<string[]>([]);
  const [hasAwarded, setHasAwarded] = useState(false);
  const [boostMsg, setBoostMsg] = useState<string | null>(null);
  const [endMsg, setEndMsg] = useState<string>("Time's Up!");

  useEffect(() => {
    if (status === "playing" && board.length === 0) {
      setBoard(generateBoard());
      setHasAwarded(false);
    }
  }, [status, board.length]);

  // Timer logic
  useEffect(() => {
    if (status !== "playing") return;
    const timer = setInterval(() => decrementTime(), 1000);
    return () => clearInterval(timer);
  }, [status, decrementTime]);

  // Handle Game Over
  useEffect(() => {
    if (status === "game_over" && !hasAwarded) {
      setHasAwarded(true);
      const earnedXP = Math.floor(score / 5);
      const earnedCoins = Math.floor(score / 20);
      
      if (score > 0) {
        addXP(earnedXP);
        addCoins(earnedCoins);
        incrementStreak();
        if (score >= 300) unlockAchievement("master_matcher");

        const endMsgs = ["Incredible!", "What a run!", "Super Speed!", "Amazing!", "Unstoppable!"];
        setEndMsg(endMsgs[Math.floor(Math.random() * endMsgs.length)]);

        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#a855f7', '#8b5cf6', '#fbbf24', '#f472b6']
        });
      } else {
        setEndMsg("Keep practicing!");
      }
    }
  }, [status, hasAwarded, score, addXP, addCoins, incrementStreak, unlockAchievement]);

  const handleCardClick = (card: MatchCard) => {
    if (status !== "playing" || card.isMatched || selectedIds.length >= 2 || selectedIds.includes(card.id)) return;

    const newSelected = [...selectedIds, card.id];
    setSelectedIds(newSelected);

    if (newSelected.length === 2) {
      const card1 = board.find(c => c.id === newSelected[0])!;
      const card2 = board.find(c => c.id === newSelected[1])!;

      if (card1.matchId === card2.matchId && card1.type !== card2.type) {
        // Match found!
        const boosts = ["Great job!", "Awesome!", "You're a star!", "Keep it up!", "Math Wizard!"];
        setBoostMsg(boosts[Math.floor(Math.random() * boosts.length)]);
        
        setTimeout(() => {
          setBoard(prev => prev.map(c => 
            newSelected.includes(c.id) ? { ...c, isMatched: true } : c
          ));
          setSelectedIds([]);
          addScore(20);
          setBoostMsg(null);
        }, 600);
      } else {
        // No match
        setMistakeIds(newSelected);
        setTimeout(() => {
          setSelectedIds([]);
          setMistakeIds([]);
        }, 600);
      }
    }
  };

  // Check board clear
  useEffect(() => {
    if (board.length > 0 && board.every(c => c.isMatched)) {
      setTimeout(() => setBoard(generateBoard()), 500);
    }
  }, [board]);

  if (status === "idle") {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 bg-purple-50">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="mx-auto bg-purple-100 w-20 h-20 rounded-full flex items-center justify-center mb-4">
              <Puzzle className="w-10 h-10 text-purple-500 fill-purple-500" />
            </div>
            <CardTitle className="text-3xl text-slate-800">Equation Matching</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-slate-500 font-medium">
              Match the equation to its correct answer! Clear the board as many times as you can in 60s.
            </p>
            <AnimatedButton variant="secondary" size="lg" className="w-full text-xl" onClick={() => startGame(60)}>
              Start Game
            </AnimatedButton>
            <Link href="/">
              <Button variant="ghost" className="w-full mt-2">
                <ChevronLeft className="w-4 h-4 mr-2" /> Back to Dashboard
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (status === "game_over") {
    const earnedXP = Math.floor(score / 5);
    const earnedCoins = Math.floor(score / 20);

    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 bg-slate-50">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-md">
          <Card className="text-center overflow-hidden border-0 shadow-2xl">
            <div className="bg-gradient-to-br from-purple-500 to-indigo-600 p-8 text-white relative">
              <Trophy className="w-16 h-16 mx-auto mb-4 text-purple-200 fill-purple-200" />
              <h2 className="text-4xl font-black mb-2">{endMsg}</h2>
              <div className="text-6xl font-black drop-shadow-md">{score}</div>
              <div className="text-purple-200 font-bold uppercase tracking-wider mt-1">Total Score</div>
            </div>
            <CardContent className="p-8 space-y-6 bg-white">
              <div className="flex justify-center gap-8">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-2xl font-bold text-purple-600 mb-1">
                    <Star className="w-6 h-6 fill-purple-500" /> +{earnedXP}
                  </div>
                  <div className="text-sm font-bold text-slate-400 uppercase">XP Earned</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-2xl font-bold text-yellow-500 mb-1">
                    <Star className="w-6 h-6 fill-yellow-400" /> +{earnedCoins}
                  </div>
                  <div className="text-sm font-bold text-slate-400 uppercase">Coins</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4">
                <AnimatedButton variant="outline" onClick={() => startGame(60)}>
                  <RotateCcw className="w-4 h-4 mr-2" /> Play Again
                </AnimatedButton>
                <Link href="/">
                  <AnimatedButton className="w-full">
                    <Home className="w-4 h-4 mr-2" /> Home
                  </AnimatedButton>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col max-w-2xl mx-auto w-full p-4 gap-6">
      {/* HUD */}
      <header className="flex justify-between items-center bg-white p-4 rounded-3xl shadow-sm border-2 border-slate-100">
        <div className="flex items-center gap-4">
          <button 
            onClick={handleQuit}
            className="w-10 h-10 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700 flex items-center justify-center transition-colors"
            title="Quit Game"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 text-slate-700 font-bold text-xl w-16">
            <Timer className={cn("w-6 h-6", timeLeft <= 10 ? "text-red-500 animate-pulse" : "text-sky-500")} />
            <span className={timeLeft <= 10 ? "text-red-500" : ""}>{timeLeft}s</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Score</div>
          <div className="text-2xl font-black text-slate-800 leading-none">{score}</div>
        </div>
      </header>

      <div className="relative">
        <AnimatePresence>
          {boostMsg && (
            <motion.div
              initial={{ y: 0, opacity: 0, scale: 0.8 }}
              animate={{ y: -20, opacity: 1, scale: 1 }}
              exit={{ y: -40, opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.4 }}
              className="absolute left-1/2 -translate-x-1/2 -top-12 whitespace-nowrap text-xl font-black text-purple-500 bg-purple-50 px-4 py-1 rounded-full border border-purple-200 shadow-sm z-10"
            >
              {boostMsg} ✨
            </motion.div>
          )}
        </AnimatePresence>
        <Progress value={(timeLeft / 60) * 100} className="h-2 bg-slate-200" indicatorClassName={timeLeft <= 10 ? "bg-red-500" : "bg-purple-500"} />
      </div>

      {/* Board */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-4">
        {board.map((card) => {
          const isSelected = selectedIds.includes(card.id);
          const isMistake = mistakeIds.includes(card.id);

          return (
            <motion.button
              key={card.id}
              layout
              whileHover={!card.isMatched && !isSelected ? { scale: 1.05 } : {}}
              whileTap={!card.isMatched && !isSelected ? { scale: 0.95 } : {}}
              animate={isMistake ? { x: [-5, 5, -5, 5, 0] } : {}}
              disabled={card.isMatched}
              onClick={() => handleCardClick(card)}
              className={cn(
                "aspect-square rounded-2xl flex items-center justify-center text-3xl font-black transition-colors border-b-4",
                card.isMatched
                  ? "bg-slate-100 text-slate-300 border-b-slate-100 shadow-inner opacity-50"
                  : isMistake
                  ? "bg-red-100 text-red-600 border-b-red-200 border-red-200"
                  : isSelected
                  ? "bg-purple-100 text-purple-600 border-b-0 translate-y-1 border-purple-200 shadow-inner"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50 shadow-sm"
              )}
            >
              {card.value}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
