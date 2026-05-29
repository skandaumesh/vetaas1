"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, CheckCircle2, AlertCircle, Calendar, Play, Sparkles, Star, Heart, Zap } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

// Data Structures
const SECTIONS = [
  {
    id: 'self-awareness',
    title: 'Self-Awareness',
    description: 'Understanding emotions, confidence, strengths, and self-expression.',
    color: '#FF5C7A', // Coral Pink
    icon: <Heart className="w-6 h-6 text-white" />,
    questions: [
      { id: 'q1', text: 'Uses words like "happy," "sad," "angry," or "worried" to express feelings.' },
      { id: 'q2', text: 'Tells me when something is bothering them.' },
      { id: 'q3', text: 'Talks positively about themselves.' },
      { id: 'q4', text: 'Tries new activities even when unsure.' },
    ]
  },
  {
    id: 'self-management',
    title: 'Self-Management',
    description: 'Emotional regulation, impulse control, routines, and handling challenges.',
    color: '#00CDBA', // Teal Mint
    icon: <Zap className="w-6 h-6 text-white" />,
    questions: [
      { id: 'q5', text: 'Calms down after becoming upset.' },
      { id: 'q6', text: 'Uses words instead of hitting, shouting, or throwing things when frustrated.' },
      { id: 'q7', text: 'Accepts "no" or disappointment appropriately.' },
      { id: 'q8', text: 'Follows routines or instructions with minimal reminders.' },
    ]
  },
  {
    id: 'social-awareness',
    title: 'Social Awareness',
    description: 'Empathy, listening, kindness, and respecting others.',
    color: '#1E90FF', // Sky Blue
    icon: <CheckCircle2 className="w-6 h-6 text-white" />,
    questions: [
      { id: 'q9', text: 'Notices when someone else is upset.' },
      { id: 'q10', text: 'Listens when others are speaking.' },
      { id: 'q11', text: 'Shares, takes turns, or cooperates during activities.' },
      { id: 'q12', text: 'Treats others respectfully.' },
    ]
  },
  {
    id: 'relationship-skills',
    title: 'Relationship Skills',
    description: 'Communication, friendship-building, teamwork, and conflict management.',
    color: '#7C3AED', // Vivid Violet
    icon: <Sparkles className="w-6 h-6 text-white" />,
    questions: [
      { id: 'q13', text: 'Starts conversations appropriately with children or adults.' },
      { id: 'q14', text: 'Participates comfortably in group activities.' },
      { id: 'q15', text: 'Handles small disagreements with support or independently.' },
      { id: 'q16', text: 'Waits respectfully while others are talking.' },
    ]
  },
  {
    id: 'responsible-decision-making',
    title: 'Responsible Decision-Making',
    description: 'Problem-solving, responsibility, and making thoughtful choices.',
    color: '#FFC107', // Sunshine Yellow
    icon: <Star className="w-6 h-6 text-white" />,
    questions: [
      { id: 'q17', text: 'Tries to solve small problems before asking for help.' },
      { id: 'q18', text: 'Thinks about consequences before acting.' },
      { id: 'q19', text: 'Takes responsibility for mistakes.' },
      { id: 'q20', text: 'Asks for help appropriately when needed.' },
    ]
  }
];

const OPTIONS = [
  { label: 'Rarely', value: 1 },
  { label: 'Sometimes', value: 2 },
  { label: 'Often', value: 3 },
  { label: 'Almost Always', value: 4 },
];

