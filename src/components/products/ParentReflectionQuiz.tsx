"use client";

import { Heart } from "lucide-react";
import ScoredQuiz, { SQOption, SQQuestion } from "./ScoredQuiz";

// Agree-scale where higher agreement = more emotionally-supportive (0..4)
const AGREE: SQOption[] = [
  { label: "Strongly Disagree", value: 0 },
  { label: "Disagree", value: 1 },
  { label: "Neutral", value: 2 },
  { label: "Agree", value: 3 },
  { label: "Strongly Agree", value: 4 },
];
// Same scale, reverse-scored — for beliefs where strong agreement is less helpful
const AGREE_REV: SQOption[] = [
  { label: "Strongly Disagree", value: 4 },
  { label: "Disagree", value: 3 },
  { label: "Neutral", value: 2 },
  { label: "Agree", value: 1 },
  { label: "Strongly Agree", value: 0 },
];
const FREQ: SQOption[] = [
  { label: "Never", value: 0 },
  { label: "Rarely", value: 1 },
  { label: "Sometimes", value: 2 },
  { label: "Often", value: 3 },
  { label: "Almost Always", value: 4 },
];

const PINK = "#FF5C7A";
const PURPLE = "#7C3AED";
const TEAL = "#00CDBA";

const QUESTIONS: SQQuestion[] = [
  { id: "q1", section: "Emotions", accent: PINK, options: AGREE_REV, text: "Children should learn to control their emotions as quickly as possible." },
  { id: "q2", section: "Emotions", accent: PINK, options: AGREE, text: "Crying is a healthy way for children to express what they feel." },
  { id: "q3", section: "Connection", accent: PURPLE, options: AGREE, text: "When my child is upset, I try to understand what they're feeling before responding." },
  { id: "q4", section: "Connection", accent: PURPLE, options: AGREE_REV, text: "Comforting a child every time they're upset will spoil them." },
  { id: "q5", section: "Everyday Parenting", accent: TEAL, options: FREQ, text: "I stay calm when my child is having a meltdown." },
  { id: "q6", section: "Everyday Parenting", accent: TEAL, options: FREQ, text: "I make time to talk with my child about their day." },
  { id: "q7", section: "Learning", accent: "#FFC107", options: AGREE, text: "Mistakes are a natural and important part of how children learn." },
  { id: "q8", section: "Learning", accent: "#FFC107", options: AGREE_REV, text: "A calm, well-behaved child is the main sign of good parenting." },
];

export default function ParentReflectionQuiz() {
  return (
    <ScoredQuiz
      quizId="parent-reflection"
      quizName="In Sync: Parent Reflection"
      introTitle="In Sync: Parent Reflection"
      introText="8 short questions, one at a time. There are no right or wrong answers — just a warm way to notice your own parenting style."
      accent={PINK}
      icon={<Heart className="w-8 h-8 text-[#FF5C7A]" fill="currentColor" />}
      questions={QUESTIONS}
      scoreNoun="reflection result"
      bands={[
        {
          min: 80,
          label: "Deeply Attuned 💛",
          blurb:
            "You lead with warmth and empathy, and you see your child's feelings as something to understand rather than fix. Keep trusting that instinct.",
        },
        {
          min: 55,
          label: "Warm & Growing 🌱",
          blurb:
            "You're building emotionally-aware habits and already do a lot of things beautifully. A few small shifts can make those connected moments even easier.",
        },
        {
          min: 0,
          label: "Just Getting Started 🤍",
          blurb:
            "Every parent begins somewhere, and the fact that you're reflecting already says a lot. Small, gentle changes can go a long way — we'd love to walk with you.",
        },
      ]}
    />
  );
}
