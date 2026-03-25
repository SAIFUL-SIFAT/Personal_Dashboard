import { motion } from 'framer-motion';
import { MoreHorizontal, Clock, BookOpen, Plus, Zap } from 'lucide-react';

export function ProgressCard({ title, subtitle, progress, icon: Icon, bg, color }: any) {
    return (
        <div className="bg-[var(--color-card)] rounded-3xl p-[22px] border border-[var(--color-border)] hover:border-[#383842] transition-all group flex flex-col shadow-sm h-full cursor-pointer">
            <div className="flex justify-between items-start mb-6">
                <div className={`w-[48px] h-[48px] rounded-2xl bg-gradient-to-br ${bg} flex items-center justify-center ${color} shadow-inner`}>
                    <Icon className="w-6 h-6" strokeWidth={2} />
                </div>
                <button className="text-[#555] group-hover:text-white transition-colors cursor-pointer p-1">
                    <MoreHorizontal className="w-[18px] h-[18px]" />
                </button>
            </div>

            <div className="mt-auto">
                <h3 className="font-medium text-[15px] mb-1 text-white leading-tight">{title}</h3>
                <p className="text-[var(--color-muted-foreground)] text-[13px] mb-6 line-clamp-1">{subtitle}</p>

                <div className="flex items-center justify-between text-[13px] mb-[10px]">
                    <span className="text-[var(--color-muted-foreground)]">Progress</span>
                    <span className="font-medium text-white">{progress}%</span>
                </div>
                <div className="h-[6px] w-full bg-[#111114] rounded-full overflow-hidden border border-[var(--color-border)]">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className={`h-full bg-white rounded-full relative overflow-hidden`}
                    />
                </div>
            </div>
        </div>
    );
}

export function TaskCard({ tags, title, price, description, duration, items, action, onAction, isPrimary }: any) {
    return (
        <div className="bg-[var(--color-card)] rounded-[2rem] p-6 border border-[var(--color-border)] hover:border-[#383842] transition-colors group cursor-pointer">
            <div className="flex gap-2 mb-4">
                {tags.map((tag: string, i: number) => (
                    <span key={i} className={`text-[11px] px-[12px] py-[3px] rounded-full font-semibold tracking-wide ${isPrimary && i === 0 ? 'bg-[var(--color-primary)] text-black' : 'bg-[#111114] text-[var(--color-muted-foreground)] border border-[var(--color-border)]'
                        }`}>
                        {tag}
                    </span>
                ))}
            </div>

            <div className="flex justify-between items-start mb-2 gap-4">
                <h3 className="font-medium text-[18px] text-white leading-snug tracking-tight">{title}</h3>
                <span className="font-medium text-white mt-1 text-[15px] whitespace-nowrap">{price}</span>
            </div>

            <p className="text-[var(--color-muted-foreground)] text-[13px] mb-6 leading-[1.6] line-clamp-2 pr-4">
                {description}
            </p>

            <div className="flex items-center justify-between mt-auto">
                <div className="flex gap-4 text-[12px] text-[var(--color-muted-foreground)] font-medium">
                    {duration && <span className="flex items-center gap-[6px]"><Clock className="w-[14px] h-[14px]" />{duration}</span>}
                    {items && <span className="flex items-center gap-[6px]"><BookOpen className="w-[14px] h-[14px]" />{items}</span>}
                </div>
                <button
                    onClick={(e) => { e.stopPropagation(); onAction?.(); }}
                    className="bg-[var(--color-primary)] hover:bg-[#e67e00] text-black text-[14px] font-semibold px-6 py-2 rounded-full transition-transform active:scale-95 duration-200">
                    {action}
                </button>
            </div>
        </div>
    );
}


export function MediaCard({ title, subtitle, img }: any) {
    return (
        <div className="bg-[var(--color-card)] rounded-[2rem] p-[10px] pl-[10px] pr-5 border border-[var(--color-border)] hover:border-[#383842] transition-all group flex gap-5 items-center cursor-pointer relative overflow-hidden h-[120px]">
            <div className="w-[140px] h-full shrink-0 rounded-[1.25rem] overflow-hidden relative shadow-md">
                <img src={img} alt={title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Plus className="text-white w-6 h-6" />
                </div>
            </div>
            <div className="py-2">
                <h3 className="font-medium text-[16px] leading-tight mb-2 text-white line-clamp-2">{title}</h3>
                <div className="flex items-center gap-[6px] text-[var(--color-muted-foreground)] text-[13px] font-medium">
                    <Zap className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                    {subtitle}
                </div>
            </div>
        </div>
    );
}
