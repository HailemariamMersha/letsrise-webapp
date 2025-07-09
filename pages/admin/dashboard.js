import Link from 'next/link';

export default function AdminDashboard() {
  const sections = [
    { href: '/admin/users', label: 'Users', desc: 'Manage users, roles, and details.' },
    { href: '/admin/assessments', label: 'Assessments', desc: 'View and manage assessments.' },
    { href: '/admin/reports', label: 'Reports', desc: 'Preview and download reports.' },
    { href: '/admin/courses', label: 'Courses', desc: 'Manage course catalog.' },
    { href: '/admin/subscriptions', label: 'Subscriptions', desc: 'Premium subscribers and payments.' },
    { href: '/admin/logs', label: 'Logs', desc: 'View activity logs.' },
    { href: '/admin/analytics', label: 'Analytics', desc: 'Charts and trends.' },
    { href: '/admin/settings', label: 'Settings', desc: 'Admin settings (coming soon).' },
  ];
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <p className="mb-8 text-gray-600">Welcome! Use the links below to manage all aspects of the platform.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {sections.map(section => (
          <Link key={section.href} href={section.href} className="block p-6 bg-white rounded shadow hover:shadow-lg transition border border-gray-100 hover:border-blue-400">
            <div className="text-xl font-semibold mb-2">{section.label}</div>
            <div className="text-gray-500 text-sm">{section.desc}</div>
          </Link>
        ))}
      </div>
    </div>
  );
} 