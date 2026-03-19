"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FollowUp } from "@/types/follow-up";
import { StatusDistribution } from "./charts/StatusDistribution";
import { TemperatureValue } from "./charts/TemperatureValue";
import { MonthlyPerformance } from "./charts/MonthlyPerformance";
import { SalespersonPerformance } from "./charts/SalespersonPerformance";
import { StatusValueBreakdown } from "./charts/StatusValueBreakdown";

interface FollowUpDashboardProps {
  data: FollowUp[];
}

export const FollowUpDashboard = ({ data }: FollowUpDashboardProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="bg-zinc-900 border-zinc-800 shadow-xl">
        <CardHeader>
          <CardTitle className="text-white text-lg">Valor por Status Agrupado</CardTitle>
          <CardDescription className="text-zinc-500">Métrica financeira por estágio principal</CardDescription>
        </CardHeader>
        <CardContent>
          <StatusValueBreakdown data={data} />
        </CardContent>
      </Card>

      <Card className="bg-zinc-900 border-zinc-800 shadow-xl">
        <CardHeader>
          <CardTitle className="text-white text-lg">Distribuição por Status (Qtd)</CardTitle>
          <CardDescription className="text-zinc-500">Volume de propostas em cada estágio</CardDescription>
        </CardHeader>
        <CardContent>
          <StatusDistribution data={data} />
        </CardContent>
      </Card>

      <Card className="bg-zinc-900 border-zinc-800 shadow-xl">
        <CardHeader>
          <CardTitle className="text-white text-lg">Valor por Temperatura</CardTitle>
          <CardDescription className="text-zinc-500">Potencial financeiro por probabilidade de fechamento</CardDescription>
        </CardHeader>
        <CardContent>
          <TemperatureValue data={data} />
        </CardContent>
      </Card>

      <Card className="bg-zinc-900 border-zinc-800 shadow-xl">
        <CardHeader>
          <CardTitle className="text-white text-lg">Desempenho por Vendedor</CardTitle>
          <CardDescription className="text-zinc-500">Valor total de propostas por integrante da equipe</CardDescription>
        </CardHeader>
        <CardContent>
          <SalespersonPerformance data={data} />
        </CardContent>
      </Card>

      <Card className="bg-zinc-900 border-zinc-800 shadow-xl lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-white text-lg">Volume Mensal</CardTitle>
          <CardDescription className="text-zinc-500">Quantidade de propostas enviadas por mês do ano</CardDescription>
        </CardHeader>
        <CardContent>
          <MonthlyPerformance data={data} />
        </CardContent>
      </Card>
    </div>
  );
};