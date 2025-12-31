'use client';

import { useState } from 'react';
import { Send, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function MessageSimulator() {
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleAnalyze = async () => {
    if (!username || !message) return;

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientUsername: username,
          message,
          interactionType: 'dm',
        }),
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ error: 'Failed to analyze message' });
    } finally {
      setLoading(false);
    }
  };

  const personalityEmojis = {
    curious: '🤔',
    hesitant: '😰',
    'quick-tempered': '😤',
    skeptical: '🤨',
    'highly-engaged': '🔥',
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">
        💬 Message Simulator
      </h2>
      <p className="text-sm text-gray-600 mb-6">
        Test the AI response engine with different client messages
      </p>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Instagram Username
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="@username"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Client Message
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type the client's message here..."
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
        </div>

        <button
          onClick={handleAnalyze}
          disabled={!username || !message || loading}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              Generate AI Response
            </>
          )}
        </button>
      </div>

      {result && !result.error && (
        <div className="mt-6 space-y-4">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200">
            <div className="flex items-start gap-3">
              <div className="bg-white rounded-full p-2">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">
                  AI Response
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {result.response.message}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h4 className="font-medium text-gray-900 mb-2">
                Client Analysis
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Personality:</span>
                  <span className="font-medium">
                    {personalityEmojis[result.client.personality as keyof typeof personalityEmojis]}{' '}
                    {result.client.personality}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Conversion:</span>
                  <span className="font-medium text-green-600">
                    {(result.client.conversionProbability * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h4 className="font-medium text-gray-900 mb-2">Strategy</h4>
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  {result.response.triggers.map((trigger: string) => (
                    <span
                      key={trigger}
                      className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-medium"
                    >
                      {trigger}
                    </span>
                  ))}
                </div>
                {result.response.followUpAction && (
                  <div className="text-sm text-gray-600 mt-2">
                    <span className="font-medium">Next:</span>{' '}
                    {result.response.followUpAction.replace(/_/g, ' ')}
                  </div>
                )}
              </div>
            </div>
          </div>

          {result.riskAssessment && !result.riskAssessment.safe && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-red-900 mb-1">Risk Alert</h4>
                <p className="text-sm text-red-700">
                  {result.riskAssessment.message}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {result && result.error && (
        <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">{result.error}</p>
        </div>
      )}
    </div>
  );
}
