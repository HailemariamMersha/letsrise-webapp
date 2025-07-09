// lib/adminAuth.js
// Placeholder: implement getUserFromRequest using your auth system (Firebase Admin, etc.)
export async function getServerSideProps(context) {
  // TODO: Replace with real user lookup
  const user = { role: 'ADMIN' }; // Replace with: await getUserFromRequest(context.req)
  if (!user || user.role !== 'ADMIN') {
    return {
      redirect: {
        destination: '/dashboard',
        permanent: false,
      },
    };
  }
  return { props: {} };
} 