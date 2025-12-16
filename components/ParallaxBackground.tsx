
'use client';

import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function ParallaxBackground() {
    const [isMounted, setIsMounted] = useState(false);

    // Mouse tracking
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const springConfig = { damping: 40, stiffness: 80, mass: 1 };
    const smoothX = useSpring(mouseX, springConfig);
    const smoothY = useSpring(mouseY, springConfig);

    // --- PARALLAX LAYERS ---
    const x1 = useTransform(smoothX, [0, 1], [20, -20]);
    const y1 = useTransform(smoothY, [0, 1], [10, -10]);

    const x2 = useTransform(smoothX, [0, 1], [40, -40]);
    const y2 = useTransform(smoothY, [0, 1], [20, -20]);

    const x3 = useTransform(smoothX, [0, 1], [70, -70]);
    const y3 = useTransform(smoothY, [0, 1], [30, -30]);

    useEffect(() => {
        setIsMounted(true);
        const handleMouseMove = (e: MouseEvent) => {
            mouseX.set(e.clientX / window.innerWidth);
            mouseY.set(e.clientY / window.innerHeight);
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [mouseX, mouseY]);

    if (!isMounted) return null;

    // Data Flow Paths - Smooth curves representing processing
    return (
        <div className="fixed inset-0 z-[-1] overflow-hidden bg-slate-50">

            {/* LAYER 1: Deep Infrastructure (Slow, Thick Flows) */}
            <motion.div style={{ x: x1, y: y1 }} className="absolute inset-0 opacity-40 will-change-transform">
                <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1440 800">
                    <motion.path
                        d="M-100,600 C300,500 600,700 1540,400"
                        fill="none"
                        stroke="#93c5fd" // blue-300
                        strokeWidth="2"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 0.5 }}
                        transition={{ duration: 3, ease: "easeInOut" }}
                    />
                    <motion.path
                        d="M-100,200 C400,300 800,100 1540,300"
                        fill="none"
                        stroke="#cbd5e1" // slate-300
                        strokeWidth="1.5"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 4, ease: "easeInOut" }}
                    />
                </svg>
            </motion.div>

            {/* LAYER 2: Active Data Streams (Medium Speed, Dashed Lines) */}
            <motion.div style={{ x: x2, y: y2 }} className="absolute inset-[-10%] will-change-transform">
                <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1440 800">
                    {/* Flowing Data Path 1 */}
                    <path d="M-200,500 C400,400 900,600 1600,300" stroke="url(#grad1)" strokeWidth="2" fill="none" />
                    <defs>
                        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="transparent" />
                            <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.4" />
                            <stop offset="100%" stopColor="transparent" />
                        </linearGradient>
                    </defs>

                    {/* Animated Dash interacting with the path */}
                    <motion.path
                        d="M-200,500 C400,400 900,600 1600,300"
                        fill="none"
                        stroke="#2563eb" // blue-600
                        strokeWidth="2"
                        strokeDasharray="10 200"
                        animate={{ strokeDashoffset: [-1000, 0] }}
                        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    />

                    {/* Flowing Data Path 2 */}
                    <motion.path
                        d="M-200,300 C500,600 1000,200 1600,400"
                        fill="none"
                        stroke="#6366f1" // indigo-500
                        strokeWidth="1.5"
                        strokeDasharray="15 300"
                        animate={{ strokeDashoffset: [0, -1000] }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    />
                </svg>
            </motion.div>

            {/* LAYER 3: Signal Pulses (Fast, Subtle) */}
            <motion.div style={{ x: x3, y: y3 }} className="absolute inset-0 will-change-transform">
                <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1440 800">
                    <motion.circle cx="400" cy="400" r="3" fill="#3b82f6" opacity="0.6">
                        <animate attributeName="cy" values="390;410;390" dur="4s" repeatCount="indefinite" />
                    </motion.circle>

                    {/* Subtle vertical flow lines */}
                    <motion.line x1="800" y1="0" x2="800" y2="800" stroke="#bae6fd" strokeWidth="1" strokeDasharray="4 8" opacity="0.3">
                        <animate attributeName="stroke-dashoffset" from="0" to="100" dur="10s" repeatCount="indefinite" />
                    </motion.line>
                </svg>
            </motion.div>

            <div className="absolute inset-0 bg-white/20 pointer-events-none" />
        </div>
    );
}
