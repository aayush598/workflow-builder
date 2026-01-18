'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type Workflow = {
    id: string;
    name: string;
    description?: string | null;
    createdAt: string;
};

export default function WorkflowsPage() {
    const router = useRouter();

    const [workflows, setWorkflows] = useState<Workflow[]>([]);
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);
    const [name, setName] = useState('');
    const [error, setError] = useState<string | null>(null);

    /* ------------------------------------------------------------ */
    /* Fetch workflows */
    /* ------------------------------------------------------------ */

    const fetchWorkflows = async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/workflows', {
                credentials: 'include',
            });

            if (!res.ok) {
                throw new Error('Failed to fetch workflows');
            }

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
                body: JSON.stringify({ name }),
            });

            if (!res.ok) {
                throw new Error('Failed to create workflow');
            }

            setName('');
            await fetchWorkflows();
        } catch (err: any) {
            setError(err.message ?? 'Something went wrong');
        } finally {
            setCreating(false);
        }
    };

    /* ------------------------------------------------------------ */
    /* Delete workflow */
    /* ------------------------------------------------------------ */

    const handleDelete = async (id: string) => {
        const confirmed = confirm('Delete this workflow?');
        if (!confirmed) return;

        try {
            const res = await fetch(`/api/workflows/${id}`, {
                method: 'DELETE',
                credentials: 'include',
            });

            if (!res.ok) {
                throw new Error('Failed to delete workflow');
            }

            setWorkflows((prev) => prev.filter((w) => w.id !== id));
        } catch (err: any) {
            setError(err.message ?? 'Something went wrong');
        }
    };

    /* ------------------------------------------------------------ */
    /* Render */
    /* ------------------------------------------------------------ */

    return (
        <div className="min-h-screen bg-[#0A0A0A] text-white p-8">
            <div className="max-w-4xl mx-auto space-y-6">
                <h1 className="text-2xl font-semibold">Workflows</h1>

                {/* Create */}
                <div className="flex gap-2">
                    <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="New workflow name"
                        className="flex-1 px-3 py-2 rounded bg-[#111] border border-[#222] outline-none"
                    />
                    <button
                        onClick={handleCreate}
                        disabled={creating}
                        className="px-4 py-2 rounded bg-white text-black disabled:opacity-50"
                    >
                        {creating ? 'Creating…' : 'Create'}
                    </button>
                </div>

                {error && (
                    <div className="text-red-400 text-sm">{error}</div>
                )}

                {/* List */}
                {loading ? (
                    <div className="text-sm text-gray-400">Loading…</div>
                ) : workflows.length === 0 ? (
                    <div className="text-sm text-gray-400">
                        No workflows yet.
                    </div>
                ) : (
                    <ul className="space-y-2">
                        {workflows.map((workflow) => (
                            <li
                                key={workflow.id}
                                className="flex items-center justify-between px-4 py-3 rounded bg-[#111] border border-[#222]"
                            >
                                <div
                                    className="cursor-pointer"
                                    onClick={() =>
                                        router.push(`/workflows/${workflow.id}`)
                                    }
                                >
                                    <div className="font-medium">{workflow.name}</div>
                                    <div className="text-xs text-gray-400">
                                        Created {new Date(workflow.createdAt).toLocaleString()}
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleDelete(workflow.id)}
                                    className="text-sm text-red-400 hover:text-red-300"
                                >
                                    Delete
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
