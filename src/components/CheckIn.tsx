import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface CheckInProps {
  onComplete: (scoreAdjustment: number, greenFlag: string, redFlag: string) => void;
  onCancel: () => void;
}

const questions = [
  {
    id: 'q1',
    text: 'Did you order delivery this week?',
    emoji: '📦',
    flags: {
      yes: { score: -5, flag: 'Ordering Out', isGreen: false },
      no:  { score: 5,  flag: 'Home/Mess Meals', isGreen: true },
    },
  },
  {
    id: 'q2',
    text: 'Did you stay active — walk or cycle to campus?',
    emoji: '🚶',
    flags: {
      yes: { score: 10, flag: 'Active Commute', isGreen: true },
      no:  { score: -5, flag: 'Skipped Moving', isGreen: false },
    },
  },
  {
    id: 'q3',
    text: 'Were you mindful with energy — unplugged chargers, turned off AC?',
    emoji: '🔋',
    flags: {
      yes: { score: 5, flag: 'Energy Mindful', isGreen: true },
      no:  { score: -5, flag: 'Energy Goblin', isGreen: false },
    },
  },
];

export function CheckIn({ onComplete, onCancel }: CheckInProps) {
  const [currentQ, setCurrentQ] = useState(0);
  const [scoreAdjustment, setScoreAdjustment] = useState(0);
  const [biggestGreen, setBiggestGreen] = useState<string>('None');
  const [biggestRed, setBiggestRed] = useState<string>('None');
  const [lastAnswer, setLastAnswer] = useState<'yes' | 'no' | null>(null);

  const handleAnswer = (answer: 'yes' | 'no') => {
    const q = questions[currentQ];
    const result = q.flags[answer];
    setLastAnswer(answer);
    const newScore = scoreAdjustment + result.score;
    setScoreAdjustment(newScore);
    if (result.isGreen) setBiggestGreen(result.flag);
    else setBiggestRed(result.flag);

    setTimeout(() => {
      setLastAnswer(null);
      if (currentQ < questions.length - 1) {
        setCurrentQ(p => p + 1);
      } else {
        onComplete(newScore, biggestGreen !== 'None' ? biggestGreen : result.flag, biggestRed !== 'None' ? biggestRed : result.flag);
      }
    }, 350);
  };

  const progress = ((currentQ + 1) / questions.length) * 100;
  const q = questions[currentQ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      style={{ background: 'rgba(30,26,22,0.5)', backdropFilter: 'blur(8px)' }}
    >
      <motion.div
        className="w-full max-w-[420px]"
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <div
          className="rounded-t-[28px] p-6 pb-10"
          style={{ background: '#FDFAF5', boxShadow: '0 -4px 40px rgba(30,26,22,0.15)' }}
        >
          {/* Handle bar */}
          <div className="w-12 h-1 rounded-full bg-[rgba(196,217,188,0.6)] mx-auto mb-6" />

          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs font-bold text-[#7BA87A] uppercase tracking-wider">
                Question {currentQ + 1} of {questions.length}
              </p>
            </div>
            <button
              onClick={onCancel}
              className="w-8 h-8 rounded-full flex items-center justify-center text-[#8A8070] hover:bg-[#F2EDE3] transition-colors text-lg"
            >
              ×
            </button>
          </div>

          {/* Progress */}
          <div className="progress-track mb-6">
            <motion.div
              className="progress-fill"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            />
          </div>

          {/* Question */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQ}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.22 }}
            >
              <div className="text-center mb-8">
                <div
                  className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center text-3xl"
                  style={{ background: 'linear-gradient(135deg, #E4EDE0, #FDF6EC)' }}
                >
                  {q.emoji}
                </div>
                <h2 className="text-display text-xl font-bold text-[#1F3D20] leading-snug">
                  {q.text}
                </h2>
              </div>

              {/* Answer Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <motion.button
                  className="soft-card p-4 text-center font-bold text-[#1E1A16] flex flex-col items-center gap-2"
                  onClick={() => handleAnswer('no')}
                  whileTap={{ scale: 0.96 }}
                  style={{
                    border: lastAnswer === 'no' ? '2px solid #5A8F5A' : '1.5px solid rgba(196,217,188,0.5)',
                    background: lastAnswer === 'no' ? '#E4EDE0' : undefined,
                  }}
                >
                  <span className="text-2xl">🙅</span>
                  <span>No</span>
                </motion.button>
                <motion.button
                  className="soft-card p-4 text-center font-bold text-[#1E1A16] flex flex-col items-center gap-2"
                  onClick={() => handleAnswer('yes')}
                  whileTap={{ scale: 0.96 }}
                  style={{
                    border: lastAnswer === 'yes' ? '2px solid #E8856A' : '1.5px solid rgba(232,133,106,0.25)',
                    background: lastAnswer === 'yes' ? '#FDEEED' : undefined,
                  }}
                >
                  <span className="text-2xl">🙋</span>
                  <span>Yeah</span>
                </motion.button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
