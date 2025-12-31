'use client';

import { useEffect, useState } from 'react';
import AnalyticsCard from '@/components/AnalyticsCard';
import ClientCard from '@/components/ClientCard';
import MessageSimulator from '@/components/MessageSimulator';
import {
  Users,
  MessageCircle,
  TrendingUp,
  DollarSign,
  MousePointerClick,
  Clock,
  Instagram,
  Zap,
  Shield,
  Target,
} from 'lucide-react';
import { Client, AnalyticsData } from '@/lib/types';

export default function Home() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [analyticsRes, clientsRes] = await Promise.all([
        fetch('/api/analytics'),
        fetch('/api/clients'),
      ]);

      const analyticsData = await analyticsRes.json();
      const clientsData = await clientsRes.json();

      setAnalytics(analyticsData.analytics);
      setClients(clientsData.clients);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading AI Sales Master...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-2">
                <Instagram className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Instagram AI Sales Master
                </h1>
                <p className="text-sm text-gray-600">
                  Intelligent client conversion & automation system
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                Active
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Key Features Banner */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-6 mb-8 text-white">
          <h2 className="text-xl font-bold mb-4">🎯 System Capabilities</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-start gap-3">
              <Zap className="w-5 h-5 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-sm">Real-Time Analysis</h3>
                <p className="text-xs opacity-90">
                  Instant personality classification
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Target className="w-5 h-5 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-sm">Smart Persuasion</h3>
                <p className="text-xs opacity-90">
                  FOMO, scarcity, social proof triggers
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-sm">Risk Protection</h3>
                <p className="text-xs opacity-90">
                  Rate limiting & compliance alerts
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <TrendingUp className="w-5 h-5 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-sm">Optimization</h3>
                <p className="text-xs opacity-90">
                  Continuous learning & improvement
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Analytics Cards */}
        {analytics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <AnalyticsCard
              title="Total Clients"
              value={analytics.totalClients}
              icon={Users}
              trend="+12% this week"
              trendUp={true}
              color="blue"
            />
            <AnalyticsCard
              title="Active Conversations"
              value={analytics.activeConversations}
              icon={MessageCircle}
              trend="Last 24 hours"
              trendUp={true}
              color="green"
            />
            <AnalyticsCard
              title="Conversion Rate"
              value={`${analytics.conversionRate.toFixed(1)}%`}
              icon={TrendingUp}
              trend="+5.3% this week"
              trendUp={true}
              color="purple"
            />
            <AnalyticsCard
              title="Link Click Rate"
              value={`${analytics.linkClickRate.toFixed(1)}%`}
              icon={MousePointerClick}
              trend="+8.7% this week"
              trendUp={true}
              color="orange"
            />
            <AnalyticsCard
              title="Revenue Generated"
              value={`$${analytics.revenueGenerated.toLocaleString()}`}
              icon={DollarSign}
              trend="+$1,782 this week"
              trendUp={true}
              color="green"
            />
            <AnalyticsCard
              title="Avg Response Time"
              value={`${analytics.averageResponseTime}s`}
              icon={Clock}
              trend="Lightning fast"
              trendUp={true}
              color="indigo"
            />
          </div>
        )}

        {/* Message Simulator */}
        <div className="mb-8">
          <MessageSimulator />
        </div>

        {/* Client List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Active Clients
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Manage and track all client interactions
              </p>
            </div>
            <button
              onClick={fetchData}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              Refresh
            </button>
          </div>

          {clients.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No clients yet. Use the simulator to create interactions.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {clients.map((client) => (
                <ClientCard key={client.id} client={client} />
              ))}
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-3">
            📋 How This System Works
          </h3>
          <div className="space-y-2 text-sm text-blue-800">
            <p>
              <strong>1. Client Analysis:</strong> Every message is analyzed to
              classify personality type (curious, hesitant, quick-tempered,
              skeptical, highly-engaged)
            </p>
            <p>
              <strong>2. Smart Response:</strong> AI generates persuasive
              responses using psychological triggers (FOMO, scarcity, social
              proof, authority)
            </p>
            <p>
              <strong>3. Conversion Tracking:</strong> Real-time monitoring of
              link clicks, engagement, and conversion probability
            </p>
            <p>
              <strong>4. Risk Protection:</strong> Built-in rate limiting and
              compliance checks to prevent account restrictions
            </p>
            <p>
              <strong>5. Continuous Optimization:</strong> System learns from
              each interaction to improve response quality and conversion rates
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
