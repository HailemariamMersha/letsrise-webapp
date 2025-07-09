import { getServerSideProps as getAuthProps } from '../../lib/adminAuth';
import AdminTable from '../../components/AdminTable';

export default function AdminReports({ reports }) {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Reports Management</h1>
      <AdminTable
        columns={['userEmail', 'label', 'createdAt']}
        data={reports}
        actions={report => (
          <button className="btn btn-xs bg-blue-100" onClick={() => {}}>View</button>
        )}
      />
    </div>
  );
}

export async function getServerSideProps(context) {
  await getAuthProps(context);
  // TODO: Replace with real Prisma query
  const reports = [
    { id: 1, userEmail: 'user1@example.com', label: 'Leader', createdAt: new Date().toISOString() },
  ];
  return { props: { reports } };
} 