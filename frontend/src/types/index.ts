export interface Task {
    id: string;
    title: string;
    description?: string;
    status: string;
    priority: string;
    category: string;
    duration?: string;
    tags?: string;
    createdAt: string;
}

export interface Habit {
    id: string;
    name: string;
    logs: any[];
}
