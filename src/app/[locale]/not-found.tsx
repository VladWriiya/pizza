import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Button } from '@/shared/ui/button';
import { Heading } from '@/shared/Heading';
import { NextIntlClientProvider, useMessages } from 'next-intl';

function NotFoundContent() {
  const t = useTranslations('NotFound');

  return (
    <div className="pz-flex pz-flex-col pz-items-center pz-justify-center pz-min-h-screen pz-text-center pz-px-4">
      <Heading level="1" className="pz-text-6xl pz-font-extrabold pz-text-primary">
        404
      </Heading>
      <Heading level="2" className="pz-mt-4 pz-text-3xl pz-font-bold">
        {t('title')}
      </Heading>
      <p className="pz-mt-4 pz-max-w-md pz-text-lg pz-text-gray-500">
        {t('description')}
      </p>
      
      <Link href="/" passHref legacyBehavior>
        <a>
          <Button className="pz-mt-8 pz-text-lg pz-h-12 pz-px-8">
            {t('goHome')}
          </Button>
        </a>
      </Link>
      
    </div>
  );
}

export default function NotFoundPage() {
    const messages = useMessages();
    return (
        <NextIntlClientProvider messages={messages}>
            <NotFoundContent />
        </NextIntlClientProvider>
    )
}