
import { motion } from 'framer-motion';

export default function AnalysisSkeleton() {
    return (
        <div className="max-w-4xl mx-auto pb-20 animate-pulse">
            {/* Suggested Actions Skeleton */}
            <div className="h-8 w-48 bg-gray-200 rounded mb-6" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white/50 border border-white/60 rounded-lg p-5 h-64">
                        <div className="h-6 w-3/4 bg-gray-200 rounded mb-4" />
                        <div className="h-4 w-full bg-gray-200 rounded mb-2" />
                        <div className="h-4 w-5/6 bg-gray-200 rounded mb-6" />
                        <div className="grid grid-cols-2 gap-4">
                            <div className="h-20 bg-gray-100 rounded" />
                            <div className="h-20 bg-gray-100 rounded" />
                        </div>
                    </div>
                ))}
            </div>

            {/* Recommended Skeleton */}
            <div className="bg-white/50 border-l-4 border-gray-300 p-6 rounded-r-lg mb-8">
                <div className="flex gap-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full" />
                    <div className="flex-1 space-y-3">
                        <div className="h-6 w-1/3 bg-gray-200 rounded" />
                        <div className="h-4 w-full bg-gray-200 rounded" />
                        <div className="h-4 w-5/6 bg-gray-200 rounded" />
                    </div>
                </div>
            </div>

            {/* Draft Skeleton */}
            <div className="h-96 bg-gray-100 rounded-lg" />
        </div>
    );
}
