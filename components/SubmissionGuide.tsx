
import { MapPin, Clock, ArrowUpCircle } from 'lucide-react';

interface SubmissionGuideProps {
    guide: {
        authorityName: string;
        method: string;
        timeline: string;
        escalation: string;
    };
}

export default function SubmissionGuide({ guide }: SubmissionGuideProps) {
    return (
        <div className="mt-6 bg-blue-900 text-white rounded-xl p-6 shadow-lg">
            <h3 className="text-xl font-bold mb-6 border-b border-blue-700 pb-2">Where and How to Submit</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <div className="flex items-start gap-3 mb-4">
                        <MapPin className="text-blue-300 mt-1" />
                        <div>
                            <h4 className="font-semibold text-blue-100 uppercase text-xs tracking-wider">Authority & Method</h4>
                            <p className="text-lg font-medium">{guide.authorityName}</p>
                            <p className="text-blue-200 text-sm mt-1">{guide.method}</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <Clock className="text-blue-300 mt-1" />
                        <div>
                            <h4 className="font-semibold text-blue-100 uppercase text-xs tracking-wider">Expected Timeline</h4>
                            <p className="text-lg font-medium">{guide.timeline}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-blue-800/50 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                        <ArrowUpCircle className="text-orange-300 mt-1" />
                        <div>
                            <h4 className="font-semibold text-orange-300 uppercase text-xs tracking-wider">Escalation Path</h4>
                            <p className="text-sm text-blue-100 leading-relaxed mt-1">
                                {guide.escalation}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
