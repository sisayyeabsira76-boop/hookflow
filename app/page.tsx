 'use client';

import { useState } from 'react';
import { RotateCw, Zap, Plus, Globe } from 'lucide-react';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('endpoints');
  const [endpoints, setEndpoints] = useState([
    { id: 1, name: 'Production Merchant API', url: 'https://api.merchant.com/webhooks' },
    { id: 2, name: 'Billing Service Hook', url: 'https://billing.internal/hooks' },
    { id: 3, name: 'my test service', url: 'https://webhook.site/test-endpoint' }
  ]);

  const [newName, setNewName] = useState('');
  const [newUrl, setNewUrl] = useState('');

  const [events, setEvents] = useState([
    { id: 'evt_101', endpointUrl: 'https://api.merchant.com/webhooks', status: 'success', createdAt: '10:42:15' },
    { id: 'evt_102', endpointUrl: 'https://billing.internal/hooks', status: 'failed', createdAt: '10:40:02' }
  ]);
 
    async function handleReplay(id: string) {
    try {
      const response = await fetch('/api/webhooks/replay/${id}', {
        method: "POST",
      });
      
      if (response.ok) {
        alert("Webhook replayed successfully!");
      } else {
        alert("Failed to replay webhook.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }
  const handleAddEndpoint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newUrl) return;
    setEndpoints([...endpoints, { id: Date.now(), name: newName, url: newUrl }]);
    setNewName('');
    setNewUrl('');
  };

  return (
    <div className="min-h-screen bg-[#0a0f1d] text-slate-100 p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        
        
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-600 rounded-lg">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">HookFlow</h1>
            <p className="text-xs text-slate-400">Enterprise Webhook Infrastructure</p>
          </div>
        </div>

        {/* Stats Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-[#111827] border border-slate-800 p-4 rounded-xl">
            <p className="text-xs text-slate-400">Total Events</p>
            <h3 className="text-2xl font-bold text-white mt-1">280</h3>
          </div>
          <div className="bg-[#111827] border border-slate-800 p-4 rounded-xl">
            <p className="text-xs text-slate-400">Success Rate</p>
            <h3 className="text-2xl font-bold text-emerald-400 mt-1">80%</h3>
          </div>
          <div className="bg-[#111827] border border-slate-800 p-4 rounded-xl">
            <p className="text-xs text-slate-400">Failed Dispatches</p>
            <h3 className="text-2xl font-bold text-rose-400 mt-1">20</h3>
          </div>
          <div className="bg-[#111827] border border-slate-800 p-4 rounded-xl">
            <p className="text-xs text-slate-400">Avg Latency</p>
            <h3 className="text-2xl font-bold text-amber-400 mt-1">40ms</h3>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 space-x-6 text-sm">
          <button 
            onClick={() => setActiveTab('events')}
            className={activeTab === 'events' ? 'pb-3 font-medium transition-colors border-b-2 border-blue-500 text-white' : 'pb-3 font-medium transition-colors border-b-2 border-transparent text-slate-400 hover:text-slate-200'}
          >
            Recent Webhook Events
          </button>
          <button 
            onClick={() => setActiveTab('endpoints')}
            className={activeTab === 'endpoints' ? 'pb-3 font-medium transition-colors border-b-2 border-blue-500 text-white' : 'pb-3 font-medium transition-colors border-b-2 border-transparent text-slate-400 hover:text-slate-200'}
          >
            Configured Endpoints
          </button>
        </div>
 
        {activeTab === 'endpoints' ? (
         <div className="space-y-6">
           
            <div className="bg-[#111827] border border-slate-800 p-6 rounded-xl space-y-4">
              <h3 className="text-sm font-semibold flex items-center gap-2 text-white">
                <Plus className="w-4 h-4 text-blue-500" /> Register New Endpoint
              </h3>
              <form onSubmit={handleAddEndpoint} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div>
                  <input 
                    type="text" 
                    placeholder="Endpoint Name (e.g. Billing Service)" 
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full bg-[#0b101d] border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <input 
                    type="text" 
                    placeholder="Payload URL (https://...)" 
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                    className="w-full bg-[#0b101d] border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <button 
                    type="submit" 
                    className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors w-full md:w-auto"
                  >
                    Add Endpoint
                  </button>
                </div>
              </form>
            </div>

            
            <div className="bg-[#111827] border border-slate-800 p-6 rounded-xl space-y-4">
              <h3 className="text-sm font-semibold text-white">Active Endpoints ({endpoints.length})</h3>
              <div className="space-y-3">
                {endpoints.map((ep) => (
                  <div key={ep.id} className="flex items-center justify-between p-4 bg-[#0b101d] border border-slate-800/80 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Globe className="w-5 h-5 text-blue-400" />
                      <div>
                        <p className="text-sm font-medium text-white">{ep.name}</p>
                        <p className="text-xs text-slate-400 font-mono">{ep.url}</p>
                      </div>
                    </div>
                    <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Active
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          
          <div className="bg-[#111827] border border-slate-800 p-6 rounded-xl space-y-4">
            <h3 className="text-sm font-semibold text-white">Recent Webhook Deliveries</h3>
            <div className="space-y-3">
              {events.map((ev) => {
                const isSuccess = ev.status === 'success';
                const badgeClass = isSuccess 
                  ? "text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium" 
                  : "text-xs px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 font-medium";
                return (
                  <div key={ev.id} className="flex items-center justify-between p-4 bg-[#0b101d] border border-slate-800 rounded-lg">
                    <div className="space-y-1">
               <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-slate-400">{ev.id}</span>
                        <span className={badgeClass}>
                          {ev.status}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 font-mono">{ev.endpointUrl}</div>
                    </div>
                    <button
                      onClick={() => handleReplay(ev.id)}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors"
                    >
                      <RotateCw className="w-3.5 h-3.5" /> Replay
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}