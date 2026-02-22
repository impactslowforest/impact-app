import { Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from './LanguageSwitcher';
import { LOGO_URL } from '@/config/constants';

/* Certification logo URLs */
const CERT_LOGOS = [
  { src: 'https://images.seeklogo.com/logo-png/30/1/rainforest-alliance-certified-logo-png_seeklogo-302722.png', alt: 'Rainforest Alliance' },
  { src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTiAGjHoeFmvk0-GkKpvAYszUXCI1derGP3hw&s', alt: 'EUDR' },
  { src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6u4R-nWehZlBf7_K6GUxhSgsDgcHxKoiXYA&s', alt: 'EU Organic' },
  { src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8H1m8FFtezr-xZtNeMsC6snTEA2T5QBqA1w&s', alt: 'Fairtrade' },
  { src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRZl67Ek28YuNPhzkU8j3DqJ3tBY7usqotBVA&s', alt: 'Bird Friendly' },
];

export function AuthLayout() {
  const { t } = useTranslation('auth');

  return (
    <div className="flex min-h-screen">
      {/* Left panel: branding */}
      <div className="hidden w-1/2 flex-col items-center justify-center bg-gradient-to-br from-primary-800 via-primary-700 to-primary-900 p-12 text-white lg:flex">
        <img
          src={LOGO_URL}
          alt="Slow Forest"
          className="mb-8 h-32 w-auto"
          style={{ filter: 'brightness(0) invert(1)' }}
        />
        <h1 className="mb-4 text-4xl font-bold">Impact</h1>
        <p className="max-w-lg text-center text-lg text-white/80">
          {t('branding_tagline')}
        </p>

        <div className="mt-8 flex gap-6 text-sm text-white/50">
          <span>GHG &amp; SBTi</span>
          <span>EUDR Compliance</span>
          <span>Certification</span>
        </div>

        {/* 5 Certification Logos — single row, no labels */}
        <div className="mt-8 flex items-center gap-5 rounded-2xl bg-white/95 px-6 py-3 shadow-lg">
          {CERT_LOGOS.map((logo) => (
            <img
              key={logo.alt}
              src={logo.src}
              alt={logo.alt}
              className="h-11 w-11 object-contain"
            />
          ))}
        </div>
      </div>

      {/* Right panel: auth forms */}
      <div className="flex w-full flex-col lg:w-1/2">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2 lg:hidden">
            <img src={LOGO_URL} alt="Slow Forest" className="h-8 w-auto" />
            <span className="font-bold text-primary-800">Impact</span>
          </div>
          <div className="ml-auto">
            <LanguageSwitcher variant="light" />
          </div>
        </div>
        <div className="flex flex-1 items-center justify-center p-6">
          <div className="w-full max-w-md">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}

