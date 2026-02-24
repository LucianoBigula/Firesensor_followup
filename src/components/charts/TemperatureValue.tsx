"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { FollowUp } from '@/types/follow-up';

interface TemperatureValueProps {
  data: FollowUp[];
}

export const TemperatureValue = ({ data }: TemperatureValueProps) => {
  const tempData = data.reduce((acc: any, curr) => {
    acc[curr.temperatura] = (acc[curr.temperatura] || 0) + curr.valor;
    return acc;
  }, { 'Quente': 0, 'Morna': 0, 'Fria': 0 });

  const chartData = [
    { name: 'Quente', value: tempData['Quente'] },
    { name: 'Morna', value: tempData['Morna'] },
    { name: 'Fria', value: tempData['Fria'] },
  ];

  const COLORS = {
    'Quente': '#ef4444',
    'Morna': '#f59e0b',
    'Fria': '#3b82f6'
  };

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#71717a', fontSize: 12 }}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#71717a', fontSize: 12 }}
            tickFormatter={(value) => `R$ ${value / 1000}k`}
          />
          <Tooltip 
            cursor={{ fill: '#27272a' }}
            contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px' }}
            formatter={(value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)}
          />
          <Bar dataKey="value" radius={[4, 4, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[entry.name as keyof typeof COLORS]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};