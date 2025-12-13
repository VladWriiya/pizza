'use client';

    import { useLocale } from 'next-intl';
    import { useRouter, usePathname } from 'next/navigation';
    import { Button } from '@/shared/ui/button';
    import { Languages } from 'lucide-react';
    
    export const LanguageSwitcher = () => {
      const router = useRouter();
      const pathname = usePathname();
      const locale = useLocale();
    
      const switchLocale = () => {
        const newLocale = locale === 'en' ? 'he' : 'en';
        const newPathname = pathname.startsWith(`/${locale}`) ? pathname.substring(3) : pathname;
        router.replace(`/${newLocale}${newPathname}`);
      };
    
      return (
        <Button variant="ghost" size="icon" onClick={switchLocale}>
          <Languages />
        </Button>
      );
    };