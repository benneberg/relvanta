'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getFirebaseAuth } from '@/lib/firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const auth = getFirebaseAuth();

      if (!auth) {
        setError(
          'Firebase is not configured. Please add your Firebase credentials to .env.local'
        );
        setIsLoading(false);
        return;
      }

      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();

      const response = await fetch(`${API_URL}/api/auth/session`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to create session');
      }

      const userData = await response.json();
      console.log('User authenticated:', userData);

      const returnTo = searchParams.get('returnTo') || '/private';
      router.push(returnTo);
    } catch (err: unknown) {
      console.error('Authentication error:', err);
      
      const firebaseError = err as { code?: string; message?: string };
      
      if (firebaseError.code === 'auth/popup-closed-by-user') {
        setError('Sign-in popup was closed. Please try again.');
      } else if (firebaseError.code === 'auth/popup-blocked') {
        setError('Popup was blocked by browser. Please allow popups for this site.');
      } else {
        setError(firebaseError.message || 'Authentication failed. Please try again.');
      }
      
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 px-6 py-8 max-w-md mx-auto min-h-[70vh] justify-center">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Link href="/" className="text-white/40 hover:text-white transition-colors">
          <span className="material-symbols-outlined text-xl">arrow_back</span>
        </Link>
        <h2 className="text-white/60 text-xs font-semibold tracking-[0.2em] uppercase">Sign In</h2>
      </div>

      {/* Login Card */}
      <div className="relvanta-card rounded-3xl p-8 border border-glass-border relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-48 h-48 bg-primary/10 rounded-full blur-[60px]"></div>
        
        <div className="relative z-10">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-6">
            <div className="relative w-10 h-10">
              <div className="absolute top-0 left-0 w-5 h-5 bg-white/20 rounded-[2px] z-20"></div>
              <div className="absolute top-[4px] right-0 w-5 h-5 bg-primary rounded-[2px] z-30 shadow-[0_0_12px_rgba(59,130,246,0.6)]"></div>
              <div className="absolute bottom-[4px] left-[4px] w-5 h-5 bg-charcoal-light border border-white/10 rounded-[2px] z-10"></div>
              <div className="absolute bottom-0 right-[4px] w-5 h-5 bg-white/5 rounded-[2px] z-0"></div>
            </div>
            <span className="text-2xl font-bold text-white">Relvanta</span>
          </div>

          <h1 className="text-xl font-bold text-white mb-2">Welcome back</h1>
          <p className="text-white/50 text-sm mb-8">
            Access your personalized AI dashboard and experimental labs.
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          <button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 px-6 py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl transition-all font-medium text-white disabled:opacity-50 disabled:cursor-not-allowed"
            data-testid="google-signin-btn"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Sign in with Google
              </>
            )}
          </button>

          <p className="mt-6 text-center text-xs text-white/30">
            By signing in, you agree to our Terms of Service and Privacy Policy.
          </p>

          {/* Configuration Notice */}
          {!process.env.NEXT_PUBLIC_FIREBASE_API_KEY && (
            <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
              <p className="text-xs text-yellow-400">
                <strong>Configuration Required:</strong> Firebase credentials are not set.
                Please update <code className="bg-white/10 px-1 rounded">.env.local</code> with your Firebase configuration.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* System Status */}
      <div className="flex items-center justify-center gap-2">
        <div className="size-2 bg-green-500 rounded-full shadow-[0_0_10px_rgba(34,197,94,0.8)]"></div>
        <span className="text-xs text-white/40">Secure authentication powered by Firebase</span>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
