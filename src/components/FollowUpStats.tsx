import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FollowUp } from "@/types/follow-up";
import { TrendingUp, CheckCircle2, Clock, XCircle } from "lucide-react";

interface FollowUpStatsProps {
  data: FollowUp[];
}

export const FollowUpStats = ({ data }: FollowUpStatsProps) => {
  const totalValor = data.reduce((acc, curr) => acc + curr.valor, 0);
  const ganhas = data.filter(f => f.status === 'Ganha').length;
  const emAndamento = data.filter(f => f.status === 'Em Andamento').length;
  const perdidas = data.filter(f => f.status === 'Perdida' || f.status === 'Cancelada').length;

  const stats = [
    {
      title: "Valor Total",
      value: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalValor),
      icon: TrendingUp,
      color: "text-blue-600",
      bg: "bg-blue-50"
    },
    {
      title: "Vendas Ganhas",
      value: ganhas,
      icon: CheckCircle2,
      color: "text-emerald-600",
      bg: "bg-emerald-50"
    },
    {
      title: "Em Andamento",
      value: emAndamento,
      icon: Clock,
      color: "text-amber-600",
      bg: "bg-amber-50"
    },
    {
      title: "Perdidas/Can.",
      value: perdidas,
      icon: XCircle,
      color: "text-rose-600",
      bg: "bg-rose-50"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, index) => (
        <Card key={index} className="border-none shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <div className={`${stat.bg} p-2 rounded-full`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};