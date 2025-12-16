
import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Loader2 } from 'lucide-react';

interface GrievanceFormProps {
    onSubmit: (data: any) => void;
    isLoading: boolean;
}

const CATEGORIES = [
    "Consumer Issue",
    "Telecom / Internet",
    "Banking / Finance",
    "Electricity / Water",
    "College / University",
    "Municipal / Local Authority",
    "Other"
];

export default function GrievanceForm({ onSubmit, isLoading }: GrievanceFormProps) {
    const [formData, setFormData] = useState({
        category: CATEGORIES[0],
        city: '',
        state: '',
        department: '',
        description: ''
    });

    const [isLocating, setIsLocating] = useState(false);
    const [locError, setLocError] = useState('');

    const handleLocationClick = () => {
        setIsLocating(true);
        setLocError('');

        if (!navigator.geolocation) {
            setLocError("Geolocation is not supported by your browser.");
            setIsLocating(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const { latitude, longitude } = position.coords;
                    // Using BigDataCloud's free client-side reverse geocoding
                    const res = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
                    const data = await res.json();

                    setFormData(prev => ({
                        ...prev,
                        city: data.city || data.locality || '',
                        state: data.principalSubdivision || data.region || ''
                    }));
                } catch (err) {
                    setLocError("Failed to fetch address details. Please enter manually.");
                } finally {
                    setIsLocating(false);
                }
            },
            (error) => {
                setIsLocating(false);
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        setLocError("Location permission denied. Please enter manually.");
                        break;
                    case error.POSITION_UNAVAILABLE:
                        setLocError("Location information unavailable.");
                        break;
                    case error.TIMEOUT:
                        setLocError("Location detection timed out.");
                        break;
                    default:
                        setLocError("An unknown error occurred.");
                }
            }
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel rounded-2xl p-8 max-w-2xl mx-auto"
        >
            <h2 className="text-2xl font-bold mb-6 text-blue-900 border-b border-blue-100 pb-2 flex items-center gap-2">
                <span className="w-2 h-8 bg-blue-600 rounded-full"></span>
                Describe Your Grievance
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label>Category</label>
                        <div className="relative">
                            <select
                                className="glass-input appearance-none"
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            >
                                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-gray-500">
                                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                            </div>
                        </div>
                    </div>
                    <div>
                        <label>Department / Company (Optional)</label>
                        <input
                            type="text"
                            placeholder="e.g. Jio, SBI, Municipality"
                            className="glass-input"
                            value={formData.department}
                            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                        />
                    </div>
                </div>

                <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100/50">
                    <div className="flex justify-between items-center mb-3">
                        <label className="mb-0">Location</label>
                        <button
                            type="button"
                            onClick={handleLocationClick}
                            disabled={isLocating}
                            className="text-sm flex items-center gap-1.5 text-blue-600 hover:text-blue-800 font-medium transition-colors disabled:opacity-50"
                        >
                            {isLocating ? <Loader2 size={14} className="animate-spin" /> : <MapPin size={14} />}
                            {isLocating ? "Detecting..." : "Auto-detect my location"}
                        </button>
                    </div>

                    {locError && <p className="text-xs text-red-500 mb-2">{locError}</p>}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                            required
                            type="text"
                            placeholder="City (e.g. Mumbai)"
                            className="glass-input"
                            value={formData.city}
                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        />
                        <input
                            required
                            type="text"
                            placeholder="State (e.g. Maharashtra)"
                            className="glass-input"
                            value={formData.state}
                            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                        />
                    </div>
                </div>

                <div>
                    <label>Problem Description</label>
                    <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                        <span className="inline-block w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                        Supports English & Hinglish (e.g. "Payment fail ho gaya")
                    </p>
                    <textarea
                        required
                        rows={5}
                        placeholder="Describe what happened, what resolution you want..."
                        className="glass-input resize-none"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="btn-primary w-full flex justify-center items-center gap-2 group"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="animate-spin" />
                            Analyzing Grievance...
                        </>
                    ) : (
                        <>
                            Analyze & Draft Complaint
                            <span className="group-hover:translate-x-1 transition-transform">→</span>
                        </>
                    )}
                </button>
            </form>
        </motion.div>
    );
}
