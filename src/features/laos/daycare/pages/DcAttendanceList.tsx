import PbCollectionTable, { type ColumnDef } from '@/components/shared/PbCollectionTable';

const columns: ColumnDef[] = [
  { key: 'attendance_id', label: 'ID' },
  { key: 'kid_name', label: 'Kid', field: 'kid.first_name' },
  { key: 'farm_name', label: 'Farm', field: 'slow_farm.name' },
  { key: 'class_id', label: 'Class' },
  { key: 'attendance_date', label: 'Date', render: (v) => v ? String(v).split('T')[0] : '' },
  { key: 'attendance_status', label: 'Status' },
  { key: 'meal_count', label: 'Meals' },
  { key: 'time_slot', label: 'Slot' },
  { key: 'check_id', label: 'Check', field: 'attendance_check.check_id' },
];

export default function DcAttendanceList() {
  return (
    <PbCollectionTable
      title="Daycare Attendance"
      collection="dc_attendance"
      columns={columns}
      expand="kid,slow_farm,attendance_check"
    />
  );
}
