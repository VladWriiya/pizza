import React from 'react';
import { cn } from '@/lib/utils';
import { Container } from '@/shared/container';
import { Logo } from './Logo';
import { HeaderActions } from './HeaderActions';
import { ProductSearch } from '@/features/search/ProductSearch';

interface HeaderProps {
  className?: string;
}

export const Header = ({ className }: HeaderProps) => {
  return (
    <header className={cn('pz-border-b pz-border', className)}>
      <Container className="pz-flex pz-items-center pz-justify-between pz-py-8">
        <Logo />
        <div className="pz-mx-10 pz-flex-1">
          <ProductSearch />
        </div>
        <HeaderActions />
      </Container>
    </header>
  );
};
