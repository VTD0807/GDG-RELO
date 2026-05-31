import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'settings' | 'analytics'>('settings');
  const [businessId, setBusinessId] = useState('');
  const [name, setName] = useState('');
  const [context, setContext] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [sessions, setSessions] = useState<any[]>([]);

  useEffect(() => {
    const id = localStorage.getItem('relo_business_id');
    if (!id) {
      navigate('/register');
      return;
    }
    setBusinessId(id);

    const fetchData = async () => {
      try {
        const auth = await import('../lib/firebase').then(m => m.app);
        const { getAuth } = await import('firebase/auth');
        const currentUser = getAuth(auth).currentUser;
        const token = currentUser ? await currentUser.getIdToken() : '';

        const [bizRes, seshRes] = await Promise.all([
          fetch(`${API_URL}/business/${id}`),
          fetch(`${API_URL}/business/${id}/sessions`, {
            headers: { 'Authorization': `Bearer ${token}` }
          })
        ]);

        if (bizRes.ok) {
          const bizData = await bizRes.json();
          setName(bizData.name);
          setContext(bizData.context);
        } else {
          localStorage.removeItem('relo_business_id');
          navigate('/register');
          return;
        }

        if (seshRes.ok) {
          const seshData = await seshRes.json();
          setSessions(seshData);
        }
      } catch (error) {
        console.error('Failed to fetch data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
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
        body: JSON.stringify({ businessId, name, context }),
      });
      if (!response.ok) {
        alert('Failed to update settings');
      } else {
        alert('Settings saved!');
      }
    } catch (error) {
      alert('Network error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center dark:bg-[#121212] dark:text-white">Loading...</div>;
  }

  const shareableUrl = `${window.location.origin}/?biz=${businessId}`;

  // Simple Analytics Calculation
  const totalInteractions = sessions.reduce((acc, s) => acc + s.turns.length, 0);
  const avgSentiment = sessions.reduce((acc, s) => acc + s.turns.reduce((tAcc: number, t: any) => tAcc + (1 - t.frustrationScore), 0), 0) / (totalInteractions || 1);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#121212] py-12 px-4 sm:px-6 lg:px-8 font-sans text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 flex justify-between items-end border-b border-gray-200 dark:border-gray-800 pb-4">
          <div>
            <h1 className="text-3xl font-bold text-[var(--color-relo)] dark:text-indigo-400">Dashboard</h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Manage your Relo AI Settings</p>
          </div>
          <div className="flex space-x-4">
            <button 
              onClick={() => setActiveTab('settings')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'settings' ? 'bg-[var(--color-relo)] text-white' : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300'}`}
            >
              Settings
            </button>
            <button 
              onClick={() => setActiveTab('analytics')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'analytics' ? 'bg-[var(--color-relo)] text-white' : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300'}`}
            >
              History & Analytics
            </button>
          </div>
        </header>

        {activeTab === 'settings' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in">
            {/* Settings Column */}
            <div className="bg-white dark:bg-[#1e1e1e] p-6 shadow rounded-lg border border-gray-200 dark:border-gray-800">
              <h2 className="text-xl font-semibold mb-6">AI Context Setup</h2>
              <form onSubmit={handleUpdate} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Business Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-[var(--color-relo)] focus:border-[var(--color-relo)] sm:text-sm bg-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Business Rules & Context</label>
                  <textarea
                    rows={6}
                    required
                    value={context}
                    onChange={(e) => setContext(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-[var(--color-relo)] focus:border-[var(--color-relo)] sm:text-sm bg-transparent"
                  />
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[var(--color-relo)] hover:bg-[#2a245e] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-relo)] transition-colors duration-300 disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Settings'}
                </button>
              </form>
            </div>

            {/* Share/Preview Column */}
            <div className="space-y-8">
              <div className="bg-white dark:bg-[#1e1e1e] p-6 shadow rounded-lg border border-gray-200 dark:border-gray-800">
                <h2 className="text-xl font-semibold mb-4">Customer Link</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  Share this link with your customers so they can speak to your customized Relo assistant.
                </p>
                <div className="flex">
                  <input
                    type="text"
                    readOnly
                    value={shareableUrl}
                    className="flex-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-l-md bg-gray-50 dark:bg-[#252525] text-sm text-gray-500"
                  />
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(shareableUrl);
                      alert('Copied to clipboard!');
                    }}
                    className="px-4 py-2 border border-transparent rounded-r-md shadow-sm text-sm font-medium text-white bg-gray-800 hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600"
                  >
                    Copy
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-8 animate-fade-in">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-[#1e1e1e] p-6 shadow rounded-lg border border-gray-200 dark:border-gray-800">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Total Conversations</p>
                <p className="mt-2 text-4xl font-extrabold text-gray-900 dark:text-white">{sessions.length}</p>
              </div>
              <div className="bg-white dark:bg-[#1e1e1e] p-6 shadow rounded-lg border border-gray-200 dark:border-gray-800">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Total Interactions</p>
                <p className="mt-2 text-4xl font-extrabold text-gray-900 dark:text-white">{totalInteractions}</p>
              </div>
              <div className="bg-white dark:bg-[#1e1e1e] p-6 shadow rounded-lg border border-gray-200 dark:border-gray-800">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Avg Sentiment</p>
                <p className="mt-2 text-4xl font-extrabold text-gray-900 dark:text-white">{Math.round(avgSentiment * 100)}%</p>
              </div>
            </div>

            {/* History Table */}
            <div className="bg-white dark:bg-[#1e1e1e] shadow rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-800">
                <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">Recent Customer Interactions</h3>
              </div>
              <ul className="divide-y divide-gray-200 dark:divide-gray-800 max-h-96 overflow-y-auto">
                {sessions.length === 0 ? (
                  <li className="px-6 py-4 text-gray-500 dark:text-gray-400 text-center">No conversations yet.</li>
                ) : (
                  sessions.map((s, i) => (
                    <li key={i} className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-[#252525] transition-colors">
                      <div className="flex justify-between mb-2">
                        <span className="text-xs text-gray-500 dark:text-gray-400">{new Date(s.updatedAt).toLocaleString()}</span>
                        <span className="text-xs font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">Session: {s.sessionId.substring(0,8)}</span>
                      </div>
                      <div className="space-y-3">
                        {s.turns.map((t: any, j: number) => (
                          <div key={j} className="text-sm">
                            <p className="font-semibold text-gray-700 dark:text-gray-300">Customer: <span className="font-normal text-gray-900 dark:text-gray-100">{t.transcript}</span></p>
                            <p className="font-semibold text-[var(--color-relo)] dark:text-indigo-400 mt-1">AI: <span className="font-normal">{t.voiceReply}</span></p>
                            <div className="flex space-x-2 mt-2">
                              <span className="text-[10px] px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded-full">{t.intent}</span>
                              <span className="text-[10px] px-2 py-0.5 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-full">Frustration: {t.frustrationScore.toFixed(2)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </li>
                  ))
                )}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
