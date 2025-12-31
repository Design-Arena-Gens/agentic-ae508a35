'use client';

import { LucideIcon } from 'lucide-react';

interface AnalyticsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
  color?: string;
}

export default function AnalyticsCard({
  title,
  value,
  icon: Icon,
  trend,
  trendUp,
  color = 'blue',
}: AnalyticsCardProps) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600',
    pink: 'bg-pink-50 text-pink-600',
    indigo: 'bg-indigo-50 text-indigo-600',
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {trend && (
            <p
              className={`text-sm mt-2 ${
                trendUp ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {trendUp ? '↑' : '↓'} {trend}
            </p>
          )}
        </div>
        <div
          className={`p-3 rounded-lg ${
            colorClasses[color as keyof typeof colorClasses]
          }`}
        >
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}
