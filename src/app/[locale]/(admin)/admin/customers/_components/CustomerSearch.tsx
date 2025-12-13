'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';

export function CustomerSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('query') || '');

  useEffect(() => {
    const debounce = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (query) {
        params.set('query', query);
      } else {
        params.delete('query');
      }
      router.push(`/admin/customers?${params.toString()}`);
    }, 300);

    return () => clearTimeout(debounce);
  }, [query, router, searchParams]);

  return (
    <div className="pz-relative pz-w-full pz-max-w-sm">
      <Search className="pz-absolute pz-left-3 pz-top-1/2 pz--translate-y-1/2 pz-w-4 pz-h-4 pz-text-gray-400" />
      <input
        type="text"
        placeholder="Search by name or email..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="pz-w-full pz-pl-10 pz-pr-4 pz-py-2 pz-border pz-border-gray-300 pz-rounded-lg focus:pz-outline-none focus:pz-ring-2 focus:pz-ring-primary focus:pz-border-transparent"
      />
    </div>
  );
}
