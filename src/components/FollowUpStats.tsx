import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FollowUp } from "@/types/follow-up";
import { TrendingUp, CheckCircle2, Clock, XCircle, Target } from "lucide-react";

interface FollowUpStatsProps {
  data: FollowUp[];
}

export const FollowUpStats = ({ data }: FollowUpStatsProps) => {
  const totalValor = data.reduce((acc, curr) => acc + curr.valor, 0);
  const ganhas = data.filter(f => f.status === 'Ganha').length;
  const emAndamento = data.filter(f => f.status === 'Em Andamento').length;
  const perdidas = data.filter(f => f.status === 'Perdida' || f.status === 'Cancelada').length;
  
  const totalEncerradas = ganhas + perdidas;
  const winRate = totalEncerradas > 0 ? (ganhas / totalEncerradas) * 100 : 0;

  const stats = [
    {
      title: "Valor Total",
      value: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalValor),
      icon: TrendingUp,
      color: "text-red-500",
      bg: "bg-red-500/10"
    },
    {
      title: "Vendas Ganhas",
      value: ganhas,
      icon: CheckCircle2,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10"
    },
    {
      title: "Taxa de Conversão",
      value: `${winRate.toFixed(1)}%`,
      icon: Target,
      color: "text-blue-500",
      bg: "bg-blue-500/10"
    },
    {
      title: "Em Andamento",
      value: emAndamento,
      icon: Clock,
      color: "text-amber-500",
      bg: "bg-amber-500/10"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, index) => (
        <Card key={index} className="bg-zinc-900 border-zinc-800 shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-zinc-400">
              {stat.title}
            </CardTitle>
            <div className={`${stat.bg} p-2 rounded-full`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};