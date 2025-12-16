'use client';

import React, { useState } from 'react';
import { Container } from '@/shared/container';
import { Github, Phone, Mail, MapPin, Clock } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/ui/dialog';
import { Button } from '@/shared/ui/button';

export const Footer = () => {
  const t = useTranslations('Footer');
  const [aboutOpen, setAboutOpen] = useState(false);

  return (
    <>
      <footer id="footer" className="pz-bg-secondary pz-text-secondary-foreground pz-py-6 sm:pz-py-10 pz-mt-6 sm:pz-mt-10">
        <Container>
          <div className="pz-grid pz-grid-cols-1 sm:pz-grid-cols-2 lg:pz-grid-cols-4 pz-gap-6 sm:pz-gap-8">
            {/* Logo & Description */}
            <div className="pz-col-span-1">
              <Link href="/" className="pz-flex pz-items-center pz-gap-3 pz-mb-4">
                <Image src="/logo.webp" alt="Collibri Pizza" width={50} height={50} />
                <span className="pz-text-xl pz-font-black pz-uppercase">Collibri Pizza</span>
              </Link>
              <p className="pz-text-sm pz-opacity-80">{t('description')}</p>
            </div>

            {/* Information */}
            <div className="pz-col-span-1">
              <h3 className="pz-font-bold pz-mb-4">{t('information')}</h3>
              <ul className="pz-space-y-2">
                <li>
                  <button
                    onClick={() => setAboutOpen(true)}
                    className="pz-opacity-80 hover:pz-opacity-100 pz-transition"
                  >
                    {t('aboutUs')}
                  </button>
                </li>
                <li>
                  <span className="pz-opacity-80">{t('delivery')}</span>
                </li>
                <li>
                  <span className="pz-opacity-80">{t('careers')}</span>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div className="pz-col-span-1">
              <h3 className="pz-font-bold pz-mb-4">{t('contact')}</h3>
              <ul className="pz-space-y-3">
                <li className="pz-flex pz-items-center pz-gap-2 pz-opacity-80">
                  <Phone size={16} />
                  <span>+972 50-123-4567</span>
                </li>
                <li className="pz-flex pz-items-center pz-gap-2 pz-opacity-80">
                  <Mail size={16} />
                  <span>info@collibri.pizza</span>
                </li>
                <li className="pz-flex pz-items-center pz-gap-2 pz-opacity-80">
                  <MapPin size={16} />
                  <span>{t('address')}</span>
                </li>
                <li className="pz-flex pz-items-center pz-gap-2 pz-opacity-80">
                  <Clock size={16} />
                  <span>{t('workingHours')}</span>
                </li>
              </ul>
            </div>

            {/* Social */}
            <div className="pz-col-span-1">
              <h3 className="pz-font-bold pz-mb-4">{t('followUs')}</h3>
              <div className="pz-flex pz-gap-4">
                <a
                  href="https://github.com/VladWriiya"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                  className="pz-opacity-80 hover:pz-opacity-100 pz-transition"
                >
                  <Github size={24} />
                </a>
              </div>
              <p className="pz-text-sm pz-opacity-60 pz-mt-4">{t('socialHint')}</p>
            </div>
          </div>

          {/* Copyright */}
          <div className="pz-border-t pz-border-border pz-mt-8 pz-pt-6 pz-text-center pz-text-sm pz-opacity-70">
            <p>{t('copyright', { year: new Date().getFullYear() })}</p>
          </div>
        </Container>
      </footer>

      {/* About Modal */}
      <Dialog open={aboutOpen} onOpenChange={setAboutOpen}>
        <DialogContent className="pz-max-w-lg">
          <DialogHeader>
            <DialogTitle className="pz-flex pz-items-center pz-gap-3">
              <Image src="/logo.webp" alt="Collibri Pizza" width={40} height={40} />
              Collibri Pizza
            </DialogTitle>
          </DialogHeader>
          <div className="pz-space-y-4 pz-text-sm pz-text-muted-foreground">
            <p>{t('aboutDescription1')}</p>
            <p>{t('aboutDescription2')}</p>
            <div className="pz-pt-2">
              <p className="pz-font-medium pz-text-foreground">{t('techStack')}</p>
              <p className="pz-mt-1">Next.js 14, TypeScript, Prisma, Tailwind CSS, NextAuth, PayPal</p>
            </div>
          </div>
          <div className="pz-flex pz-justify-end pz-mt-4">
            <Button variant="outline" onClick={() => setAboutOpen(false)}>
              {t('close')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
