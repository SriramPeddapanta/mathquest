"use client";

import { ArithmeticGame } from "@/components/games/ArithmeticGame";
import { Layers } from "lucide-react";

export default function TwoDigitAdditionGame() {
  const generateQuestion = () => {
    const num1 = Math.floor(Math.random() * 90) + 10; // 10 to 99
    const num2 = Math.floor(Math.random() * 90) + 10; // 10 to 99
    return { num1, num2, answer: num1 + num2 };
  };

  const getHelpSteps = (num1: number, num2: number) => {
    const ones1 = num1 % 10;
    const ones2 = num2 % 10;
    const tens1 = Math.floor(num1 / 10);
    const tens2 = Math.floor(num2 / 10);
    const onesSum = ones1 + ones2;
    const carry = onesSum >= 10 ? 1 : 0;
    const finalOnes = onesSum % 10;
    const tensSum = tens1 + tens2 + carry;

    const steps = [
      { title: "Stack them up", desc: `Align the ones and tens: ${num1} + ${num2}.` },
      { title: "Add the ones column", desc: `${ones1} + ${ones2} = ${onesSum}.` },
    ];

    if (carry > 0) {
      steps.push({ title: "Carry over", desc: `Since ${onesSum} is 10 or more, write down ${finalOnes} and carry over the 1 to the tens column.` });
      steps.push({ title: "Add the tens column", desc: `${tens1} + ${tens2} + 1 (carried) = ${tensSum}.` });
    } else {
      steps.push({ title: "Write the ones", desc: `Write down ${finalOnes}.` });
      steps.push({ title: "Add the tens column", desc: `${tens1} + ${tens2} = ${tensSum}.` });
    }

    steps.push({ title: "Final Answer", desc: `The total is ${num1 + num2}.` });
    return steps;
  };

  return (
    <ArithmeticGame
      title="Two-Digit Addition"
      description="Level up! Add two-digit numbers as fast as you can. Watch out for carrying!"
      hint="Add the ones column first, then the tens column."
      operator="+"
      generateQuestion={generateQuestion}
      getHelpSteps={getHelpSteps}
      icon={<Layers className="w-10 h-10 text-orange-500 fill-orange-500" />}
    />
  );
}
