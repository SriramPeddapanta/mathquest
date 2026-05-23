"use client";

import { ArithmeticGame } from "@/components/games/ArithmeticGame";
import { Zap } from "lucide-react";

export default function AdditionGame() {
  const generateQuestion = () => {
    const num1 = Math.floor(Math.random() * 12) + 1;
    const num2 = Math.floor(Math.random() * 12) + 1;
    return { num1, num2, answer: num1 + num2 };
  };

  const getHelpSteps = (num1: number, num2: number) => {
    return [
      { title: "Understand the problem", desc: `We need to find the total sum of ${num1} and ${num2}.` },
      { title: "Count them together", desc: `Start at ${Math.max(num1, num2)} and count up by ${Math.min(num1, num2)}.` },
      { title: "Find the answer", desc: `The total is ${num1 + num2}.` }
    ];
  };

  return (
    <ArithmeticGame
      title="Quick Addition"
      description="Solve as many addition problems as you can in 60 seconds! Build your combo for extra points."
      hint="Add the two numbers together before time runs out!"
      operator="+"
      generateQuestion={generateQuestion}
      getHelpSteps={getHelpSteps}
      icon={<Zap className="w-10 h-10 text-sky-500 fill-sky-500" />}
    />
  );
}
