
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp, MapPin, Building2, LayoutGrid, Info, Mic, MicOff, Loader2 } from 'lucide-react';

interface ConversationalInputProps {
    onSubmit: (data: any) => void;
    isLoading: boolean;
}

export default function ConversationalInput({ onSubmit, isLoading }: ConversationalInputProps) {
    const [step, setStep] = useState<'landing' | 'details'>('landing');
    const [formData, setFormData] = useState({
        description: '',
        category: '',
        city: '',
        state: '',
        department: ''
    });
    const [isListening, setIsListening] = useState(false);
    const recognitionRef = useRef<any>(null);

    // Auto-detect location logic moved to manual button

    // Speech Recognition Setup
    useEffect(() => {
        if (typeof window !== 'undefined') {
            // @ts-ignore
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            if (SpeechRecognition) {
                const recognition = new SpeechRecognition();
                recognition.continuous = false;
                recognition.interimResults = false;
                recognition.lang = 'en-IN'; // Default to Indian English, usually handles Hinglish okay

                recognition.onstart = () => setIsListening(true);
                recognition.onend = () => setIsListening(false);
                recognition.onresult = (event: any) => {
                    const transcript = event.results[0][0].transcript;
                    setFormData(prev => ({ ...prev, description: (prev.description + " " + transcript).trim() }));
                };
                recognition.onerror = (event: any) => {
                    console.error("Speech recognition error", event.error);
                    setIsListening(false);
                };

                recognitionRef.current = recognition;
            }
        }
    }, []);

    const toggleListening = () => {
        if (!recognitionRef.current) {
            alert("Voice input is not supported in this browser. Please try Chrome or Edge.");
            return;
        }

        if (isListening) {
            recognitionRef.current.stop();
        } else {
            recognitionRef.current.start();
        }
    };

    const handleStepExpand = (step: 'landing' | 'details') => {
        setStep(step);
    };

    const handleSubmit = () => {
        if (formData.description.trim()) {
            onSubmit(formData);
        }
    };

    return (
        <motion.div
            layout // Enable layout animation for smooth transitions
            className={`w-full max-w-2xl mx-auto bg-white/80 backdrop-blur-xl border border-white/40 shadow-xl rounded-3xl overflow-hidden transition-all duration-500 ease-out ${step === 'details' ? 'mt-4' : 'mt-[15vh]' // Move up when active
                }`}
        >
            <div className="p-4 space-y-4">

                {/* Primary Input - Description */}
                <div className="relative">
                    <textarea
                        disabled={isLoading}
                        placeholder="Describe your issue in detail... (English, Hindi, or Hinglish)"
                        className={`w-full bg-slate-50 border p-4 rounded-2xl resize-none outline-none focus:ring-2 focus:ring-blue-400 transition-all ${step === 'landing' ? 'h-32 text-lg border-transparent shadow-inner' : 'h-32 text-base border-blue-100'
                            }`}
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        onFocus={() => handleStepExpand('details')}
                    />

                    {/* Voice Input Button */}
                    <button
                        onClick={toggleListening}
                        className={`absolute bottom-3 right-3 p-2 rounded-full transition-all flex items-center justify-center ${isListening
                            ? 'bg-red-500 text-white animate-pulse shadow-red-200 shadow-lg'
                            : 'bg-white text-gray-500 border border-gray-200 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 shadow-sm'
                            }`}
                        title="Speak to draft"
                    >
                        {isListening ? <MicOff size={20} /> : <Mic size={20} />}
                    </button>
                </div>

                <AnimatePresence>
                    {step === 'details' && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="space-y-3 pt-2"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div className="relative">
                                    <LayoutGrid className="absolute left-3 top-3 text-blue-400 pointer-events-none z-10" size={20} />
                                    <select
                                        style={{ paddingLeft: '3.5rem' }} // Force padding to prevent overlap
                                        className="w-full bg-white/60 border border-blue-200 rounded-lg py-2.5 pr-2 text-sm text-blue-800 outline-none focus:ring-1 focus:ring-blue-400 appearance-none relative z-0"
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    >
                                        <option value="">Select Category</option>
                                        <option value="Consumer">Consumer Grievance (Product/Service)</option>
                                        <option value="Civic">Civic Issue (Roads, Water, Garbage)</option>
                                        <option value="Cyber">Cyber Crime / Online Fraud</option>
                                        <option value="Utility">Electricity / Water / Internet Bill</option>
                                        <option value="Financial">Banking / Insurance / Loan</option>
                                        <option value="RealEstate">Real Estate / Builder Issue</option>
                                        <option value="Employment">Employment / Salary Dispute</option>
                                        <option value="Healthcare">Hospital / Medical Negligence</option>
                                        <option value="Government">Government Office Delay / Bribe</option>
                                        <option value="Other">Other / Not Listed</option>
                                    </select>
                                </div>

                                <div className="relative flex items-center">
                                    <MapPin className="absolute left-3 top-3 text-blue-400 pointer-events-none z-10" size={20} />
                                    <input
                                        style={{ paddingLeft: '3.5rem' }} // Force padding to prevent overlap
                                        type="text"
                                        placeholder="City / State"
                                        className="w-full bg-white/60 border border-blue-200 rounded-lg py-2.5 pr-24 text-sm text-blue-800 outline-none focus:ring-1 focus:ring-blue-400"
                                        value={formData.city ? `${formData.city}${formData.state ? `, ${formData.state}` : ''}` : ''}
                                        onChange={(e) => {
                                            const parts = e.target.value.split(',');
                                            setFormData({ ...formData, city: parts[0], state: parts[1]?.trim() || '' })
                                        }}
                                    />
                                    <button
                                        onClick={() => {
                                            if ("geolocation" in navigator) {
                                                navigator.geolocation.getCurrentPosition(async (position) => {
                                                    try {
                                                        const { latitude, longitude } = position.coords;
                                                        const res = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
                                                        const data = await res.json();
                                                        if (data.city || data.principalSubdivision) {
                                                            setFormData(prev => ({
                                                                ...prev,
                                                                city: data.city || data.locality || '',
                                                                state: data.principalSubdivision || ''
                                                            }));
                                                        }
                                                    } catch (e) {
                                                        console.error("Geo error", e);
                                                    }
                                                });
                                            }
                                        }}
                                        className="absolute right-2 top-1.5 px-3 py-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-bold rounded-md shadow-sm hover:from-blue-600 hover:to-blue-700 hover:shadow-md transition-all active:scale-95 z-20"
                                    >
                                        Auto Detect
                                    </button>
                                </div>
                            </div>

                            <div className="flex justify-end pt-2">
                                <button
                                    onClick={handleSubmit}
                                    disabled={!formData.description || isLoading}
                                    className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-bold text-white shadow-lg transition-all ${!formData.description || isLoading
                                        ? 'bg-gray-300 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:scale-105 active:scale-95'
                                        }`}
                                >
                                    {isLoading ? (
                                        <>Analyzing <Loader2 className="animate-spin" size={18} /></>
                                    ) : (
                                        <>Analyze & Resolve <ArrowUp size={18} /></>
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}
