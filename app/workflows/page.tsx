'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserButton, useUser } from '@clerk/nextjs';
import { LayoutGrid, List, Plus, Search, FileText, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type Workflow = {
    id: string;
    name: string;
    description?: string | null;
    createdAt: string;
};

function Skeleton({ className }: { className: string }) {
    return (
        <div
            className={`animate-pulse rounded-md bg-[#1a1a1a] ${className}`}
        />
    );
}

function SidebarSkeleton() {
    return (
        <div className="flex-1 px-2 space-y-2">
            {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-8 w-full" />
            ))}
        </div>
    );
}

function GridSkeleton() {
    return (
        <div className="grid grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
                <div
                    key={i}
                    className="p-4 rounded-lg bg-[#111] border border-[#222]"
                >
                    <Skeleton className="h-4 w-2/3 mb-2" />
                    <Skeleton className="h-3 w-1/2" />
                </div>
            ))}
        </div>
    );
}

function TableSkeleton() {
    return (
        <div className="border border-[#222] rounded overflow-hidden">
            {Array.from({ length: 5 }).map((_, i) => (
                <div
                    key={i}
                    className="flex gap-4 px-4 py-3 border-b border-[#222]"
                >
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-4 w-1/4" />
                </div>
            ))}
        </div>
    );
}

function CarouselSkeleton() {
    return (
        <div className="flex gap-4 overflow-hidden">
            {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton
                    key={i}
                    className="min-w-[260px] h-40"
                />
            ))}
        </div>
    );
}

