import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function AdminPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || user.role !== "admin")) {
      router.push("/dashboard");
    }
  }, [user, loading]);

  if (loading) return <p>Loading...</p>;
  router.push("pages/admin/dashboard");
  return <h1>Admin Dashboard - Welcome {user.email}</h1>;
}
