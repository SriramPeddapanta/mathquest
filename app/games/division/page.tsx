"use client";

import { ArithmeticGame } from "@/components/games/ArithmeticGame";
import { SplitSquareHorizontal } from "lucide-react";

export default function DivisionGame() {
  const generateQuestion = () => {
    const divisor = Math.floor(Math.random() * 10) + 1; // 1 to 10
    const answer = Math.floor(Math.random() * 10) + 1; // 1 to 10
    const dividend = divisor * answer;
    
    return { num1: dividend, num2: divisor, answer };
  };

  const getHelpSteps = (num1: number, num2: number) => {
    return [
      { title: "Understand Division", desc: `${num1} ÷ ${num2} means we want to split ${num1} into ${num2} equal groups.` },
      { title: "Use Multiplication", desc: `Think backwards: What number times ${num2} equals ${num1}? (${num2} × ? = ${num1})` },
      { title: "Find the Answer", desc: `Since ${num2} × ${num1 / num2} = ${num1}, the answer is ${num1 / num2}.` }
    ];
  };

  return (
    <ArithmeticGame
      title="Division"
      description="Practice your division facts. Find the quotient as fast as you can!"
      hint="Think backwards using multiplication!"
      operator="÷"
      generateQuestion={generateQuestion}
      getHelpSteps={getHelpSteps}
      icon={<SplitSquareHorizontal className="w-10 h-10 text-pink-500 fill-pink-500" />}
    />
  );
}
