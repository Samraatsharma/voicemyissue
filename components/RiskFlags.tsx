
import { AlertTriangle } from 'lucide-react';

interface RiskFlagsProps {
    risks: string[];
}

export default function RiskFlags({ risks }: RiskFlagsProps) {
    if (!risks || risks.length === 0) return null;

    return (
        <div className="mt-8 bg-orange-50 border border-orange-200 rounded-xl p-6">
            <h3 className="text-lg font-bold text-orange-800 flex items-center gap-2 mb-3">
                <AlertTriangle className="text-orange-600" />
                Important Points to Review
            </h3>
            <ul className="space-y-2">
                {risks.map((risk, index) => (
                    <li key={index} className="flex items-start gap-2 text-orange-900/80 text-sm font-medium">
                        <span className="mt-1.5 w-1.5 h-1.5 bg-orange-400 rounded-full flex-shrink-0" />
                        {risk}
                    </li>
                ))}
            </ul>
        </div>
    );
}
