import '../styles/globals.css';
import { AuthProvider } from '../context/AuthContext';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { auth, getRedirectResult } from '../lib/firebase';

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    const handleRedirect = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result) {
          // User successfully signed in
          router.push('/dashboard');
        }
      } catch (error) {
        console.error('Error handling redirect:', error);
      }
    };

    handleRedirect();
  }, [router]);

  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}

export default MyApp;
