'use client';

import { useEffect } from 'react';
import { Button } from '@/shared/ui/button';
import { AlertTriangle } from 'lucide-react';

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Admin panel error:', error);
  }, [error]);

  return (
    <div className="pz-flex pz-flex-col pz-items-center pz-justify-center pz-min-h-[60vh] pz-text-center pz-px-4">
      <AlertTriangle className="pz-w-16 pz-h-16 pz-text-destructive pz-mb-4" />
      <h1 className="pz-text-2xl pz-font-bold pz-mb-2">
        Admin Panel Error
      </h1>
      <p className="pz-max-w-md pz-text-muted-foreground pz-mb-4">
        An error occurred in the admin panel. This has been logged.
      </p>
      {error.digest && (
        <p className="pz-text-sm pz-text-muted-foreground pz-mb-4">
          Error ID: {error.digest}
        </p>
      )}
      <div className="pz-flex pz-gap-4">
        <Button onClick={reset} variant="default">
          Try again
        </Button>
        <Button onClick={() => window.location.href = '/admin'} variant="outline">
          Go to Dashboard
        </Button>
      </div>
    </div>
  );
}
