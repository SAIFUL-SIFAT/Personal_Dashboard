import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, CheckSquare, Wallet, Dumbbell, PlayCircle, Shield, Settings, Code } from 'lucide-react';
import profilePic from '../assets/profile.png';
import logoPng from '../assets/logo.png';

interface SidebarProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
}

export function Sidebar({ activeTab, setActiveTab, isOpen, setIsOpen }: SidebarProps) {
    const navItems = [
        { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { id: 'tasks', icon: CheckSquare, label: 'Tasks' },
        { id: 'finance', icon: Wallet, label: 'Finance' },
        { id: 'coding', icon: Code, label: 'Coding' },
        { id: 'lifestyle', icon: Dumbbell, label: 'Lifestyle' },
        { id: 'media', icon: PlayCircle, label: 'Media' },
        { id: 'vault', icon: Shield, label: 'Vault' },
        { id: 'settings', icon: Settings, label: 'Settings' },
    ];

    return (
        <>
            {/* Mobile bottom nav - unchanged */}
            <nav className="fixed md:hidden bottom-0 left-0 w-full bg-[var(--color-sidebar)] flex flex-row items-center py-2 z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] overflow-x-auto no-scrollbar border-t border-white/5 backdrop-blur-xl">
                <div className="flex flex-row gap-2 flex-1 w-full items-center justify-around px-2">
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`relative w-12 h-12 rounded-2xl flex flex-col items-center justify-center transition-all group ${activeTab === item.id
                                ? 'text-[var(--color-primary)] bg-[var(--color-primary)]/10'
                                : 'text-[var(--color-muted-foreground)] hover:text-white'
                                }`}
                            title={item.label}
                        >
                            {activeTab === item.id && (
                                <motion.div
                                    layoutId="sidebar-active-mobile"
                                    className="absolute bottom-0 w-8 h-1 bg-[var(--color-primary)] rounded-full"
                                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                />
                            )}
                            <item.icon className={`w-[20px] h-[20px] relative z-10 ${activeTab === item.id ? 'stroke-[2.5px]' : 'stroke-2 group-hover:scale-110 transition-transform'}`} />
                            <span className="text-[8px] font-black uppercase tracking-tighter mt-1 opacity-80">{item.label.slice(0, 4)}</span>
                        </button>
                    ))}
                </div>
            </nav>

            {/* Desktop sidebar */}
            <motion.nav
                initial={false}
                animate={{ width: isOpen ? 200 : 80 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="hidden md:flex relative flex-col items-center py-8 z-50 bg-[var(--color-sidebar)] shadow-2xl shadow-black/50 border-r border-white/5 overflow-hidden shrink-0"
            >
                {/* Logo — click to toggle sidebar */}
                <div className="flex items-center gap-3 mb-10 px-4 w-full overflow-hidden">
                    <div
                        onClick={() => setIsOpen(!isOpen)}
                        className="w-10 h-10 min-w-[40px] bg-black rounded-2xl flex items-center justify-center shadow-xl transition-all cursor-pointer group overflow-hidden border border-white/10"
                    >
                        <img src={logoPng} alt="Dash Logo" className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                    </div>
                    <AnimatePresence>
                        {isOpen && (
                            <motion.span
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                transition={{ duration: 0.15 }}
                                className="text-sm font-black text-white uppercase tracking-widest whitespace-nowrap"
                            >
                                Dashboard
                            </motion.span>
                        )}
                    </AnimatePresence>
                </div>

                {/* Nav items */}
                <div className="flex flex-col gap-2 flex-1 w-full px-3 overflow-hidden">
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`relative flex items-center gap-3 rounded-2xl transition-all group overflow-hidden ${isOpen ? 'px-4 py-3' : 'w-12 h-12 mx-auto justify-center'} ${activeTab === item.id
                                ? 'text-[var(--color-primary)] bg-[var(--color-primary)]/10'
                                : 'text-[var(--color-muted-foreground)] hover:text-white hover:bg-white/5'
                                }`}
                            title={!isOpen ? item.label : undefined}
                        >
                            {activeTab === item.id && (
                                <motion.div
                                    layoutId="sidebar-active-desktop"
                                    className="absolute left-0 w-1 h-8 bg-[var(--color-primary)] rounded-r-full"
                                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                />
                            )}
                            <item.icon className={`min-w-[20px] w-5 h-5 relative z-10 ${activeTab === item.id ? 'stroke-[2.5px]' : 'stroke-2 group-hover:scale-110 transition-transform'}`} />
                            <AnimatePresence>
                                {isOpen && (
                                    <motion.span
                                        initial={{ opacity: 0, x: -8 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -8 }}
                                        transition={{ duration: 0.15 }}
                                        className="text-[11px] font-black uppercase tracking-widest whitespace-nowrap"
                                    >
                                        {item.label}
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </button>
                    ))}
                </div>

                {/* Profile */}
                <div className="flex flex-col items-center gap-3 w-full px-3 pt-6 border-t border-white/5 mt-auto overflow-hidden">
                    <div className={`flex items-center gap-3 w-full overflow-hidden ${isOpen ? '' : 'justify-center'}`}>
                        <div className="w-10 h-10 min-w-[40px] rounded-full overflow-hidden cursor-pointer ring-2 ring-white/10 hover:ring-[var(--color-primary)]/50 transition-all shrink-0">
                            <img src={profilePic} alt="Profile" className="w-full h-full object-cover object-top" />
                        </div>
                        <AnimatePresence>
                            {isOpen && (
                                <motion.div
                                    initial={{ opacity: 0, x: -8 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -8 }}
                                    transition={{ duration: 0.15 }}
                                    className="overflow-hidden"
                                >
                                    <p className="text-[11px] font-black text-white uppercase tracking-widest whitespace-nowrap">Saiful Sifat</p>
                                    <p className="text-[9px] text-[var(--color-muted-foreground)] font-bold uppercase tracking-widest whitespace-nowrap">Admin</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>


            </motion.nav>
        </>
    );
}
