import { useState } from 'react';
import { Zap, Mail, Lock, User as UserIcon, ArrowRight } from 'lucide-react';
import { useStore } from '../store/useStore';

export function Auth() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const { setUser } = useStore();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const endpoint = isLogin ? '/auth/login' : '/auth/signup';
        const body = isLogin ? { email, password } : { email, password, name };

        try {
            const resp = await fetch(`http://localhost:3000${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            const data = await resp.json();
            if (resp.ok) {
                setUser(isLogin ? data.user : { name, email });
                if (isLogin) localStorage.setItem('token', data.access_token);
            } else {
                alert(data.message || 'Something went wrong');
            }
        } catch (err) {
            console.error(err);
            alert('Failed to connect to backend');
        }
    };

    return (
        <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[var(--color-primary)]/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px]" />

            <div className="w-full max-w-[420px] z-10">
                <div className="bg-[var(--color-card)] border border-[#2a2a32] rounded-[2.5rem] p-10 shadow-2xl">
                    <div className="flex flex-col items-center mb-10">
                        <div className="w-16 h-16 bg-gradient-to-tr from-[var(--color-primary)] to-orange-400 rounded-2xl flex items-center justify-center text-black mb-6 shadow-xl shadow-orange-500/20">
                            <Zap size={32} fill="currentColor" />
                        </div>
                        <h1 className="text-3xl font-bold text-white tracking-tight">{isLogin ? 'Welcome back' : 'Start your journey'}</h1>
                        <p className="text-[var(--color-muted-foreground)] mt-2">{isLogin ? 'Enter your details to sign in' : 'Create an account to get started'}</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {!isLogin && (
                            <div className="relative">
                                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-muted-foreground)] w-5 h-5" />
                                <input required className="w-full bg-[var(--color-background)] border border-[#2a2a32] rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-[var(--color-primary)] transition-colors" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} />
                            </div>
                        )}
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-muted-foreground)] w-5 h-5" />
                            <input required type="email" className="w-full bg-[var(--color-background)] border border-[#2a2a32] rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-[var(--color-primary)] transition-colors" placeholder="Email Address" value={email} onChange={e => setEmail(e.target.value)} />
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-muted-foreground)] w-5 h-5" />
                            <input required type="password" className="w-full bg-[var(--color-background)] border border-[#2a2a32] rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-[var(--color-primary)] transition-colors" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
                        </div>

                        <button type="submit" className="w-full bg-[var(--color-primary)] text-black font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all mt-6 shadow-lg shadow-orange-500/20">
                            {isLogin ? 'Sign In' : 'Sign Up'} <ArrowRight size={20} />
                        </button>
                    </form>

                    <div className="mt-10 pt-10 border-t border-[#2a2a32] text-center">
                        <p className="text-[var(--color-muted-foreground)] text-sm">
                            {isLogin ? "Don't have an account?" : "Already have an account?"}
                            <button onClick={() => setIsLogin(!isLogin)} className="text-[var(--color-primary)] font-bold ml-2 hover:underline decoration-2 underline-offset-4 decoration-[var(--color-primary)]/40">
                                {isLogin ? 'Sign up for free' : 'Sign in here'}
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
