import { useEffect, useMemo } from 'react';
import { Dumbbell, Plus, Minus, Activity } from 'lucide-react';
import {
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    ResponsiveContainer,
} from 'recharts';

import { useStore } from '../store/useStore';

export function Lifestyle() {
    const { createWorkout, workoutSummary, fetchWorkoutSummary, workoutTrend, fetchWorkoutTrend } = useStore();

    useEffect(() => {
        fetchWorkoutSummary();
        fetchWorkoutTrend();
    }, [fetchWorkoutSummary, fetchWorkoutTrend]);

    const handleWorkoutChange = async (muscleGroup: string, delta: number) => {
        const currentCount = workoutSummary[muscleGroup] || 0;
        if (currentCount + delta < 0) return;
        await createWorkout({ muscleGroup, count: delta });
    };

    const muscles = ['Chest', 'Biceps', 'Triceps', 'Legs', 'Back', 'Shoulders'];

    const chartData = useMemo(() => {
        return muscles.map(muscle => ({
            subject: muscle,
            value: workoutSummary[muscle] || 0,
        }));
    }, [workoutSummary]);

    return (
        <div className="flex flex-col gap-6 md:gap-10 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <h1 className="text-2xl md:text-[32px] font-black text-white tracking-tighter uppercase italic">Biological Optimization</h1>
                    <p className="text-[10px] text-[var(--color-muted-foreground)] font-bold uppercase tracking-[0.3em] mt-1">Track Physical Performance & Recovery</p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-10 md:gap-16">
                {/* Fitness Section */}
                <div className="flex flex-col gap-8 md:gap-12">
                    <div className="flex flex-col gap-5">
                        <div className="flex items-center gap-3 px-2">
                            <div className="w-10 h-10 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                                <Dumbbell size={20} />
                            </div>
                            <h2 className="text-lg md:text-xl font-black text-white uppercase italic tracking-tighter">Physical Intensity Matrix</h2>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                            <div className="lg:col-span-3 bg-[var(--color-card)] rounded-[2rem] border border-white/5 overflow-hidden h-fit">
                                {muscles.map((muscle, i, arr) => (
                                    <div
                                        key={muscle}
                                        className={`flex items-center gap-4 px-5 py-3.5 hover:bg-white/[0.03] transition-colors ${i !== arr.length - 1 ? 'border-b border-white/5' : ''}`}
                                    >
                                        <div className="w-24 shrink-0">
                                            <span className="text-[10px] font-black text-[var(--color-muted-foreground)] uppercase tracking-widest">{muscle}</span>
                                        </div>

                                        <div className="flex items-center gap-2 ml-auto">
                                            <button
                                                onClick={() => handleWorkoutChange(muscle, -1)}
                                                className="w-8 h-8 rounded-xl bg-white/5 text-white flex items-center justify-center hover:bg-white/10 active:scale-90 transition-all"
                                            >
                                                <Minus size={13} />
                                            </button>
                                            <input
                                                type="number"
                                                min={0}
                                                value={workoutSummary[muscle] || 0}
                                                onChange={async (e) => {
                                                    const next = parseInt(e.target.value) || 0;
                                                    const current = workoutSummary[muscle] || 0;
                                                    const delta = next - current;
                                                    if (delta !== 0) await createWorkout({ muscleGroup: muscle, count: delta });
                                                }}
                                                className="w-14 text-center bg-white/5 border border-white/10 rounded-xl py-1.5 text-sm font-black text-white focus:outline-none focus:border-blue-500/50 transition-colors appearance-none"
                                            />
                                            <button
                                                onClick={() => handleWorkoutChange(muscle, 1)}
                                                className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center hover:bg-blue-500 hover:text-white active:scale-90 transition-all"
                                            >
                                                <Plus size={13} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Intensity Radar Chart */}
                            <div className="lg:col-span-2 bg-[var(--color-card)] rounded-[2rem] border border-white/5 p-6 flex flex-col items-center justify-center min-h-[300px]">
                                <h3 className="text-[8px] font-black uppercase text-[var(--color-muted-foreground)] tracking-[0.3em] mb-4">Functional Distribution</h3>
                                <div className="w-full h-full min-h-[250px] relative">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                                            <PolarGrid stroke="rgba(255,255,255,0.05)" />
                                            <PolarAngleAxis
                                                dataKey="subject"
                                                tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 8, fontWeight: 900 }}
                                            />
                                            <Radar
                                                name="Intensity"
                                                dataKey="value"
                                                stroke="var(--color-primary)"
                                                fill="var(--color-primary)"
                                                fillOpacity={0.2}
                                            />
                                        </RadarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* History Section */}
                    <div className="flex flex-col gap-5">
                        <div className="flex items-center gap-3 px-2">
                            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                                <Activity size={20} />
                            </div>
                            <h2 className="text-lg md:text-xl font-black text-white uppercase italic tracking-tighter">Biological Audit Logs</h2>
                        </div>

                        <div className="bg-[var(--color-card)] rounded-[2rem] border border-white/5 overflow-hidden">
                            {Object.keys(workoutTrend).length > 0 ? Object.keys(workoutTrend).sort((a, b) => b.localeCompare(a)).map((date, i, arr) => (
                                <div
                                    key={date}
                                    className={`flex flex-col sm:flex-row sm:items-center gap-3 px-5 py-4 hover:bg-white/[0.03] transition-colors ${i !== arr.length - 1 ? 'border-b border-white/5' : ''}`}
                                >
                                    {/* Date */}
                                    <div className="flex items-center gap-3 sm:w-44 shrink-0">
                                        <span className="text-[10px] font-black text-white uppercase tracking-widest whitespace-nowrap">
                                            {new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                                        </span>
                                    </div>

                                    {/* Muscle chips */}
                                    <div className="flex flex-wrap gap-2 flex-1">
                                        {Object.entries(workoutTrend[date]).map(([muscle, count]: any) => (
                                            <span
                                                key={muscle}
                                                className="flex items-center gap-1.5 bg-white/5 border border-white/5 rounded-full px-3 py-1 text-[9px] font-black uppercase tracking-widest text-[var(--color-muted-foreground)] hover:border-emerald-500/20 hover:text-white transition-colors"
                                            >
                                                <span className="text-emerald-500 font-black">{count}</span>
                                                {muscle}
                                            </span>
                                        ))}
                                    </div>

                                    {/* Synced badge */}
                                    <span className="text-[8px] bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-full font-black tracking-widest uppercase border border-emerald-500/10 shrink-0 self-start sm:self-auto">
                                        Synced
                                    </span>
                                </div>
                            )) : (
                                <div className="py-14 text-center">
                                    <p className="text-[var(--color-muted-foreground)] font-black uppercase tracking-[0.2em] text-xs opacity-30 italic">No historical biological data found.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