export default function WorkflowsPage() {
    const router = useRouter();
    const { user, isLoaded } = useUser();

    const [workflows, setWorkflows] = useState<Workflow[]>([]);
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState<string | null>(null);

    const [search, setSearch] = useState('');
    const [view, setView] = useState<'grid' | 'table'>('grid');
    const [libraryTab, setLibraryTab] = useState<'workflows' | 'tutorials'>(
        'workflows'
    );
    const [isCreateOpen, setIsCreateOpen] = useState(false);


    /* ------------------------------------------------------------ */
    /* Fetch workflows */
    /* ------------------------------------------------------------ */

    const fetchWorkflows = async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/workflows', {
                credentials: 'include',
            });

            if (!res.ok) throw new Error('Failed to fetch workflows');

            const json = await res.json();
            setWorkflows(json.data);
        } catch (err: any) {
            setError(err.message ?? 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWorkflows();
    }, []);

    /* ------------------------------------------------------------ */
    /* Create workflow */
    /* ------------------------------------------------------------ */

    const handleCreate = async () => {
        if (!name.trim()) return;

        try {
            setCreating(true);
            setError(null);

            const res = await fetch('/api/workflows', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    name,
                    description: description || undefined,
                }),
            });

            if (!res.ok) throw new Error('Failed to create workflow');

            setName('');
            setDescription('');
            await fetchWorkflows();
        } catch (err: any) {
            setError(err.message ?? 'Something went wrong');
        } finally {
            setCreating(false);
        }
    };

    /* ------------------------------------------------------------ */
    /* Derived data */
    /* ------------------------------------------------------------ */

    const filteredWorkflows = useMemo(() => {
        return workflows.filter((w) =>
            w.name.toLowerCase().includes(search.toLowerCase())
        );
    }, [workflows, search]);

    /* ------------------------------------------------------------ */
    /* Render */
    /* ------------------------------------------------------------ */

    return (
        <div className="flex min-h-screen bg-[#0A0A0A] text-white">
            {/* ---------------- Left Sidebar ---------------- */}
            <aside className="w-64 border-r border-[#1f1f1f] flex flex-col h-screen sticky top-0 bg-[#0A0A0A] z-10">
                {/* User */}
                <div className="h-[65px] p-4 flex items-center gap-3 border-b border-[#1f1f1f]">
                    {!isLoaded ? (
                        <>
                            <Skeleton className="w-8 h-8 rounded-full" />
                            <Skeleton className="h-4 w-24" />
                        </>
                    ) : (
                        <>
                            <UserButton />
                            <div className="text-sm font-medium">
                                {user?.fullName ?? 'User'}
                            </div>
                        </>
                    )}
                </div>

                {/* Create */}
                <div className="p-4">
                    <button
                        onClick={() => setIsCreateOpen(true)}
                        className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded bg-white text-black font-medium"
                    >
                        <Plus size={16} /> Create Workflow
                    </button>
                </div>

                {/* Workflow list */}
                <div className="flex-1 overflow-y-auto py-2">
                    {loading ? (
                        <SidebarSkeleton />
                    ) : (
                        <div className="px-2 space-y-1">
                            {workflows.map((w) => (
                                <div
                                    key={w.id}
                                    onClick={() => router.push(`/workflows/${w.id}`)}
                                    className="group flex items-center gap-3 px-3 py-2 rounded-md text-sm cursor-pointer hover:bg-[#1f1f1f] text-gray-400 hover:text-white transition-all"
                                >
                                    <FileText size={15} className="text-gray-500 group-hover:text-white transition-colors" />
                                    <span className="truncate">{w.name}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>


                {/* Discord */}
                <div className="p-4 border-t border-[#1f1f1f] text-sm text-gray-400">
                    <a
                        href="#"
                        className="flex items-center gap-2 hover:text-white"
                    >
                        <img
                            src="/discord.svg"
                            alt="Discord"
                            className="w-4 h-4"
                        />
                        Discord Community
                    </a>
                </div>
            </aside>

            {/* ---------------- Main Content ---------------- */}
            <main className="flex-1 p-8 space-y-10">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <div className="text-sm text-gray-400">
                            Workspace
                        </div>
                        <h1 className="text-2xl font-semibold">
                            {user?.firstName ?? 'User'}’s workspace
                        </h1>
                    </div>
                    <div className="p-4">
                        <button
                            onClick={() => setIsCreateOpen(true)}
                            className="w-full flex items-center justify-center gap-2 px-6 py-2 rounded bg-white text-black font-medium"
                        >
                            <Plus size={16} /> Create Workflow
                        </button>
                    </div>
                </div>

                {/* Library */}
                <section className="space-y-4">
                    <div className="flex gap-6 border-b border-[#1f1f1f]">
                        {(['workflows', 'tutorials'] as const).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setLibraryTab(tab)}
                                className={`pb-2 text-sm ${libraryTab === tab
                                    ? 'text-white border-b-2 border-white'
                                    : 'text-gray-400'
                                    }`}
                            >
                                {tab === 'workflows'
                                    ? 'Workflow Library'
                                    : 'Tutorials'}
                            </button>
                        ))}
                    </div>

                    {loading ? (
                        <CarouselSkeleton />
                    ) : (
                        <div className="min-h-[160px]">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={libraryTab}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.2 }}
                                    className="flex gap-4 overflow-x-auto pb-2"
                                >
                                    {[1, 2, 3, 4].map((i) => (
                                        <div
                                            key={i}
                                            className="min-w-[260px] h-40 rounded-lg bg-[#111] border border-[#222] flex items-end p-4 hover:border-[#333] transition-colors cursor-pointer"
                                        >
                                            <div className="text-sm font-medium">
                                                {libraryTab === 'workflows'
                                                    ? `Example Workflow ${i}`
                                                    : `Tutorial ${i}`}
                                            </div>
                                        </div>
                                    ))}
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    )}

                </section>

                {/* Your Workflows */}
                <section className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold">
                            Your Workflows
                        </h2>
                        <div className="flex items-center gap-2">
                            <div className="relative">
                                <Search
                                    size={14}
                                    className="absolute left-2 top-2.5 text-gray-400"
                                />
                                <input
                                    value={search}
                                    onChange={(e) =>
                                        setSearch(e.target.value)
                                    }
                                    placeholder="Search"
                                    className="pl-7 pr-3 py-2 rounded bg-[#111] border border-[#222] text-sm outline-none"
                                />
                            </div>
                            <button
                                onClick={() => setView('grid')}
                                className={`p-2 rounded ${view === 'grid'
                                    ? 'bg-[#222]'
                                    : 'bg-transparent'
                                    }`}
                            >
                                <LayoutGrid size={16} />
                            </button>
                            <button
                                onClick={() => setView('table')}
                                className={`p-2 rounded ${view === 'table'
                                    ? 'bg-[#222]'
                                    : 'bg-transparent'
                                    }`}
                            >
                                <List size={16} />
                            </button>
                        </div>
                    </div>

                    {loading ? (
                        view === 'grid' ? <GridSkeleton /> : <TableSkeleton />
                    ) : (
                        <div>
                            <AnimatePresence mode="wait">
                                {view === 'grid' ? (
                                    <motion.div
                                        key="grid"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        transition={{ duration: 0.2 }}
                                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                                    >
                                        <AnimatePresence mode="popLayout">
                                            {filteredWorkflows.map((w) => (
                                                <motion.div
                                                    key={w.id}
                                                    layout
                                                    initial={{ opacity: 0, scale: 0.9 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={{ opacity: 0, scale: 0.9 }}
                                                    transition={{ duration: 0.2 }}
                                                    onClick={() => router.push(`/workflows/${w.id}`)}
                                                    className="p-4 rounded-lg bg-[#111] border border-[#222] cursor-pointer hover:border-[#333]"
                                                >
                                                    <div className="font-medium">{w.name}</div>

                                                    {w.description && (
                                                        <div className="text-xs text-gray-400 mt-1 line-clamp-2">
                                                            {w.description}
                                                        </div>
                                                    )}
                                                    <div className="text-xs text-gray-400 mt-1">
                                                        {new Date(w.createdAt).toLocaleString()}
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </AnimatePresence>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="table"
                                        initial={{ opacity: 0, x: 10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -10 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <div className="border border-[#222] rounded-lg overflow-hidden">
                                            <table className="w-full text-left text-sm">
                                                <thead className="bg-[#111] text-gray-400 font-medium border-b border-[#222]">
                                                    <tr>
                                                        <th className="px-4 py-3">Name</th>
                                                        <th className="px-4 py-3">Description</th>
                                                        <th className="px-4 py-3">Created</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-[#222]">
                                                    <AnimatePresence>
                                                        {filteredWorkflows.map((w) => (
                                                            <motion.tr
                                                                key={w.id}
                                                                initial={{ opacity: 0 }}
                                                                animate={{ opacity: 1 }}
                                                                exit={{ opacity: 0 }}
                                                                transition={{ duration: 0.2 }}
                                                                onClick={() => router.push(`/workflows/${w.id}`)}
                                                                className="cursor-pointer hover:bg-[#111]"
                                                            >
                                                                <td className="px-4 py-3 font-medium text-white">
                                                                    {w.name}
                                                                </td>
                                                                <td className="px-4 py-3 text-gray-400 max-w-md truncate">
                                                                    {w.description || '-'}
                                                                </td>
                                                                <td className="px-4 py-3 text-gray-400 whitespace-nowrap">
                                                                    {new Date(w.createdAt).toLocaleDateString()}
                                                                </td>
                                                            </motion.tr>
                                                        ))}
                                                    </AnimatePresence>
                                                </tbody>
                                            </table>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    )}

                </section>

                {error && (
                    <div className="text-sm text-red-400">{error}</div>
                )}
            </main>
            {/* ---------------- Create Workflow Modal ---------------- */}
            {/* ---------------- Create Workflow Modal ---------------- */}
            <AnimatePresence>
                {isCreateOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsCreateOpen(false)}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            transition={{ duration: 0.2 }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full max-w-md rounded-xl bg-[#0f0f0f] border border-[#222] shadow-xl overflow-hidden"
                        >
                            {/* Header */}
                            <div className="px-6 py-4 border-b border-[#1f1f1f] bg-[#111]">
                                <h3 className="text-lg font-semibold">Create new workflow</h3>
                                <p className="text-sm text-gray-400 mt-1">
                                    Give your workflow a clear, descriptive name.
                                </p>
                            </div>

                            {/* Body */}
                            <div className="px-6 py-4 space-y-4">
                                <div>
                                    <label className="block text-sm mb-1 text-gray-300 font-medium">
                                        Workflow name
                                    </label>
                                    <input
                                        autoFocus
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="e.g. Product marketing generator"
                                        className="w-full px-3 py-2 rounded-md bg-[#000] border border-[#222] outline-none focus:border-blue-500 transition-colors focus:ring-1 focus:ring-blue-500/20"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm mb-1 text-gray-300 font-medium">
                                        Description <span className="text-gray-500">(optional)</span>
                                    </label>
                                    <textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder="Describe what this workflow does…"
                                        rows={3}
                                        className="w-full px-3 py-2 rounded-md bg-[#000] border border-[#222] outline-none resize-none focus:border-blue-500 transition-colors focus:ring-1 focus:ring-blue-500/20"
                                    />
                                </div>

                                {error && (
                                    <div className="text-sm text-red-400 bg-red-400/10 p-2 rounded border border-red-400/20">
                                        {error}
                                    </div>
                                )}
                            </div>


                            {/* Footer */}
                            <div className="px-6 py-4 border-t border-[#1f1f1f] flex justify-end gap-2 bg-[#111]">
                                <button
                                    onClick={() => {
                                        setIsCreateOpen(false);
                                        setName('');
                                        setDescription('');
                                        setError(null);
                                    }}
                                    className="px-4 py-2 rounded-md text-sm text-gray-300 hover:bg-[#1a1a1a] transition-colors"
                                >
                                    Cancel
                                </button>

                                <button
                                    onClick={async () => {
                                        await handleCreate();
                                        setIsCreateOpen(false);
                                    }}
                                    disabled={creating || !name.trim()}
                                    className="min-w-[130px] flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-white text-black text-sm font-medium disabled:opacity-50 hover:bg-gray-200 transition-colors"
                                >
                                    {creating ? (
                                        <>
                                            <Loader2 size={16} className="animate-spin" />
                                            <span>Creating</span>
                                        </>
                                    ) : (
                                        'Create workflow'
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
}
