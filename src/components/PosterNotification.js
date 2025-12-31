"use client";

import { useState, useEffect } from 'react';

export default function PosterNotification() {
    const [poster, setPoster] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const [imageLoading, setImageLoading] = useState(true);

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
                    setIsOpen(true);
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
                <div className="p-1 relative min-h-[200px] flex items-center justify-center bg-slate-50">
                    {imageLoading && (
                        <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-50 animate-pulse">
                            <div className="flex flex-col items-center gap-2">
                                <svg className="h-8 w-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span className="text-[10px] font-medium text-slate-400">Loading Announcement...</span>
                            </div>
                        </div>
                    )}
                    <img 
                        src={poster.imageUrl.startsWith('http') ? poster.imageUrl : `${process.env.NEXT_PUBLIC_API_URL}/uploads/${poster.imageUrl}`}
                        alt="Special Announcement" 
                        onLoad={() => setImageLoading(false)}
                        className={`w-full h-auto rounded-xl object-cover shadow-inner transition-opacity duration-500 ${imageLoading ? 'opacity-0' : 'opacity-100'}`}
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
