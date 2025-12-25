"use client";

import { useState, useEffect } from 'react';

export default function PosterNotification() {
    const [poster, setPoster] = useState(null);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const checkPoster = async () => {
            try {
                // Get current user from localStorage
                const userStr = localStorage.getItem('user');
                const user = userStr ? JSON.parse(userStr) : null;
                const userId = user ? user._id : 'guest';

                // Check if they already dismissed it this session for THIS user
                const dismissedFor = sessionStorage.getItem('poster_dismissed_for');
                if (dismissedFor === userId) {
                    return;
                }

                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posters/active`);
                const data = await res.json();
                
                if (data && data.imageUrl) {
                    setPoster(data);
                    // Show small popup after short delay
                    setTimeout(() => setIsOpen(true), 1500);
                }
            } catch (err) {
                // Silently fail in production or log to service
            }
        };

        checkPoster();
    }, []);

    const closePoster = () => {
        setIsOpen(false);
        const userStr = localStorage.getItem('user');
        const user = userStr ? JSON.parse(userStr) : null;
        const userId = user ? user._id : 'guest';
        sessionStorage.setItem('poster_dismissed_for', userId);
    };

    if (!poster || !isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="relative w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-slate-200 animate-in zoom-in-95 duration-300">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-2 border-b border-slate-100 bg-slate-50/50">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Special Announcement</span>
                    <button 
                        onClick={closePoster}
                        className="rounded-full p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition-colors"
                    >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Poster Content */}
                <div className="p-1">
                    <img 
                        src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${poster.imageUrl}`} 
                        alt="Special Announcement" 
                        className="w-full h-auto rounded-xl object-cover shadow-inner"
                    />
                </div>

                {/* Footer / Close Button */}
                <div className="p-3 text-center">
                    <button 
                        onClick={closePoster}
                        className="w-full rounded-xl bg-slate-900 py-2.5 text-xs font-bold text-white transition hover:bg-slate-800 active:scale-[0.98]"
                    >
                        Got it, Thanks!
                    </button>
                </div>
            </div>
        </div>
    );
}
