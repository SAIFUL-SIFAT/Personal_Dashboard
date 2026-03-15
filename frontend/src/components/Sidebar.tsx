import { motion } from 'framer-motion';
import { LayoutDashboard, CheckSquare, Wallet, Dumbbell, PlayCircle, Shield, Settings, Zap, Code } from 'lucide-react';

interface SidebarProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

export function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
    const navItems = [
        { id: 'dashboard', icon: LayoutDashboard, label: 'Dash' },
        { id: 'tasks', icon: CheckSquare, label: 'Tasks' },
        { id: 'finance', icon: Wallet, label: 'Gold' },
        { id: 'coding', icon: Code, label: 'Code' },
        { id: 'lifestyle', icon: Dumbbell, label: 'Life' },
        { id: 'media', icon: PlayCircle, label: 'Media' },
        { id: 'vault', icon: Shield, label: 'Vault' },
        { id: 'settings', icon: Settings, label: 'Settings' },
    ];

    return (
        <nav className="fixed md:relative bottom-0 left-0 w-full md:w-24 md:min-w-[96px] bg-[var(--color-sidebar)] md:flex flex-row md:flex-col items-center py-2 md:py-8 z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] md:shadow-2xl md:shadow-black/50 overflow-x-auto md:overflow-y-auto no-scrollbar border-t md:border-t-0 md:border-r border-white/5 backdrop-blur-xl md:backdrop-blur-none">

            {/* Logo - Hidden on Mobile Bottom Nav */}
            <div className="hidden md:flex w-12 h-12 bg-gradient-to-tr from-[var(--color-primary)] to-orange-400 rounded-2xl items-center justify-center mb-10 text-black shadow-xl shadow-orange-500/10 hover:rotate-12 transition-all cursor-pointer group">
                <Zap className="w-6 h-6 fill-current group-hover:scale-110 transition-transform" />
            </div>

            <div className="flex flex-row md:flex-col gap-2 md:gap-6 flex-1 w-full items-center justify-around md:justify-start px-2 md:px-0">
                {navItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`relative w-12 h-12 md:w-12 md:h-12 rounded-2xl flex flex-col md:flex-row items-center justify-center transition-all group ${activeTab === item.id
                            ? 'text-[var(--color-primary)] bg-[var(--color-primary)]/10 md:bg-[var(--color-primary)]/5'
                            : 'text-[var(--color-muted-foreground)] hover:text-white md:hover:bg-white/5'
                            }`}
                        title={item.label}
                    >
                        {activeTab === item.id && (
                            <motion.div
                                layoutId="sidebar-active"
                                className="absolute bottom-0 md:bottom-auto md:left-[-24px] w-8 md:w-1 h-1 md:h-8 bg-[var(--color-primary)] rounded-full"
                                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                            />
                        )}
                        <item.icon className={`w-[20px] h-[20px] md:w-[22px] md:h-[22px] relative z-10 ${activeTab === item.id ? 'stroke-[2.5px]' : 'stroke-2 group-hover:scale-110 transition-transform'}`} />
                        <span className="text-[8px] font-black uppercase tracking-tighter mt-1 md:hidden opacity-80">{item.label}</span>
                    </button>
                ))}
            </div>

            {/* Profile - Hidden on Mobile Bottom Nav */}
            <div className="hidden md:flex mt-auto flex-col items-center gap-5 w-full pt-6 border-t border-white/5">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center overflow-hidden cursor-pointer hover:ring-2 ring-[var(--color-primary)]/30 transition-all">
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sifat" alt="Profile" className="w-full h-full" />
                </div>
            </div>
        </nav>
    );
}
