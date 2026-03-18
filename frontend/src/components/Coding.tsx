import { useEffect, useState } from 'react';
import { Terminal, Bug, Cpu, Plus, X, Flame } from 'lucide-react';
import { useStore } from '../store/useStore';
import { showNotification } from '../utils/notifications';

export function Coding() {
    const { codingHistory, fetchCodingHistory, createCodingLog, searchQuery } = useStore();
    const [showModal, setShowModal] = useState(false);
    const [newLog, setNewLog] = useState({ minutes: '', language: 'TypeScript' });

    useEffect(() => {
        fetchCodingHistory();
    }, [fetchCodingHistory]);

    // Generate dates for the last 154 days (22 weeks)
    const generateHeatmapData = () => {
        const data = [];
        const today = new Date();
        for (let i = 153; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];
            data.push({
                date: dateStr,
                count: codingHistory[dateStr] || 0
            });
        }
        return data;
    };

    const heatmapData = generateHeatmapData();
    const q = searchQuery.toLowerCase();
    const displayedHeatmap = q
        ? heatmapData.filter(d => d.date.includes(q) && d.count > 0)
        : heatmapData;

    const getColor = (count: number) => {
        if (count === 0) return 'bg-white/5';
        if (count < 30) return 'bg-orange-900/40';
        if (count < 60) return 'bg-orange-700/60';
        if (count < 120) return 'bg-orange-500/80';
        return 'bg-[var(--color-primary)]';
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const mins = parseInt(newLog.minutes);
        await createCodingLog({
            minutes: mins,
            language: newLog.language
        });

        showNotification("Session Recorded! 💻", {
            body: `You just logged ${mins} minutes of ${newLog.language}. Keep it up!`,
            tag: "coding-log"
        });

        setShowModal(false);
        setNewLog({ minutes: '', language: 'TypeScript' });
    };

    const totalMinutes = Object.values(codingHistory).reduce((a, b) => a + b, 0);

    // Calculate current streak
    const calculateStreak = () => {
        let currentStreak = 0;
        const today = new Date();
        for (let i = 0; i < 365; i++) {
            const d = new Date(today);
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];
            if (codingHistory[dateStr] > 0) {
                currentStreak++;
            } else if (i > 0) {
                break;
            }
        }
        return currentStreak;
    };

    const currentStreak = calculateStreak();

    return (
        <div className="flex flex-col gap-8 pb-10">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-[32px] font-semibold text-[var(--color-card-foreground)] tracking-tight">Coding</h1>
                    <p className="text-[var(--color-muted-foreground)] mt-1">Consistency is key to mastery.</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-[var(--color-primary)] text-black px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:scale-105 transition-all shadow-lg active:scale-95"
                >
                    <Plus size={20} /> Log Session
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[var(--color-card)] rounded-[2rem] p-8 border border-white/5 flex items-center gap-6 shadow-sm">
                    <div className="w-14 h-14 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                        <Terminal size={28} />
                    </div>
                    <div>
                        <p className="text-[var(--color-muted-foreground)] text-[10px] font-bold uppercase tracking-widest mb-1">Total Time</p>
                        <h2 className="text-2xl font-black text-[var(--color-card-foreground)]">{Math.floor(totalMinutes / 60)}h {totalMinutes % 60}m</h2>
                    </div>
                </div>
                <div className="bg-[var(--color-card)] rounded-[2rem] p-8 border border-white/5 flex items-center gap-6 shadow-sm">
                    <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                        <Bug size={28} />
                    </div>
                    <div>
                        <p className="text-[var(--color-muted-foreground)] text-[10px] font-bold uppercase tracking-widest mb-1">Project Phase</p>
                        <h2 className="text-2xl font-black text-[var(--color-card-foreground)] uppercase tracking-tighter">Production</h2>
                    </div>
                </div>
                <div className="bg-[var(--color-card)] rounded-[2rem] p-8 border border-white/5 flex items-center gap-6 shadow-sm">
                    <div className="w-14 h-14 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-500">
                        <Flame size={28} />
                    </div>
                    <div>
                        <p className="text-[var(--color-muted-foreground)] text-[10px] font-bold uppercase tracking-widest mb-1">Current Streak</p>
                        <h2 className="text-2xl font-black text-[var(--color-card-foreground)]">{currentStreak} Days</h2>
                    </div>
                </div>
            </div>

            {/* Heatmap Section */}
            <div className="bg-[var(--color-card)] rounded-[2.5rem] border border-white/5 p-8 shadow-sm">
                <div className="flex justify-between items-center mb-8">
                    <h3 className="text-xl font-bold text-[var(--color-card-foreground)] flex items-center gap-2"><Cpu size={20} className="text-[var(--color-primary)]" /> Activity Map</h3>
                    <div className="flex items-center gap-2 text-[10px] text-[var(--color-muted-foreground)] font-bold uppercase tracking-wider">
                        <span>Less</span>
                        <div className="w-3 h-3 rounded-[2px] bg-white/5" />
                        <div className="w-3 h-3 rounded-[2px] bg-orange-900/40" />
                        <div className="w-3 h-3 rounded-[2px] bg-orange-700/60" />
                        <div className="w-3 h-3 rounded-[2px] bg-orange-500/80" />
                        <div className="w-3 h-3 rounded-[2px] bg-[var(--color-primary)]" />
                        <span>More</span>
                    </div>
                </div>

                <div className="flex flex-wrap gap-[4px] justify-center md:justify-start">
                    {displayedHeatmap.length > 0 ? displayedHeatmap.map((d, i) => (
                        <div
                            key={i}
                            title={`${d.date}: ${d.count}m`}
                            className={`w-[14px] h-[14px] rounded-[3px] ${getColor(d.count)} transition-all hover:scale-150 hover:z-10 cursor-pointer`}
                        />
                    )) : (
                        <div className="py-12 w-full text-center text-[var(--color-muted-foreground)] font-black uppercase tracking-widest text-[10px] opacity-30">No sessions found for "{searchQuery}"</div>
                    )}
                </div>
                <div className="mt-8 pt-6 border-t border-white/5 flex justify-between text-[10px] font-bold text-[var(--color-muted-foreground)] uppercase tracking-widest">
                    <span>Oct 2025</span>
                    <span>Nov 2025</span>
                    <span>Dec 2025</span>
                    <span>Jan 2026</span>
                    <span>Feb 2026</span>
                    <span>Mar 2026</span>
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-[var(--color-card)] border border-white/10 rounded-[2.5rem] w-full max-w-md overflow-hidden shadow-2xl">
                        <div className="p-8 border-b border-white/5 flex justify-between items-center">
                            <h3 className="text-xl font-black text-[var(--color-card-foreground)]">Log Session</h3>
                            <button onClick={() => setShowModal(false)} className="w-10 h-10 rounded-full flex items-center justify-center text-[var(--color-muted-foreground)] hover:bg-white/5 transition-all"><X size={24} /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            <div>
                                <label className="block text-[9px] font-black uppercase tracking-[0.2em] text-[var(--color-muted-foreground)] mb-3">Duration (Minutes)</label>
                                <input required type="number" className="w-full bg-[var(--color-background)] border border-white/10 rounded-2xl px-6 py-4.5 text-[var(--color-card-foreground)] focus:outline-none focus:border-[var(--color-primary)] font-bold transition-all" value={newLog.minutes} onChange={e => setNewLog({ ...newLog, minutes: e.target.value })} placeholder="60" />
                            </div>
                            <div>
                                <label className="block text-[9px] font-black uppercase tracking-[0.2em] text-[var(--color-muted-foreground)] mb-3">Main Language</label>
                                <select className="w-full bg-[var(--color-background)] border border-white/10 rounded-2xl px-6 py-4.5 text-[var(--color-card-foreground)] focus:outline-none focus:border-[var(--color-primary)] font-bold appearance-none cursor-pointer transition-all" value={newLog.language} onChange={e => setNewLog({ ...newLog, language: e.target.value })}>
                                    <option>TypeScript</option>
                                    <option>Python</option>
                                    <option>Go</option>
                                    <option>Rust</option>
                                    <option>Swift</option>
                                </select>
                            </div>
                            <button type="submit" className="w-full bg-[var(--color-primary)] text-black font-black py-5 rounded-2xl mt-4 shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-widest text-sm">Record Session</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
