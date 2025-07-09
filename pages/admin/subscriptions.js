import AdminTable from '../../components/AdminTable';

export default function AdminSubscriptions() {
  const subscribers = [
    { id: 1, email: 'premium1@example.com', since: '2024-05-01' },
  ];
  const payments = [
    { id: 1, email: 'premium1@example.com', amount: '$49', date: '2024-06-01' },
  ];
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Subscriptions</h1>
      <h2 className="font-semibold mb-2">Premium Subscribers</h2>
      <AdminTable columns={['email', 'since']} data={subscribers} />
      <h2 className="font-semibold mt-8 mb-2">Payment History</h2>
      <AdminTable columns={['email', 'amount', 'date']} data={payments} />
    </div>
  );
} 