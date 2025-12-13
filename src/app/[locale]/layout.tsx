import './globals.css';
import { cn } from '@/lib/utils';
import { Nunito, Heebo } from 'next/font/google';
import { Providers } from '@/shared/Providers';
import { AccessibilityProvider } from '@/shared/AccessibilityProvider';
import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';

const nunito = Nunito({
  subsets: ['cyrillic', 'latin'],
  variable: '--font-nunito',
  weight: ['400', '500', '600', '700', '800', '900'],
});

const heebo = Heebo({
  subsets: ['hebrew'],
  variable: '--font-heebo',
  weight: ['400', '500', '600', '700', '800', '900'],
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  
  if (!routing.locales.includes(locale as typeof routing.locales[number])) {
    notFound();
  }

  const font = locale === 'he' ? heebo : nunito;

  return (
    <html lang={locale} dir={locale === 'he' ? 'rtl' : 'ltr'}>
      <body
        className={cn(
          'pz-min-h-screen pz-bg-background pz-font-sans pz-antialiased',
          font.variable
        )}
      >
        <NextIntlClientProvider locale={locale}>
          <AccessibilityProvider />
          <Providers>{children}</Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}