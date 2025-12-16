
'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import ConversationalInput from '@/components/ConversationalInput';
// import RotatingFacts from '@/components/RotatingFacts'; // Dynamically imported
import AnalysisResults from '@/components/AnalysisResults';
import AnalysisSkeleton from '@/components/AnalysisSkeleton';
// import LogoIntro from '@/components/LogoIntro'; // Removed
import { RefreshCcw, Loader2, Sparkles } from 'lucide-react';

// Lazy load heavy visual components
const ParallaxBackground = dynamic(() => import('@/components/ParallaxBackground'), {
  ssr: false,
  loading: () => <div className="fixed inset-0 bg-gradient-to-br from-blue-50 to-white" />
});
const RotatingFacts = dynamic(() => import('@/components/RotatingFacts'), { ssr: true });

const ANALYSIS_STEPS = [
  "Understanding your issue...",
  "Identifying key entities...",
  "Evaluating possible action paths...",
  "Comparing efficiency and authority...",
  "Drafting professional complaint...",
  "Finalizing recommendations..."
];

export default function Home() {
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [error, setError] = useState('');
  // const [introComplete, setIntroComplete] = useState(false); // Removed

  // Cycle through analysis steps while loading
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading) {
      setLoadingStep(0);
      interval = setInterval(() => {
        setLoadingStep(prev => (prev < ANALYSIS_STEPS.length - 1 ? prev + 1 : prev));
      }, 800);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleAnalyze = async (formData: any) => {
    setIsLoading(true);
    setAnalysisData(null); // Clear previous data
    setError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (!res.ok) throw new Error("Failed to analyze grievance");
      const data = await res.json();
      setAnalysisData(data);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen relative flex flex-col">
      {/* Intro Animation Layer Removed */}

      <ParallaxBackground />

      <div className={`relative z-10 flex-1 flex flex-col transition-all duration-700 ease-in-out ${analysisData || isLoading ? 'justify-start pt-6' : 'justify-center pb-20'}`}>

        {/* Header - Shrinks when interaction starts */}
        <motion.header
          layout
          className={`text-center px-4 transition-all duration-700 ${analysisData || isLoading ? 'mb-6 scale-90 opacity-80' : 'mb-8 scale-100'}`}
        >
          <h1 className="text-4xl md:text-6xl font-black text-blue-900 mb-2 tracking-tight drop-shadow-sm">
            VoiceMyIssue
          </h1>
          <p className="text-lg md:text-xl text-blue-700/80 font-medium">
            AI-Assisted Civic & Consumer Grievance Decision System
          </p>
        </motion.header>

        <div className="container mx-auto px-4 max-w-4xl w-full">

          {/* Rotating Facts */}
          <AnimatePresence>
            {!analysisData && !isLoading && (
              <motion.div exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                <RotatingFacts />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Conversational Input */}
          <ConversationalInput
            onSubmit={handleAnalyze}
            isLoading={isLoading}
          />

          {/* Loading State */}
          <AnimatePresence>
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-8"
              >
                <div className="flex items-center gap-3 mb-6 p-4 bg-white/40 backdrop-blur-sm rounded-lg border border-blue-100 w-fit mx-auto">
                  <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                  <span className="text-blue-900 font-medium">{ANALYSIS_STEPS[loadingStep]}</span>
                </div>
                <AnalysisSkeleton />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Analysis Results */}
          <AnimatePresence>
            {analysisData && (
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 pb-32"
              >
                <AnalysisResults data={analysisData} />
                <div className="mt-12 pt-8 border-t border-blue-100/50">
                  <h3 className="text-center text-blue-800 font-medium mb-4 flex items-center justify-center gap-2">
                    <Sparkles size={16} /> Use the input above to refine these results
                  </h3>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {error && (
            <div className="mt-6 bg-red-100 text-red-700 p-4 rounded-lg text-center font-semibold">
              {error}
            </div>
          )}
        </div>
      </div>

      <footer className="fixed bottom-0 left-0 right-0 p-3 text-center bg-white/60 backdrop-blur-md border-t border-white/40 text-[10px] md:text-xs text-blue-900/60 z-50">
        VoiceMyIssue is an AI tool. Not legal advice.
      </footer>
    </main>
  );
}
