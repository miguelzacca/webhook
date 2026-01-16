"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/webhook");
        if (res.ok) {
          const json = await res.json();
          if (json) {
            setData(json);
            setLastUpdated(new Date());
          }
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData(); // Initial fetch
    const interval = setInterval(fetchData, 2000); // Poll every 2 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col items-center justify-center p-8 font-sans">
      <div className="w-full max-w-3xl space-y-8">
        <header className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Live JSON Viewer
          </h1>
          <p className="text-neutral-400">
            Waiting for incoming webhooks...
          </p>
        </header>

        <div className="bg-neutral-900/50 backdrop-blur-md border border-neutral-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-xs text-neutral-500 font-mono">
              {lastUpdated ? `Updated: ${lastUpdated.toLocaleTimeString()}` : "Waiting..."}
            </span>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-64 text-neutral-500 animate-pulse">
              Connecting...
            </div>
          ) : data ? (
            <pre className="font-mono text-sm text-green-400 overflow-x-auto whitespace-pre-wrap break-words max-h-[70vh] overflow-y-auto custom-scrollbar">
              {JSON.stringify(data, null, 2)}
            </pre>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-neutral-500 space-y-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 opacity-50">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
              <p>No JSON received yet.</p>
              <p className="text-xs text-neutral-600">Send a POST request to <code className="bg-neutral-800 px-1 py-0.5 rounded text-neutral-400">/api/webhook</code> or GET request to <code className="bg-neutral-800 px-1 py-0.5 rounded text-neutral-400">/api/webhook/q</code></p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
