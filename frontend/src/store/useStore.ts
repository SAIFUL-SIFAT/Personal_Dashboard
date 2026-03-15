import { create } from 'zustand';
import type { Task, Habit } from '../types';

interface StoreState {
    user: any | null;
    tasks: Task[];
    habits: Habit[];
    expenses: any[];
    media: any[];
    vault: any[];
    reminders: any[];
    codingHistory: Record<string, number>;

    workoutSummary: Record<string, number>;
    workoutTrend: any;

    searchQuery: string;
    loading: boolean;
    error: string | null;

    // Appearance settings
    accentColor: string;
    theme: 'dark' | 'light';

    setUser: (user: any) => void;
    setSearchQuery: (query: string) => void;
    setAccentColor: (color: string) => void;
    setTheme: (theme: 'dark' | 'light') => void;

    fetchTasks: (q?: string) => Promise<void>;
    fetchHabits: () => Promise<void>;
    fetchExpenses: () => Promise<void>;
    fetchMedia: (type?: string) => Promise<void>;
    fetchVault: (q?: string) => Promise<void>;
    fetchWorkoutSummary: () => Promise<void>;
    fetchWorkoutTrend: () => Promise<void>;
    fetchCodingHistory: () => Promise<void>;

    fetchReminders: () => Promise<void>;


    createTask: (task: Partial<Task>) => Promise<void>;
    updateTask: (id: string, data: Partial<Task>) => Promise<void>;
    deleteTask: (id: string) => Promise<void>;
    createHabit: (habit: Partial<Habit>) => Promise<void>;
    createExpense: (expense: any) => Promise<void>;
    updateExpense: (id: string, data: any) => Promise<void>;
    deleteExpense: (id: string) => Promise<void>;
    createMedia: (media: any) => Promise<void>;
    deleteMedia: (id: string) => Promise<void>;

    createVault: (item: any) => Promise<void>;
    createWorkout: (workout: any) => Promise<void>;
    createCodingLog: (data: { minutes: number; language?: string; date?: string }) => Promise<void>;
    createReminder: (reminder: any) => Promise<void>;
    markReminderNotified: (id: string) => Promise<void>;
    deleteReminder: (id: string) => Promise<void>;
    logHabit: (id: string) => Promise<void>;
    aiChat: (prompt: string) => Promise<string>;



    // Auth helper
    logout: () => void;
}

const isLocaltunnel = window.location.hostname.endsWith('loca.lt');
const API_URL = isLocaltunnel
    ? 'https://ready-yaks-look.loca.lt'
    : `http://${window.location.hostname}:3000`;




