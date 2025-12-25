import React from 'react';
import { Camera, Home, Settings } from 'lucide-react';

export default function Layout({ children, currentTab, onTabChange }) {
    return (
        <div className="min-h-screen bg-background text-text font-sans selection:bg-primary selection:text-white">
            <main className="pb-20 min-h-screen relative">
                <div className="max-w-md mx-auto min-h-screen bg-surface shadow-2xl overflow-hidden relative border-x border-border">
                    {children}
                </div>
            </main>

            {/* Mobile Bottom Nav */}
            <nav className="fixed bottom-0 left-0 right-0 bg-surface/80 backdrop-blur-lg border-t border-border z-50">
                <div className="max-w-md mx-auto flex justify-around items-center h-16 px-4">
                    <NavButton
                        icon={Home}
                        label="Home"
                        active={currentTab === 'home'}
                        onClick={() => onTabChange('home')}
                    />
                    <div className="relative -top-6">
                        <button
                            onClick={() => onTabChange('capture')}
                            className="bg-primary hover:bg-primary-dark text-white p-4 rounded-full shadow-lg shadow-primary/40 transition-transform active:scale-95 border-4 border-surface"
                        >
                            <Camera size={28} />
                        </button>
                    </div>
                    <NavButton
                        icon={Settings}
                        label="Settings"
                        active={currentTab === 'settings'}
                        onClick={() => onTabChange('settings')}
                    />
                </div>
            </nav>
        </div>
    );
}

function NavButton({ icon: Icon, label, active, onClick }) {
    return (
        <button
            onClick={onClick}
            className={`flex flex-col items-center justify-center w-16 h-full transition-colors ${active ? 'text-primary' : 'text-text-muted hover:text-text'
                }`}
        >
            <Icon size={24} className={active ? 'fill-current' : ''} />
            <span className="text-[10px] mt-1 font-medium">{label}</span>
        </button>
    );
}
