import { useEffect } from 'react';
import { Target, Activity, Terminal, Wallet, TrendingUp, Users, CreditCard } from 'lucide-react';
import { useStore } from '../store/useStore';
import { CalendarWidget } from './CalendarWidget';
import { ProgressCard, TaskCard } from './Widgets';
import { showNotification } from '../utils/notifications';
import {
    ResponsiveContainer,
    XAxis,
    Tooltip,
    BarChart,
    Bar,
    Cell,
    AreaChart,
    Area
} from 'recharts';

export function Dashboard() {
    const {
        tasks, habits, fetchTasks, fetchHabits, fetchExpenses,
        fetchMedia, user, workoutSummary, fetchWorkoutSummary,
        workoutTrend, fetchWorkoutTrend,
        codingHistory, fetchCodingHistory, expenses,
        accentColor, theme, updateTask
    } = useStore();

    useEffect(() => {
        fetchTasks();
        fetchHabits();
        fetchExpenses();
        fetchMedia();
        fetchWorkoutSummary();
        fetchWorkoutTrend();
        fetchCodingHistory();
    }, []);

    const activeTasks = tasks.filter(t => t.status !== 'COMPLETED').slice(0, 3);
    const totalCodingMinutes = Object.values(codingHistory).reduce((a, b) => a + b, 0);

    const handleComplete = async (id: string, title: string) => {
        await updateTask(id, { status: 'COMPLETED' });
        showNotification("Task Completed! 🎉", {
            body: `Dashboard update: You finished "${title}"`,
            tag: "task-done"
        });
    };

    // Prepare Coding Chart Data (Last 7 Days)
    const codingChartData = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        const dateStr = d.toISOString().split('T')[0];
        const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
        return {
            name: dayName,
            minutes: codingHistory[dateStr] || 0
        };
    });

    // Prepare Workout Trend Data (Last 7 Days)
    const workoutTrendData = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        const dateStr = d.toISOString().split('T')[0];
        const displayDate = d.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' });

        const dayTrend = workoutTrend[dateStr] || {};
        const total = Object.values(dayTrend).reduce((a: any, b: any) => a + (Number(b) || 0), 0);

        return {
            date: displayDate,
            total
        };
    });

    // Prepare Finance Data
    const personalExpenses = expenses.filter(e => !e.isFamily);
    const personalInflow = personalExpenses.filter(e => e.type === 'INCOME').reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
    const personalOutflow = personalExpenses.filter(e => e.type === 'EXPENSE').reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);

    const familyExpenses = expenses.filter(e => e.isFamily);
    const familyInflow = familyExpenses.filter(e => e.type === 'INCOME').reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
    const familyOutflow = familyExpenses.filter(e => e.type === 'EXPENSE').reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);

    const MOTIVATIONAL_QUOTES = [
        "According to all known laws of aviation, there is no way a bee should be able to fly. Its wings are too small to get its fat little body off the ground. The bee, of course, flies anyway, because bees don't care what humans think is impossible.",
        "The only way to do great work is to love what you do. If you haven't found it yet, keep looking. Don't settle. As with all matters of the heart, you'll know when you find it.",
        "Success is not final, failure is not fatal: it is the courage to continue that counts. It does not matter how slowly you go as long as you do not stop.",
        "Believe you can and you're halfway there. Your time is limited, so don't waste it living someone else's life. The best way to predict the future is to create it.",
        "Hardships often prepare ordinary people for an extraordinary destiny. The starting point of all achievement is desire. Weak desire brings weak results.",
        "Don't count the days, make the days count. The only person you are destined to become is the person you decide to be. Go confidently in the direction of your dreams.",
        "Opportunity is missed by most people because it is dressed in overalls and looks like work. Whether you think you can or you think you can't, you're right."
    ];

    const todayQuote = MOTIVATIONAL_QUOTES[new Date().getDate() % MOTIVATIONAL_QUOTES.length];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 pb-10">
            {/* Left Column */}
            <div className="lg:col-span-8 flex flex-col gap-6 md:gap-8">
                {/* Hero Banner */}
                <div className="bg-[var(--color-card)] rounded-3xl md:rounded-[3rem] p-6 md:p-10 relative overflow-hidden flex flex-col justify-center min-h-[280px] md:min-h-[320px] border border-white/5 hover:border-white/10 transition-all group shadow-sm">
                    <div className="relative z-10 max-w-[600px]">
                        <div className="inline-flex items-center gap-2 px-3 md:px-4 py-1.5 rounded-full bg-orange-500/10 text-orange-500 text-[9px] md:text-[10px] font-black uppercase tracking-widest mb-4 md:mb-6 border border-orange-500/10">
                            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" /> Focus: {Math.floor(totalCodingMinutes / 60)}h logged
                        </div>
                        <h2 className="text-lg md:text-2xl font-black mb-2 md:mb-4 text-[var(--color-primary)] tracking-tight uppercase">
                            Welcome!, {user?.name || 'Sifat'}
                        </h2>
                        <p className="text-md md:text-xl font-medium mb-4 md:mb-8 leading-relaxed text-[var(--color-card-foreground)] italic tracking-tight opacity-90">
                            "{todayQuote}"
                        </p>
                    </div>

                    <div className="absolute right-[-20px] md:right-[-40px] bottom-[-20px] md:bottom-[-40px] w-48 h-48 md:w-80 md:h-80 opacity-5 md:opacity-10 group-hover:opacity-10 md:group-hover:opacity-20 transition-opacity duration-700 text-[var(--color-primary)]">
                        <Target size={320} className="w-full h-full stroke-1" />
                    </div>
                </div>

                {/* Main Analytics Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-8">
                    {/* Coding Activity Chart */}
                    <div className="bg-[var(--color-card)] rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8 border border-white/5 flex flex-col gap-6 shadow-sm">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-md md:text-lg font-black text-[var(--color-card-foreground)] flex items-center gap-2 uppercase tracking-tighter">
                                    <Terminal size={18} className="text-orange-500 md:w-5 md:h-5" /> Focus Activity
                                </h3>
                                <p className="text-[9px] md:text-[10px] text-[var(--color-muted-foreground)] font-bold uppercase tracking-widest mt-1">Flow Tracker</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xl md:text-2xl font-black text-[var(--color-card-foreground)]">{Math.floor(totalCodingMinutes / 60)}h</p>
                                <p className="text-[8px] md:text-[9px] text-orange-500 font-bold uppercase tracking-tighter">Total</p>
                            </div>
                        </div>

                        <div className="h-32 md:h-40 w-full mb-2">
                            <ResponsiveContainer width="100%" height="100%" minHeight={100}>
                                <BarChart data={codingChartData}>
                                    <Tooltip
                                        cursor={{ fill: 'rgba(128,128,128,0.05)' }}
                                        contentStyle={{
                                            backgroundColor: theme === 'dark' ? '#1a1a1e' : '#fff',
                                            border: '1px solid var(--color-border)',
                                            borderRadius: '16px',
                                            fontSize: '10px',
                                            fontWeight: 'bold',
                                        }}
                                    />
                                    <Bar dataKey="minutes" radius={[4, 4, 4, 4]} barSize={24}>
                                        {codingChartData.map((_, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={index === 6 ? accentColor : 'var(--color-muted)'}
                                                opacity={index === 6 ? 1 : 0.4}
                                            />
                                        ))}
                                    </Bar>
                                    <XAxis
                                        dataKey="name"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: 'var(--color-muted-foreground)', fontSize: 9, fontWeight: 800 }}
                                        dy={10}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Finance Card (Personal) */}
                    <div className="bg-[var(--color-card)] rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8 border border-white/5 flex flex-col gap-5 md:gap-6 shadow-sm">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-md md:text-lg font-black text-[var(--color-card-foreground)] flex items-center gap-2 uppercase tracking-tighter">
                                    <Wallet size={18} className="text-emerald-500 md:w-5 md:h-5" /> Treasury
                                </h3>
                                <p className="text-[9px] md:text-[10px] text-[var(--color-muted-foreground)] font-bold uppercase tracking-widest mt-1">Personal Wealth</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xl md:text-2xl font-black text-[var(--color-card-foreground)] truncate max-w-[100px] md:max-w-none">
                                    {personalInflow - personalOutflow >= 0 ? '' : '-'}${Math.abs(personalInflow - personalOutflow).toLocaleString()}
                                </p>
                                <p className="text-[8px] md:text-[9px] text-emerald-500 font-bold uppercase tracking-tighter">Net Balance</p>
                            </div>
                        </div>

                        <div className="flex-1 flex flex-col justify-center gap-4 md:gap-5">
                            <div className="space-y-2 md:space-y-3">
                                <div className="flex justify-between text-[10px] md:text-[11px] font-black text-[var(--color-muted-foreground)] uppercase tracking-widest">
                                    <span>Personal In</span>
                                    <span className="text-emerald-500">+${personalInflow.toLocaleString()}</span>
                                </div>
                                <div className="h-2 md:h-2.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: personalInflow > 0 ? `${Math.min(100, (personalInflow / (personalInflow + personalOutflow)) * 100)}%` : '0%' }} />
                                </div>
                            </div>
                            <div className="space-y-2 md:space-y-3">
                                <div className="flex justify-between text-[10px] md:text-[11px] font-black text-[var(--color-muted-foreground)] uppercase tracking-widest">
                                    <span>Personal Out</span>
                                    <span className="text-red-500">-${personalOutflow.toLocaleString()}</span>
                                </div>
                                <div className="h-2 md:h-2.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                                    <div className="h-full bg-red-500 rounded-full" style={{ width: personalOutflow > 0 ? `${Math.min(100, (personalOutflow / (personalInflow + personalOutflow)) * 100)}%` : '0%' }} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Family Equity Summary */}
                <div className="bg-[var(--color-card)] rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8 border border-blue-500/10 flex flex-col md:flex-row items-center gap-6 md:gap-10 shadow-2xl shadow-blue-500/5 relative z-0 overflow-hidden group">
                    <div className="absolute top-0 right-0 w-48 md:w-64 h-48 md:h-64 bg-blue-500/5 rounded-full blur-[60px] md:blur-[80px] -mr-24 md:-mr-32 -mt-24 md:-mt-32 -z-10"></div>
                    <div className="flex items-center gap-4 md:gap-6 z-10 w-full md:w-auto">
                        <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl md:rounded-3xl bg-blue-500/10 flex items-center justify-center text-blue-500 border border-blue-500/10 shrink-0">
                            <Users size={24} className="md:w-8 md:h-8" />
                        </div>
                        <div>
                            <h3 className="text-lg md:text-2xl font-black text-white tracking-tighter uppercase italic">Family Equity</h3>
                            <p className="text-[8px] md:text-[10px] text-blue-400 font-black uppercase tracking-[0.2em]">Shared Wealth Protocol</p>
                        </div>
                    </div>

                    <div className="flex-1 grid grid-cols-2 gap-4 md:gap-8 z-10 w-full">
                        <div className="space-y-1 md:space-y-2">
                            <p className="text-[9px] md:text-[10px] text-[var(--color-muted-foreground)] font-black uppercase tracking-widest">Balance</p>
                            <p className={`text-xl md:text-3xl font-black ${familyInflow - familyOutflow >= 0 ? 'text-white' : 'text-red-500'} tracking-tighter`}>
                                {familyInflow - familyOutflow < 0 ? '-' : ''}${Math.abs(familyInflow - familyOutflow).toLocaleString()}
                            </p>
                        </div>
                        <div className="space-y-1 md:space-y-2 text-right">
                            <p className="text-[9px] md:text-[10px] text-[var(--color-muted-foreground)] font-black uppercase tracking-widest">Burn Rate</p>
                            <p className="text-xl md:text-3xl font-black text-blue-500 tracking-tighter">${familyOutflow.toLocaleString()}</p>
                        </div>
                    </div>

                    <div className="hidden sm:flex flex-row md:flex-col gap-2 z-10 w-full md:w-auto">
                        <div className="px-3 py-1.5 md:py-2 bg-blue-500/10 rounded-xl border border-blue-500/10 text-[8px] md:text-[9px] font-black text-blue-400 uppercase tracking-widest flex items-center gap-1.5 md:gap-2">
                            <CreditCard size={10} className="md:w-3 md:h-3" /> Sync Active
                        </div>
                        <div className="px-3 py-1.5 md:py-2 bg-emerald-500/10 rounded-xl border border-emerald-500/10 text-[8px] md:text-[9px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-1.5 md:gap-2">
                            <TrendingUp size={10} className="md:w-3 md:h-3" /> Healthy
                        </div>
                    </div>
                </div>

                {/* Fitness Summary Section */}
                <div className="space-y-4 md:space-y-6">
                    <div className="flex items-center gap-3 px-2">
                        <div className="w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500 shadow-xl shadow-orange-500/5 border border-orange-500/10 shrink-0">
                            <Activity size={20} className="md:w-7 md:h-7" />
                        </div>
                        <div>
                            <h2 className="text-lg md:text-2xl font-black text-[var(--color-card-foreground)] tracking-tighter uppercase leading-none mb-1 md:mb-1">Physical Stats</h2>
                            <p className="text-[8px] md:text-[10px] text-[var(--color-muted-foreground)] font-bold uppercase tracking-widest font-black">Distribution</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 lg:grid-cols-6 gap-3 md:gap-5">
                        {['Chest', 'Biceps', 'Triceps', 'Legs', 'Back', 'Shoulders'].map((muscle) => (
                            <div key={muscle} className="bg-[var(--color-card)] rounded-2xl md:rounded-[2rem] p-4 md:p-6 border border-white/5 text-center hover:border-orange-500/30 transition-all cursor-pointer group shadow-sm active:scale-95 duration-300">
                                <p className="text-[7px] md:text-[10px] text-[var(--color-muted-foreground)] uppercase font-black mb-1 md:mb-3 tracking-tighter opacity-40 group-hover:opacity-100 transition-opacity truncate">{muscle}</p>
                                <p className="text-2xl md:text-4xl font-black text-[var(--color-card-foreground)] group-hover:scale-110 transition-transform duration-300">{workoutSummary[muscle] || 0}</p>
                            </div>
                        ))}
                    </div>

                    {/* Workout Growth Chart */}
                    <div className="bg-[var(--color-card)] rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8 border border-white/5 shadow-sm">
                        <div className="flex justify-between items-center mb-4 md:mb-6">
                            <h3 className="text-[10px] md:text-sm font-black text-[var(--color-card-foreground)] uppercase tracking-widest uppercase">Growth Trend</h3>
                            <span className="text-[9px] font-bold text-orange-500 uppercase tracking-tighter font-black">Total Intensity</span>
                        </div>
                        <div className="h-24 md:h-32 w-full">
                            <ResponsiveContainer width="100%" height="100%" minHeight={80}>
                                <AreaChart data={workoutTrendData}>
                                    <defs>
                                        <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <Area
                                        type="monotone"
                                        dataKey="total"
                                        stroke="var(--color-primary)"
                                        fillOpacity={1}
                                        fill="url(#colorTotal)"
                                        strokeWidth={2}
                                    />
                                    <XAxis
                                        dataKey="date"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: 'var(--color-muted-foreground)', fontSize: 8, fontWeight: 700 }}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Column */}
            <div className="lg:col-span-4 flex flex-col gap-8">
                <div className="lg:sticky lg:top-24 space-y-6 md:space-y-8">
                    <CalendarWidget />

                    <div className="bg-[var(--color-card)] rounded-[2rem] md:rounded-[3rem] p-6 md:p-8 border border-white/5 shadow-2xl shadow-black/20">
                        <div className="flex justify-between items-center mb-6 md:mb-8 px-2">
                            <h2 className="text-lg md:text-xl font-black text-[var(--color-card-foreground)] tracking-tighter uppercase">Execution</h2>
                            <span className="px-2.5 py-1 bg-[var(--color-primary)]/10 rounded-lg md:rounded-xl text-[8px] md:text-[10px] font-black text-[var(--color-primary)] uppercase tracking-widest">{activeTasks.length} PENDING</span>
                        </div>
                        <div className="flex flex-col gap-4 md:gap-6">
                            {activeTasks.length > 0 ? activeTasks.map((task, index) => (
                                <TaskCard
                                    key={task.id}
                                    tags={[task.category]}
                                    title={task.title}
                                    price={task.priority}
                                    duration="Priority"
                                    description={task.description || "System requires manual input."}
                                    action="Confirm Complete"
                                    onAction={() => handleComplete(task.id, task.title)}
                                    isPrimary={index === 0}
                                />
                            )) : (
                                <div className="py-12 md:py-20 text-center bg-white/[0.02] rounded-[1.5rem] md:rounded-[2.5rem] border border-dashed border-white/10">
                                    <p className="text-[var(--color-muted-foreground)] font-black text-[10px] md:text-xs uppercase tracking-widest">Efficiency 100%</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
