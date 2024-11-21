"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ref, onValue, get, child } from "firebase/database";
import { database } from "../firebase";

interface Conversacion {
  username: string;
  últimoMensaje: string;
  timestamp: number | null;
}

export default function ChatPage() {
  const [conversaciones, setConversaciones] = useState<Conversacion[]>([]);
  const [, setCurrentUsername] = useState<string | null>(null);
  const [targetUsername, setTargetUsername] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const username = typeof window !== "undefined" ? localStorage.getItem("username") : null;
    setCurrentUsername(username);

    if (username) {
      const userRef = ref(database, `conversaciones/${username}`);

      onValue(userRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const conversacionesArray = Object.keys(data).map((key) => {
            const mensajes = data[key].mensajes ? Object.values(data[key].mensajes) : [];
            const últimoMensaje = mensajes.length > 0 ? String((mensajes[mensajes.length - 1] as { texto: string }).texto) : '';
            const timestamp = mensajes.length > 0 ? (mensajes[mensajes.length - 1] as { timestamp: number }).timestamp : null;
            return { username: key, últimoMensaje, timestamp };
          });

          // Orden descendente por timestamp
          conversacionesArray.sort((a, b) => (b.timestamp ?? 0) - (a.timestamp ?? 0));
          setConversaciones(conversacionesArray);
        }
      });
    }
  }, [router]);

  const handleOpenChat = async () => {
    if (targetUsername.trim()) {
      try {
        const userRef = ref(database);
        const snapshot = await get(child(userRef, `users/${targetUsername.trim()}`));

        if (snapshot.exists()) {
          setError(null);
          router.push(`/Chat/${targetUsername.trim()}`);
        } else {
          setError('El usuario no existe.');
        }
      } catch (error) {
        console.error('Error al verificar el usuario en Firebase:', error);
        setError('Hubo un problema al verificar el usuario.');
      }
    } else {
      setError('Por favor, ingrese un nombre de usuario válido.');
    }
  };

  const handleOpenChat2 = (username: string) => {
    router.push(`/Chat/${username}`);
  };

  const handleLogout = () => {
    localStorage.removeItem("username");
    router.push("/Login");
  };

  return (
    <div className="flex flex-col text-black items-center justify-center h-screen bg-gray-200 p-4">
      <button onClick={handleLogout} className="mb-4 p-2 w-32 h-12 bg-red-500 text-white rounded">
        Salir
      </button>
      <div className="items-center justify-center h-64 bg-gray-200">
        <h1 className="text-2xl mb-4">Selecciona un Chat</h1>
        <input
          type="text"
          placeholder="Ingrese el nombre de usuario con quien chatear"
          value={targetUsername}
          onChange={(e) => setTargetUsername(e.target.value)}
          className="border p-2 mb-4 w-64"
        />
        <button onClick={handleOpenChat} className="bg-blue-500 text-white px-4 py-2 rounded">
          Abrir Chat
        </button>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>
      <div className="items-center justify-items-center w-screen h-screen bg-gray-200">
        <h1 className="text-xl mb-4">Conversaciones</h1>
        <div className="bg-white rounded p-4 w-full max-w-md h-80 overflow-y-auto">
          {conversaciones.length === 0 ? (
            <p>No tienes conversaciones.</p>
          ) : (
            conversaciones.map((conversacion) => (
              <div
                key={conversacion.username}
                className="flex flex-col justify-between p-2 border-b cursor-pointer"
                onClick={() => handleOpenChat2(conversacion.username)}
              >
                <span className="font-bold">{conversacion.username}</span>
                <span className="text-gray-600">{conversacion.últimoMensaje}</span>
                <span className="text-gray-500 text-sm">
                  {conversacion.timestamp ? new Date(conversacion.timestamp).toLocaleString() : ''}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
