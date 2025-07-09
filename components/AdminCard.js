export default function AdminCard({ title, value, icon }) {
  return (
    <div className="flex items-center p-4 bg-white rounded shadow">
      {icon && <div className="mr-4">{icon}</div>}
      <div>
        <div className="text-sm text-gray-500">{title}</div>
        <div className="text-2xl font-bold">{value}</div>
      </div>
    </div>
  );
} 