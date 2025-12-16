
import { motion } from 'framer-motion';
import { CheckCircle, XCircle } from 'lucide-react';

interface ActionCardProps {
    action: {
        title: string;
        description: string;
        pros: string[];
        cons: string[];
    };
    index: number;
}

export default function ActionCard({ action, index }: ActionCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
        >
            <h3 className="font-bold text-lg text-blue-900 mb-2">{action.title}</h3>
            <p className="text-gray-600 text-sm mb-4">{action.description}</p>

            <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                    <h4 className="font-semibold text-green-700 flex items-center gap-1 mb-1">
                        <CheckCircle size={14} /> Pros
                    </h4>
                    <ul className="list-disc list-inside text-gray-500 space-y-1">
                        {action.pros.map((pro, i) => <li key={i}>{pro}</li>)}
                    </ul>
                </div>
                <div>
                    <h4 className="font-semibold text-red-600 flex items-center gap-1 mb-1">
                        <XCircle size={14} /> Cons
                    </h4>
                    <ul className="list-disc list-inside text-gray-500 space-y-1">
                        {action.cons.map((con, i) => <li key={i}>{con}</li>)}
                    </ul>
                </div>
            </div>
        </motion.div>
    );
}
