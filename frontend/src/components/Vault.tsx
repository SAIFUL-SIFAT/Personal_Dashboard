import { useEffect, useState } from 'react';
import { Shield, Plus, X, Lock, Eye, EyeOff, Globe, CreditCard, FileText, KeyRound, CheckCircle2 } from 'lucide-react';
import { useStore } from '../store/useStore';

export function Vault() {
    const { vault, fetchVault, createVault, searchQuery } = useStore();
    const [showModal, setShowModal] = useState(false);
    const [isUnlocked, setIsUnlocked] = useState(false);
    const [masterKey, setMasterKey] = useState(localStorage.getItem('vault_master_key') || '');
    const [passkeyInput, setPasskeyInput] = useState('');
    const [isSettingUp, setIsSettingUp] = useState(!localStorage.getItem('vault_master_key'));
    const [showSecret, setShowSecret] = useState<Record<string, boolean>>({});
    const [newItem, setNewItem] = useState({ title: '', username: '', secret: '', type: 'password', url: '' });

    useEffect(() => {
        if (isUnlocked) fetchVault(searchQuery);
    }, [fetchVault, searchQuery, isUnlocked]);

    const handleSetup = (e: React.FormEvent) => {
        e.preventDefault();
        if (passkeyInput.length < 4) {
            alert('Passkey must be at least 4 characters');
            return;
        }
        localStorage.setItem('vault_master_key', passkeyInput);
        setMasterKey(passkeyInput);
        setIsSettingUp(false);
        setIsUnlocked(true);
        setPasskeyInput('');
    };

    const handleUnlock = (e: React.FormEvent) => {
        e.preventDefault();
        if (passkeyInput === masterKey) {
            setIsUnlocked(true);
            setPasskeyInput('');
        } else {
            alert('Invalid Passkey');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await createVault(newItem);
        setShowModal(false);
        setNewItem({ title: '', username: '', secret: '', type: 'password', url: '' });
    };

    const toggleSecret = (id: string) => {
        setShowSecret(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'password': return <Lock size={18} />;
            case 'card': return <CreditCard size={18} />;
            case 'note': return <FileText size={18} />;
            default: return <Globe size={18} />;
        }
    };

    if (isSettingUp) {
        return (
            <div className="flex flex-col items-center justify-center py-10 md:py-20 px-4">
                <div className="bg-[var(--color-card)] p-8 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] border border-white/5 w-full max-w-md shadow-2xl text-center relative overflow-hidden">
                    <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-transparent via-[var(--color-primary)] to-transparent opacity-50" />
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-[var(--color-primary)]/10 rounded-2xl md:rounded-[2.2rem] flex items-center justify-center text-[var(--color-primary)] mx-auto mb-6 md:mb-8">
                        <Shield size={32} />
                    </div>
                    <h1 className="text-xl md:text-2xl font-black text-white mb-2">Initialize Vault</h1>
                    <p className="text-[10px] md:text-sm text-[var(--color-muted-foreground)] mb-8 md:mb-10 font-bold uppercase tracking-widest opacity-60 px-4 leading-relaxed">Create a master passkey to protect your data.</p>
                    <form onSubmit={handleSetup} className="space-y-6">
                        <div className="relative">
                            <input
                                required
                                type="password"
                                className="w-full bg-[var(--color-background)] border border-white/5 rounded-2xl py-4 md:py-5 px-6 text-center text-2xl md:text-3xl tracking-[1rem] text-white focus:outline-none focus:border-[var(--color-primary)] placeholder:tracking-normal placeholder:text-lg transition-all"
                                placeholder="••••"
                                value={passkeyInput}
                                onChange={e => setPasskeyInput(e.target.value)}
                            />
                        </div>
                        <button type="submit" className="w-full bg-white text-black font-black py-4 md:py-5 rounded-2xl hover:bg-[var(--color-primary)] transition-all flex items-center justify-center gap-2 shadow-xl shadow-white/5 active:scale-95 text-xs md:text-sm uppercase tracking-widest">
                            <CheckCircle2 size={18} /> Establish Key
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    if (!isUnlocked) {
        return (
            <div className="flex flex-col items-center justify-center py-10 md:py-24 px-4">
                <div className="bg-[var(--color-card)] p-8 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] border border-white/5 w-full max-w-md shadow-2xl text-center">
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-[var(--color-primary)]/10 rounded-2xl md:rounded-[2.2rem] flex items-center justify-center text-[var(--color-primary)] mx-auto mb-6 md:mb-8 shadow-inner">
                        <KeyRound size={32} />
                    </div>
                    <h1 className="text-xl md:text-2xl font-black text-white mb-2 uppercase tracking-tighter italic">Vault Locked</h1>
                    <p className="text-[10px] md:text-sm text-[var(--color-muted-foreground)] mb-8 md:mb-10 font-bold uppercase tracking-[0.2em] opacity-60">Authentication Required</p>
                    <form onSubmit={handleUnlock} className="space-y-6">
                        <input
                            required
                            type="password"
                            className="w-full bg-[var(--color-background)] border border-white/5 rounded-2xl py-4 md:py-5 px-6 text-center text-2xl md:text-3xl tracking-[1rem] text-white focus:outline-none focus:border-[var(--color-primary)] transition-all"
                            placeholder="••••"
                            value={passkeyInput}
                            onChange={e => setPasskeyInput(e.target.value)}
                            autoFocus
                        />
                        <div className="flex flex-col gap-4">
                            <button type="submit" className="w-full bg-[var(--color-primary)] text-black font-black py-4 md:py-5 rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-lg shadow-orange-500/20 text-xs md:text-sm uppercase tracking-widest">
                                Unlock Workspace
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    if (confirm('Warning: This will clear your local master key. You will need to re-initialize your vault. Continue?')) {
                                        localStorage.removeItem('vault_master_key');
                                        setMasterKey('');
                                        setIsSettingUp(true);
                                    }
                                }}
                                className="text-[var(--color-muted-foreground)] text-[8px] md:text-[9px] font-black hover:text-red-400 transition-colors uppercase tracking-[0.3em] opacity-40 hover:opacity-100"
                            >
                                Reset Master Key
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6 md:gap-8 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <h1 className="text-2xl md:text-[32px] font-black text-white tracking-tighter uppercase italic">Secure Vault</h1>
                    <p className="text-[10px] text-[var(--color-muted-foreground)] font-bold uppercase tracking-[0.3em] mt-1">Zero-Knowledge Encrypted Repository</p>
                </div>
                <div className="flex gap-3 md:gap-4 w-full md:w-auto">
                    <button
                        onClick={() => setIsUnlocked(false)}
                        className="flex-1 md:flex-none bg-white/5 text-white px-5 md:px-6 py-4 rounded-xl md:rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-white/10 transition-colors border border-white/5"
                    >
                        <Lock size={16} className="md:w-[18px] md:h-[18px]" /> Lock
                    </button>
                    <button
                        onClick={() => setShowModal(true)}
                        className="flex-1 md:flex-none bg-[var(--color-primary)] text-black px-6 md:px-8 py-4 rounded-xl md:rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:scale-105 transition-all active:scale-95 shadow-lg shadow-orange-500/20"
                    >
                        <Plus size={18} className="md:w-5 md:h-5" /> Secure Entry
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
                {vault.length > 0 ? vault.map((item) => (
                    <div key={item.id} className="bg-[var(--color-card)] rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8 border border-white/5 group hover:border-[var(--color-primary)]/40 transition-all shadow-sm relative overflow-hidden active:scale-[0.98] duration-300">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-[var(--color-primary)]/5 rounded-full blur-3xl -mr-12 -mt-12 group-hover:bg-[var(--color-primary)]/10 transition-colors" />
                        <div className="flex justify-between items-start mb-6">
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-[var(--color-primary)]/5 flex items-center justify-center text-[var(--color-primary)] group-hover:bg-[var(--color-primary)]/10 transition-colors">
                                {getIcon(item.type)}
                            </div>
                            <span className="text-[8px] md:text-[9px] uppercase font-black text-[var(--color-muted-foreground)] tracking-[2px] bg-white/5 px-3 py-1.5 rounded-full border border-white/5">{item.type}</span>
                        </div>

                        <h3 className="text-lg md:text-2xl font-black text-white mb-1 uppercase tracking-tight italic">{item.title}</h3>
                        {item.url && <p className="text-[10px] md:text-xs text-blue-400 font-black mb-6 truncate opacity-60">{item.url}</p>}

                        <div className="space-y-4 mt-6">
                            {item.username && (
                                <div className="bg-[var(--color-background)]/50 rounded-xl md:rounded-2xl p-4 border border-white/5">
                                    <p className="text-[8px] md:text-[9px] text-[var(--color-muted-foreground)] uppercase font-black mb-1.5 tracking-widest opacity-40">Identity</p>
                                    <p className="text-xs md:text-sm text-white font-black tracking-tight">{item.username}</p>
                                </div>
                            )}
                            <div className="bg-[var(--color-background)]/50 rounded-xl md:rounded-2xl p-4 border border-white/5 flex justify-between items-center group/secret">
                                <div className="flex-1 overflow-hidden">
                                    <p className="text-[8px] md:text-[9px] text-[var(--color-muted-foreground)] uppercase font-black mb-1.5 tracking-widest opacity-40">Credential</p>
                                    <p className="text-sm md:text-base text-white font-mono tracking-widest font-black truncate pr-2">
                                        {showSecret[item.id] ? item.secret : '••••••••••••'}
                                    </p>
                                </div>
                                <button onClick={() => toggleSecret(item.id)} className="w-10 h-10 md:w-11 md:h-11 rounded-lg md:rounded-[1.1rem] bg-white/5 text-[var(--color-muted-foreground)] hover:text-white flex items-center justify-center transition-all hover:scale-105 active:scale-90 shrink-0">
                                    {showSecret[item.id] ? <EyeOff size={16} className="md:w-[18px] md:h-[18px]" /> : <Eye size={16} className="md:w-[18px] md:h-[18px]" />}
                                </button>
                            </div>
                        </div>
                    </div>
                )) : (
                    <div className="col-span-full py-16 md:py-24 text-center bg-[var(--color-card)] rounded-[2.5rem] md:rounded-[3.5rem] border border-dashed border-white/10">
                        <Shield size={48} className="mx-auto mb-6 text-[var(--color-muted-foreground)] opacity-10" />
                        <p className="text-[10px] md:text-sm font-black uppercase tracking-widest text-[var(--color-muted-foreground)] opacity-40 italic">Secure Shield Active: Zero Records</p>
                    </div>
                )}
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-2 md:p-4">
                    <div className="bg-[var(--color-card)] border border-white/5 rounded-3xl md:rounded-[3.5rem] w-full max-w-md overflow-hidden shadow-2xl relative">
                        <div className="p-6 md:p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
                            <h3 className="text-lg md:text-xl font-black text-white uppercase italic tracking-tighter">Secure Protocol Entry</h3>
                            <button onClick={() => setShowModal(false)} className="w-10 h-10 rounded-full flex items-center justify-center text-[var(--color-muted-foreground)] hover:bg-white/5 hover:text-white transition-all"><X size={20} className="md:w-6 md:h-6" /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-4 md:space-y-6">
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-[var(--color-muted-foreground)] mb-2">Service Identity</label>
                                <input required className="w-full bg-[var(--color-background)] border border-white/5 rounded-xl md:rounded-2xl px-5 md:px-6 py-4 md:py-4.5 text-white focus:outline-none focus:border-[var(--color-primary)] font-black text-sm uppercase italic tracking-tight" placeholder="e.g. ProtonMail, Stripe" value={newItem.title} onChange={e => setNewItem({ ...newItem, title: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-[var(--color-muted-foreground)] mb-2">Alias / ID</label>
                                <input className="w-full bg-[var(--color-background)] border border-white/5 rounded-xl md:rounded-2xl px-5 md:px-6 py-4 md:py-4.5 text-white focus:outline-none focus:border-[var(--color-primary)] font-black text-xs md:text-sm" placeholder="Username or Email" value={newItem.username} onChange={e => setNewItem({ ...newItem, username: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-[var(--color-muted-foreground)] mb-2">Encrypted Secret</label>
                                <input required type="password" className="w-full bg-[var(--color-background)] border border-white/5 rounded-xl md:rounded-2xl px-5 md:px-6 py-4 md:py-4.5 text-white focus:outline-none focus:border-[var(--color-primary)] font-black text-lg md:text-xl" placeholder="••••••••" value={newItem.secret} onChange={e => setNewItem({ ...newItem, secret: e.target.value })} />
                            </div>
                            <button type="submit" className="w-full bg-[var(--color-primary)] text-black font-black py-5 md:py-6 rounded-xl md:rounded-2xl hover:scale-[1.02] active:scale-95 transition-all mt-4 shadow-xl shadow-orange-500/20 uppercase tracking-[0.2em] text-[10px] md:text-xs">Seal Secure Record</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
