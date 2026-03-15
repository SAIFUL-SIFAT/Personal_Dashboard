import { useEffect, useState } from 'react';
import { Wallet, TrendingUp, TrendingDown, Plus, Minus, X, DollarSign, CreditCard, Edit2, Trash2, Check, Users } from 'lucide-react';

import { useStore } from '../store/useStore';

export function Finance() {
    const { expenses, fetchExpenses, createExpense, updateExpense, deleteExpense } = useStore();
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [newTransaction, setNewTransaction] = useState({
        amount: '',
        category: 'General',
        note: '',
        type: 'EXPENSE',
        isFamily: false,
        account: 'Cash',
        date: new Date().toISOString().split('T')[0]
    });

    useEffect(() => {
        fetchExpenses();
    }, [fetchExpenses]);

    // PERSONAL CALCULATIONS
    const personalExpenses = expenses.filter(e => !e.isFamily);
    const personalInflow = personalExpenses
        .filter(e => e.type === 'INCOME')
        .reduce((acc, curr) => acc + Number(curr.amount), 0);
    const personalOutflow = personalExpenses
        .filter(e => e.type === 'EXPENSE')
        .reduce((acc, curr) => acc + Number(curr.amount), 0);
    const personalBalance = personalInflow - personalOutflow;

    // FAMILY CALCULATIONS
    const familyExpenses = expenses.filter(e => e.isFamily);
    const familyInflow = familyExpenses
        .filter(e => e.type === 'INCOME')
        .reduce((acc, curr) => acc + Number(curr.amount), 0);
    const familyOutflow = familyExpenses
        .filter(e => e.type === 'EXPENSE')
        .reduce((acc, curr) => acc + Number(curr.amount), 0);
    const familyBalance = familyInflow - familyOutflow;

    // ACCOUNT BREAKDOWN CALCULATIONS
    const getBalanceByAccount = (accountName: string) => {
        const inflow = expenses.filter(e => e.type === 'INCOME' && e.account === accountName).reduce((acc, curr) => acc + Number(curr.amount), 0);
        const outflow = expenses.filter(e => e.type === 'EXPENSE' && e.account === accountName).reduce((acc, curr) => acc + Number(curr.amount), 0);
        return inflow - outflow;
    };

    const cashBalance = getBalanceByAccount('Cash');
    const bankBalance = getBalanceByAccount('Bank');
    const bkashBalance = getBalanceByAccount('bKash');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const payload = {
            ...newTransaction,
            amount: Number(newTransaction.amount)
        };

        if (editingId) {
            await updateExpense(editingId, payload);
        } else {
            await createExpense(payload);
        }

        setShowModal(false);
        setEditingId(null);
        setNewTransaction({
            amount: '',
            category: 'General',
            note: '',
            type: 'EXPENSE',
            isFamily: false,
            account: 'Cash',
            date: new Date().toISOString().split('T')[0]
        });
    };

    const handleEdit = (exp: any) => {
        setEditingId(exp.id);
        setNewTransaction({
            amount: exp.amount.toString(),
            category: exp.category,
            note: exp.note || '',
            type: exp.type || 'EXPENSE',
            isFamily: exp.isFamily || false,
            account: exp.account || 'Cash',
            date: new Date(exp.date).toISOString().split('T')[0]
        });
        setShowModal(true);
    };

    return (
        <div className="flex flex-col gap-5 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h1 className="text-xl md:text-2xl font-black text-white tracking-tighter uppercase italic">Institutional Capital</h1>
                    <p className="text-[10px] text-[var(--color-muted-foreground)] font-bold uppercase tracking-[0.2em] mt-1">Asset Management</p>
                </div>
                <button
                    onClick={() => {
                        setEditingId(null);
                        setNewTransaction({
                            amount: '',
                            category: 'General',
                            note: '',
                            type: 'EXPENSE',
                            isFamily: false,
                            account: 'Cash',
                            date: new Date().toISOString().split('T')[0]
                        });
                        setShowModal(true);
                    }}
                    className="w-full md:w-auto bg-[var(--color-primary)] text-black px-6 md:px-8 py-3 rounded-xl md:rounded-2xl font-black shadow-lg shadow-orange-500/10 hover:scale-105 transition-all active:scale-95 uppercase tracking-widest text-[10px]"
                >
                    Log Transaction
                </button>
            </div>

            {/* Split System Balances */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Personal Balance */}
                <div className="bg-[var(--color-card)] rounded-3xl p-6 md:p-8 border border-white/5 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-48 md:w-64 h-48 md:h-64 bg-[var(--color-primary)]/5 rounded-full blur-[40px] md:blur-[60px] -mr-24 md:-mr-32 -mt-24 md:-mt-32 transition-all group-hover:bg-[var(--color-primary)]/10"></div>
                    <div className="relative z-10 flex flex-col justify-between items-start">
                        <p className="text-[10px] text-[var(--color-muted-foreground)] font-black uppercase tracking-[0.3em] mb-2 flex items-center gap-2">
                            <Wallet size={14} className="opacity-50" /> Personal Liquidity
                        </p>
                        <h2 className={`text-3xl md:text-5xl font-black tracking-tighter italic ${personalBalance >= 0 ? 'text-white' : 'text-red-500'}`}>
                            {personalBalance < 0 ? '-' : ''}৳{Math.abs(personalBalance).toLocaleString()}
                        </h2>
                    </div>
                </div>

                {/* Family Balance */}
                <div className="bg-[var(--color-card)] rounded-3xl p-6 md:p-8 border border-blue-500/10 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-48 md:w-64 h-48 md:h-64 bg-blue-500/5 rounded-full blur-[40px] md:blur-[60px] -mr-24 md:-mr-32 -mt-24 md:-mt-32 transition-all group-hover:bg-blue-500/10"></div>
                    <div className="relative z-10 flex flex-col justify-between items-start">
                        <p className="text-[10px] text-blue-400 font-black uppercase tracking-[0.3em] mb-2 flex items-center gap-2">
                            <Users size={14} className="opacity-50" /> Family Liquidity
                        </p>
                        <h2 className={`text-3xl md:text-5xl font-black tracking-tighter italic ${familyBalance >= 0 ? 'text-blue-400' : 'text-red-500'}`}>
                            {familyBalance < 0 ? '-' : ''}৳{Math.abs(familyBalance).toLocaleString()}
                        </h2>
                    </div>
                </div>
            </div>

            {/* ACCOUNT BALANCES */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
                <div className="flex flex-col p-5 md:p-6 bg-[var(--color-card)] rounded-3xl border border-white/5 relative overflow-hidden group">
                    <p className="text-[9px] text-[var(--color-muted-foreground)] font-black uppercase tracking-widest mb-1.5 flex items-center gap-1.5"><Wallet size={12} className="opacity-50" /> Cash Vault</p>
                    <h2 className={`text-xl md:text-2xl font-black tracking-tighter ${cashBalance >= 0 ? 'text-white' : 'text-red-500'}`}>
                        {cashBalance < 0 ? '-' : ''}৳{Math.abs(cashBalance).toLocaleString()}
                    </h2>
                    <Wallet size={32} className="absolute right-[-2px] bottom-[-2px] opacity-[0.03] text-white md:w-16 md:h-16" />
                </div>
                <div className="flex flex-col p-5 md:p-6 bg-[var(--color-card)] rounded-3xl border border-blue-500/10 relative overflow-hidden group">
                    <p className="text-[9px] text-[var(--color-muted-foreground)] font-black uppercase tracking-widest mb-1.5 flex items-center gap-1.5"><CreditCard size={12} className="opacity-50 text-blue-400" /> Bank Interlink</p>
                    <h2 className={`text-xl md:text-2xl font-black tracking-tighter ${bankBalance >= 0 ? 'text-blue-400' : 'text-red-500'}`}>
                        {bankBalance < 0 ? '-' : ''}৳{Math.abs(bankBalance).toLocaleString()}
                    </h2>
                    <CreditCard size={32} className="absolute right-[-2px] bottom-[-2px] opacity-[0.03] text-blue-500 md:w-16 md:h-16" />
                </div>
                <div className="flex flex-col p-5 md:p-6 bg-[var(--color-card)] rounded-3xl border border-pink-500/10 relative overflow-hidden group">
                    <p className="text-[9px] text-[var(--color-muted-foreground)] font-black uppercase tracking-widest mb-1.5 flex items-center gap-1.5"><DollarSign size={12} className="opacity-50 text-pink-500" /> bKash Matrix</p>
                    <h2 className={`text-xl md:text-2xl font-black tracking-tighter ${bkashBalance >= 0 ? 'text-pink-500' : 'text-red-500'}`}>
                        {bkashBalance < 0 ? '-' : ''}৳{Math.abs(bkashBalance).toLocaleString()}
                    </h2>
                    <DollarSign size={32} className="absolute right-[-2px] bottom-[-2px] opacity-[0.03] text-pink-500 md:w-16 md:h-16" />
                </div>
            </div>

            {/* PERSONAL SECTION */}
            <div className="space-y-4">
                <div className="flex items-center gap-3 px-2">
                    <div className="w-8 h-8 rounded-xl bg-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-primary)]">
                        <Wallet size={16} />
                    </div>
                    <h3 className="text-md md:text-lg font-black text-white uppercase italic tracking-tighter">Personal Treasury</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                    <div className="bg-[var(--color-card)] rounded-3xl p-5 border border-white/5 relative overflow-hidden group">
                        <p className="text-[9px] text-[var(--color-muted-foreground)] font-black uppercase tracking-widest mb-1">Personal Inflow</p>
                        <h2 className="text-xl md:text-2xl font-black text-emerald-500 tracking-tighter">৳{personalInflow.toLocaleString()}</h2>
                        <TrendingUp size={32} className="absolute right-[-2px] bottom-[-2px] opacity-[0.03] text-emerald-500 md:w-16 md:h-16" />
                    </div>
                    <div className="bg-[var(--color-card)] rounded-3xl p-5 border border-white/5 relative overflow-hidden group">
                        <p className="text-[9px] text-[var(--color-muted-foreground)] font-black uppercase tracking-widest mb-1">Personal Outflow</p>
                        <h2 className="text-xl md:text-2xl font-black text-red-500 tracking-tighter">৳{personalOutflow.toLocaleString()}</h2>
                        <TrendingDown size={32} className="absolute right-[-2px] bottom-[-2px] opacity-[0.03] text-red-500 md:w-16 md:h-16" />
                    </div>
                    <div className="bg-[var(--color-card)] rounded-3xl p-5 border border-white/5 relative overflow-hidden group sm:col-span-2 md:col-span-1">
                        <p className="text-[9px] text-[var(--color-muted-foreground)] font-black uppercase tracking-widest mb-1">Treasury Status</p>
                        <h2 className="text-xl md:text-2xl font-black text-white tracking-tighter">
                            {personalBalance >= 0 ? 'Liquid' : 'Deficit'}
                        </h2>
                        <Wallet size={32} className="absolute right-[-2px] bottom-[-2px] opacity-[0.03] text-white md:w-16 md:h-16" />
                    </div>
                </div>

                <div className="bg-[var(--color-card)] rounded-3xl border border-white/5 overflow-hidden shadow-sm">
                    <div className="p-4 md:p-5 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
                        <h3 className="text-[10px] md:text-xs font-black text-white tracking-widest uppercase italic">Journal of Personal Expenditures</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left min-w-[500px] md:min-w-0">
                            <thead className="bg-white/[0.02]">
                                <tr className="text-[var(--color-muted-foreground)] text-[9px] uppercase tracking-[0.2em] font-black">
                                    <th className="px-4 py-3">Identity</th>
                                    <th className="px-4 py-3 hidden sm:table-cell">Details</th>
                                    <th className="px-4 py-3">Timeline</th>
                                    <th className="px-4 py-3 text-right">Valuation</th>
                                    <th className="px-4 py-3 text-right">Ops</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {personalExpenses.length > 0 ? personalExpenses.map((exp) => (
                                    <tr key={exp.id} className="group hover:bg-white/[0.02] transition-colors">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${exp.type === 'INCOME' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                                                    {exp.type === 'INCOME' ? <Plus size={14} /> : <Minus size={14} />}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-black text-white text-sm md:text-md tracking-tight group-hover:text-[var(--color-primary)] transition-colors uppercase italic line-clamp-1">{exp.note || 'Internal Transaction'}</span>
                                                    <span className="sm:hidden text-[7px] font-black text-white/40 uppercase tracking-widest">{exp.category} &bull; {exp.account}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 hidden sm:table-cell">
                                            <div className="flex items-center gap-1.5">
                                                <span className="px-2 py-0.5 bg-white/5 rounded-md text-[8px] font-black text-[var(--color-muted-foreground)] uppercase tracking-widest border border-white/5">{exp.category}</span>
                                                <span className="px-2 py-0.5 bg-[var(--color-primary)]/10 rounded-md text-[8px] font-black text-[var(--color-primary)] uppercase tracking-widest border border-[var(--color-primary)]/10">{exp.account || 'Cash'}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-[9px] font-black text-[var(--color-muted-foreground)] uppercase tracking-widest opacity-50">
                                            {new Date(exp.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </td>
                                        <td className={`px-4 py-3 text-right font-black text-md md:text-lg tracking-tighter ${exp.type === 'INCOME' ? 'text-emerald-500' : 'text-white'}`}>
                                            {exp.type === 'INCOME' ? '+' : '-'}৳{Number(exp.amount).toLocaleString()}
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex items-center justify-end gap-1.5 md:opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => handleEdit(exp)} className="p-2 rounded-lg bg-white/5 text-white hover:bg-[var(--color-primary)] hover:text-black transition-all"><Edit2 size={12} /></button>
                                                <button onClick={() => deleteExpense(exp.id)} className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all"><Trash2 size={12} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={5} className="px-8 py-12 text-center text-[var(--color-muted-foreground)] uppercase font-black text-[10px] tracking-widest opacity-20">Secure Record Empty</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* FAMILY SECTION */}
            <div className="space-y-4">
                <div className="flex items-center gap-3 px-2">
                    <div className="w-8 h-8 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                        <Users size={16} />
                    </div>
                    <h3 className="text-md md:text-lg font-black text-white uppercase italic tracking-tighter">Family Equity</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                    <div className="bg-[var(--color-card)] rounded-3xl p-5 border border-blue-500/10 relative overflow-hidden group">
                        <p className="text-[9px] text-blue-400 font-black uppercase tracking-widest mb-1">Family Inflow</p>
                        <h2 className="text-xl md:text-2xl font-black text-blue-400 tracking-tighter">৳{familyInflow.toLocaleString()}</h2>
                        <Plus size={32} className="absolute right-[-2px] bottom-[-2px] opacity-[0.03] text-blue-400 md:w-12 md:h-12" />
                    </div>
                    <div className="bg-[var(--color-card)] rounded-3xl p-5 border border-blue-500/10 relative overflow-hidden group">
                        <p className="text-[9px] text-blue-400 font-black uppercase tracking-widest mb-1">Family Outflow</p>
                        <h2 className="text-xl md:text-2xl font-black text-red-500 tracking-tighter">৳{familyOutflow.toLocaleString()}</h2>
                        <Minus size={32} className="absolute right-[-2px] bottom-[-2px] opacity-[0.03] text-red-500 md:w-12 md:h-12" />
                    </div>
                    <div className="bg-[var(--color-card)] rounded-3xl p-5 border border-blue-500/10 relative overflow-hidden group sm:col-span-2 md:col-span-1">
                        <p className="text-[9px] text-blue-400 font-black uppercase tracking-widest mb-1">Ledger Balance</p>
                        <h2 className={`text-xl md:text-2xl font-black tracking-tighter ${familyBalance >= 0 ? 'text-white' : 'text-red-500'}`}>
                            {familyBalance < 0 ? '-' : ''}৳{Math.abs(familyBalance).toLocaleString()}
                        </h2>
                        <Users size={32} className="absolute right-[-2px] bottom-[-2px] opacity-[0.03] text-blue-500 md:w-12 md:h-12" />
                    </div>
                </div>

                <div className="bg-[var(--color-card)] rounded-3xl border border-blue-500/20 overflow-hidden shadow-2xl shadow-blue-500/5">
                    <div className="p-4 md:p-5 border-b border-white/5 flex justify-between items-center bg-blue-500/[0.02]">
                        <h3 className="text-[10px] md:text-xs font-black text-white tracking-widest uppercase italic">Family Ledger Records</h3>
                        <span className="hidden xs:inline text-[8px] font-black text-blue-500 uppercase tracking-[0.2em] bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">Authorized</span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left min-w-[500px] md:min-w-0">
                            <thead className="bg-blue-500/[0.02]">
                                <tr className="text-[var(--color-muted-foreground)] text-[9px] uppercase tracking-[0.2em] font-black">
                                    <th className="px-4 py-3">Reference</th>
                                    <th className="px-4 py-3 hidden sm:table-cell">Details</th>
                                    <th className="px-4 py-3">Timeline</th>
                                    <th className="px-4 py-3 text-right">Valuation</th>
                                    <th className="px-4 py-3 text-right">Ops</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {familyExpenses.length > 0 ? familyExpenses.map((exp) => (
                                    <tr key={exp.id} className="group hover:bg-blue-500/[0.01] transition-colors">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0">
                                                    <CreditCard size={14} />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-black text-white text-sm md:text-md tracking-tight group-hover:text-blue-400 transition-colors uppercase italic line-clamp-1">{exp.note || 'Consumables'}</span>
                                                    <span className="sm:hidden text-[7px] font-black text-blue-400/40 uppercase tracking-widest">{exp.category} &bull; {exp.account}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 hidden sm:table-cell">
                                            <div className="flex items-center gap-1.5">
                                                <span className="px-2 py-0.5 bg-white/5 rounded-md text-[8px] font-black text-blue-400 uppercase tracking-widest border border-blue-500/10">{exp.category}</span>
                                                <span className="px-2 py-0.5 bg-blue-500/10 rounded-md text-[8px] font-black text-blue-400 uppercase tracking-widest border border-blue-500/20">{exp.account || 'Cash'}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="text-[9px] font-black text-[var(--color-muted-foreground)] uppercase tracking-widest opacity-50">
                                                {new Date(exp.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </span>
                                        </td>
                                        <td className={`px-4 py-3 text-right font-black text-md md:text-lg tracking-tighter ${exp.type === 'INCOME' ? 'text-blue-400' : 'text-white'}`}>
                                            {exp.type === 'INCOME' ? '+' : '-'}৳{Number(exp.amount).toLocaleString()}
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex items-center justify-end gap-1.5 md:opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => handleEdit(exp)} className="p-2 rounded-lg bg-white/5 text-white hover:bg-blue-500 transition-all"><Edit2 size={12} /></button>
                                                <button onClick={() => deleteExpense(exp.id)} className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all"><Trash2 size={12} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={5} className="px-8 py-12 text-center text-[var(--color-muted-foreground)] uppercase font-black text-[10px] tracking-widest opacity-20">Shared Ledger Dormant</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-2 md:p-4">
                    <div className="bg-[var(--color-card)] border border-white/5 rounded-3xl md:rounded-[3rem] w-full max-w-md overflow-hidden shadow-2xl relative">
                        <div className="p-6 md:p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
                            <h3 className="text-lg md:text-xl font-black text-white italic uppercase tracking-tighter">{editingId ? 'Modify Record' : 'Create Record'}</h3>
                            <button onClick={() => setShowModal(false)} className="text-[var(--color-muted-foreground)] hover:text-white transition-colors"><X size={20} className="md:w-6 md:h-6" /></button>
                        </div>

                        <div className="flex border-b border-white/5 p-1.5 md:p-2 gap-1.5 md:gap-2 bg-white/[0.02]">
                            <button
                                onClick={() => setNewTransaction({ ...newTransaction, type: 'EXPENSE' })}
                                className={`flex-1 py-3 md:py-4 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] rounded-xl md:rounded-2xl transition-all ${newTransaction.type === 'EXPENSE' ? 'text-red-500 bg-red-500/10' : 'text-[var(--color-muted-foreground)]'}`}
                            >
                                Debit
                            </button>
                            <button
                                onClick={() => setNewTransaction({ ...newTransaction, type: 'INCOME' })}
                                className={`flex-1 py-3 md:py-4 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] rounded-xl md:rounded-2xl transition-all ${newTransaction.type === 'INCOME' ? 'text-emerald-500 bg-emerald-500/10' : 'text-[var(--color-muted-foreground)]'}`}
                            >
                                Credit
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-5 md:p-6 space-y-4">
                            <div>
                                <label className="block text-[9px] font-black text-[var(--color-muted-foreground)] uppercase tracking-widest mb-1.5">Valuation (USD)</label>
                                <div className="relative">
                                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted-foreground)] w-4 h-4" />
                                    <input required type="number" step="0.01" className="w-full bg-[var(--color-background)] border border-white/5 rounded-2xl py-3 pl-9 pr-4 text-white font-black text-xl md:text-2xl focus:outline-none focus:border-[var(--color-primary)] transition-colors" placeholder="0.00" value={newTransaction.amount} onChange={e => setNewTransaction({ ...newTransaction, amount: e.target.value })} />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-[9px] font-black text-[var(--color-muted-foreground)] uppercase tracking-widest mb-1.5">Account</label>
                                    <select className="w-full bg-[var(--color-background)] border border-white/5 rounded-2xl py-3 px-4 text-[10px] md:text-xs font-black text-white focus:outline-none focus:border-[var(--color-primary)] transition-colors appearance-none uppercase" value={newTransaction.account} onChange={e => setNewTransaction({ ...newTransaction, account: e.target.value })}>
                                        <option>Cash</option>
                                        <option>Bank</option>
                                        <option>bKash</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[9px] font-black text-[var(--color-muted-foreground)] uppercase tracking-widest mb-1.5">Sector</label>
                                    <select className="w-full bg-[var(--color-background)] border border-white/5 rounded-2xl py-3 px-4 text-[10px] md:text-xs font-black text-white focus:outline-none focus:border-[var(--color-primary)] transition-colors appearance-none uppercase" value={newTransaction.category} onChange={e => setNewTransaction({ ...newTransaction, category: e.target.value })}>
                                        <option>General</option>
                                        <option>Food</option>
                                        <option>Transport</option>
                                        <option>Bills</option>
                                        <option>Leisure</option>
                                        <option>Salary</option>
                                        <option>Invest</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-[9px] font-black text-[var(--color-muted-foreground)] uppercase tracking-widest mb-1.5">Timeline</label>
                                <input type="date" className="w-full bg-[var(--color-background)] border border-white/5 rounded-2xl py-3 px-4 text-[10px] md:text-xs font-black text-white focus:outline-none focus:border-[var(--color-primary)] transition-colors uppercase" value={newTransaction.date} onChange={e => setNewTransaction({ ...newTransaction, date: e.target.value })} />
                            </div>

                            <div>
                                <label className="block text-[9px] font-black text-[var(--color-muted-foreground)] uppercase tracking-widest mb-1.5">Reference Note</label>
                                <input className="w-full bg-[var(--color-background)] border border-white/5 rounded-2xl py-3 px-4 text-xs font-black text-white italic uppercase tracking-tight focus:outline-none focus:border-[var(--color-primary)] transition-colors" placeholder="Identification tag..." value={newTransaction.note} onChange={e => setNewTransaction({ ...newTransaction, note: e.target.value })} />
                            </div>

                            <label className="flex items-center gap-3 cursor-pointer group bg-blue-500/5 p-4 rounded-2xl border border-blue-500/10 hover:bg-blue-500/10 transition-all">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all shrink-0 ${newTransaction.isFamily ? 'bg-blue-500 text-white' : 'bg-white/5 text-[var(--color-muted-foreground)]'}`}>
                                    {newTransaction.isFamily ? <Check size={18} /> : <Minus size={18} />}
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs font-black text-white uppercase italic tracking-tight leading-none mb-1">Family Protocol</p>
                                    <p className="text-[9px] text-[var(--color-muted-foreground)] uppercase font-black tracking-widest leading-none">Shared Ledger</p>
                                </div>
                                <input type="checkbox" className="hidden" checked={newTransaction.isFamily} onChange={e => setNewTransaction({ ...newTransaction, isFamily: e.target.checked })} />
                            </label>

                            <button type="submit" className="w-full bg-[var(--color-primary)] text-black font-black uppercase tracking-[0.2em] py-4 rounded-2xl hover:scale-[1.02] active:scale-95 transition-all mt-2 shadow-xl shadow-orange-500/10 text-[10px] md:text-xs">
                                {editingId ? 'Re-Authorize Record' : 'Confirm Transaction'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
