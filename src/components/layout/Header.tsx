import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Wifi, WifiOff, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { LanguageSwitcher } from './LanguageSwitcher';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/hooks/useTheme';
import { CommodityIcon } from '@/components/shared/CommodityIcon';
import { useUIStore } from '@/stores/ui-store';

const COUNTRY_INFO: Record<string, { name: string; iso: string }> = {
  vietnam: { name: 'Vietnam', iso: 'vn' },
  laos: { name: 'Laos', iso: 'la' },
  indonesia: { name: 'Indonesia', iso: 'id' },
};

function Clock() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const time = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const date = now.toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' });

  return (
    <div className="text-right text-white hidden sm:block">
      <div className="text-sm font-bold tabular-nums">{time}</div>
      <div className="text-[10px] text-white/70 capitalize">{date}</div>
    </div>
  );
}

export function Header() {
  const { t } = useTranslation();
  const isOnline = useOnlineStatus();
  const { user, logout } = useAuth();
  const { headerGradient } = useTheme();
  const activeCountry = useUIStore((s) => s.activeCountry);

  return (
    <header className={`sticky top-0 z-40 flex h-16 items-center bg-gradient-to-r ${headerGradient} px-3 shadow-lg md:px-4`}>
      {/* Left: Sidebar trigger + Commodity icon */}
      <div className="flex items-center gap-2.5">
        <SidebarTrigger className="text-white/80 hover:bg-white/10 hover:text-white" />
        <CommodityIcon className="h-5 w-5 text-white/50 hidden sm:block" />
      </div>

      {/* Center: App title + country indicator */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <h1 className="text-lg font-extrabold text-white tracking-wider uppercase sm:text-xl md:text-2xl drop-shadow-sm">
          Impact — Slow Forest
        </h1>
        {activeCountry !== 'all' && COUNTRY_INFO[activeCountry] && (
          <span className="inline-flex items-center justify-center gap-1.5 text-[10px] text-white/80 uppercase tracking-[0.15em] hidden md:flex">
            <img
              src={`https://flagcdn.com/w20/${COUNTRY_INFO[activeCountry].iso}.png`}
              alt={COUNTRY_INFO[activeCountry].name}
              className="h-3 w-4 rounded-[1px] object-cover"
            />
            Working in {COUNTRY_INFO[activeCountry].name}
          </span>
        )}
      </div>

      {/* Right: Clock + Status + Language + Logout */}
      <div className="flex items-center gap-2 md:gap-2.5">
        <Clock />

        <Badge
          variant={isOnline ? 'default' : 'destructive'}
          className={`gap-1 text-[10px] ${
            isOnline
              ? 'bg-white/15 text-white border-white/20 hover:bg-white/20'
              : 'bg-red-500/80 text-white border-red-400/40'
          }`}
        >
          {isOnline ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
          <span className="hidden md:inline">{isOnline ? t('online') : t('offline')}</span>
        </Badge>

        <LanguageSwitcher />

        <Button
          variant="ghost"
          size="sm"
          onClick={logout}
          className="h-8 gap-1.5 text-white/80 hover:bg-white/10 hover:text-white border border-white/20 text-xs rounded-lg"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">{t('close')}</span>
        </Button>
      </div>
    </header>
  );
}
