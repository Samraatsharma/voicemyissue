
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check } from 'lucide-react';

interface ComplaintDraftProps {
    draft: {
        subject: string;
        body: string;
    };
}

export default function ComplaintDraft({ draft }: ComplaintDraftProps) {
    const [copied, setCopied] = useState(false);
    const [fullText, setFullText] = useState(`Subject: ${draft.subject}\n\n${draft.body}`);

    const handleCopy = () => {
        navigator.clipboard.writeText(fullText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card mt-6"
        >
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">Generated Complaint Draft</h3>
                <button
                    onClick={handleCopy}
                    className="flex items-center gap-2 text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg transition-colors text-gray-700"
                >
                    {copied ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
                    {copied ? "Copied!" : "Copy Text"}
                </button>
            </div>

            <textarea
                className="w-full h-96 font-mono text-sm p-4 bg-gray-50 border rounded-lg focus:bg-white transition-colors"
                value={fullText}
                onChange={(e) => setFullText(e.target.value)}
            />
        </motion.div>
    );
}
