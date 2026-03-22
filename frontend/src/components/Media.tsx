import { useEffect, useState } from 'react';
import { PlayCircle, Plus, X, Film, Tv, Music, Star, Layers, Trash2 } from 'lucide-react';

import { useStore } from '../store/useStore';

export function Media() {
    const { media, fetchMedia, createMedia, deleteMedia, searchQuery } = useStore();

    const [showModal, setShowModal] = useState(false);
    const [activeFilter, setActiveFilter] = useState('all');
    const [newItem, setNewItem] = useState({
        title: '',
        type: 'movie',
        status: 'watching',
        rating: 0,
        season: 1,
        episode: 1,
        imageUrl: ''
    });

    useEffect(() => {
        fetchMedia(activeFilter === 'all' ? undefined : activeFilter);
    }, [fetchMedia, activeFilter]);

    const q = searchQuery.toLowerCase();
    const filteredMedia = q
        ? media.filter(m =>
            (m.title || '').toLowerCase().includes(q) ||
            (m.type || '').toLowerCase().includes(q) ||
            (m.status || '').toLowerCase().includes(q)
        )
        : media;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await createMedia(newItem);
        setShowModal(false);
        setNewItem({
            title: '',
            type: 'movie',
            status: 'watching',
            rating: 0,
            season: 1,
            episode: 1,
            imageUrl: ''
        });
    };

    const getIcon = (type: string, size = 18) => {
        switch (type.toLowerCase()) {
            case 'movie': return <Film size={size} />;
            case 'anime': return <Tv size={size} />;
            case 'series': return <Layers size={size} />;
            case 'music': return <Music size={size} />;
            default: return <PlayCircle size={size} />;
        }
    };

    return (
        <div className="flex flex-col gap-6 md:gap-8 pb-20">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <h1 className="text-2xl md:text-[32px] font-black text-white tracking-tighter uppercase italic">Media Repository</h1>
                    <p className="text-[10px] text-[var(--color-muted-foreground)] font-bold uppercase tracking-[0.3em] mt-1">Movies, Anime, Music & Series Collection</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="w-full md:w-auto bg-[var(--color-primary)] text-black px-8 py-4 rounded-xl md:rounded-2xl font-black flex items-center justify-center gap-2 hover:scale-105 transition-all active:scale-95 shadow-lg shadow-orange-500/20 uppercase tracking-widest text-xs"
                >
                    <Plus size={18} /> Catalog Item
                </button>
            </div>

            <div className="flex gap-2 p-1 bg-[var(--color-card)] rounded-2xl w-full md:w-fit border border-white/5 overflow-x-auto no-scrollbar">
                {['all', 'movie', 'series', 'anime', 'music'].map((filter) => (
                    <button
                        key={filter}
                        onClick={() => setActiveFilter(filter)}
                        className={`flex-1 md:flex-none px-4 md:px-6 py-2.5 rounded-xl text-[10px] md:text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeFilter === filter ? 'bg-[var(--color-background)] text-[var(--color-primary)] shadow-sm' : 'text-[var(--color-muted-foreground)] hover:text-white'}`}
                    >
                        {filter}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 md:gap-8">
                {filteredMedia.length > 0 ? filteredMedia.map((item) => (
                    <div key={item.id} className="bg-[var(--color-card)] rounded-[2rem] md:rounded-[2.5rem] border border-white/5 overflow-hidden group hover:border-[var(--color-primary)]/30 transition-all duration-500 shadow-sm flex flex-col">
                        <div className="aspect-video relative overflow-hidden bg-[var(--color-background)]">
                            {item.imageUrl ? (
                                <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-white/5 to-white/0 group-hover:from-[var(--color-primary)]/5 transition-all duration-500">
                                    {(item.type === 'series' || item.type === 'anime') ? (
                                        <div className="flex items-baseline gap-1 opacity-20 group-hover:opacity-50 transition-all">
                                            <span className="text-4xl md:text-5xl font-black text-white tracking-tighter">S{item.season}</span>
                                            <span className="text-xl md:text-2xl font-black text-[var(--color-primary)] tracking-tighter">E{item.episode}</span>
                                        </div>
                                    ) : (
                                        <div className="text-[var(--color-primary)] opacity-20 group-hover:opacity-40 transition-opacity">
                                            {getIcon(item.type, 48)}
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="absolute top-4 left-4 bg-black/40 backdrop-blur-xl p-2 rounded-xl text-[var(--color-primary)] border border-white/5">
                                {getIcon(item.type, 14)}
                            </div>

                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    deleteMedia(item.id);
                                }}
                                className="absolute top-4 right-4 bg-red-500/20 backdrop-blur-xl p-2 rounded-xl text-red-500 border border-red-500/20 md:opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white"
                            >
                                <Trash2 size={14} />
                            </button>

                            {item.rating > 0 && (
                                <div className="absolute bottom-4 right-4 bg-black/40 backdrop-blur-xl px-2.5 py-1 rounded-lg md:rounded-xl text-yellow-500 border border-white/5 flex items-center gap-1.5 shadow-2xl">
                                    <Star size={10} fill="currentColor" />
                                    <span className="text-[9px] md:text-[10px] font-black">{item.rating}</span>
                                </div>
                            )}
                        </div>

                        <div className="p-5 md:p-6 flex flex-col flex-1 gap-4">
                            <div className="flex-1">
                                <h3 className="font-black text-white text-md md:text-lg leading-tight group-hover:text-[var(--color-primary)] transition-colors line-clamp-1 mb-1 italic tracking-tight">{item.title}</h3>
                                <p className="text-[9px] font-bold text-[var(--color-muted-foreground)] uppercase tracking-[0.2em]">{item.type}</p>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                <div className={`px-3 md:px-4 py-1.5 rounded-full text-[8px] md:text-[9px] font-black uppercase tracking-widest ${item.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400' :
                                    item.status === 'watching' ? 'bg-blue-500/10 text-blue-400' :
                                        'bg-white/5 text-[var(--color-muted-foreground)]'
                                    }`}>
                                    {item.status}
                                </div>

                                {(item.type === 'series' || item.type === 'anime') && item.status === 'watching' && (
                                    <div className="flex items-center gap-2 bg-white/5 px-2.5 py-1.5 rounded-xl border border-white/5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                                        <span className="text-[9px] font-black text-white">S{item.season} E{item.episode}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )) : (
                    <div className="col-span-full py-16 md:py-24 text-center bg-[var(--color-card)] rounded-[2rem] md:rounded-[3rem] border border-dashed border-white/10">
                        <PlayCircle size={48} className="mx-auto mb-4 text-[var(--color-muted-foreground)] opacity-20" />
                        <p className="text-[10px] md:text-sm font-black uppercase tracking-widest text-[var(--color-muted-foreground)]">Repository Empty</p>
                    </div>
                )}
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-2 md:p-4">
                    <div className="bg-[var(--color-card)] border border-white/5 rounded-3xl md:rounded-[3rem] w-full max-w-md overflow-hidden shadow-2xl relative">
                        <div className="p-6 md:p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
                            <h3 className="text-lg md:text-xl font-black text-white italic uppercase tracking-tighter">Add to Collection</h3>
                            <button onClick={() => setShowModal(false)} className="w-10 h-10 rounded-full flex items-center justify-center text-[var(--color-muted-foreground)] hover:bg-white/5 hover:text-white transition-all"><X size={20} className="md:w-6 md:h-6" /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-4 md:space-y-6">
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-[var(--color-muted-foreground)] mb-2">Item Title</label>
                                <input
                                    required
                                    className="w-full bg-[var(--color-background)] border border-white/5 rounded-xl md:rounded-2xl px-5 md:px-6 py-4 md:py-4.5 text-white focus:outline-none focus:border-[var(--color-primary)] font-black text-sm"
                                    placeholder="e.g. Breaking Bad, Interstellar"
                                    value={newItem.title}
                                    onChange={e => setNewItem({ ...newItem, title: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-[var(--color-muted-foreground)] mb-2">Cover Image URL (Optional)</label>
                                <input
                                    className="w-full bg-[var(--color-background)] border border-white/5 rounded-xl md:rounded-2xl px-5 md:px-6 py-4 md:py-4.5 text-white focus:outline-none focus:border-[var(--color-primary)] font-black text-xs"
                                    placeholder="https://example.com/poster.jpg"
                                    value={newItem.imageUrl}
                                    onChange={e => setNewItem({ ...newItem, imageUrl: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4 md:gap-6">
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-[var(--color-muted-foreground)] mb-2">Type</label>
                                    <select
                                        className="w-full bg-[var(--color-background)] border border-white/5 rounded-xl md:rounded-2xl px-4 md:px-6 py-4 md:py-4.5 text-[10px] md:text-xs font-black text-white focus:outline-none focus:border-[var(--color-primary)] appearance-none cursor-pointer uppercase"
                                        value={newItem.type}
                                        onChange={e => setNewItem({ ...newItem, type: e.target.value })}
                                    >
                                        <option value="movie">Movie</option>
                                        <option value="series">Series</option>
                                        <option value="anime">Anime</option>
                                        <option value="music">Music</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-[var(--color-muted-foreground)] mb-2">Status</label>
                                    <select
                                        className="w-full bg-[var(--color-background)] border border-white/5 rounded-xl md:rounded-2xl px-4 md:px-6 py-4 md:py-4.5 text-[10px] md:text-xs font-black text-white focus:outline-none focus:border-[var(--color-primary)] appearance-none cursor-pointer uppercase"
                                        value={newItem.status}
                                        onChange={e => setNewItem({ ...newItem, status: e.target.value })}
                                    >
                                        <option value="watching">Watching</option>
                                        <option value="completed">Completed</option>
                                        <option value="dropped">Dropped</option>
                                    </select>
                                </div>
                            </div>

                            {(newItem.type === 'series' || newItem.type === 'anime') ? (
                                <div className="grid grid-cols-2 gap-4 md:gap-6">
                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-widest text-[var(--color-muted-foreground)] mb-2">Season</label>
                                        <input
                                            type="number"
                                            className="w-full bg-[var(--color-background)] border border-white/5 rounded-xl md:rounded-2xl px-5 md:px-6 py-4 md:py-4.5 text-white focus:outline-none focus:border-[var(--color-primary)] font-black"
                                            value={newItem.season}
                                            onChange={e => setNewItem({ ...newItem, season: Number(e.target.value) })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-widest text-[var(--color-muted-foreground)] mb-2">Episode</label>
                                        <input
                                            type="number"
                                            className="w-full bg-[var(--color-background)] border border-white/5 rounded-xl md:rounded-2xl px-5 md:px-6 py-4 md:py-4.5 text-white focus:outline-none focus:border-[var(--color-primary)] font-black"
                                            value={newItem.episode}
                                            onChange={e => setNewItem({ ...newItem, episode: Number(e.target.value) })}
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-[var(--color-muted-foreground)] mb-2">Personal Rating (0-10)</label>
                                    <input
                                        type="number"
                                        max="10"
                                        min="0"
                                        className="w-full bg-[var(--color-background)] border border-white/5 rounded-xl md:rounded-2xl px-5 md:px-6 py-4 md:py-4.5 text-white focus:outline-none focus:border-[var(--color-primary)] font-black"
                                        value={newItem.rating}
                                        onChange={e => setNewItem({ ...newItem, rating: Number(e.target.value) })}
                                    />
                                </div>
                            )}

                            <button type="submit" className="w-full bg-[var(--color-primary)] text-black font-black py-5 rounded-xl md:rounded-2xl hover:scale-[1.02] transition-all active:scale-95 mt-4 shadow-xl shadow-orange-500/20 uppercase tracking-[0.2em] text-[10px] md:text-sm">
                                Confirm Catalog Entry
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
