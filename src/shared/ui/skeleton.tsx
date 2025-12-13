import { cn } from '@/lib/utils';

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('pz-animate-pulse pz-rounded-md pz-bg-primary/10', className)} {...props} />;
}

export { Skeleton };