export const useStore = create<StoreState>((set, get) => ({
    user: JSON.parse(localStorage.getItem('user') || 'null'),
    tasks: [],
    habits: [],
    expenses: [],
    media: [],
    vault: [],
    reminders: [],
    workoutTrend: {},
    codingHistory: {},


    workoutSummary: {},
    searchQuery: '',
    loading: false,
    error: null,

    accentColor: localStorage.getItem('accent_color') || '#ff8a00',
    theme: (localStorage.getItem('theme') as 'dark' | 'light') || 'dark',

    setUser: (user) => {
        set({ user });
        if (user) localStorage.setItem('user', JSON.stringify(user));
        else localStorage.removeItem('user');
    },

    logout: () => {
        set({ user: null });
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    },

    setSearchQuery: (searchQuery) => {
        set({ searchQuery });
        get().fetchTasks(searchQuery);
        get().fetchVault(searchQuery);
    },

    setAccentColor: (accentColor) => {
        set({ accentColor });
        localStorage.setItem('accent_color', accentColor);
        document.documentElement.style.setProperty('--color-primary', accentColor);
    },

    setTheme: (theme) => {
        set({ theme });
        localStorage.setItem('theme', theme);
        // Theme switching logic handled in App or useEffect
    },

    fetchTasks: async (q) => {
        try {
            const url = q ? `${API_URL}/tasks?q=${q}` : `${API_URL}/tasks`;
            const resp = await fetch(url);
            set({ tasks: await resp.json() });
        } catch (err: any) { console.error(err); }
    },

    fetchHabits: async () => {
        try {
            const resp = await fetch(`${API_URL}/habits`);
            set({ habits: await resp.json() });
        } catch (err: any) { console.error(err); }
    },

    fetchExpenses: async () => {
        try {
            const resp = await fetch(`${API_URL}/expenses`);
            set({ expenses: await resp.json() });
        } catch (err: any) { console.error(err); }
    },

    fetchMedia: async (type) => {
        try {
            const url = type ? `${API_URL}/media?type=${type}` : `${API_URL}/media`;
            const resp = await fetch(url);
            set({ media: await resp.json() });
        } catch (err: any) { console.error(err); }
    },

    fetchVault: async (q) => {
        try {
            const url = q ? `${API_URL}/vault?q=${q}` : `${API_URL}/vault`;
            const resp = await fetch(url);
            set({ vault: await resp.json() });
        } catch (err: any) { console.error(err); }
    },

    fetchWorkoutSummary: async () => {
        try {
            const resp = await fetch(`${API_URL}/habits/workouts/summary`);
            set({ workoutSummary: await resp.json() });
        } catch (err: any) { console.error(err); }
    },

    fetchWorkoutTrend: async () => {
        try {
            const resp = await fetch(`${API_URL}/habits/workouts/trend`);
            set({ workoutTrend: await resp.json() });
        } catch (err: any) { console.error(err); }
    },


    fetchCodingHistory: async () => {
        try {
            const resp = await fetch(`${API_URL}/coding/history`);
            set({ codingHistory: await resp.json() });
        } catch (err: any) { console.error(err); }
    },

    fetchReminders: async () => {
        try {
            const resp = await fetch(`${API_URL}/reminders`);
            set({ reminders: await resp.json() });
        } catch (err: any) { console.error(err); }
    },


    createTask: async (task) => {
        try {
            const resp = await fetch(`${API_URL}/tasks`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(task),
            });
            const data = await resp.json();
            set((state) => ({ tasks: [data, ...state.tasks] }));
        } catch (err: any) { console.error(err); }
    },

    updateTask: async (id, data) => {
        try {
            const resp = await fetch(`${API_URL}/tasks/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            const updated = await resp.json();
            set((state) => ({
                tasks: state.tasks.map(t => t.id === id ? updated : t)
            }));
        } catch (err: any) { console.error(err); }
    },

    deleteTask: async (id) => {
        try {
            const resp = await fetch(`${API_URL}/tasks/${id}`, { method: 'DELETE' });
            if (resp.ok) {
                set((state) => ({
                    tasks: state.tasks.filter(t => t.id !== id)
                }));
            }
        } catch (err: any) { console.error(err); }
    },

    createHabit: async (habit) => {
        try {
            const resp = await fetch(`${API_URL}/habits`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(habit),
            });
            const data = await resp.json();
            set((state) => ({ habits: [data, ...state.habits] }));
        } catch (err: any) { console.error(err); }
    },

    createExpense: async (expense) => {
        try {
            const resp = await fetch(`${API_URL}/expenses`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(expense),
            });
            const data = await resp.json();
            set((state) => ({ expenses: [data, ...state.expenses] }));
        } catch (err: any) { console.error(err); }
    },

    updateExpense: async (id, data) => {
        try {
            const resp = await fetch(`${API_URL}/expenses/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            const updated = await resp.json();
            set((state) => ({
                expenses: state.expenses.map(e => e.id === id ? updated : e)
            }));
        } catch (err: any) { console.error(err); }
    },

    deleteExpense: async (id) => {
        try {
            const resp = await fetch(`${API_URL}/expenses/${id}`, { method: 'DELETE' });
            if (resp.ok) {
                set((state) => ({
                    expenses: state.expenses.filter(e => e.id !== id)
                }));
            }
        } catch (err: any) { console.error(err); }
    },

    createMedia: async (media) => {
        try {
            const resp = await fetch(`${API_URL}/media`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(media),
            });
            const data = await resp.json();
            set((state) => ({ media: [data, ...state.media] }));
        } catch (err: any) { console.error(err); }
    },

    deleteMedia: async (id) => {
        try {
            const resp = await fetch(`${API_URL}/media/${id}`, { method: 'DELETE' });
            if (resp.ok) {
                set((state) => ({
                    media: state.media.filter(m => m.id !== id)
                }));
            }
        } catch (err: any) { console.error(err); }
    },


    createVault: async (item) => {
        try {
            const resp = await fetch(`${API_URL}/vault`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(item),
            });
            const data = await resp.json();
            set((state) => ({ vault: [data, ...state.vault] }));
        } catch (err: any) { console.error(err); }
    },

    createWorkout: async (workout) => {
        try {
            await fetch(`${API_URL}/habits/workouts`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(workout),
            });
            get().fetchWorkoutSummary();
        } catch (err: any) { console.error(err); }
    },

    createCodingLog: async (log) => {
        try {
            await fetch(`${API_URL}/coding`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(log),
            });
            get().fetchCodingHistory();
        } catch (err: any) { console.error(err); }
    },

    logHabit: async (id) => {
        try {
            const resp = await fetch(`${API_URL}/habits/${id}/log`, { method: 'POST' });
            if (resp.ok) get().fetchHabits();
        } catch (err) { console.error(err); }
    },

    createReminder: async (reminder) => {
        try {
            const resp = await fetch(`${API_URL}/reminders`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(reminder),
            });
            const data = await resp.json();
            set((state) => ({ reminders: [...state.reminders, data] }));
        } catch (err: any) { console.error(err); }
    },

    markReminderNotified: async (id) => {
        try {
            await fetch(`${API_URL}/reminders/${id}/notified`, { method: 'PATCH' });
            get().fetchReminders();
        } catch (err: any) { console.error(err); }
    },

    deleteReminder: async (id) => {
        try {
            await fetch(`${API_URL}/reminders/${id}`, { method: 'DELETE' });
            get().fetchReminders();
        } catch (err: any) { console.error(err); }
    },

    aiChat: async (prompt: string) => {
        try {
            const resp = await fetch(`${API_URL}/ai/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt }),
            });
            const data = await resp.json();
            return data.response;
        } catch (err: any) {
            console.error(err);
            return "Connection to Neural Core lost.";
        }
    },

}));
