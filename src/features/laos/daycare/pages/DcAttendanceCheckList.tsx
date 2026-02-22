import PbCollectionTable, { type ColumnDef } from '@/components/shared/PbCollectionTable';

const columns: ColumnDef[] = [
  { key: 'check_id', label: 'Check ID' },
  { key: 'check_date', label: 'Date', render: (v) => v ? String(v).split('T')[0] : '' },
  { key: 'farm_name', label: 'Farm', field: 'slow_farm.name' },
  { key: 'class_id', label: 'Class' },
  { key: 'slot_time', label: 'Slot' },
];

export default function DcAttendanceCheckList() {
  return (
    <PbCollectionTable
      title="Attendance Checks"
      collection="dc_attendance_checks"
      columns={columns}
      expand="slow_farm"
    />
  );
}
