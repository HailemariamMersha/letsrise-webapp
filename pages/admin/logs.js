import AdminTable from '../../components/AdminTable';

export default function AdminLogs() {
  const logs = [
    { id: 1, action: 'User signup', user: 'user1@example.com', date: '2024-06-01' },
  ];
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Activity Log</h1>
      <AdminTable columns={['action', 'user', 'date']} data={logs} />
    </div>
  );
} 