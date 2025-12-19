'use client';

import { useState } from 'react';
import { Button } from '@/shared/ui/button';
import { Download, Loader2 } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

export function ExportOrdersButton() {
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const status = searchParams.get('status') || 'ALL';

  const handleExport = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (status && status !== 'ALL') {
        params.set('status', status);
      }

      const response = await fetch(`/api/admin/export-orders?${params.toString()}`);

      if (!response.ok) {
        throw new Error('Export failed');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;

      // Get filename from Content-Disposition header or generate one
      const disposition = response.headers.get('Content-Disposition');
      const filenameMatch = disposition?.match(/filename="(.+)"/);
      a.download = filenameMatch ? filenameMatch[1] : 'orders.csv';

      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Export error:', error);
      alert('Failed to export orders');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      onClick={handleExport}
      disabled={loading}
      className="pz-gap-2"
    >
      {loading ? (
        <Loader2 size={16} className="pz-animate-spin" />
      ) : (
        <Download size={16} />
      )}
      Export CSV
    </Button>
  );
}
