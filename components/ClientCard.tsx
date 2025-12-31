'use client';

import { Client } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';
import {
  User,
  Brain,
  TrendingUp,
  MessageSquare,
  MousePointerClick,
} from 'lucide-react';

interface ClientCardProps {
  client: Client;
  onClick?: () => void;
}

const personalityColors = {
  curious: 'bg-blue-100 text-blue-800 border-blue-200',
  hesitant: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  'quick-tempered': 'bg-red-100 text-red-800 border-red-200',
  skeptical: 'bg-gray-100 text-gray-800 border-gray-200',
  'highly-engaged': 'bg-green-100 text-green-800 border-green-200',
};

const stageColors = {
  awareness: 'bg-gray-50 text-gray-700',
  interest: 'bg-blue-50 text-blue-700',
  consideration: 'bg-purple-50 text-purple-700',
  intent: 'bg-orange-50 text-orange-700',
  purchase: 'bg-green-50 text-green-700',
};

export default function ClientCard({ client, onClick }: ClientCardProps) {
  const probabilityColor =
    client.conversionProbability >= 0.7
      ? 'text-green-600'
      : client.conversionProbability >= 0.4
      ? 'text-orange-600'
      : 'text-gray-600';

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 hover:shadow-md transition-all cursor-pointer hover:border-blue-300"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-full p-2">
            <User className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{client.username}</h3>
            {client.name && (
              <p className="text-sm text-gray-500">{client.name}</p>
            )}
          </div>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium border ${
            personalityColors[client.personality]
          }`}
        >
          {client.personality}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-600">
            {client.totalInteractions} interactions
          </span>
        </div>
        <div className="flex items-center gap-2">
          <MousePointerClick className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-600">
            {client.linkClicks} clicks
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <TrendingUp className={`w-4 h-4 ${probabilityColor}`} />
          <span className={`text-sm font-medium ${probabilityColor}`}>
            {(client.conversionProbability * 100).toFixed(0)}% conversion
          </span>
        </div>
        <span
          className={`px-2 py-1 rounded text-xs font-medium ${
            stageColors[client.stage]
          }`}
        >
          {client.stage}
        </span>
      </div>

      <div className="mt-3 text-xs text-gray-500">
        Last active {formatDistanceToNow(new Date(client.lastInteraction))} ago
      </div>
    </div>
  );
}
