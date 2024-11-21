"use client"
import React from 'react';

export default function LoginPage() {
    const handleLogin = () => {
        window.location.href = `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/auth/login`;
    };

    return (
        <div>
            <h1>Login Page</h1>
            <button onClick={handleLogin}>Iniciar Sesión con GitHub</button>
        </div>
    );
}
