import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';

export default async function DeniedPage() {
  const t = await getTranslations('Denied');

  return (
    <div className="pz-min-h-[60vh] pz-flex pz-flex-col pz-items-center pz-justify-center pz-text-center pz-px-4">
      <h1 className="pz-text-6xl pz-font-bold pz-text-red-500 pz-mb-4">403</h1>
      <h2 className="pz-text-2xl pz-font-semibold pz-mb-2">{t('title')}</h2>
      <p className="pz-text-gray-600 pz-mb-8">{t('description')}</p>
      <Link
        href="/"
        className="pz-bg-primary pz-text-white pz-px-6 pz-py-3 pz-rounded-full pz-font-medium hover:pz-bg-primary/90 pz-transition"
      >
        {t('goHome')}
      </Link>
    </div>
  );
}
