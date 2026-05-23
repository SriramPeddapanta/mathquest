"use client";

import { AnimatedButton } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useUserStore } from "@/store/useUserStore";
import { Progress } from "@/components/ui/progress";
import { Flame, Trophy, Coins, Star, Gamepad2, Play } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ClientOnly } from "@/components/ClientOnly";
import { PlayerOnboarding } from "@/components/PlayerOnboarding";

export default function Dashboard() {
  const { playerName, xp, level, coins, currentStreak, unlockedAchievements } = useUserStore();

  const xpForNextLevel = level * 1000;
  const xpProgress = (xp / xpForNextLevel) * 100;

  return (
    <ClientOnly>
      <PlayerOnboarding />
      <div className="flex-1 p-6 md:p-10 max-w-5xl mx-auto w-full flex flex-col gap-8">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">MathQuest</h1>
            <p className="text-slate-500 font-medium text-lg">
              {playerName ? `Welcome back, ${playerName}!` : "Welcome back! Ready for a challenge?"}
            </p>
          </div>
        <div className="flex gap-4">
          <div className="bg-orange-100 text-orange-600 px-4 py-2 rounded-2xl flex items-center gap-2 font-bold shadow-sm">
            <Flame className="w-5 h-5 fill-orange-500" />
            {currentStreak} Day Streak
          </div>
          <div className="bg-yellow-100 text-yellow-600 px-4 py-2 rounded-2xl flex items-center gap-2 font-bold shadow-sm">
            <Coins className="w-5 h-5 fill-yellow-500" />
            {coins} Coins
          </div>
        </div>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="col-span-1 md:col-span-2 bg-gradient-to-br from-indigo-500 to-purple-600 text-white border-0 shadow-lg relative overflow-hidden">
          <div className="absolute -right-10 -top-10 opacity-20">
            <Star className="w-64 h-64 fill-white" />
          </div>
          <CardHeader>
            <CardTitle className="text-white text-xl flex justify-between">
              <span>Level {level}</span>
              <span className="text-purple-200 text-base">{xp} / {xpForNextLevel} XP</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 relative z-10">
            <Progress value={xpProgress} className="bg-purple-900/40 h-4" indicatorClassName="bg-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.8)]" />
            <p className="font-medium text-purple-100">Keep playing to unlock new rewards and avatars!</p>
          </CardContent>
        </Card>

        <Card className="bg-sky-50 border-sky-200 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sky-800">
              <Trophy className="w-6 h-6 text-sky-500" />
              Achievements
            </CardTitle>
            <CardDescription className="text-sky-600/80">Unlocked so far</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-5xl font-black text-sky-500">
              {unlockedAchievements.length}
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <Gamepad2 className="w-6 h-6" /> Play Games
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <motion.div whileHover={{ y: -4 }}>
            <Card className="h-full border-b-4 border-b-sky-200 hover:border-b-sky-400 transition-colors group">
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-sky-100 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <span className="text-2xl font-black text-sky-500">+</span>
                </div>
                <CardTitle>Quick Addition</CardTitle>
                <CardDescription>Test your speed with basic addition!</CardDescription>
              </CardHeader>
              <CardContent className="mt-auto">
                <Link href="/games/addition">
                  <AnimatedButton className="w-full gap-2 text-lg">
                    <Play className="w-5 h-5 fill-white" /> Play Now
                  </AnimatedButton>
                </Link>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div whileHover={{ y: -4 }}>
            <Card className="h-full border-b-4 border-b-purple-200 hover:border-b-purple-400 transition-colors group">
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <span className="text-2xl font-black text-purple-500">?</span>
                </div>
                <CardTitle>Equation Match</CardTitle>
                <CardDescription>Match the problem to the answer!</CardDescription>
              </CardHeader>
              <CardContent className="mt-auto">
                <Link href="/games/matching">
                  <AnimatedButton variant="secondary" className="w-full gap-2 text-lg">
                    <Play className="w-5 h-5 fill-white" /> Play Now
                  </AnimatedButton>
                </Link>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div whileHover={{ y: -4 }}>
            <Card className="h-full border-b-4 border-b-orange-200 hover:border-b-orange-400 transition-colors group">
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <span className="text-2xl font-black text-orange-500">+</span>
                </div>
                <CardTitle>Two-Digit Add</CardTitle>
                <CardDescription>Level up with harder addition problems!</CardDescription>
              </CardHeader>
              <CardContent className="mt-auto">
                <Link href="/games/two-digit">
                  <AnimatedButton variant="destructive" className="w-full gap-2 text-lg">
                    <Play className="w-5 h-5 fill-white" /> Play Now
                  </AnimatedButton>
                </Link>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div whileHover={{ y: -4 }}>
            <Card className="h-full border-b-4 border-b-emerald-200 hover:border-b-emerald-400 transition-colors group">
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <span className="text-2xl font-black text-emerald-500">×</span>
                </div>
                <CardTitle>Multiplication</CardTitle>
                <CardDescription>Master your times tables.</CardDescription>
              </CardHeader>
              <CardContent className="mt-auto">
                <Link href="/games/multiplication">
                  <AnimatedButton className="w-full gap-2 text-lg bg-emerald-500 hover:bg-emerald-600 text-white">
                    <Play className="w-5 h-5 fill-white" /> Play Now
                  </AnimatedButton>
                </Link>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div whileHover={{ y: -4 }}>
            <Card className="h-full border-b-4 border-b-pink-200 hover:border-b-pink-400 transition-colors group">
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-pink-100 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <span className="text-2xl font-black text-pink-500">÷</span>
                </div>
                <CardTitle>Division</CardTitle>
                <CardDescription>Find the quotient!</CardDescription>
              </CardHeader>
              <CardContent className="mt-auto">
                <Link href="/games/division">
                  <AnimatedButton className="w-full gap-2 text-lg bg-pink-500 hover:bg-pink-600 text-white">
                    <Play className="w-5 h-5 fill-white" /> Play Now
                  </AnimatedButton>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
    </ClientOnly>
  );
}
