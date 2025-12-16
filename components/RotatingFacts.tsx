
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';

const FACTS = [
    "Did you know? You can file consumer complaints via WhatsApp on +91 8800001915.",
    "Under the Right to Service Act, government officials must deliver services within a set time limit.",
    "RERA has resolved over 1.25 Lakh homebuyer complaints in just 5 years.",
    "You can escalate banking issues to the RBI Ombudsman if not resolved by the bank in 30 days.",
    "The National Consumer Helpline handles over 100,000 grievances every single month.",
    "Filing a complaint on CPGRAMS connects you directly to the relevant central ministry."
];

export default function RotatingFacts() {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % FACTS.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center mb-8 h-12">
            <AnimatePresence mode='wait'>
                <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.5 }}
                    className="flex items-center gap-2 text-blue-700/80 font-medium text-sm md:text-base text-center px-4"
                >
                    <Sparkles size={16} className="text-yellow-500 shrink-0" fill="currentColor" />
                    {FACTS[index]}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
