"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { database, ref, set } from '../firebase';

export default function RegistroPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!username.trim()) {
      alert('Por favor, ingrese un nombre de usuario.');
      return;
    }

    setLoading(true);
    try {
      // Check if the username already exists in the `/conversaciones` path
      // const userRef = ref(database, `conversaciones/${username}`);
      // const snapshot = await get(userRef);

      // if (snapshot.exists()) {
      //   alert('El nombre de usuario ya está en uso. Por favor, elija otro.');
      //   setLoading(false);
      //   return;
      // }

      // // Save username in `/conversaciones/{username}`
      // await set(userRef, username.trim());

      // Save additional details in `/users/{username}`
      const userDetailsRef = ref(database, `users/${username}`);
      await set(userDetailsRef, {
        username: username.trim(),
        createdAt: new Date().toISOString(),
        // Add more user-specific data here as needed
      });

      alert(`¡Registro exitoso! Bienvenido, ${username}`);
      setUsername('');
      router.push('/Login'); // Redirect to Login or another page as needed
    } catch (error) {
      console.error('Error al registrar el usuario:', error);
      alert('Hubo un problema con el registro. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col text-black items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl mb-4">Registro</h1>
      <input
        type="text"
        placeholder="Nombre de usuario"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="border p-2 mb-4 w-64"
      />
      <button
        onClick={handleRegister}
        disabled={loading || !username}
        className="bg-blue-500 text-white p-2"
      >
        {loading ? 'Registrando...' : 'Registrarse'}
      </button>
    </div>
  );
}
