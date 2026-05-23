"use client";

import { ArithmeticGame } from "@/components/games/ArithmeticGame";
import { Grid3X3 } from "lucide-react";

export default function MultiplicationGame() {
  const generateQuestion = () => {
    const num1 = Math.floor(Math.random() * 10) + 1; // 1 to 10
    const num2 = Math.floor(Math.random() * 10) + 1; // 1 to 10
    return { num1, num2, answer: num1 * num2 };
  };

  const getHelpSteps = (num1: number, num2: number) => {
    return [
      { title: "Understand Multiplication", desc: `${num1} × ${num2} means you have ${num1} groups of ${num2}.` },
      { title: "Use addition", desc: `You can add ${num2} to itself ${num1} times: ` + Array(num1).fill(num2).join(" + ") },
      { title: "Final Answer", desc: `The total product is ${num1 * num2}.` }
    ];
  };

  return (
    <ArithmeticGame
      title="Multiplication"
      description="Master your times tables! Multiply the numbers as quickly as possible."
      hint="Think of it as repeated addition."
      operator="×"
      generateQuestion={generateQuestion}
      getHelpSteps={getHelpSteps}
      icon={<Grid3X3 className="w-10 h-10 text-emerald-500 fill-emerald-500" />}
    />
  );
}
