import AdminChart from '../../components/AdminChart';

export default function AdminAnalytics() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Analytics</h1>
      <AdminChart title="User Growth" />
      <AdminChart title="Assessment Submissions" />
      <AdminChart title="Premium Upgrades" />
    </div>
  );
} 