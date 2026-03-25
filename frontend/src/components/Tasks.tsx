import { useEffect, useState } from 'react';
import { Circle, Plus, X, Flag, Tag, CheckCircle2 } from 'lucide-react';
import { useStore } from '../store/useStore';
import { showNotification } from '../utils/notifications';

export function Tasks() {
    const { tasks, fetchTasks, createTask, updateTask, deleteTask, searchQuery } = useStore();
    const [showModal, setShowModal] = useState(false);
    const [filter, setFilter] = useState('ALL');
    const [newTask, setNewTask] = useState({
        title: '',
        description: '',
        priority: 'MEDIUM',
        category: 'personal',
        duration: '30 min'
    });

    useEffect(() => {
        fetchTasks(searchQuery);
    }, [fetchTasks, searchQuery]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await createTask(newTask);
        setShowModal(false);
        setNewTask({ title: '', description: '', priority: 'MEDIUM', category: 'personal', duration: '30 min' });

        showNotification("Task Created", {
            body: `"${newTask.title}" has been added to your board.`,
            tag: "task-add"
        });
    };

    const toggleComplete = async (id: string, currentStatus: string, title: string) => {
        const newStatus = currentStatus === 'COMPLETED' ? 'TODO' : 'COMPLETED';
        await updateTask(id, { status: newStatus });

        if (newStatus === 'COMPLETED') {
            showNotification("Task Completed! 🎉", {
                body: `Excellent work on: ${title}`,
                tag: "task-done"
            });
        }
    };

    const filteredTasks = tasks.filter(task => {
        const matchesStatus = filter === 'ALL' || task.status === filter;
        const q = searchQuery.toLowerCase();
        const matchesQuery = !q ||
            (task.title || '').toLowerCase().includes(q) ||
            (task.description || '').toLowerCase().includes(q) ||
            (task.category || '').toLowerCase().includes(q);
        return matchesStatus && matchesQuery;
    });

    return (
        <div className="flex flex-col gap-6 md:gap-8 pb-20">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <h1 className="text-2xl md:text-[32px] font-black text-white tracking-tighter uppercase italic">Strategic Workflow</h1>
                    <p className="text-[10px] text-[var(--color-muted-foreground)] font-bold uppercase tracking-[0.3em] mt-1">Operational Execution & Performance</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="w-full md:w-auto bg-[var(--color-primary)] text-black px-8 py-4 rounded-xl md:rounded-2xl font-black flex items-center justify-center gap-2 hover:scale-105 transition-all active:scale-95 shadow-lg shadow-orange-500/20 uppercase tracking-widest text-xs"
                >
                    <Plus size={18} /> New Objective
                </button>
            </div>

            <div className="flex gap-2 bg-[var(--color-card)] p-1.5 rounded-2xl border border-white/5 w-full md:w-fit overflow-x-auto no-scrollbar">
                {['ALL', 'TODO', 'COMPLETED'].map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`flex-1 md:flex-none px-6 py-2.5 rounded-xl text-[10px] md:text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${filter === f ? 'bg-[var(--color-primary)] text-black' : 'text-[var(--color-muted-foreground)] hover:text-white'}`}
                    >
                        {f}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 gap-4">
                {filteredTasks.length > 0 ? filteredTasks.map((task) => (
                    <div
                        key={task.id}
                        className={`bg-[var(--color-card)] rounded-2xl md:rounded-[1.5rem] p-5 md:p-6 border border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group hover:border-[var(--color-primary)]/40 transition-all ${task.status === 'COMPLETED' ? 'opacity-60' : ''}`}
                    >
                        <div className="flex items-center gap-4 md:gap-6 w-full sm:w-auto">
                            <button
                                onClick={() => toggleComplete(task.id, task.status, task.title)}
                                className={`w-8 h-8 md:w-10 md:h-10 rounded-full border-2 flex items-center justify-center transition-all shrink-0 ${task.status === 'COMPLETED' ? 'bg-emerald-500 border-emerald-500 text-black' : 'border-white/10 hover:border-[var(--color-primary)] text-transparent hover:text-[var(--color-primary)]'}`}
                            >
                                {task.status === 'COMPLETED' ? <CheckCircle2 size={18} className="md:w-5 md:h-5" /> : <Circle size={18} className="md:w-5 md:h-5" />}
                            </button>
                            <div className="flex-1">
                                <h3 className={`text-md md:text-lg font-black text-white mb-1 transition-all italic tracking-tight ${task.status === 'COMPLETED' ? 'line-through decoration-[var(--color-primary)]/40 text-[var(--color-muted-foreground)]' : ''}`}>
                                    {task.title}
                                </h3>
                                <div className="flex flex-wrap items-center gap-3 md:gap-4 text-[8px] md:text-[9px] font-black text-[var(--color-muted-foreground)] uppercase tracking-widest">
                                    <div className="flex items-center gap-1.5"><Flag size={10} className={task.priority === 'HIGH' ? 'text-red-500' : 'text-orange-400'} /> {task.priority}</div>
                                    <div className="flex items-center gap-1.5"><Tag size={10} /> {task.category}</div>
                                    {task.duration && <div className="text-[var(--color-primary)]/80 italic">{task.duration}</div>}
                                </div>
                            </div>
                        </div>
                        <div className="sm:opacity-0 group-hover:opacity-100 transition-opacity w-full sm:w-auto">
                            <button
                                onClick={() => deleteTask(task.id)}
                                className="w-full sm:w-auto p-3 rounded-xl bg-white/5 text-red-500 hover:bg-red-500/10 transition-colors flex items-center justify-center gap-2 font-black uppercase tracking-widest text-[10px]"
                            >
                                <X size={16} /> <span className="sm:hidden">Cancel Objective</span>
                            </button>
                        </div>
                    </div>
                )) : (
                    <div className="py-16 md:py-24 text-center bg-[var(--color-card)] rounded-[2rem] md:rounded-[3.5rem] border border-dashed border-white/10">
                        <p className="text-[10px] md:text-sm font-black uppercase tracking-widest text-[var(--color-muted-foreground)] opacity-30 italic">No operational objectives detected.</p>
                    </div>
                )}
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-2 md:p-4">
                    <div className="bg-[var(--color-card)] border border-white/5 rounded-3xl md:rounded-[2.5rem] w-full max-w-md overflow-hidden shadow-2xl relative">
                        <div className="p-6 md:p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
                            <h3 className="text-lg md:text-xl font-black text-white italic uppercase tracking-tighter">New Operational Objective</h3>
                            <button onClick={() => setShowModal(false)} className="text-[var(--color-muted-foreground)] hover:text-white transition-colors"><X size={20} className="md:w-6 md:h-6" /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-4 md:space-y-6">
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-[var(--color-muted-foreground)] mb-2">Outcome Title</label>
                                <input required className="w-full bg-[var(--color-background)] border border-white/5 rounded-xl md:rounded-2xl py-4 px-5 text-white focus:outline-none focus:border-[var(--color-primary)] transition-colors font-black text-sm" placeholder="What is the objective?" value={newTask.title} onChange={e => setNewTask({ ...newTask, title: e.target.value })} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-[var(--color-muted-foreground)] mb-2">Priority</label>
                                    <select className="w-full bg-[var(--color-background)] border border-white/5 rounded-xl md:rounded-2xl py-4 px-4 text-[10px] font-black uppercase text-white focus:outline-none focus:border-[var(--color-primary)] transition-colors appearance-none" value={newTask.priority} onChange={e => setNewTask({ ...newTask, priority: e.target.value })}>
                                        <option>LOW</option>
                                        <option>MEDIUM</option>
                                        <option>HIGH</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-[var(--color-muted-foreground)] mb-2">Duration</label>
                                    <input className="w-full bg-[var(--color-background)] border border-white/5 rounded-xl md:rounded-2xl py-4 px-5 text-[10px] font-black uppercase text-white focus:outline-none focus:border-[var(--color-primary)] transition-colors" placeholder="30 min" value={newTask.duration} onChange={e => setNewTask({ ...newTask, duration: e.target.value })} />
                                </div>
                            </div>
                            <button type="submit" className="w-full bg-[var(--color-primary)] text-black font-black uppercase tracking-[0.2em] py-5 rounded-xl md:rounded-2xl hover:scale-[1.02] active:scale-95 transition-all mt-4 shadow-xl shadow-orange-500/20 text-[10px] md:text-sm">
                                Authorize Objective
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
