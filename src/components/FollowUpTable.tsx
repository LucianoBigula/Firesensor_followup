import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FollowUp } from "@/types/follow-up";
import { format, isBefore, isToday, startOfDay } from "date-fns";
import { User, Trash2, Pencil, ArrowRightCircle, AlertTriangle, Calendar, Clock, FileText } from "lucide-react";
import { FollowUpForm } from "./FollowUpForm";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { base64ToBlob } from "@/utils/file-utils";

interface FollowUpTableProps {
  data: FollowUp[];
  onDelete: (id: string) => void;
  onUpdate: (followUp: FollowUp) => void;
}

export const FollowUpTable = ({ data, onDelete, onUpdate }: FollowUpTableProps) => {
  const getTempColor = (temp: string) => {
    switch (temp) {
      case 'Quente': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'Morna': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'Fria': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default: return '';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Ganha': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'Perdida': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'Cancelada': return 'bg-zinc-700/50 text-zinc-400 border-zinc-600';
      case 'Em Andamento': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default: return '';
    }
  };

  const formatDateCorrectly = (dateString?: string) => {
    if (!dateString) return "";
    const [year, month, day] = dateString.split('-').map(Number);
    return format(new Date(year, month - 1, day), 'dd/MM/yyyy');
  };

  const getDeadlineStyle = (dateString?: string, status?: string) => {
    if (!dateString || status !== 'Em Andamento') return { color: 'text-zinc-500', icon: null };
    
    const [year, month, day] = dateString.split('-').map(Number);
    const deadlineDate = startOfDay(new Date(year, month - 1, day));
    const today = startOfDay(new Date());

    if (isBefore(deadlineDate, today)) {
      return { 
        color: 'text-red-500 font-bold bg-red-500/10 px-2 py-1 rounded border border-red-500/20', 
        icon: <AlertTriangle className="h-3.5 w-3.5 animate-pulse" />,
        label: 'Atrasado'
      };
    }
    if (isToday(deadlineDate)) {
      return { 
        color: 'text-amber-500 font-bold bg-amber-500/10 px-2 py-1 rounded border border-amber-500/20', 
        icon: <Clock className="h-3.5 w-3.5" />,
        label: 'Hoje'
      };
    }
    return { 
      color: 'text-emerald-400 font-medium', 
      icon: <Calendar className="h-3.5 w-3.5" />,
      label: 'Agendado'
    };
  };

  const viewPdf = (base64: string) => {
    try {
      const blob = base64ToBlob(base64, 'application/pdf');
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
      // Limpa a URL da memória após um tempo para evitar vazamento
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (error) {
      console.error("Erro ao abrir PDF:", error);
    }
  };

  return (
    <div className="bg-zinc-900/50 rounded-xl shadow-2xl border border-zinc-800 overflow-hidden">
      <Table>
        <TableHeader className="bg-zinc-900">
          <TableRow className="border-zinc-800 hover:bg-transparent">
            <TableHead className="font-bold text-zinc-300">Vendedor</TableHead>
            <TableHead className="font-bold text-zinc-300">Proposta / Integrador</TableHead>
            <TableHead className="font-bold text-zinc-300">Status / Temp</TableHead>
            <TableHead className="font-bold text-zinc-300">Próxima Ação</TableHead>
            <TableHead className="font-bold text-zinc-300 min-w-[140px]">Prazo</TableHead>
            <TableHead className="font-bold text-right text-zinc-300">Valor</TableHead>
            <TableHead className="font-bold text-center text-zinc-300">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow className="border-zinc-800">
              <TableCell colSpan={7} className="text-center py-12 text-zinc-500">Nenhum registro encontrado.</TableCell>
            </TableRow>
          ) : (
            data.map((item) => {
              const deadline = getDeadlineStyle(item.dataProximaAcao, item.status);
              
              return (
                <TableRow key={item.id} className="border-zinc-800 hover:bg-zinc-800/30 transition-colors">
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <User className="h-3.5 w-3.5 text-zinc-500" />
                      <span className="font-medium text-sm text-zinc-200">{item.vendedor}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-red-400">#{item.numeroProposta}</span>
                        {item.arquivoPdf && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button 
                                  onClick={() => viewPdf(item.arquivoPdf!)}
                                  className="text-emerald-500 hover:text-emerald-400 transition-colors flex items-center gap-1"
                                >
                                  <FileText className="h-3.5 w-3.5" />
                                  <span className="text-[9px] font-bold uppercase">Ver PDF</span>
                                </button>
                              </TooltipTrigger>
                              <TooltipContent className="bg-zinc-800 border-zinc-700 text-white">
                                <p>Visualizar/Baixar: {item.nomeArquivo}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </div>
                      <span className="text-xs text-zinc-200 font-semibold">{item.integrador}</span>
                      <span className="text-[10px] text-zinc-500 uppercase">{item.obra}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <Badge variant="outline" className={`${getStatusColor(item.status)} font-medium text-[9px] w-fit`}>
                        {item.status}
                      </Badge>
                      <Badge variant="outline" className={`${getTempColor(item.temperatura)} font-medium text-[9px] w-fit`}>
                        {item.temperatura}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-[200px]">
                    <div className="flex items-start gap-1.5 text-[11px] text-zinc-300">
                      <ArrowRightCircle className="h-3 w-3 text-zinc-500 shrink-0 mt-0.5" />
                      <span className="line-clamp-2">{item.acaoFutura || (item.status === 'Em Andamento' ? 'Não definida' : 'Encerrado')}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {item.status === 'Em Andamento' ? (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className={`flex items-center gap-2 text-xs w-fit ${deadline.color}`}>
                              {deadline.icon}
                              <span>{formatDateCorrectly(item.dataProximaAcao)}</span>
                            </div>
                          </TooltipTrigger>
                          {deadline.label && (
                            <TooltipContent className="bg-zinc-800 border-zinc-700 text-white">
                              <p>{deadline.label}</p>
                            </TooltipContent>
                          )}
                        </Tooltip>
                      </TooltipProvider>
                    ) : (
                      <span className="text-[10px] text-zinc-600 italic">Finalizado</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right font-bold text-sm text-white">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.valor)}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <FollowUpForm onSave={onUpdate} initialData={item} trigger={
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-blue-400"><Pencil className="h-4 w-4" /></Button>
                      } />
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-red-500" onClick={() => { if(window.confirm("Excluir?")) onDelete(item.id); }}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
};