import { getServerSideProps as getAuthProps } from '../../lib/adminAuth';
import AdminCard from '../../components/AdminCard';
import Link from 'next/link';
// import prisma from '../../lib/db'; // Uncomment and use your Prisma client

export default function AdminDashboard({ recentSignups, recentAssessments, recentPremiums }) {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <AdminCard title="Recent Signups" value={recentSignups.length} />
        <AdminCard title="Recent Assessments" value={recentAssessments.length} />
        <AdminCard title="Recent Premium Upgrades" value={recentPremiums.length} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <h2 className="font-semibold mb-2">Latest Users</h2>
          <ul>
            {recentSignups.map(u => (
              <li key={u.id}>{u.email} <span className="text-xs text-gray-400">{u.createdAt}</span></li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="font-semibold mb-2">Latest Assessments</h2>
          <ul>
            {recentAssessments.map(a => (
              <li key={a.id}>{a.userEmail} <span className="text-xs text-gray-400">{a.createdAt}</span></li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="font-semibold mb-2">Latest Premiums</h2>
          <ul>
            {recentPremiums.map(u => (
              <li key={u.id}>{u.email} <span className="text-xs text-gray-400">{u.createdAt}</span></li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mt-8 flex gap-4">
        <Link href="/admin/users" className="btn">Manage Users</Link>
        <Link href="/admin/assessments" className="btn">Manage Assessments</Link>
        <Link href="/admin/reports" className="btn">Manage Reports</Link>
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  await getAuthProps(context);
  // TODO: Replace with real Prisma queries
  const recentSignups = [
    { id: 1, email: 'user1@example.com', createdAt: new Date().toISOString() },
  ];
  const recentAssessments = [
    { id: 1, userEmail: 'user1@example.com', createdAt: new Date().toISOString() },
  ];
  const recentPremiums = [
    { id: 1, email: 'user2@example.com', createdAt: new Date().toISOString() },
  ];
  return {
    props: {
      recentSignups,
      recentAssessments,
      recentPremiums,
    }
  };
} 