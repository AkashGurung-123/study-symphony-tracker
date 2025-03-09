
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { getCompletedCreditHours, getTotalCreditHours } from '@/lib/data';

interface ProgressChartProps {
  className?: string;
}

export function ProgressChart({ className }: ProgressChartProps) {
  const completedHours = getCompletedCreditHours();
  const totalHours = getTotalCreditHours();
  const remainingHours = totalHours - completedHours;

  const data = [
    { name: 'Completed', value: completedHours },
    { name: 'Remaining', value: remainingHours },
  ];

  const COLORS = ['#3b82f6', '#e2e8f0'];

  const renderCustomizedLabel = ({ 
    cx, cy, midAngle, innerRadius, outerRadius, percent 
  }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor="middle" 
        dominantBaseline="central"
        className="text-xs font-medium"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const customTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass p-3 rounded-lg border shadow-sm">
          <p className="text-sm font-medium">{`${payload[0].name}: ${payload[0].value} hours`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={className}>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={80}
              innerRadius={40}
              fill="#8884d8"
              dataKey="value"
              animationDuration={800}
              animationBegin={100}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={customTooltip} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex justify-center gap-6 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-primary"></div>
          <span className="text-sm">Completed ({completedHours} hrs)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-secondary"></div>
          <span className="text-sm">Remaining ({remainingHours} hrs)</span>
        </div>
      </div>
    </div>
  );
}
