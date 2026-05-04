"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Prospecting } from "@/types/prospecting";
import { FollowUp } from "@/types/follow-up";
import { isBefore, isToday, startOfDay } from "date-fns";
import { AlertTriangle, Bell, CalendarCheck } from "lucide-react";
import { useMemo } from "react";

interface CommercialAlertsProps {
  prospects: Prospecting[];
  followUps: FollowUp[];
}

export const CommercialAlerts = ({ prospects, followUps }: CommercialAlertsProps) => {
  const alerts = useMemo(() => {
    const today = startOfDay(new Date());
    
    const overdueProspects = prospects.filter(p => p.dataProximoPasso && isBefore(startOfDay(new Date(p.dataProximoPasso.split('-').map(Number)[0], p.dataProximoPasso.split('-').map(Number)[1] - 1, p.dataProximoPasso.split('-').map(Number)[2])), today));
    const todayProspects = prospects.filter(p => p.dataProximoPasso && isToday(startOfDay(new Date(p.dataProximoPasso.split('-').map(Number)[0], p.dataProximoPasso.split('-').map(Number)[1] - 1, p.dataProximoPasso.split('-').map(Number)[2]))));
    
    const overdueFollowUps = followUps.filter(f => f.status === 'Em Andamento' && f.dataProximaAcao && isBefore(startOfDay(new Date(f.dataProximaAcao.split('-').map(Number)[0], f.dataProximaAcao.split('-').map(Number)[1] - 1, f.dataProximaAcao.split('-').map(Number)[2])), today));
    const todayFollowUps = followUps.filter(f => f.status === 'Em Andamento' && f.dataProximaAcao && isToday(startOfDay(new Date(f.dataProximaAcao.split('-').map(Number)[0], f.dataProximaAcao.split('-').map(Number)[1] - 1, f.dataProximaAcao.split('-').map(Number)[2]))));

    return {
      overdueCount: overdueProspects.length + overdueFollowUps.length,
      todayCount: todayProspects.length + todayFollowUps.length
    };
  }, [prospects, followUps]);

  if (alerts.overdueCount === 0 && alerts.todayCount === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      {alerts.overdueCount > 0 && (
        <Alert variant="destructive" className="bg-red-500/10 border-red-500/50 text-red-500">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle className="font-bold">Atenção: Atividades Atrasadas</AlertTitle>
          <AlertDescription>
            Você possui <strong>{alerts.overdueCount}</strong> tarefas com prazo vencido. Verifique as tabelas para regularizar.
          </AlertDescription>
        </Alert>
      )}
      {alerts.todayCount > 0 && (
        <Alert className="bg-amber-500/10 border-amber-500/50 text-amber-500">
          <CalendarCheck className="h-4 w-4" />
          <AlertTitle className="font-bold">Agenda de Hoje</AlertTitle>
          <AlertDescription>
            Existem <strong>{alerts.todayCount}</strong> compromissos agendados para hoje.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};