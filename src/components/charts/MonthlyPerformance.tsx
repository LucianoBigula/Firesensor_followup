"use client";

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { FollowUp } from '@/types/follow-up';
import { parseISO, getMonth, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface MonthlyPerformanceProps {
  data: FollowUp[];
}

export const MonthlyPerformance = ({ data }: MonthlyPerformanceProps) => {
  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];
  
  const chartData = months.map((month, index) => {
    const monthlyFollowUps = data.filter(f => {
      if (!f.dataAtualizacao) return false;
      const date = parseISO(f.dataAtualizacao);
      return getMonth(date) === index;
    });

    return {
      name: month.substring(0, 3), // Abreviação (Jan, Fev...)
      fullName: month,
      quantidade: monthlyFollowUps.length,
      valor: monthlyFollowUps.reduce((acc, curr) => acc + curr.valor, 0)
    };
  });

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorQty" x1="0" y1="0" x2="0" y2="1">
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
            labelStyle={{ color: '#fff', fontWeight: 'bold', marginBottom: '4px' }}
            formatter={(value: number, name: string) => [
              name === 'valor' 
                ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
                : value,
              name === 'valor' ? 'Valor Total' : 'Quantidade'
            ]}
          />
          <Area 
            type="monotone" 
            dataKey="quantidade" 
            stroke="#ef4444" 
            fillOpacity={1} 
            fill="url(#colorQty)" 
            strokeWidth={3}
            name="quantidade"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};