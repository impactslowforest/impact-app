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

const COLOR_MAP: Record<StatusColor, string> = {
  gray:   'bg-gray-100 text-gray-700 border-gray-300',
  yellow: 'bg-amber-50 text-amber-700 border-amber-300',
  green:  'bg-green-50 text-green-700 border-green-300',
  red:    'bg-red-50 text-red-700 border-red-300',
  blue:   'bg-blue-50 text-blue-700 border-blue-300',
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
        'inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium capitalize',
        COLOR_MAP[color],
        className,
      )}
    >
      {text}
    </span>
  );
}

/** Render function for PbCollectionTable ColumnDef */
export function renderStatus(value: unknown): React.ReactNode {
  return <StatusBadge value={value} />;
}
