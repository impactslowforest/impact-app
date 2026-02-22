import { Coffee, Bean, type LucideProps } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

interface CommodityIconProps extends LucideProps {
  /** Override: force a specific commodity regardless of theme */
  forceType?: 'coffee' | 'cacao';
}

/**
 * Renders Coffee icon for VN/LA or Bean (Cacao) icon for Indonesia,
 * based on the current user's country theme.
 */
export function CommodityIcon({ forceType, ...props }: CommodityIconProps) {
  const { theme } = useTheme();
  const type = forceType ?? theme;

  if (type === 'cacao') {
    return <Bean {...props} />;
  }
  return <Coffee {...props} />;
}
