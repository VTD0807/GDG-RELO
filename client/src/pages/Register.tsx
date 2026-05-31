import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [context, setContext] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const auth = await import('../lib/firebase').then(m => m.app);
      const { getAuth } = await import('firebase/auth');
      const currentUser = getAuth(auth).currentUser;
      const token = currentUser ? await currentUser.getIdToken() : '';

      const response = await fetch(`${API_URL}/business`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name, context }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('relo_business_id', data.businessId);
        navigate('/dashboard');
      } else {
        alert('Failed to register business');
      }
    } catch (error) {
      console.error(error);
      alert('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#121212] flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <h2 className="text-3xl font-extrabold text-[var(--color-relo)] dark:text-indigo-400">Register your Business</h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Setup your Voice CX Assistant personality</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-[#1e1e1e] py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-200 dark:border-gray-800">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Business Name
              </label>
              <div className="mt-1">
                <input
                  id="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[var(--color-relo)] focus:border-[var(--color-relo)] sm:text-sm bg-transparent"
                  placeholder="e.g. Acme Corp"
                />
              </div>
            </div>

            <div>
              <label htmlFor="context" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Business Context & Rules
              </label>
              <div className="mt-1">
                <textarea
                  id="context"
                  rows={4}
                  required
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[var(--color-relo)] focus:border-[var(--color-relo)] sm:text-sm bg-transparent"
                  placeholder="e.g. We sell luxury shoes. We have a strict 30-day return policy. Never offer discounts."
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[var(--color-relo)] hover:bg-[#2a245e] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-relo)] transition-colors duration-300 disabled:opacity-50"
              >
                {loading ? 'Registering...' : 'Complete Setup'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
