import { useState, useEffect } from 'react';
import { User, Bell, Shield, Moon, Monitor, LogOut, ChevronRight, Edit2, Camera, ShieldCheck, Palette, Sun, Smartphone, QrCode } from 'lucide-react';
import QRCode from 'react-qr-code';
import { useStore } from '../store/useStore';
import profilePic from '../assets/profile.png';

export function Settings() {
    const { user, logout, accentColor, setAccentColor, theme, setTheme } = useStore();
    const [activeTab, setActiveTab] = useState('profile');

    const sections = [
        { id: 'profile', icon: User, label: 'Profile', desc: 'Account details and avatar' },
        { id: 'appearance', icon: Moon, label: 'Appearance', desc: 'Dark mode and themes' },
        { id: 'security', icon: Shield, label: 'Security', desc: 'Passwords and sessions' },
        { id: 'notifications', icon: Bell, label: 'Notifications', desc: 'Email alerts' },
        { id: 'mobile', icon: Smartphone, label: 'Mobile App', desc: 'Scan to use on phone' },
    ];

    const colors = [
        { name: 'Dash Orange', value: '#ff8a00' },
        { name: 'Electric Blue', value: '#3b82f6' },
        { name: 'Royal Purple', value: '#8b5cf6' },
        { name: 'Emerald Green', value: '#10b981' },
        { name: 'Rose Pink', value: '#f43f5e' },
    ];

    // Apply accent color on mount
    useEffect(() => {
        document.documentElement.style.setProperty('--color-primary', accentColor);
    }, [accentColor]);

    return (
        <div className="flex flex-col gap-10 pb-20">
            <div>
                <h1 className="text-[32px] font-semibold text-white tracking-tight">Settings</h1>
                <p className="text-[var(--color-muted-foreground)] mt-1">Manage your dashboard preferences and account.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Navigation Sidebar */}
                <div className="lg:col-span-4 flex flex-col gap-3">
                    {sections.map(section => (
                        <button
                            key={section.id}
                            onClick={() => setActiveTab(section.id)}
                            className={`flex items-center gap-4 p-5 rounded-3xl border transition-all text-left group ${activeTab === section.id ? 'bg-[var(--color-primary)]/10 border-[var(--color-primary)] text-white' : 'bg-[var(--color-card)] border-[#2a2a32] text-[var(--color-muted-foreground)] hover:border-[#3a3a42] hover:text-white'}`}
                        >
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${activeTab === section.id ? 'bg-[var(--color-primary)] text-black' : 'bg-[var(--color-background)] text-[var(--color-muted-foreground)] group-hover:text-[var(--color-primary)]'}`}>
                                <section.icon size={22} />
                            </div>
                            <div>
                                <h4 className={`font-bold transition-colors ${activeTab === section.id ? 'text-white' : 'text-[var(--color-muted-foreground)] group-hover:text-white'}`}>{section.label}</h4>
                                <p className="text-xs font-medium opacity-60 tracking-tight">{section.desc}</p>
                            </div>
                            {activeTab === section.id && <ChevronRight size={18} className="ml-auto text-[var(--color-primary)]" />}
                        </button>
                    ))}

                    <div className="mt-4 pt-4 border-t border-[#2a2a32]">
                        <button
                            onClick={logout}
                            className="w-full bg-red-500/10 text-red-500 border border-red-500/20 rounded-3xl p-5 flex items-center justify-between group hover:bg-red-500 hover:text-white transition-all shadow-lg shadow-red-500/5"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-red-500/20 flex items-center justify-center group-hover:bg-white/20">
                                    <LogOut size={22} />
                                </div>
                                <span className="font-bold">Logout Session</span>
                            </div>
                            <ChevronRight size={18} className="opacity-40 group-hover:opacity-100 transition-opacity" />
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                <div className="lg:col-span-8">
                    <div className="bg-[var(--color-card)] rounded-[2.5rem] border border-[#2a2a32] p-10 shadow-sm min-h-[500px]">
                        {activeTab === 'profile' && (
                            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                <div className="flex flex-col items-center justify-center p-6 bg-white/[0.02] border border-dashed border-[#2a2a32] rounded-[3rem]">
                                    <div className="relative group cursor-pointer">
                                        <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-[var(--color-primary)] to-orange-400 p-1.5 shadow-2xl transition-all duration-500">
                                            <div className="w-full h-full rounded-full bg-[var(--color-card)] flex items-center justify-center overflow-hidden">
                                                <img src={profilePic} alt="Avatar" className="w-full h-full object-cover object-top" />
                                            </div>
                                        </div>
                                        <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Camera className="text-white" size={24} />
                                        </div>
                                        <div className="absolute bottom-1 right-1 w-10 h-10 bg-[var(--color-primary)] rounded-full flex items-center justify-center text-black border-4 border-[var(--color-card)] shadow-lg transition-all duration-300">
                                            <Edit2 size={16} />
                                        </div>
                                    </div>
                                    <div className="mt-6 text-center">
                                        <h3 className="text-2xl font-black text-white capitalize">{user?.name || 'Sifat'}</h3>
                                        <p className="text-[var(--color-muted-foreground)] font-medium tracking-tight mt-1">{user?.email}</p>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-muted-foreground)] mb-3">Display Name</label>
                                            <input className="w-full bg-[var(--color-background)] border border-[#2a2a32] rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-[var(--color-primary)] font-semibold transition-colors" defaultValue={user?.name || ''} />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-muted-foreground)] mb-3">Email Address</label>
                                            <input className="w-full bg-[var(--color-background)] border-[#2a2a32] rounded-2xl px-6 py-4 text-[var(--color-muted-foreground)] focus:outline-none border opacity-60 cursor-not-allowed font-semibold" value={user?.email || ''} readOnly />
                                        </div>
                                    </div>
                                    <button className="bg-white text-black px-10 py-5 rounded-[2rem] font-black tracking-tight hover:bg-[var(--color-primary)] transition-all active:scale-95 shadow-xl shadow-white/5">Update Information</button>
                                </div>
                            </div>
                        )}

                        {activeTab === 'appearance' && (
                            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-2">Interface Appearance</h3>
                                    <p className="text-[var(--color-muted-foreground)] text-sm mb-6">Choose how the dashboard looks on your device.</p>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div
                                            onClick={() => setTheme('dark')}
                                            className={`relative rounded-3xl p-6 flex flex-col items-center gap-4 cursor-pointer transition-all ${theme === 'dark' ? 'bg-[var(--color-background)] border-2 border-[var(--color-primary)] shadow-lg shadow-primary/5' : 'bg-white/[0.02] border border-[#2a2a32] hover:bg-white/[0.05]'}`}
                                        >
                                            <Moon size={32} className={theme === 'dark' ? 'text-[var(--color-primary)]' : 'text-gray-500'} />
                                            <span className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-500'}`}>Deep Night</span>
                                            {theme === 'dark' && <div className="absolute top-3 right-3 w-2 h-2 bg-[var(--color-primary)] rounded-full" />}
                                        </div>
                                        <div
                                            onClick={() => setTheme('light')}
                                            className={`relative rounded-3xl p-6 flex flex-col items-center gap-4 cursor-pointer transition-all ${theme === 'light' ? 'bg-[#f0f0f5] border-2 border-[var(--color-primary)] shadow-lg' : 'bg-white/[0.02] border border-[#2a2a32] hover:bg-white/[0.05]'}`}
                                        >
                                            <Sun size={32} className={theme === 'light' ? 'text-[var(--color-primary)]' : 'text-gray-500'} />
                                            <span className={`font-bold ${theme === 'light' ? 'text-gray-800' : 'text-gray-500'}`}>Modern Light</span>
                                            {theme === 'light' && <div className="absolute top-3 right-3 w-2 h-2 bg-[var(--color-primary)] rounded-full" />}
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-8 border-t border-[#2a2a32]">
                                    <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                                        <Palette size={20} className="text-[var(--color-primary)]" />
                                        Accent Color System
                                    </h3>
                                    <div className="flex flex-wrap gap-4">
                                        {colors.map(color => (
                                            <button
                                                key={color.value}
                                                onClick={() => setAccentColor(color.value)}
                                                className={`w-14 h-14 rounded-full transition-all flex items-center justify-center relative group`}
                                                style={{ backgroundColor: color.value }}
                                                title={color.name}
                                            >
                                                <div className={`w-16 h-16 rounded-full border-4 border-transparent transition-all absolute ${accentColor === color.value ? 'border-[var(--color-primary)] opacity-40 scale-110' : 'group-hover:border-white/20'}`} />
                                                {accentColor === color.value && <div className="w-3 h-3 bg-white rounded-full shadow-lg" />}
                                            </button>
                                        ))}
                                    </div>
                                    <p className="mt-6 text-xs text-[var(--color-muted-foreground)] font-medium">Selected: <span className="text-white font-bold">{colors.find(c => c.value === accentColor)?.name || 'Custom'}</span></p>
                                </div>
                            </div>
                        )}

                        {activeTab === 'security' && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                <div className="bg-white/[0.02] border border-[#2a2a32] rounded-3xl p-8 flex items-start gap-6">
                                    <div className="w-14 h-14 bg-green-500/10 rounded-2xl flex items-center justify-center text-green-500">
                                        <ShieldCheck size={28} />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-white font-bold text-lg mb-1">Passkey Protection</h4>
                                        <p className="text-sm text-[var(--color-muted-foreground)] leading-relaxed">Your account is currently protected by local encryption. To enable biometric unlocking (FaceID/Fingerprint), upgrade to Pro.</p>
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <button className="w-full py-5 bg-[var(--color-background)] border border-[#2a2a32] text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:border-[var(--color-primary)] transition-all active:scale-[0.98]">
                                        <Monitor size={20} /> View All Active Sessions
                                    </button>
                                </div>
                            </div>
                        )}

                        {activeTab === 'notifications' && (
                            <div className="flex flex-col items-center justify-center h-full text-center py-20">
                                <div className="w-20 h-20 bg-blue-500/10 rounded-[2rem] flex items-center justify-center text-blue-500 mb-6">
                                    <Bell size={32} />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">Notification Hub</h3>
                                <p className="text-sm text-[var(--color-muted-foreground)] max-w-xs mx-auto mb-8">System-wide alerts are active. You can toggle specific categories below.</p>

                                <div className="w-full space-y-4 text-left">
                                    {['Task Reminders', 'Finance Alerts', 'Habit Streaks'].map(label => (
                                        <div key={label} className="flex items-center justify-between p-5 bg-white/[0.02] border border-[#2a2a32] rounded-2xl">
                                            <span className="font-bold text-white text-sm">{label}</span>
                                            <div className="w-12 h-6 bg-[var(--color-primary)] rounded-full relative shadow-inner cursor-pointer">
                                                <div className="absolute right-1 top-1 w-4 h-4 bg-black rounded-full shadow-md" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'mobile' && (
                            <div className="flex flex-col items-center justify-center h-full text-center py-10 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                <div className="w-20 h-20 bg-[var(--color-primary)]/10 rounded-[2rem] flex items-center justify-center text-[var(--color-primary)] mb-6 shadow-lg shadow-primary/5">
                                    <QrCode size={32} />
                                </div>
                                <h3 className="text-2xl font-black text-white mb-2 uppercase tracking-tight">Dash on Mobile</h3>
                                <p className="text-sm text-[var(--color-muted-foreground)] max-w-sm mx-auto mb-10 leading-relaxed font-medium">Scan this QR code with your phone's camera to quickly open and install the Dash PWA on your mobile device.</p>

                                <div className="p-6 bg-white rounded-[2rem] shadow-2xl overflow-hidden hover:scale-105 transition-transform duration-300">
                                    {(() => {
                                        const QRCodeComp = (QRCode as any).default || (QRCode as any).QRCode || QRCode;
                                        return (
                                            <QRCodeComp
                                                value={window.location.origin}
                                                size={200}
                                                fgColor="#000000"
                                                bgColor="#FFFFFF"
                                            />
                                        );
                                    })()}
                                </div>
                                <div className="mt-6 flex flex-col items-center gap-2 opacity-60">
                                    <span className="text-[10px] uppercase font-black tracking-widest text-[var(--color-muted-foreground)]">Current Target URL</span>
                                    <code className="px-4 py-2 bg-white/5 rounded-full text-xs text-white font-mono break-all">{window.location.origin}</code>
                                    {window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ? (
                                        <p className="text-[10px] text-orange-400 mt-2 max-w-xs leading-relaxed font-bold">
                                            ⚠️ You are currently using localhost. To scan and use this on your phone, access the dashboard via your computer's local network IP address (e.g. 192.168.x.x:5173).
                                        </p>
                                    ) : null}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
