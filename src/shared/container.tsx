import { cn } from '@/lib/utils';
import React from 'react';

interface ContainerProps {
  className?: string;
  children: React.ReactNode;
}

export const Container = ({ className, children }: ContainerProps) => {
  return <div className={cn('pz-mx-auto pz-max-w-[1400px] pz-px-4', className)}>{children}</div>;
};
