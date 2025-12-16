
import { motion } from 'framer-motion';
import { FileCheck, CheckSquare } from 'lucide-react';

interface EvidenceChecklistProps {
    items: string[];
}

export default function EvidenceChecklist({ items }: EvidenceChecklistProps) {
    if (!items || items.length === 0) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel rounded-xl p-6 mb-6 border-l-4 border-indigo-500"
        >
            <div className="flex items-center gap-2 mb-4">
                <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600">
                    <FileCheck size={20} />
                </div>
                <h3 className="text-lg font-bold text-gray-800">Required Documents Checklist</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {items.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 bg-white/50 rounded-lg border border-white/60">
                        <CheckSquare size={18} className="text-indigo-400 mt-0.5 shrink-0" />
                        <span className="text-sm font-medium text-gray-700">{item}</span>
                    </div>
                ))}
            </div>
        </motion.div>
    );
}
