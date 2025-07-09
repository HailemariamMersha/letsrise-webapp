import AdminTable from '../../components/AdminTable';

export default function AdminCourses() {
  const courses = [
    { id: 1, title: 'Startup 101', createdAt: '2024-06-01' },
  ];
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Course Catalog</h1>
      <button className="btn mb-4">Add Course</button>
      <AdminTable
        columns={['title', 'createdAt']}
        data={courses}
        actions={course => (
          <div className="flex gap-2">
            <button className="btn btn-xs bg-blue-100" onClick={() => {}}>Edit</button>
            <button className="btn btn-xs bg-red-100" onClick={() => {}}>Delete</button>
          </div>
        )}
      />
    </div>
  );
} 