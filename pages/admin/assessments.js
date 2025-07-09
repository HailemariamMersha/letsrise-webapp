import { getServerSideProps as getAuthProps } from '../../lib/adminAuth';
import AdminTable from '../../components/AdminTable';

export default function AdminAssessments({ assessments }) {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Assessment Management</h1>
      <AdminTable
        columns={['userEmail', 'createdAt', 'id']}
        data={assessments}
        actions={assessment => (
          <button className="btn btn-xs bg-blue-100" onClick={() => {}}>View JSON</button>
        )}
      />
    </div>
  );
}

export async function getServerSideProps(context) {
  await getAuthProps(context);
  // TODO: Replace with real Prisma query
  const assessments = [
    { id: 1, userEmail: 'user1@example.com', createdAt: new Date().toISOString() },
  ];
  return { props: { assessments } };
} 