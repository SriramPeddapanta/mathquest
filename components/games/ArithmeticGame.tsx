"use client";

import { useState, useEffect, useCallback } from "react";
import { useGameStore } from "@/store/useGameStore";
import { useUserStore } from "@/store/useUserStore";
import { AnimatedButton, Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { Timer, Star, Zap, ChevronLeft, RotateCcw, Home, Flame, X, Lightbulb, HelpCircle, Trophy } from "lucide-react";
import Link from "next/link";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import confetti from "canvas-confetti";

interface ArithmeticGameProps {
  title: string;
  description: string;
  hint: string;
  operator: string;
  generateQuestion: () => { num1: number; num2: number; answer: number };
  getHelpSteps: (num1: number, num2: number) => { title: string; desc: string }[];
  icon?: React.ReactNode;
}

export function ArithmeticGame({
  title,
  description,
  hint,
  operator,
  generateQuestion,
  getHelpSteps,
  icon = <Zap className="w-10 h-10 text-sky-500 fill-sky-500" />
}: ArithmeticGameProps) {
  const { score, timeLeft, status, startGame, endGame, pauseGame, resumeGame, quitGame, addScore, decrementTime, comboMultiplier, increaseMultiplier, resetMultiplier } = useGameStore();
  const { addXP, addCoins, incrementStreak, unlockAchievement } = useUserStore();

  const [question, setQuestion] = useState(generateQuestion());
  const [inputStr, setInputStr] = useState("");
  const [feedback, setFeedback] = useState<"none" | "correct" | "wrong">("none");
  const [showHelp, setShowHelp] = useState(false);
  const [hasAwarded, setHasAwarded] = useState(false);
  const [boostMsg, setBoostMsg] = useState<string | null>(null);
  const [endMsg, setEndMsg] = useState<string>("Time's Up!");

  // Timer logic
  useEffect(() => {
    if (status !== "playing") return;
    const timer = setInterval(() => {
      decrementTime();
    }, 1000);
    return () => clearInterval(timer);
  }, [status, decrementTime]);

  // Reset award status on new game
  useEffect(() => {
    if (status === "playing") {
      setHasAwarded(false);
    }
  }, [status]);

  // Handle Game Over
  useEffect(() => {
    if (status === "game_over" && !hasAwarded) {
      setHasAwarded(true);
      const earnedXP = Math.floor(score / 10);
      const earnedCoins = Math.floor(score / 50);
      
      if (score > 0) {
        addXP(earnedXP);
        addCoins(earnedCoins);
        incrementStreak();
        if (score >= 500) unlockAchievement("speed_demon");

        const endMsgs = ["Incredible!", "What a run!", "Super Speed!", "Amazing!", "Unstoppable!"];
        setEndMsg(endMsgs[Math.floor(Math.random() * endMsgs.length)]);

        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#38bdf8', '#818cf8', '#fbbf24', '#f472b6']
        });
      } else {
        setEndMsg("Keep practicing!");
      }
    }
  }, [status, hasAwarded, score, addXP, addCoins, incrementStreak, unlockAchievement]);

  const handleInput = useCallback((val: string) => {
    if (status !== "playing") return;
    
    const newInput = inputStr + val;
    setInputStr(newInput);

    if (parseInt(newInput) === question.answer) {
      // Correct
      setFeedback("correct");
      addScore(10);
      increaseMultiplier();
      
      const boosts = ["Great job!", "Awesome!", "You're a star!", "Keep it up!", "Math Wizard!"];
      setBoostMsg(boosts[Math.floor(Math.random() * boosts.length)]);
      
      setTimeout(() => {
        setQuestion(generateQuestion());
        setInputStr("");
        setFeedback("none");
        setBoostMsg(null);
      }, 600);
    } else if (newInput.length >= String(question.answer).length) {
      // Wrong
      setFeedback("wrong");
      resetMultiplier();
      setTimeout(() => {
        setInputStr("");
        setFeedback("none");
      }, 400);
    }
  }, [inputStr, status, question.answer, addScore, increaseMultiplier, resetMultiplier, generateQuestion]);

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= "0" && e.key <= "9") {
        handleInput(e.key);
      } else if (e.key === "Backspace") {
        setInputStr(prev => prev.slice(0, -1));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleInput]);

  const handleQuit = () => {
    if (window.confirm("Are you sure you want to quit? You will lose your current score.")) {
      quitGame();
    }
  };

  const handleGetHelp = () => {
    pauseGame();
    setShowHelp(true);
  };

  const handleCloseHelp = () => {
    setShowHelp(false);
    resumeGame();
  };

  if (status === "idle") {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 bg-sky-50">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="mx-auto bg-sky-100 w-20 h-20 rounded-full flex items-center justify-center mb-4">
              {icon}
            </div>
            <CardTitle className="text-3xl text-slate-800">{title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-slate-500 font-medium">
              {description}
            </p>
            <AnimatedButton size="lg" className="w-full text-xl" onClick={() => startGame(60)}>
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
    const earnedXP = Math.floor(score / 10);
    const earnedCoins = Math.floor(score / 50);

    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 bg-slate-50">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-md">
          <Card className="text-center overflow-hidden border-0 shadow-2xl">
            <div className="bg-gradient-to-br from-yellow-400 to-orange-500 p-8 text-white relative">
              <Trophy className="w-16 h-16 mx-auto mb-4 text-yellow-200 fill-yellow-200" />
              <h2 className="text-4xl font-black mb-2">{endMsg}</h2>
              <div className="text-6xl font-black drop-shadow-md">{score}</div>
              <div className="text-orange-100 font-bold uppercase tracking-wider mt-1">Total Score</div>
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
    <div className="flex-1 flex flex-col max-w-md mx-auto w-full p-4 gap-4 relative">
      
      {/* Help Modal Overlay */}
      <AnimatePresence>
        {showHelp && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 rounded-3xl"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white w-full rounded-3xl p-6 shadow-2xl relative"
            >
              <div className="flex items-center gap-3 mb-6 border-b-2 border-slate-100 pb-4">
                <div className="bg-sky-100 p-2 rounded-xl">
                  <HelpCircle className="w-8 h-8 text-sky-500" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-800">Need Help?</h3>
                  <p className="text-sm text-slate-500 font-bold">Step-by-step solution</p>
                </div>
              </div>

              <div className="text-center text-4xl font-black text-slate-800 mb-6">
                {question.num1} {operator} {question.num2} = ?
              </div>

              <div className="space-y-4 mb-8 max-h-[40vh] overflow-y-auto pr-2">
                {getHelpSteps(question.num1, question.num2).map((step, i) => (
                  <div key={i} className="flex gap-4 items-start bg-slate-50 p-4 rounded-2xl">
                    <div className="bg-sky-500 text-white font-black w-8 h-8 rounded-full flex items-center justify-center shrink-0">
                      {i + 1}
                    </div>
                    <div>
                      <div className="font-bold text-slate-800">{step.title}</div>
                      <div className="text-slate-600 text-sm mt-1">{step.desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              <AnimatedButton className="w-full text-lg" onClick={handleCloseHelp}>
                Got it! Resume Game
              </AnimatedButton>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
            <span className={timeLeft <= 10 ? "text-red-500" : ""}>{timeLeft}</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Score</div>
            <div className="text-2xl font-black text-slate-800 leading-none">{score}</div>
          </div>
        </div>
      </header>

      {/* Persistent Hint */}
      <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-3 flex items-center gap-3">
        <div className="bg-indigo-100 p-2 rounded-full text-indigo-500">
          <Lightbulb className="w-5 h-5 fill-indigo-200" />
        </div>
        <div className="text-sm font-bold text-indigo-800">
          {hint}
        </div>
        <button 
          onClick={handleGetHelp}
          className="ml-auto bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-bold px-3 py-2 rounded-xl transition-colors whitespace-nowrap"
        >
          Get Help
        </button>
      </div>

      {/* Progress Bar for Timer */}
      <Progress value={(timeLeft / 60) * 100} className="h-2 bg-slate-200" indicatorClassName={timeLeft <= 10 ? "bg-red-500" : "bg-sky-500"} />

      {/* Play Area */}
      <Card className="flex-1 flex flex-col justify-center border-0 shadow-none bg-transparent min-h-[200px]">
        <div className="text-center space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${question.num1}-${question.num2}`}
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -50, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="text-7xl font-black text-slate-800 tracking-tighter"
            >
              {question.num1} {operator} {question.num2}
            </motion.div>
          </AnimatePresence>

          <div className="relative">
            <AnimatePresence>
              {boostMsg && (
                <motion.div
                  initial={{ y: 20, opacity: 0, scale: 0.8 }}
                  animate={{ y: -40, opacity: 1, scale: 1 }}
                  exit={{ y: -60, opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.4 }}
                  className="absolute left-1/2 -translate-x-1/2 -top-4 whitespace-nowrap text-xl font-black text-emerald-500 bg-emerald-50 px-4 py-1 rounded-full border border-emerald-200 shadow-sm z-10"
                >
                  {boostMsg} ✨
                </motion.div>
              )}
            </AnimatePresence>
            
            <motion.div
              animate={
                feedback === "wrong" ? { x: [-10, 10, -10, 10, 0], color: "#ef4444" } :
                feedback === "correct" ? { scale: [1, 1.1, 1], color: "#10b981" } :
                { color: "#334155" }
              }
              className="h-20 flex items-center justify-center text-6xl font-black border-b-4 border-slate-300 mx-12 pb-2 relative z-0"
            >
              {inputStr || <span className="text-slate-300 animate-pulse">?</span>}
            </motion.div>
          </div>
          
          {/* Combo Indicator */}
          <div className="h-8">
            {comboMultiplier > 1 && (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="inline-flex items-center gap-1 bg-orange-100 text-orange-600 px-3 py-1 rounded-full font-bold text-sm">
                <Flame className="w-4 h-4 fill-orange-500" /> {comboMultiplier}x Combo!
              </motion.div>
            )}
          </div>
        </div>
      </Card>

      {/* Numpad */}
      <div className="grid grid-cols-3 gap-3 pb-4">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <AnimatedButton
            key={num}
            variant="outline"
            size="lg"
            className="h-16 text-3xl font-black text-slate-700 bg-white border-b-4 hover:bg-slate-50 active:border-b-0 active:translate-y-1"
            onClick={() => handleInput(num.toString())}
          >
            {num}
          </AnimatedButton>
        ))}
        <div />
        <AnimatedButton
          variant="outline"
          size="lg"
          className="h-16 text-3xl font-black text-slate-700 bg-white border-b-4 hover:bg-slate-50 active:border-b-0 active:translate-y-1"
          onClick={() => handleInput("0")}
        >
          0
        </AnimatedButton>
        <AnimatedButton
          variant="outline"
          size="lg"
          className="h-16 text-xl font-bold text-slate-500 bg-slate-100 border-b-4 hover:bg-slate-200 active:border-b-0 active:translate-y-1"
          onClick={() => setInputStr(prev => prev.slice(0, -1))}
        >
          DEL
        </AnimatedButton>
      </div>
    </div>
  );
}
