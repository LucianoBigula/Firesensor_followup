"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { FollowUp } from '@/types/follow-up';

interface StatusValueBreakdownProps {
  data: FollowUp[];
}

export const StatusValueBreakdown = ({ data }: StatusValueBreakdownProps) => {
  const groupedData = data.reduce((acc: any, curr) => {
    let group = curr.status;
    if (curr.status === 'Perdida' || curr.status === 'Cancelada') {
      group = 'Perdida/Can.';
    }
    
    acc[group] = (acc[group] || 0) + curr.valor;
    return acc;
  }, { 'Ganha': 0, 'Em Andamento': 0, 'Perdida/Can.': 0 });

  const chartData = [
    { name: 'Ganha', value: groupedData['Ganha'] },
    { name: 'Em Andamento', value: groupedData['Em Andamento'] },
    { name: 'Perdida/Can.', value: groupedData['Perdida/Can.'] },
  ];

  const COLORS = {
    'Ganha': '#10b981',
    'Em Andamento': '#3b82f6',
    'Perdida/Can.': '#71717a'
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