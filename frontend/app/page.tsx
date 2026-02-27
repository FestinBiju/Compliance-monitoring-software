'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';

export default function Home() {
  const [health, setHealth] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const response = await api.get('/health');
        setHealth(response.data);
        setError(null);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    checkHealth();
  }, []);

  return (
    <main className="min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-4">
        Indian Compliance Monitoring Platform
      </h1>

      <div className="bg-gray-100 p-4 rounded">
        <h2 className="text-xl font-semibold mb-2">Backend Status</h2>
        
        {loading && <p>Loading...</p>}
        
        {error && (
          <div className="text-red-600">
            <p>Error: {error}</p>
          </div>
        )}
        
        {health && (
          <div>
            <p className="mb-2">
              Status: <span className="font-semibold">{health.status}</span>
            </p>
            <pre className="bg-white p-2 rounded text-sm overflow-auto">
              {JSON.stringify(health, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </main>
  );
}
