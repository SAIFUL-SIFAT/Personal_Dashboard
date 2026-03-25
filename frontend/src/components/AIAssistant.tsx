import { useState, useRef, useEffect } from 'react';
import { Bot, Send, X } from 'lucide-react';
import { useStore } from '../store/useStore';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export function AIAssistant() {
    const { aiChat } = useStore();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([
        { role: 'assistant', content: "Neural Link Established. System status: Operational. How can I assist with your strategy today?" }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMsg = input;
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setIsLoading(true);

        const response = await aiChat(userMsg);
        setMessages(prev => [...prev, { role: 'assistant', content: response }]);
        setIsLoading(false);
    };

    return (
        <div className="fixed bottom-6 right-6 z-[60]">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="absolute bottom-20 right-0 w-[350px] md:w-[400px] h-[500px] bg-[var(--color-card)] border border-white/10 rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden backdrop-blur-xl"
                    >
                        {/* Chat Header */}
                        <div className="p-6 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-2xl bg-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-primary)]">
                                    <Bot size={22} />
                                </div>
                                <div>
                                    <h3 className="text-sm font-black text-white uppercase tracking-widest italic">Neural Command</h3>
                                    <div className="flex items-center gap-1.5 mt-0.5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                        <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">Core Active</span>
                                    </div>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="text-[var(--color-muted-foreground)] hover:text-white transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Chat Messages */}
                        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
                            {messages.map((msg, i) => (
                                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[85%] p-4 rounded-2xl text-[13px] leading-relaxed tracking-tight shadow-sm overflow-hidden ${msg.role === 'user'
                                        ? 'bg-[var(--color-primary)] text-black rounded-tr-none font-bold'
                                        : 'bg-white/5 text-[var(--color-card-foreground)] rounded-tl-none border border-white/5'
                                        }`}>
                                        {msg.role === 'assistant' ? (
                                            <div className="max-w-none [&>p]:mb-3 [&>p:last-child]:mb-0 [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:mb-3 [&>ul:last-child]:mb-0 [&>ol]:list-decimal [&>ol]:pl-5 [&>ol]:mb-3 [&>ol:last-child]:mb-0 [&>ul>li]:mb-1 [&>ol>li]:mb-1 [&_strong]:text-white [&_strong]:font-black [&_em]:italic [&_code]:bg-white/10 [&_code]:rounded [&_code]:px-1.5 [&_code]:py-0.5 [&_h1]:text-lg [&_h1]:font-black [&_h1]:mb-3 [&_h2]:text-base [&_h2]:font-black [&_h2]:mb-2 [&_h3]:text-sm [&_h3]:font-black [&_h3]:mb-2 [&_a]:text-[var(--color-primary)] [&_a]:underline">
                                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                                    {msg.content}
                                                </ReactMarkdown>
                                            </div>
                                        ) : (
                                            msg.content
                                        )}
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="bg-white/5 p-4 rounded-2xl rounded-tl-none border border-white/5 flex gap-1">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] animate-bounce" style={{ animationDelay: '0s' }} />
                                        <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] animate-bounce" style={{ animationDelay: '0.2s' }} />
                                        <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] animate-bounce" style={{ animationDelay: '0.4s' }} />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Chat Input */}
                        <form onSubmit={handleSend} className="p-6 border-t border-white/5 bg-white/[0.01]">
                            <div className="relative">
                                <input
                                    value={input}
                                    onChange={e => setInput(e.target.value)}
                                    placeholder="Enter Protocol Command..."
                                    className="w-full bg-[var(--color-background)] border border-white/5 rounded-2xl py-4 pl-6 pr-14 text-xs font-black text-white focus:outline-none focus:border-[var(--color-primary)] transition-all uppercase tracking-widest"
                                />
                                <button
                                    type="submit"
                                    className="absolute right-2 top-2 w-10 h-10 rounded-xl bg-[var(--color-primary)] text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg shadow-orange-500/20"
                                >
                                    <Send size={16} />
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-14 h-14 md:w-16 md:h-16 rounded-[1.5rem] md:rounded-[2rem] flex items-center justify-center shadow-2xl transition-all hover:scale-110 active:scale-90 relative ${isOpen ? 'bg-white/5 text-white border border-white/10' : 'bg-[var(--color-primary)] text-black'
                    }`}
            >
                {isOpen ? <X size={24} /> : (
                    <>
                        <Bot size={28} />
                        <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-[var(--color-background)]"
                        />
                    </>
                )}
            </button>
        </div>
    );
}
