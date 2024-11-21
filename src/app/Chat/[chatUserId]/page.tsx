"use client"
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { database, ref, onValue, push, set } from '../../firebase';

interface Message {
  id: string;
  texto: string;
  sender: string;
  content: string;
  timestamp: number;
  userId: string;
}

export default function ChatPage() {
  const router = useRouter();
  const { chatUserId } = useParams(); // ID del usuario con el que se está chateando
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState('');

  useEffect(() => {
    // Obtener el ID del usuario actual desde el almacenamiento local
    const id = typeof window !== "undefined" ? localStorage.getItem("username") : null;
    setCurrentUserId(id);

    if (id && chatUserId) {
      const chatRef = ref(database, `conversaciones/${id}/${chatUserId}/mensajes`);

      onValue(chatRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const messagesArray = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }));
          setMessages(messagesArray);
        }
      });
    }
  }, [chatUserId]);

  const handleSendMessage = async () => {
    if (messageText.trim()) {
      const messageRef = ref(database, `conversaciones/${currentUserId}/${chatUserId}/mensajes`);
      const newMessageRef = push(messageRef);

      // Guarda el mensaje en la ruta del usuario actual, incluyendo el ID del remitente
      await set(newMessageRef, {
        texto: messageText,
        timestamp: new Date().toISOString(),
        userId: currentUserId, // Agregar el ID del usuario que envía el mensaje
      });

      // Guarda el mensaje en la ruta del destinatario
      const recipientMessageRef = ref(database, `conversaciones/${chatUserId}/${currentUserId}/mensajes`);
      const recipientNewMessageRef = push(recipientMessageRef);

      await set(recipientNewMessageRef, {
        texto: messageText,
        timestamp: new Date().toISOString(),
        userId: currentUserId, // Agregar el ID del usuario que envía el mensaje
      });

      setMessageText(''); // Limpiar el campo de entrada después de enviar
    }
  };

  const handleback = () => {
    router.push("/Chat");
  };

  const handleLogout = () => {
    // Eliminar el userId del almacenamiento local
    localStorage.removeItem("username");
    // Redirigir al login
    router.push("/Login"); // Cambia "/Login" a la ruta correcta de tu página de login
  };


  return (
    <div className="flex flex-col text-black h-screen p-4 bg-gray-200">
      <h1 className="text-xl mb-4">Chat con Usuario {chatUserId}</h1>
      <div className='pl-2'>
        <button onClick={handleback} className="mb-4 p-2 w-32 h-12 bg-blue-500 text-white rounded">
          Volver
        </button>
        <button onClick={handleLogout} className="mb-4 p-2 w-32 h-12 bg-red-500 text-white rounded">
          Salir
        </button>
      </div>
      <div className="flex-1 overflow-y-auto bg-white rounded p-4 mb-4">
        {messages.map((message) => (
          <div key={message.id} className={`mb-2 ${message.userId === currentUserId ? 'text-right' : 'text-left'}`}>
            <div className={`inline-block p-2 rounded-lg ${message.userId === currentUserId ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'}`}>
              <p>{message.texto}</p>
              <span className="text-gray-600 text-sm">{new Date(message.timestamp).toLocaleString()}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="flex">
        <input
          type="text"
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          className="flex-1 p-2 border rounded"
          placeholder="Escribe un mensaje..."
        />
        <button
          onClick={handleSendMessage}
          className="ml-2 p-2 bg-blue-500 text-white rounded"
        >
          Enviar
        </button>
      </div>
    </div>
  );
};
