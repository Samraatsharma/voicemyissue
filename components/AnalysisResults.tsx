
import { motion } from 'framer-motion';
import ActionCard from './ActionCard';
import Recommendation from './Recommendation';
import ComplaintDraft from './ComplaintDraft';
import RiskFlags from './RiskFlags';
import SubmissionGuide from './SubmissionGuide';
import EvidenceChecklist from './EvidenceChecklist';

interface AnalysisResultsProps {
    data: any;
}

export default function AnalysisResults({ data }: AnalysisResultsProps) {
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="max-w-4xl mx-auto pb-20"
        >
            {/* 1. Suggested Actions */}
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Suggested Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                {data.actions.map((action: any, i: number) => (
                    <ActionCard key={i} action={action} index={i} />
                ))}
            </div>

            {/* 2. Recommended for You */}
            <Recommendation
                recommendation={data.recommendation}
                actions={data.actions}
                urgency={data.analysis?.urgency}
            />

            {/* 2.5 Evidence Checklist (New) */}
            <EvidenceChecklist items={data.evidenceChecklist} />

            {/* 3. Generated Complaint Draft */}
            <ComplaintDraft draft={data.draft} />

            {/* 4. Risk Flags */}
            <RiskFlags risks={data.risks} />

            {/* 5. Where and How to Submit */}
            <SubmissionGuide guide={data.submissionGuide} />

        </motion.div>
    );
}
