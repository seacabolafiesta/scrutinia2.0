'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/revisionmanual-scrutinia';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/admin-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.ok) {
        router.push(redirect);
      } else {
        setError(data.error || 'Credenciales incorrectas');
      }
    } catch {
      setError('Error de conexión');
    }

    setIsLoading(false);
  };

  return (
    <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Image src="/logoscrutinia.png" alt="Scrutinia" width={64} height={64} className="mx-auto mb-4" />
          <h1 className="text-2xl font-black text-white">Acceso Administración</h1>
          <p className="text-slate-400 text-sm mt-1">Panel de revisión manual de actas</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-900/30 border border-red-800 rounded-lg text-red-300 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs text-slate-400 mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm"
              placeholder="admin@email.com"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1.5">Contraseña</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm pr-10"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white font-bold rounded-lg transition-colors text-sm"
          >
            <Lock className="w-4 h-4" />
            {isLoading ? 'Verificando...' : 'Acceder'}
          </button>
        </form>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <Suspense fallback={
        <div className="text-slate-400 text-sm">Cargando...</div>
      }>
        <LoginForm />
      </Suspense>
    </div>
  );
}
