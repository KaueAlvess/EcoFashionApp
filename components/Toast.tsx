import React from 'react';

export default function Toast({ message, type }: { message: string; type?: 'success' | 'error' }) {
  if (!message) return null;
  return (
    <div
      style={{
        position: 'fixed',
        bottom: 32,
        left: '50%',
        transform: 'translateX(-50%)',
        background: type === 'error' ? '#ff5252' : '#43ea7a',
        color: '#fff',
        padding: '12px 32px',
        borderRadius: 24,
        fontWeight: 'bold',
        fontSize: 16,
        boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
        zIndex: 9999,
      }}
    >
      {message}
    </div>
  );
}
