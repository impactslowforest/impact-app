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
  const { headerGradient, commodity } = useTheme();

  return (
    <header className={`sticky top-0 z-40 flex h-14 items-center bg-gradient-to-r ${headerGradient} px-3 shadow-lg md:px-4`}>
      {/* Left: Sidebar trigger + Commodity icon */}
      <div className="flex items-center gap-2.5">
        <SidebarTrigger className="text-white/80 hover:bg-white/10 hover:text-white" />
        <CommodityIcon className="h-5 w-5 text-white/50 hidden sm:block" />
      </div>

      {/* Center: App title */}
      <div className="flex-1 text-center">
        <h1 className="text-lg font-extrabold text-white tracking-wider uppercase sm:text-xl md:text-2xl drop-shadow-sm">
          Impact — Slow Forest
        </h1>
        <span className="text-[10px] text-white/50 uppercase tracking-[0.2em] hidden md:block">
          {commodity} Supply Chain
        </span>
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
