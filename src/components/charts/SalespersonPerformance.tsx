"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { FollowUp } from '@/types/follow-up';

interface SalespersonPerformanceProps {
  data: FollowUp[];
}

export const SalespersonPerformance = ({ data }: SalespersonPerformanceProps) => {
  // Agrupar valores por vendedor
  const salesData = data.reduce((acc: any, curr) => {
    acc[curr.vendedor] = (acc[curr.vendedor] || 0) + curr.valor;
    return acc;
  }, {});

  const chartData = Object.keys(salesData)
    .map(name => ({
      name,
      value: salesData[name]
    }))
    .sort((a, b) => b.value - a.value); // Ordenar do maior para o menor

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart 
          data={chartData} 
          layout="vertical" 
          margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#27272a" horizontal={true} vertical={false} />
          <XAxis 
            type="number"
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#71717a', fontSize: 10 }}
            tickFormatter={(value) => `R$ ${value / 1000}k`}
          />
          <YAxis 
            dataKey="name" 
            type="category"
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#fff', fontSize: 12 }}
            width={80}
          />
          <Tooltip 
            cursor={{ fill: '#27272a' }}
            contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px' }}
            formatter={(value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)}
          />
          <Bar dataKey="value" radius={[0, 4, 4, 0]} fill="#ef4444" barSize={20} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};