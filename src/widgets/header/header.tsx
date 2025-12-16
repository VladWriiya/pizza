import React from 'react';
import { cn } from '@/lib/utils';
import { Container } from '@/shared/container';
import { Logo } from './Logo';
import { HeaderActions } from './HeaderActions';
import { ProductSearch } from '@/features/search/ProductSearch';
import { MobileMenu } from './MobileMenu';

interface HeaderProps {
  className?: string;
}

export const Header = ({ className }: HeaderProps) => {
  return (
    <header className={cn('pz-border-b pz-border', className)}>
      <Container className="pz-flex pz-items-center pz-justify-between pz-py-4 md:pz-py-8">
        {/* Mobile: burger menu */}
        <div className="md:pz-hidden">
          <MobileMenu />
        </div>

        {/* Logo - на мобилке по центру, на десктопе слева */}
        <Logo />

        {/* Desktop: search bar */}
        <div className="pz-hidden md:pz-block pz-mx-10 pz-flex-1">
          <ProductSearch />
        </div>

        {/* Actions */}
        <HeaderActions />
      </Container>
    </header>
  );
};
