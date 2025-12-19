'use client';

import { useEffect } from 'react';
import { Button } from '@/shared/ui/button';
import { ShoppingCart, Home } from 'lucide-react';

export default function CheckoutError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Checkout error:', error);
  }, [error]);

  return (
    <div className="pz-flex pz-flex-col pz-items-center pz-justify-center pz-min-h-[60vh] pz-text-center pz-px-4">
      <ShoppingCart className="pz-w-16 pz-h-16 pz-text-muted-foreground pz-mb-4" />
      <h1 className="pz-text-2xl pz-font-bold pz-mb-2">
        Checkout Error
      </h1>
      <p className="pz-max-w-md pz-text-muted-foreground pz-mb-2">
        Something went wrong during checkout. Your payment was not processed.
      </p>
      <p className="pz-text-sm pz-text-muted-foreground pz-mb-4">
        Please try again or contact support if the problem persists.
      </p>
      {error.digest && (
        <p className="pz-text-xs pz-text-muted-foreground pz-mb-4">
          Reference: {error.digest}
        </p>
      )}
      <div className="pz-flex pz-gap-4">
        <Button onClick={reset} variant="default">
          Try again
        </Button>
        <Button onClick={() => window.location.href = '/'} variant="outline">
          <Home className="pz-w-4 pz-h-4 pz-me-2" />
          Back to Home
        </Button>
      </div>
    </div>
  );
}
