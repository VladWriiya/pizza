'use client';

import { useEffect } from 'react';
import { Button } from '@/shared/ui/button';
import { Heading } from '@/shared/Heading';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="pz-flex pz-flex-col pz-items-center pz-justify-center pz-min-h-screen pz-text-center pz-px-4">
      <Heading level="1" className="pz-text-6xl pz-font-extrabold pz-text-destructive">
        Oops!
      </Heading>
      <Heading level="2" className="pz-mt-4 pz-text-2xl pz-font-bold">
        Something went wrong
      </Heading>
      <p className="pz-mt-4 pz-max-w-md pz-text-lg pz-text-muted-foreground">
        An unexpected error occurred. Please try again.
      </p>
      {error.digest && (
        <p className="pz-mt-2 pz-text-sm pz-text-muted-foreground">
          Error ID: {error.digest}
        </p>
      )}
      <Button
        onClick={reset}
        className="pz-mt-8 pz-text-lg pz-h-12 pz-px-8"
      >
        Try again
      </Button>
    </div>
  );
}
