'use client'

import { signIn } from "next-auth/react";
import { FaGoogle, FaGithub } from 'react-icons/fa';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignIn() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    
    const form = e.currentTarget;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;
    const password = (form.elements.namedItem('password') as HTMLInputElement).value;

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl: '/'
      });

      if (result?.error) {
        setError(result.error);
      } else if (result?.ok) {
        router.push('/');
        router.refresh();
      }
    } catch (err) {
      console.error('Sign-in error:', err);
      setError('An unexpected error occurred');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-500 to-teal-400 flex items-center justify-center p-4">
      <div className="max-w-md w-full backdrop-blur-lg bg-white/10 p-8 rounded-2xl shadow-2xl border border-white/20">
        <h1 className="text-4xl font-bold text-white text-center mb-8">Welcome Back</h1>
        
        <form
          className="space-y-6"
          onSubmit={handleSubmit}
        >
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-200 text-sm">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <input
              name="email"
              type="email"
              placeholder="Email"
              required
              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-200"
            />
            <input
              name="password"
              type="password"
              placeholder="Password"
              required
              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-200"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg font-semibold transition duration-200 hover:shadow-lg"
          >
            Sign In
          </button>
        </form>

        <div className="mt-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-transparent text-white/60">Or continue with</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <button
              onClick={() => signIn("google")}
              className="flex items-center justify-center px-4 py-3 bg-white/5 hover:bg-white/10 text-white rounded-lg transition duration-200 hover:shadow-lg group"
            >
              <FaGoogle className="mr-2 group-hover:scale-110 transition duration-200" />
              Google
            </button>
            <button
              onClick={() => signIn("github")}
              className="flex items-center justify-center px-4 py-3 bg-white/5 hover:bg-white/10 text-white rounded-lg transition duration-200 hover:shadow-lg group"
            >
              <FaGithub className="mr-2 group-hover:scale-110 transition duration-200" />
              GitHub
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}