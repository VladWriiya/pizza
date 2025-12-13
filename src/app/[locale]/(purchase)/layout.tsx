import { Header } from '@/widgets/header/header';
import { Container } from '@/shared/container';

import React from 'react';

export default function PurchaseLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="pz-min-h-screen pz-bg-[#F4F1EE]">
      <Header
        // hasSearch={false}
        // hasCart={false}
        className="pz-border-b-gray-200"
      />
      <Container>{children}</Container>
    </main>
  );
}
