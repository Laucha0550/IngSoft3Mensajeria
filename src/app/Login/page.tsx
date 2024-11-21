"use client";
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { database, ref, get, child } from '../firebase';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [username, setUsername] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Get the username from the URL parameters
    const usernameParam = searchParams.get('username');
    if (usernameParam) {
      setUsername(usernameParam);
    }
  }, [searchParams]);

  const handleLogin = async () => {
    if (!username.trim()) {
      setError('Por favor, ingrese un nombre de usuario.');
      return;
    }

    try {
      // Check if the username exists in Firebase
      const userRef = ref(database);
      const snapshot = await get(child(userRef, `users/${username.trim()}`));

      if (snapshot.exists()) {
        // Save the username to local storage
        localStorage.setItem('username', username.trim());

        // Redirect to the chat page
        router.push('/Chat');
      } else {
        // If user doesn't exist, set an error message
        setError('El usuario no existe. Por favor, regístrese primero.');
      }
    } catch (error) {
      console.error('Error al comprobar el usuario en Firebase:', error);
      setError('Hubo un problema al iniciar sesión. Inténtelo de nuevo más tarde.');
    }
  };

  const handleLogin2 = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/auth/login`;
  };

  return (
    <div className="flex flex-col text-black items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl mb-4">Iniciar Sesión</h1>
      <input
        type="text"
        placeholder="Ingrese su nombre de usuario"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="border p-2 mb-4 w-64"
      />
      <button onClick={handleLogin} className="bg-blue-500 text-white p-2 mb-4">
        Entrar
      </button>
      <button onClick={handleLogin2} className="bg-blue-500 text-white p-2 mb-4">
        Iniciar Sesión con GitHub
      </button>
      {error && <p className="text-red-500">{error}</p>}
      <Link href="/Registro" className="text-black mt-4">
        Crear Usuario
      </Link>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <LoginContent />
    </Suspense>
  );
}
