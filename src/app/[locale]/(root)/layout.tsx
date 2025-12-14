export const dynamic = 'force-dynamic';

import { AccessibilityToolbar } from '@/widgets/AccessibilityToolbar';
import { Header } from '@/widgets/header/header';
import { Footer } from '@/widgets/Footer';
import { EmergencyBanner } from '@/widgets/EmergencyBanner';
import { HighLoadBanner } from '@/widgets/HighLoadBanner';

export default function RootPagesLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <main className="pz-min-h-screen pz-flex pz-flex-col">
      <EmergencyBanner />
      <HighLoadBanner />
      <Header />
      <div className="pz-flex-1">
        {children}
        {modal}
      </div>
      <Footer />
      <AccessibilityToolbar />
    </main>
  );
}