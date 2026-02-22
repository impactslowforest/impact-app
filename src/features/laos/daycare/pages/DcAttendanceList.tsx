import PbCollectionTable, { type ColumnDef } from '@/components/shared/PbCollectionTable';

const columns: ColumnDef[] = [
  { key: 'attendance_id', label: 'ID' },
  { key: 'kid_id_text', label: 'Kid' },
  { key: 'farm_id_text', label: 'Farm' },
  { key: 'class_id', label: 'Class' },
  { key: 'attendance_date', label: 'Date', render: (v) => v ? String(v).split('T')[0] : '' },
  { key: 'attendance_status', label: 'Status' },
  { key: 'meal_count', label: 'Meals' },
  { key: 'time_slot', label: 'Slot' },
  { key: 'check_id_text', label: 'Check' },
];

export default function DcAttendanceList() {
  return (
    <PbCollectionTable
      title="Daycare Attendance"
      collection="dc_attendance"
      columns={columns}
    />
  );
}
