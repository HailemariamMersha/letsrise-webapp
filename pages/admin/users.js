import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../../context/AuthContext";
import Navbar from "../../components/Navbar";
import { getServerSideProps as getAuthProps } from '../../lib/adminAuth';
import AdminTable from '../../components/AdminTable';

export default function AdminUsers({ users }) {
  const { user, isAdmin, loading } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace("/login");
      } else if (!isAdmin) {
        router.replace("/dashboard");
      }
    }
  }, [user, isAdmin, loading, router]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/admin/users");
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user && isAdmin) {
      fetchUsers();
    }
  }, [user, isAdmin]);

  const toggleAdminStatus = async (userId, currentStatus) => {
    try {
      const response = await fetch("/api/admin/set-admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          isAdmin: !currentStatus,
        }),
      });

      if (response.ok) {
        setUsers((prevUsers) =>
          prevUsers.map((u) =>
            u.uid === userId ? { ...u, isAdmin: !currentStatus } : u
          )
        );
      } else {
        console.error("Failed to update admin status");
      }
    } catch (error) {
      console.error("Error updating admin status:", error);
    }
  };

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  // Don't render anything if not authenticated or not admin
  if (!user || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg p-4">
            <h1 className="text-2xl font-semibold text-gray-900 mb-4">
              User Management
            </h1>
            {isLoading ? (
              <div className="text-center py-4">Loading users...</div>
            ) : (
              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <AdminTable
                  columns={['email', 'name', 'role', 'premium', 'createdAt']}
                  data={users}
                  actions={user => (
                    <div className="flex gap-2">
                      <button className="btn btn-xs bg-green-100" onClick={() => {}}>Promote</button>
                      <button className="btn btn-xs bg-yellow-100" onClick={() => {}}>Demote</button>
                      <button className="btn btn-xs bg-red-100" onClick={() => {}}>Delete</button>
                    </div>
                  )}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  await getAuthProps(context);
  // TODO: Replace with real Prisma query
  const users = [
    { email: 'user1@example.com', name: 'User One', role: 'USER', premium: 'No', createdAt: new Date().toISOString() },
    { email: 'admin@example.com', name: 'Admin', role: 'ADMIN', premium: 'Yes', createdAt: new Date().toISOString() },
  ];
  return { props: { users } };
} 