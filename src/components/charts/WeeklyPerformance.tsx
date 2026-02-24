"use client";

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { FollowUp } from '@/types/follow-up';

interface WeeklyPerformanceProps {
  data: FollowUp[];
}

export const WeeklyPerformance = ({ data }: WeeklyPerformanceProps) => {
  const weeks = ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4', 'Semana 5'];
  
  const chartData = weeks.map(week => ({
    name: week,
    quantidade: data.filter(f => f.semanaMes === week).length,
    valor: data.filter(f => f.semanaMes === week).reduce((acc, curr) => acc + curr.valor, 0)
  }));

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
            </linearGradient>
          </defs>
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
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px' }}
          />
          <Area 
            type="monotone" 
            dataKey="quantidade" 
            stroke="#ef4444" 
            fillOpacity={1} 
            fill="url(#colorVal)" 
            strokeWidth={3}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};