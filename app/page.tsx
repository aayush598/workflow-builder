'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <div className="h-screen flex items-center justify-center bg-black text-white">
      <Link
        href="/workflows"
        className="px-6 py-3 rounded bg-white text-black"
      >
        Go to Workflows
      </Link>
    </div>
  );
}
