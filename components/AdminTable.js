export default function AdminTable({ columns, data, actions }) {
  return (
    <div className="overflow-x-auto rounded shadow bg-white">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            {columns.map(col => (
              <th key={col} className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">{col}</th>
            ))}
            {actions && <th className="px-4 py-2"></th>}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={idx} className="hover:bg-gray-50">
              {columns.map(col => (
                <td key={col} className="px-4 py-2">{row[col]}</td>
              ))}
              {actions && <td className="px-4 py-2">{actions(row)}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 