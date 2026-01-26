'use client';

import { useState } from 'react';
import { supabase } from '../../../src/lib/supabaseClient';

export default function LoginPage() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const signUp = async () => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    setMessage(error ? error.message : 'Check your email to confirm signup');
  };

  const login = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setMessage(error ? error.message : 'Logged in');
  };

  return (
    <div style={{ maxWidth: 400, margin: '100px auto' }}>
      <h1>Continuum</h1>

      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <div style={{ marginTop: 12 }}>
        <button onClick={login}>Login</button>
        <button onClick={signUp} style={{ marginLeft: 8 }}>
          Sign Up
        </button>
      </div>

      {message && <p>{message}</p>}
    </div>
  );
}