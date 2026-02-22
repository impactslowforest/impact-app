import { cn } from '@/lib/utils';

/**
 * Color-coded status badge for ERP tables.
 *
 * Maps status strings to semantic colors:
 *   Pending / Draft        → Gray
 *   Checking / Processing  → Yellow/Amber
 *   Approved / Completed   → Green
 *   Rejected / Cancelled   → Red
 *   Sold / Shipped         → Blue
 */

type StatusColor = 'gray' | 'yellow' | 'green' | 'red' | 'blue';

const COLOR_MAP: Record<StatusColor, { badge: string; dot: string }> = {
  gray:   { badge: 'bg-gray-50 text-gray-600 ring-1 ring-gray-200',          dot: 'bg-gray-400' },
  yellow: { badge: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',       dot: 'bg-amber-500' },
  green:  { badge: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200', dot: 'bg-emerald-500' },
  red:    { badge: 'bg-red-50 text-red-700 ring-1 ring-red-200',             dot: 'bg-red-500' },
  blue:   { badge: 'bg-blue-50 text-blue-700 ring-1 ring-blue-200',          dot: 'bg-blue-500' },
};

const STATUS_COLORS: Record<string, StatusColor> = {
  // Gray — pending / draft / new
  pending: 'gray',
  draft: 'gray',
  new: 'gray',
  open: 'gray',
  waiting: 'gray',
  // Yellow — in progress / checking
  checking: 'yellow',
  processing: 'yellow',
  in_progress: 'yellow',
  'in progress': 'yellow',
  review: 'yellow',
  partial: 'yellow',
  // Green — approved / completed / active
  approved: 'green',
  completed: 'green',
  complete: 'green',
  active: 'green',
  verified: 'green',
  passed: 'green',
  pass: 'green',
  good: 'green',
  sold: 'green',
  // Red — rejected / failed / cancelled
  rejected: 'red',
  failed: 'red',
  fail: 'red',
  cancelled: 'red',
  canceled: 'red',
  expired: 'red',
  blocked: 'red',
  // Blue — shipped / delivered / transferred
  shipped: 'blue',
  delivered: 'blue',
  transferred: 'blue',
  transit: 'blue',
  'in transit': 'blue',
};

function resolveColor(status: string): StatusColor {
  const key = status.toLowerCase().trim();
  if (STATUS_COLORS[key]) return STATUS_COLORS[key];
  // Partial match fallback
  if (key.includes('pend')) return 'gray';
  if (key.includes('check') || key.includes('process')) return 'yellow';
  if (key.includes('approv') || key.includes('complet') || key.includes('pass')) return 'green';
  if (key.includes('reject') || key.includes('fail') || key.includes('cancel')) return 'red';
  if (key.includes('ship') || key.includes('deliver') || key.includes('transit')) return 'blue';
  return 'gray';
}

interface StatusBadgeProps {
  value: unknown;
  className?: string;
}

export default function StatusBadge({ value, className }: StatusBadgeProps) {
  const text = String(value ?? '').trim();
  if (!text) return null;

  const color = resolveColor(text);

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold capitalize',
        COLOR_MAP[color].badge,
        className,
      )}
    >
      <span className={cn('h-1.5 w-1.5 rounded-full', COLOR_MAP[color].dot)} />
      {text}
    </span>
  );
}

/** Render function for PbCollectionTable ColumnDef */
export function renderStatus(value: unknown): React.ReactNode {
  return <StatusBadge value={value} />;
}
