'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/shared/ui/input';
import { Search } from 'lucide-react';

const DEBOUNCE_DELAY = 300;

export function StaffSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('query') || '');

  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (query) {
        params.set('query', query);
      } else {
        params.delete('query');
      }
      router.push(`/admin/staff?${params.toString()}`);
    }, DEBOUNCE_DELAY);

    return () => clearTimeout(timer);
  }, [query, router, searchParams]);

  return (
    <div className="pz-relative">
      <Search size={16} className="pz-absolute pz-left-3 pz-top-1/2 pz-transform pz--translate-y-1/2 pz-text-gray-400" />
      <Input
        type="text"
        placeholder="Search by name or email..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="pz-pl-9 pz-w-64"
      />
    </div>
  );
}
