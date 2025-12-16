
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, ShieldAlert, Gauge, Scale, HeartHandshake, Baby } from 'lucide-react';

interface RecommendationProps {
    recommendation: {
        actionId: string;
        reason: string;
        tradeoffAnalysis?: string;
        confidence?: { level: string; reason: string };
        empatheticPath?: string;
        simplifiedExplanation?: { en: string; hi: string; hinglish: string };
    };
    urgency?: { level: string; reason: string };
    actions: any[];
}

export default function Recommendation({ recommendation, urgency, actions }: RecommendationProps) {
    const recommendedAction = actions.find(a => a.id === recommendation.actionId) || actions[0];
    const [showSimple, setShowSimple] = useState(false);
    const [simpleLang, setSimpleLang] = useState<'en' | 'hi' | 'hinglish'>('en');

    // Color mapping for Urgency/Confidence
    const getUrgencyColor = (level: string) => {
        switch (level?.toLowerCase()) {
            case 'high': return 'bg-red-100 text-red-700 border-red-200';
            case 'medium': return 'bg-orange-100 text-orange-700 border-orange-200';
            default: return 'bg-green-100 text-green-700 border-green-200';
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="my-6 space-y-6"
        >
            {/* Main Recommendation Card */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-600 p-6 rounded-r-lg shadow-sm relative">
                <div className="flex flex-col md:flex-row md:items-start gap-4">
                    <div className="bg-blue-100 p-3 rounded-full text-blue-600 shrink-0">
                        <Star size={24} fill="currentColor" />
                    </div>
                    <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-3 mb-2">
                            <h3 className="text-xl font-bold text-blue-900">Recommended Approach</h3>

                            {/* Urgency Badge */}
                            {urgency && (
                                <span className={`px-2 py-0.5 rounded-full text-xs font-bold border flex items-center gap-1 ${getUrgencyColor(urgency.level)}`}>
                                    <ShieldAlert size={12} />
                                    Urgency: {urgency.level}
                                </span>
                            )}
                        </div>

                        <p className="font-semibold text-lg text-blue-700 mb-3">{recommendedAction.title}</p>

                        {/* Standard Reason */}
                        <p className="text-gray-700 leading-relaxed mb-4">
                            <span className="font-bold">Why? </span>
                            {recommendation.reason}
                        </p>

                        {/* Trade-off Analysis */}
                        {recommendation.tradeoffAnalysis && (
                            <div className="mt-4 bg-white/60 p-3 rounded-lg border border-blue-100 text-sm text-gray-600">
                                <strong className="flex items-center gap-1.5 text-blue-800 mb-1">
                                    <Scale size={14} /> Why not others?
                                </strong>
                                {recommendation.tradeoffAnalysis}
                            </div>
                        )}
                    </div>

                    {/* Confidence Meter (Right Side) */}
                    {recommendation.confidence && (
                        <div className="hidden md:flex bg-white/80 p-3 rounded-lg border border-blue-100/50 flex-col items-center text-center w-32 shrink-0">
                            <Gauge size={20} className="text-blue-500 mb-1" />
                            <span className="text-xs text-gray-500 uppercase font-bold tracking-wider">Confidence</span>
                            <span className={`text-sm font-bold ${recommendation.confidence.level === 'High' ? 'text-green-600' : 'text-orange-500'}`}>
                                {recommendation.confidence.level}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* If I were you - Empathetic Section */}
            {recommendation.empatheticPath && (
                <div className="bg-purple-50/80 border border-purple-100 p-5 rounded-xl flex items-start gap-4 shadow-sm">
                    <div className="bg-purple-100 p-2 rounded-full text-purple-600 shrink-0 mt-1">
                        <HeartHandshake size={20} />
                    </div>
                    <div>
                        <h4 className="font-bold text-purple-900 mb-1 flex items-center gap-2">
                            If I were in your situation...
                        </h4>
                        <p className="text-purple-800/90 italic text-sm md:text-base leading-relaxed">
                            "{recommendation.empatheticPath}"
                        </p>
                        <p className="text-[10px] text-purple-400 mt-2 uppercase tracking-wide font-semibold">Perspective-based guidance, not legal advice.</p>
                    </div>
                </div>
            )}

            {/* Explain to Parent - Prominent High-Visibility Section */}
            {recommendation.simplifiedExplanation && (
                <motion.div
                    layout
                    className={`border overflow-hidden rounded-xl transition-all duration-300 ${showSimple ? 'bg-indigo-50 border-indigo-200' : 'bg-white border-2 border-dashed border-gray-300 hover:border-indigo-300'}`}
                >
                    {!showSimple ? (
                        <button
                            onClick={() => setShowSimple(true)}
                            className="w-full p-4 flex items-center justify-between group"
                        >
                            <div className="flex items-center gap-3">
                                <div className="bg-gray-100 group-hover:bg-indigo-100 p-2 rounded-lg text-gray-500 group-hover:text-indigo-600 transition-colors">
                                    <Baby size={20} />
                                </div>
                                <div className="text-left">
                                    <h4 className="font-bold text-gray-700 group-hover:text-indigo-700 transition-colors text-base">
                                        Explain this simply?
                                    </h4>
                                    <p className="text-xs text-gray-500 group-hover:text-indigo-500">
                                        Tap for a parent-friendly explanation (Hindi/English).
                                    </p>
                                </div>
                            </div>
                            <span className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                                Explain Now
                            </span>
                        </button>
                    ) : (
                        <div className="p-5">
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="font-bold text-indigo-900 flex items-center gap-2">
                                    <Baby size={18} /> Simplified Explanation
                                </h4>
                                <button
                                    onClick={() => setShowSimple(false)}
                                    className="text-xs text-indigo-500 hover:text-indigo-700 font-medium"
                                >
                                    Close
                                </button>
                            </div>

                            <div className="flex gap-2 mb-4">
                                {(['en', 'hi', 'hinglish'] as const).map((lang) => (
                                    <button
                                        key={lang}
                                        onClick={() => setSimpleLang(lang)}
                                        className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-all border ${simpleLang === lang
                                                ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                                                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                                            }`}
                                    >
                                        {lang === 'en' ? 'English' : lang === 'hi' ? 'हिंदी' : 'Hinglish'}
                                    </button>
                                ))}
                            </div>

                            <motion.div
                                key={simpleLang}
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white p-4 rounded-xl border border-indigo-100 shadow-sm text-indigo-900 leading-relaxed font-medium text-lg"
                            >
                                {recommendation.simplifiedExplanation[simpleLang]}
                            </motion.div>
                        </div>
                    )}
                </motion.div>
            )}
        </motion.div>
    );
}