export default function SelAssessment() {
  const [currentStep, setCurrentStep] = useState(-1); // -1: Intro, 0: Parent Info, 1-5: Sections, 6: Results
  const [parentInfo, setParentInfo] = useState({
    parentName: '',
    childName: '',
    childAge: '',
    schoolGrade: '',
    email: '',
    phone: '',
  });
  
  // Store responses as { questionId: value }
  const [responses, setResponses] = useState<Record<string, number>>({});

  const handleNext = () => {
    if (currentStep === -1) setCurrentStep(1);
    else if (currentStep < 6) setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep === 1) setCurrentStep(-1);
    else if (currentStep > -1) setCurrentStep(currentStep - 1);
  };

  const handleOptionSelect = (qId: string, value: number) => {
    setResponses((prev) => ({ ...prev, [qId]: value }));
  };

  const isCurrentSectionComplete = () => {
    if (currentStep === -1) return true;
    if (currentStep >= 1 && currentStep <= 5) {
      const section = SECTIONS[currentStep - 1];
      return section.questions.every((q) => responses[q.id] !== undefined);
    }
    return true;
  };

  const getScoreDescription = (score: number, maxScore: number) => {
    const percentage = score / maxScore;
    if (percentage < 0.56) return "Emerging"; // 9 and below out of 16
    if (percentage < 0.81) return "Developing"; // 10 - 12 out of 16
    return "Strongly Developing"; // 13 - 16 out of 16
  };

  const renderProgressBar = () => {
    const totalSteps = 6;
    const progress = Math.max(0, currentStep) / totalSteps * 100;

    return (
      <div className="w-full max-w-4xl mx-auto mb-10 px-4 relative z-10">
        <div className="flex justify-between text-sm font-bold mb-3" style={{ color: '#7C3AED' }}>
          <span>Adventure Progress</span>
          <span className="bg-white px-3 py-1 rounded-full shadow-sm">{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden relative">
          <div 
            className="h-full rounded-full transition-all duration-700 ease-out"
            style={{ 
              width: `${Math.max(2, progress)}%`,
              backgroundColor: '#00CDBA',
            }}
          >
          </div>
        </div>
      </div>
    );
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.5, type: "spring" as const, bounce: 0.4 } },
    exit: { opacity: 0, scale: 0.95, y: -20, transition: { duration: 0.3 } }
  };

  return (
    <div className="relative w-full flex flex-col items-center justify-start py-12 px-4 bg-[#FAFAFA] font-[family-name:var(--font-poppins)] overflow-hidden min-h-[80vh]">
      
      {/* Minimalist soft glow */}
      <div className="absolute top-[20%] left-[10%] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] rounded-full bg-gradient-to-tr from-[#1E90FF]/5 to-[#00CDBA]/5 blur-[100px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[10%] right-[5%] w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] rounded-full bg-gradient-to-bl from-[#FF5C7A]/5 to-[#FFC107]/5 blur-[120px] pointer-events-none z-0"></div>
      
      {currentStep > -1 && currentStep < 6 && renderProgressBar()}

      <div className="w-full max-w-4xl relative z-10">
        <AnimatePresence mode="wait">
          
          {/* INTRO SCREEN */}
          {currentStep === -1 && (
            <motion.div 
              key="intro"
              variants={containerVariants}
              initial="hidden" animate="visible" exit="exit"
              className="p-8 md:p-16 text-center"
            >
              <div className="inline-block p-4 bg-white border border-gray-100 rounded-full mb-6 shadow-sm">
                <Sparkles className="w-8 h-8 text-[#FFC107]" />
              </div>
              <h1 className="text-4xl md:text-5xl font-semibold mb-6 tracking-tight text-gray-900">
                Discover Your Child's Superpowers
              </h1>
              <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed font-medium">
                Join us on a fun, 5-minute journey to explore your child's social and emotional skills across five key areas. Let's uncover their strengths together!
              </p>
              
              <div className="flex flex-wrap justify-center gap-4 md:gap-6 mb-12">
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-gray-100 shadow-sm">
                  <Heart className="w-4 h-4 text-[#FF5C7A]" />
                  <span className="font-medium text-gray-600 text-sm">5 Magic Areas</span>
                </div>
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-gray-100 shadow-sm">
                  <Calendar className="w-4 h-4 text-[#00CDBA]" />
                  <span className="font-medium text-gray-600 text-sm">Takes ~5 Mins</span>
                </div>
              </div>

              <button 
                onClick={handleNext}
                className="bg-gray-900 text-white font-medium py-3.5 px-8 rounded-full text-base transition-all duration-300 hover:bg-gray-800 hover:shadow-lg inline-flex items-center gap-2"
              >
                Start the Assessment <ChevronRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}



          {/* ASSESSMENT SECTIONS */}
          {currentStep >= 1 && currentStep <= 5 && (
            <motion.div 
              key={`section-${currentStep}`}
              variants={containerVariants}
              initial="hidden" animate="visible" exit="exit"
              className="p-6 md:p-10 relative z-10"
            >
              {(() => {
                const section = SECTIONS[currentStep - 1];
                return (
                  <>
                    <div className="mb-12 flex flex-col md:flex-row items-center gap-5 text-center md:text-left">
                      <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-white shadow-sm border border-gray-50 text-white" style={{ backgroundColor: section.color }}>
                        {section.icon}
                      </div>
                      <div>
                        <span className="font-medium text-xs uppercase tracking-widest mb-1 block text-gray-400">Section {currentStep} of 5</span>
                        <h2 className="text-2xl md:text-3xl font-semibold mb-1 text-gray-900">{section.title}</h2>
                        <p className="text-gray-500 font-medium text-sm md:text-base">{section.description}</p>
                      </div>
                    </div>

                    <div className="space-y-6">
                      {section.questions.map((q, idx) => (
                        <div key={q.id} className="relative bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100/50">
                          
                          <p className="text-base md:text-lg text-gray-800 font-medium mb-6 flex items-start gap-3">
                            <span style={{ color: section.color }} className="font-semibold">0{idx + 1}.</span> {q.text}
                          </p>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {OPTIONS.map(opt => {
                              const isSelected = responses[q.id] === opt.value;
                              return (
                                <button
                                  key={opt.value}
                                  onClick={() => handleOptionSelect(q.id, opt.value)}
                                  className={`py-3 px-3 rounded-xl text-sm font-medium transition-all flex items-center justify-center border ${
                                    isSelected
                                      ? 'shadow-sm'
                                      : 'bg-[#FAFAFA] border-transparent text-gray-500 hover:bg-gray-100'
                                  }`}
                                  style={{ 
                                    backgroundColor: isSelected ? section.color : undefined, 
                                    borderColor: isSelected ? section.color : undefined,
                                    color: isSelected ? 'white' : undefined,
                                  }}
                                >
                                  {opt.label}
                                </button>
                              )
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                );
              })()}
            </motion.div>
          )}

          {/* RESULTS SCREEN */}
          {currentStep === 6 && (
            <motion.div 
              key="results"
              variants={containerVariants}
              initial="hidden" animate="visible" exit="exit"
              className="p-8 md:p-12"
            >
              <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-2xl mb-6 shadow-sm border border-gray-100">
                  <Star className="w-8 h-8 text-[#FFC107]" />
                </div>
                <h2 className="text-3xl md:text-4xl font-semibold mb-3 text-gray-900">Assessment Complete</h2>
                <p className="text-gray-500 font-medium">Here is a brief overview of your child's SEL profile.</p>
              </div>

              <div className="grid md:grid-cols-2 gap-10 mb-8">
                {/* Scores */}
                <div className="space-y-5">
                  <h3 className="text-2xl font-black text-gray-800 mb-6 flex items-center gap-3">
                    <Sparkles className="w-6 h-6 text-[#FF5C7A]" /> Power Levels
                  </h3>
                  {SECTIONS.map((sec) => {
                    const sectionScore = sec.questions.reduce((sum, q) => sum + (responses[q.id] || 0), 0);
                    const maxScore = sec.questions.length * 4;
                    const percentage = Math.round((sectionScore / maxScore) * 100);
                    const desc = getScoreDescription(sectionScore, maxScore);

                    return (
                      <div key={sec.id} className="bg-white rounded-2xl p-6 border border-gray-100/50 shadow-sm">
                        <div className="flex justify-between items-end mb-4">
                          <div>
                            <p className="font-semibold text-gray-900 text-base">{sec.title}</p>
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-widest mt-1">{desc}</p>
                          </div>
                          <span className="font-medium text-xl" style={{ color: sec.color }}>{percentage}%</span>
                        </div>
                        <div className="w-full bg-[#FAFAFA] rounded-full h-1.5 overflow-hidden">
                          <div className="h-full transition-all duration-1000" style={{ width: `${Math.max(2, percentage)}%`, backgroundColor: sec.color }}></div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Growth Insights & CTA */}
                <div className="flex flex-col gap-6">
                  <div className="bg-white rounded-2xl p-8 border border-gray-100/50 shadow-sm">
                    <h3 className="text-lg font-semibold mb-6 flex items-center gap-2 text-gray-900">
                      <CheckCircle2 className="w-5 h-5 text-[#00CDBA]" /> Growth Insights
                    </h3>
                    
                    <div className="mb-6">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                        Strongest Areas
                      </p>
                      <ul className="space-y-3">
                        <li className="flex items-center gap-3 text-sm font-medium text-gray-700"><div className="w-1.5 h-1.5 rounded-full bg-[#00CDBA]"></div> Social Awareness</li>
                        <li className="flex items-center gap-3 text-sm font-medium text-gray-700"><div className="w-1.5 h-1.5 rounded-full bg-[#00CDBA]"></div> Emotional Literacy</li>
                      </ul>
                    </div>
                    
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                        Areas to Nurture
                      </p>
                      <ul className="space-y-3">
                        <li className="flex items-center gap-3 text-sm font-medium text-gray-700"><div className="w-1.5 h-1.5 rounded-full bg-[#FF5C7A]"></div> Emotional Regulation</li>
                        <li className="flex items-center gap-3 text-sm font-medium text-gray-700"><div className="w-1.5 h-1.5 rounded-full bg-[#FF5C7A]"></div> Problem-Solving</li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-gray-900 rounded-2xl p-8 shadow-md text-center text-white flex flex-col justify-center">
                    <h3 className="text-xl font-semibold mb-2">Next Steps</h3>
                    <p className="text-gray-400 text-sm mb-8 font-medium">Book a 20-minute discovery call to understand these results and explore fun activities.</p>
                    <div className="flex flex-col gap-4">
                      <Link 
                        href="/contact" 
                        className="block w-full bg-white text-gray-900 font-medium text-sm py-3 px-6 rounded-xl hover:bg-gray-100 transition-colors"
                      >
                        Book Discovery Call
                      </Link>
                      <a
                        href={`mailto:skandaumesh82@gmail.com?subject=SEL Assessment Results&body=${encodeURIComponent(
                          `Hello Vetaas,\n\nHere are the SEL Assessment results:\n\n` +
                          SECTIONS.map(sec => {
                            const score = sec.questions.reduce((sum, q) => sum + (responses[q.id] || 0), 0);
                            const max = sec.questions.length * 4;
                            return `- ${sec.title}: ${score}/${max} (${Math.round((score / max) * 100)}%)`;
                          }).join('\n')
                        )}`}
                        className="block w-full bg-transparent border border-gray-700 text-white font-medium text-sm py-3 px-6 rounded-xl hover:bg-gray-800 transition-colors"
                      >
                        Email My Results
                      </a>
                    </div>
                  </div>
                </div>
              </div>

            </motion.div>
          )}
        </AnimatePresence>

        {/* NAVIGATION BAR */}
        {currentStep > -1 && currentStep < 6 && (
          <div className="w-full max-w-4xl flex justify-between items-center relative z-20 mt-8 pt-6 border-t border-gray-200">
            <button 
              onClick={handleBack}
              className="flex items-center gap-2 text-gray-500 font-medium px-4 py-2 rounded-lg hover:text-gray-900 hover:bg-gray-100 transition-colors text-sm"
            >
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
            <button 
              onClick={handleNext}
              disabled={!isCurrentSectionComplete()}
              className={`flex items-center gap-2 font-medium px-6 py-2.5 rounded-full transition-colors text-sm ${
                isCurrentSectionComplete()
                  ? 'bg-gray-900 text-white hover:bg-gray-800 shadow-sm'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              {currentStep === 5 ? 'See Results' : 'Continue'} 
              {currentStep !== 5 && <ChevronRight className="w-4 h-4" />}
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
