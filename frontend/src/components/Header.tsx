import { Search, Download, BellRing, MonitorSmartphone } from 'lucide-react';
import { useStore } from '../store/useStore';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { requestNotificationPermission, showNotification } from '../utils/notifications';
import profilePic from '../assets/profile.png';

interface HeaderProps {
    activeTab: string;
}

export function Header({ activeTab }: HeaderProps) {
    const { searchQuery, setSearchQuery, user } = useStore();
    const { isInstallable, installPWA, isInstalled } = usePWAInstall();

    const handleNotificationRequest = async () => {
        const granted = await requestNotificationPermission();
        if (granted) {
            showNotification("Access Granted!", {
                body: "OS-level notifications are now active.",
                tag: "dash-init"
            });
        }
    };

    return (
        <header className="flex justify-between items-center py-4 md:py-6 px-4 md:px-10 z-10 shrink-0 border-b border-white/5 md:border-none bg-[var(--color-background)]/80 backdrop-blur-md md:bg-transparent">
            <div className="flex items-center gap-4 md:gap-8 overflow-hidden">
                <div className="flex items-center gap-3">
                    <div className="md:hidden w-8 h-8 bg-[var(--color-primary)] rounded-lg flex items-center justify-center text-black shadow-lg shadow-orange-500/20">
                        <span className="font-black text-xs italic">SD</span>
                    </div>
                    <h2 className="text-lg md:text-2xl font-black text-white capitalize tracking-tighter italic truncate max-w-[120px] md:max-w-none">{activeTab}</h2>
                </div>

                <div className="relative w-full max-w-[180px] md:max-w-[320px] hidden sm:block">
                    <Search className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 w-[14px] h-[14px] md:w-[18px] md:h-[18px] text-[var(--color-muted-foreground)]" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search..."
                        className="w-full bg-[var(--color-card)] border border-transparent hover:border-white/10 rounded-full py-2 md:py-3.5 pl-[36px] md:pl-[46px] pr-4 text-xs md:text-sm focus:outline-none focus:border-[var(--color-primary)] transition-all text-white placeholder:text-[var(--color-muted-foreground)] shadow-sm"
                    />
                </div>
            </div>

            <div className="flex items-center gap-2 md:gap-4 shrink-0">
                {/* PWA Button */}
                {isInstallable ? (
                    <button
                        onClick={installPWA}
                        className="bg-[var(--color-primary)] text-black px-3 md:px-5 py-2 md:py-2.5 rounded-xl md:rounded-2xl text-[10px] md:text-xs font-black flex items-center gap-2 hover:scale-105 transition-all shadow-xl active:scale-95"
                    >
                        <Download size={12} strokeWidth={3} className="md:w-3.5 md:h-3.5" /> <span className="hidden xs:inline">Install</span>
                    </button>
                ) : isInstalled && (
                    <div className="hidden sm:flex bg-white/5 border border-white/5 text-[var(--color-muted-foreground)] px-4 py-2.5 rounded-2xl text-[10px] font-black items-center gap-2">
                        <MonitorSmartphone size={14} className="text-[var(--color-primary)]" /> DESKTOP
                    </div>
                )}

                <button
                    onClick={handleNotificationRequest}
                    className="w-10 h-10 md:w-[46px] md:h-[46px] rounded-full bg-[var(--color-card)] flex items-center justify-center border border-white/5 text-white hover:bg-white/10 transition-colors relative shadow-sm"
                >
                    <BellRing className="w-4 h-4 md:w-[18px] md:h-[18px]" />
                    {!("Notification" in window && Notification.permission === "granted") && (
                        <span className="absolute top-2.5 right-2.5 md:top-3 md:right-3 w-1.5 h-1.5 md:w-2 md:h-2 bg-[var(--color-primary)] rounded-full border-2 border-[var(--color-card)] animate-pulse" />
                    )}
                </button>

                <div className="h-8 md:h-[44px] w-[1px] bg-white/5 mx-1 md:mx-2 hidden xs:block" />

                <div className="flex items-center gap-2 md:gap-3 pl-1 md:pl-2 group cursor-pointer">
                    <div className="text-right hidden sm:block text-ellipsis overflow-hidden">
                        <p className="text-xs md:text-sm font-black text-white group-hover:text-[var(--color-primary)] transition-colors line-clamp-1">{user?.name || 'Sifat'}</p>
                        <p className="text-[8px] md:text-[9px] text-[var(--color-muted-foreground)] font-black uppercase tracking-widest opacity-60">Elite</p>
                    </div>
                    <div className="w-10 h-10 md:w-[48px] md:h-[48px] rounded-xl md:rounded-2xl bg-gradient-to-tr from-[var(--color-primary)] to-orange-400 p-[2px]">
                        <div className="w-full h-full rounded-[10px] md:rounded-[14px] bg-[var(--color-card)] flex items-center justify-center overflow-hidden">
                            <img src={profilePic} alt="Avatar" className="w-full h-full object-cover object-top" />
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
