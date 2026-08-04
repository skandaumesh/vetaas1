"use client";

import { Sparkles } from "lucide-react";
import ScoredQuiz, { SQOption, SQQuestion } from "./ScoredQuiz";

// How often does your child do this? (0..3 → clean 0-100% range)
const FREQ: SQOption[] = [
  { label: "Rarely", value: 0 },
  { label: "Sometimes", value: 1 },
  { label: "Often", value: 2 },
  { label: "Almost Always", value: 3 },
];

const QUESTIONS: SQQuestion[] = [
  // Self-Awareness
  { id: "q1", section: "Self-Awareness", accent: "#FF5C7A", options: FREQ, text: "Uses words like “happy,” “sad,” “angry,” or “worried” to express feelings." },
  { id: "q2", section: "Self-Awareness", accent: "#FF5C7A", options: FREQ, text: "Talks positively about themselves and tries new things even when unsure." },
  // Self-Management
  { id: "q3", section: "Self-Management", accent: "#00CDBA", options: FREQ, text: "Calms down within a reasonable time after becoming upset." },
  { id: "q4", section: "Self-Management", accent: "#00CDBA", options: FREQ, text: "Uses words instead of hitting or shouting when frustrated." },
  // Social Awareness
  { id: "q5", section: "Social Awareness", accent: "#268bff", options: FREQ, text: "Notices when someone else is upset or needs help." },
  { id: "q6", section: "Social Awareness", accent: "#268bff", options: FREQ, text: "Shares, takes turns, and cooperates during activities." },
  // Relationship Skills
  { id: "q7", section: "Relationship Skills", accent: "#7C3AED", options: FREQ, text: "Starts conversations and joins group play comfortably." },
  { id: "q8", section: "Relationship Skills", accent: "#7C3AED", options: FREQ, text: "Handles small disagreements with support or on their own." },
  // Responsible Decision-Making
  { id: "q9", section: "Decision-Making", accent: "#FFC107", options: FREQ, text: "Thinks about what might happen before acting." },
  { id: "q10", section: "Decision-Making", accent: "#FFC107", options: FREQ, text: "Takes responsibility for mistakes and asks for help when needed." },
];

export default function SelAssessment() {
  return (
    <ScoredQuiz
      quizId="sel-assessment"
      quizName="SEL Assessment for Children"
      introTitle="Discover Your Child's Superpowers"
      introText="10 quick questions, one at a time, across five social-emotional skills. Answer how often your child does each — there are no wrong answers."
      accent="#7C3AED"
      icon={<Sparkles className="w-8 h-8 text-[#FFC107]" />}
      questions={QUESTIONS}
      scoreNoun="SEL profile"
      cta={{ href: "/contact", label: "Book a discovery call" }}
      bands={[
        {
          min: 80,
          label: "Strongly Developing ⭐",
          blurb:
            "Your child shows strong social-emotional skills across the board. Keep nurturing these strengths with play, conversation, and encouragement.",
        },
        {
          min: 55,
          label: "Developing 🌱",
          blurb:
            "Your child is building these skills nicely, with clear strengths and a few areas that will bloom with gentle practice and support.",
        },
        {
          min: 0,
          label: "Emerging 🌼",
          blurb:
            "These skills are just beginning to grow — which is completely normal. With the right playful support, children make big leaps here.",
        },
      ]}
    />
  );
}
