'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Heading } from '@/shared/Heading';
import { Button } from '@/shared/ui/button';
import { verifyEmailAction } from '@/app/[locale]/actions/email-verification';
import { Link } from '@/i18n/navigation';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function VerifyEmailPage() {
  const t = useTranslations('VerifyEmailPage');
  const searchParams = useSearchParams();
  const code = searchParams.get('code');
  const userId = searchParams.get('userId');

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    async function verify() {
      if (!code || !userId) {
        setStatus('error');
        setErrorMessage(t('invalidLink'));
        return;
      }

      const result = await verifyEmailAction(Number(userId), code);
      if (result.success) {
        setStatus('success');
      } else {
        setStatus('error');
        setErrorMessage(result.error || t('verificationFailed'));
      }
    }

    verify();
  }, [code, userId, t]);

  if (status === 'loading') {
    return (
      <div className="pz-min-h-[60vh] pz-flex pz-items-center pz-justify-center">
        <div className="pz-text-center">
          <Loader2 className="pz-w-12 pz-h-12 pz-animate-spin pz-text-primary pz-mx-auto pz-mb-4" />
          <p className="pz-text-gray-500">{t('verifying')}</p>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="pz-min-h-[60vh] pz-flex pz-items-center pz-justify-center">
        <div className="pz-text-center pz-max-w-md pz-p-8">
          <XCircle className="pz-w-16 pz-h-16 pz-text-red-500 pz-mx-auto pz-mb-4" />
          <Heading level="2">{t('errorTitle')}</Heading>
          <p className="pz-text-gray-500 pz-mt-2 pz-mb-6">
            {errorMessage}
          </p>
          <Link href="/">
            <Button>{t('backToHome')}</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pz-min-h-[60vh] pz-flex pz-items-center pz-justify-center">
      <div className="pz-text-center pz-max-w-md pz-p-8">
        <CheckCircle className="pz-w-16 pz-h-16 pz-text-green-500 pz-mx-auto pz-mb-4" />
        <Heading level="2">{t('successTitle')}</Heading>
        <p className="pz-text-gray-500 pz-mt-2 pz-mb-6">
          {t('successDescription')}
        </p>
        <Link href="/profile">
          <Button>{t('goToProfile')}</Button>
        </Link>
      </div>
    </div>
  );
}
