'use client';

import { useTranslations } from 'next-intl';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog';

interface AboutModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const techStack = [
  'Next.js 14',
  'TypeScript',
  'Prisma',
  'PostgreSQL',
  'Tailwind CSS',
  'next-intl',
  'NextAuth.js',
  'PayPal SDK',
  'Zustand',
];

export function AboutModal({ open, onOpenChange }: AboutModalProps) {
  const t = useTranslations('Footer');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="pz-max-w-lg">
        <DialogHeader>
          <DialogTitle>{t('aboutUs')}</DialogTitle>
        </DialogHeader>
        <div className="pz-space-y-4">
          <p className="pz-text-gray-600">{t('aboutDescription1')}</p>
          <p className="pz-text-gray-600">{t('aboutDescription2')}</p>
          <div>
            <h4 className="pz-font-semibold pz-mb-2">{t('techStack')}</h4>
            <div className="pz-flex pz-flex-wrap pz-gap-2">
              {techStack.map((tech) => (
                <span
                  key={tech}
                  className="pz-bg-gray-100 pz-text-gray-700 pz-px-3 pz-py-1 pz-rounded-full pz-text-sm"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
