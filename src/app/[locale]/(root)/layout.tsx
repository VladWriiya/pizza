export const dynamic = 'force-dynamic';

import { AccessibilityToolbar } from '@/widgets/accessibility';
import { Header } from '@/widgets/header/header';
import { Footer } from '@/widgets/Footer';
import { EmergencyBanner } from '@/widgets/EmergencyBanner';
import { ClosedBanner } from '@/widgets/ClosedBanner';
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
      <ClosedBanner />
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