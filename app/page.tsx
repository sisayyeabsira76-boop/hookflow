 'use client';

import { useState } from 'react';
import { Zap, Plus, Globe, CheckCircle2, Trash2, RotateCw } from 'lucide-react';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('events');
  const [endpoints, setEndpoints] = useState([
    { id: 1, name: 'Production Merchant API', url: 'https://api.merchant.com/webhooks', status: 'Active' },
    { id: 2, name: 'Billing Service Hook', url: 'https://billing.internal/hooks', status: 'Active' }
  ]);
  
  // የሙከራ ዌብኮክ ኢቨንቶች ዝርዝር (ከ Replay ቁልፍ ጋር)
  const [events, setEvents] = useState([
    { id: 'evt_101', endpointUrl: 'https://api.merchant.com/webhooks', status: 'Failed', createdAt: '2 mins ago' },
    { id: 'evt_102', endpointUrl: 'https://billing.internal/hooks', status: 'Success', createdAt: '15 mins ago' }
  ]);

  const [newUrl, setNewUrl] = useState('');
  const [newName, setNewName] = useState('');

  const handleAddEndpoint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl || !newName) return;
    setEndpoints([...endpoints, { id: Date.now(), name: newName, url: newUrl, status: 'Active' }]);
    setNewUrl('');
    setNewName('');
  };

  
  const handleReplay = async (eventId: string) => {
    try {
      const res = await fetch('/api/events/replay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId }),
      });
      const data = await res.json();
      if (res.ok) {
        alert("Event replayed and queued successfully!");
      } else {
        alert('Error: ${data.error}');
      }
    } catch (err) {
      console.error("Failed to replay event", err);
      alert("Failed to replay event.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <header className="border-b border-slate-800 bg-slate-900/50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-xl text-white">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-lg">HookFlow</h1>
            <p className="text-xs text-slate-400">Enterprise Webhook Infrastructure</p>
          </div>
        </div>
      </header>

      <main className="flex-1 p-6 max-w-7xl mx-auto w-full space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl">
            <span className="text-sm text-slate-400">Total Events</span>
            <div className="text-2xl font-bold mt-2">1,284,932</div>
          </div>
          <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl">
            <span className="text-sm text-slate-400">Success Rate</span>
            <div className="text-2xl font-bold mt-2 text-emerald-400">99.8%</div>
          </div>
          <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl">
            <span className="text-sm text-slate-400">Failed Dispatches</span>
            <div className="text-2xl font-bold mt-2 text-rose-400">241</div>
          </div>
          <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl">
            <span className="text-sm text-slate-400">Avg Latency</span>
            <div className="text-2xl font-bold mt-2 text-amber-400">42ms</div>
          </div>
        </div>

        <div className="flex border-b border-slate-800 gap-6">
          <button 
            onClick={() => setActiveTab('events')}
            className={'pb-3 text-sm font-medium border-b-2 ' + (activeTab === 'events' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400')}
          >
             Recent Webhook Events
          </button>
          <button 
            onClick={() => setActiveTab('endpoints')}
            className={'pb-3 text-sm font-medium border-b-2 ' + (activeTab === 'endpoints' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400')}
          >
            Configured Endpoints
          </button>
        </div>

        {activeTab === 'events' ? (
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="font-semibold text-slate-200">Recent Dispatched Events</h3>
            <p className="text-slate-400 text-sm">Real-time webhook event logs processed via event queues.</p>
            
            <div className="space-y-3">
              {events.map((ev) => (
                <div key={ev.id} className="flex items-center justify-between p-4 bg-slate-950 border border-slate-800 rounded-xl">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-indigo-400">{ev.id}</span>
                      <span className={text-xs px-2 py-0.5 rounded-full ${ev.status === 'Success' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}}>
                        {ev.status}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 font-mono">{ev.endpointUrl}</div>
                  </div>
                  <button 
                    onClick={() => handleReplay(ev.id)}
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs rounded-xl flex items-center gap-1.5 transition font-medium"
                  >
                    <RotateCw className="w-3.5 h-3.5" /> Replay
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <form onSubmit={handleAddEndpoint} className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 space-y-4">
              <h3 className="font-semibold text-slate-200 flex items-center gap-2">
                <Plus className="w-4 h-4 text-indigo-400" /> Register New Endpoint
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input 
                  type="text" 
                  placeholder="Endpoint Name (e.g. Billing Service)" 
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                />
                <input 
                  type="url" 
                  placeholder="Payload URL (https://...)" 
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition">
                Add Endpoint
              </button>
            </form>

            <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 space-y-4">
              <h3 className="font-semibold text-slate-200">Active Endpoints ({endpoints.length})</h3>
              <div className="space-y-3">
                {endpoints.map((ep) => (
                  <div key={ep.id} className="flex items-center justify-between p-4 bg-slate-950 border border-slate-800 rounded-xl">
                <div className="flex items-center gap-3">
                      <Globe className="w-5 h-5 text-indigo-400" />
                      <div>
                        <div className="font-medium text-slate-200 text-sm">{ep.name}</div>
                        <div className="text-xs text-slate-400 font-mono">{ep.url}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> {ep.status}
                      </span>
                      <button 
                        type="button"
                        onClick={() => setEndpoints(endpoints.filter(item => item.id !== ep.id))}
                        className="text-slate-500 hover:text-rose-400 transition p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}