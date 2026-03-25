import { useEffect } from 'react';
import { useStore } from '../store/useStore';
import { showNotification } from '../utils/notifications';

export function ReminderListener() {
    const { fetchReminders, markReminderNotified } = useStore();

    useEffect(() => {
        const checkReminders = async () => {
            try {
                const resp = await fetch('http://localhost:3000/reminders/due');
                if (!resp.ok) return;

                const dueReminders = await resp.json();

                dueReminders.forEach((reminder: any) => {
                    showNotification("🔔 Reminder: " + reminder.title, {
                        body: "Scheduled alert for your dashboard.",
                        tag: reminder.id,
                        requireInteraction: true
                    });
                    markReminderNotified(reminder.id);
                });
            } catch (err) {
                console.error("Failed to check reminders:", err);
            }
        };

        // Initial check
        checkReminders();
        fetchReminders();

        // Polling every 30 seconds
        const interval = setInterval(checkReminders, 30000);
        return () => clearInterval(interval);
    }, [markReminderNotified, fetchReminders]);

    return null;
}
