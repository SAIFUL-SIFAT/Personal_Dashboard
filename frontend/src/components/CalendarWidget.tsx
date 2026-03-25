import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeft, ChevronRight, Bell, X, Clock } from 'lucide-react';
import { useStore } from '../store/useStore';
import { showNotification } from '../utils/notifications';

export function CalendarWidget() {
    const { reminders, fetchReminders, createReminder } = useStore();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [showModal, setShowModal] = useState(false);
    const [reminderTitle, setReminderTitle] = useState('');
    const [reminderTime, setReminderTime] = useState('12:00');

    useEffect(() => {
        fetchReminders();
    }, [fetchReminders]);

    const getWeekDays = (date: Date) => {
        const start = new Date(date);
        start.setDate(date.getDate() - date.getDay() + (date.getDay() === 0 ? -6 : 1)); // Adjust for Monday start

        return Array.from({ length: 7 }, (_, i) => {
            const d = new Date(start);
            d.setDate(start.getDate() + i);
            return d;
        });
    };

    const weekDays = getWeekDays(currentDate);
    const monthYear = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

    const handlePrevWeek = () => {
        const d = new Date(currentDate);
        d.setDate(d.getDate() - 7);
        setCurrentDate(d);
    };

    const handleNextWeek = () => {
        const d = new Date(currentDate);
        d.setDate(d.getDate() + 7);
        setCurrentDate(d);
    };

    const handleDateClick = (d: Date) => {
        setSelectedDate(d);
        setShowModal(true);
    };

    const handleAddReminder = async (e: React.FormEvent) => {
        e.preventDefault();

        const [hours, minutes] = reminderTime.split(':');
        const reminderDate = new Date(selectedDate);
        reminderDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);

        await createReminder({
            title: reminderTitle,
            date: reminderDate.toISOString(),
        });

        showNotification("Reminder Set", {
            body: `Alert scheduled for ${reminderTitle} at ${reminderTime}.`,
            tag: "reminder-add"
        });

        setShowModal(false);
        setReminderTitle('');
    };

    const hasReminder = (date: Date) => {
        const dStr = date.toISOString().split('T')[0];
        return reminders.some(r => r.date.startsWith(dStr));
    };

    return (
        <div className="bg-[var(--color-card)] rounded-[2.5rem] p-7 border border-white/5 shadow-sm relative">
            <div className="flex justify-between items-center mb-8 px-1">
                <button
                    onClick={handlePrevWeek}
                    className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-black transition-all">
                    <ChevronLeft className="w-5 h-5" />
                </button>
                <h3 className="font-black text-[15px] text-white tracking-[0.05em] uppercase">{monthYear}</h3>
                <button
                    onClick={handleNextWeek}
                    className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-black transition-all">
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>

            <div className="flex justify-between items-center">
                {weekDays.map((date, i) => {
                    const isSelected = date.toDateString() === selectedDate.toDateString();
                    const isToday = date.toDateString() === new Date().toDateString();
                    const dayName = date.toLocaleString('default', { weekday: 'short' });
                    const dayNum = date.getDate();

                    return (
                        <div
                            key={i}
                            className="flex flex-col items-center gap-[12px] cursor-pointer group"
                            onClick={() => handleDateClick(date)}
                        >
                            <span className="text-[11px] font-black uppercase tracking-widest text-[var(--color-muted-foreground)] group-hover:text-white transition-colors">{dayName}</span>
                            <div className={`w-[40px] h-[40px] rounded-full flex items-center justify-center text-[15px] transition-all duration-300 relative ${isSelected
                                ? 'bg-[var(--color-primary)] text-black font-black shadow-lg shadow-primary/20 scale-110'
                                : isToday
                                    ? 'bg-blue-500/10 text-blue-500 font-bold border border-blue-500/20'
                                    : 'text-white/60 hover:bg-white/5 font-bold hover:text-white border border-transparent'
                                }`}>
                                {dayNum}
                                {hasReminder(date) && !isSelected && (
                                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-orange-500 border-2 border-[var(--color-card)] rounded-full" />
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {showModal && createPortal(
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-[var(--color-card)] border border-white/10 rounded-[2.5rem] w-full max-w-md overflow-hidden shadow-2xl">
                        <div className="p-8 border-b border-white/5 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                                    <Bell size={20} />
                                </div>
                                <h3 className="text-xl font-black text-white uppercase tracking-tighter">New Reminder</h3>
                            </div>
                            <button onClick={() => setShowModal(false)} className="w-10 h-10 rounded-full flex items-center justify-center text-[var(--color-muted-foreground)] hover:bg-white/5 transition-all"><X size={24} /></button>
                        </div>
                        <form onSubmit={handleAddReminder} className="p-8 space-y-6">
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-muted-foreground)] mb-3">Event Title</label>
                                <input required className="w-full bg-[var(--color-background)] border border-white/10 rounded-2xl px-6 py-4.5 text-white focus:outline-none focus:border-[var(--color-primary)] font-bold transition-all" value={reminderTitle} onChange={e => setReminderTitle(e.target.value)} placeholder="E.g. Project Deadline" />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-muted-foreground)] mb-3">Alert Time</label>
                                <div className="relative">
                                    <Clock className="absolute left-6 top-1/2 -translate-y-1/2 text-[var(--color-muted-foreground)] w-5 h-5 pointer-events-none" />
                                    <input required type="time" className="w-full bg-[var(--color-background)] border border-white/10 rounded-2xl pl-16 pr-6 py-4.5 text-white focus:outline-none focus:border-[var(--color-primary)] font-bold transition-all appearance-none" value={reminderTime} onChange={e => setReminderTime(e.target.value)} />
                                </div>
                            </div>
                            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 flex items-center gap-4">
                                <span className="text-xs font-bold text-[var(--color-muted-foreground)]">Date: {selectedDate.toDateString()}</span>
                            </div>
                            <button type="submit" className="w-full bg-[var(--color-primary)] text-black font-black py-5 rounded-2xl mt-4 shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-widest text-sm">Schedule Alert</button>
                        </form>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
}
