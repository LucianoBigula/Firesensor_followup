import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Prospecting } from "@/types/prospecting";
import { format, isBefore, isToday, parseISO, startOfDay } from "date-fns";
import { User, Trash2, Pencil, Phone, Mail, Share2, ArrowRightCircle, Calendar, AlertTriangle, Clock } from "lucide-react";
import { ProspectingForm } from "./ProspectingForm";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ProspectingTableProps {
  data: Prospecting[];
  onDelete: (id: string) => void;
  onUpdate: (prospect: Prospecting) => void;
}

export const ProspectingTable = ({ data, onDelete, onUpdate }: ProspectingTableProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Novo Lead': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'Em Contato': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'Qualificado': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'Desqualificado': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'Virou Proposta': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      default: return '';
    }
  };

  const formatDateCorrectly = (dateString: string) => {
    if (!dateString) return "";
    const [year, month, day] = dateString.split('-').map(Number);
    return format(new Date(year, month - 1, day), 'dd/MM/yyyy');
  };

  const getDeadlineStyle = (dateString?: string) => {
    if (!dateString) return { color: 'text-zinc-500', icon: null };
    
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

  return (
    <div className="bg-zinc-900/50 rounded-xl shadow-2xl border border-zinc-800 overflow-hidden">
      <Table>
        <TableHeader className="bg-zinc-900">
          <TableRow className="border-zinc-800 hover:bg-transparent">
            <TableHead className="font-bold text-zinc-300">Vendedor</TableHead>
            <TableHead className="font-bold text-zinc-300">Empresa / Contato</TableHead>
            <TableHead className="font-bold text-zinc-300">Status</TableHead>
            <TableHead className="font-bold text-zinc-300">Próximo Passo</TableHead>
            <TableHead className="font-bold text-zinc-300 min-w-[150px]">Prazo Atividade</TableHead>
            <TableHead className="font-bold text-center text-zinc-300">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow className="border-zinc-800">
              <TableCell colSpan={6} className="text-center py-12 text-zinc-500">Nenhuma prospecção registrada.</TableCell>
            </TableRow>
          ) : (
            data.map((item) => {
              const deadline = getDeadlineStyle(item.dataProximoPasso);
              
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
                      <span className="font-semibold text-sm text-zinc-200">{item.empresa}</span>
                      <span className="text-[10px] text-zinc-500">{item.contato}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`${getStatusColor(item.status)} font-medium text-[10px]`}>
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-[11px] text-zinc-300">
                      <ArrowRightCircle className="h-3 w-3 text-zinc-500 shrink-0" />
                      <span className="line-clamp-1">{item.proximoPasso || 'Nenhum planejado'}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className={`flex items-center gap-2 text-xs w-fit ${deadline.color}`}>
                            {deadline.icon}
                            <span>{formatDateCorrectly(item.dataProximoPasso || "")}</span>
                          </div>
                        </TooltipTrigger>
                        {deadline.label && (
                          <TooltipContent className="bg-zinc-800 border-zinc-700 text-white">
                            <p>{deadline.label}</p>
                          </TooltipContent>
                        )}
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <ProspectingForm onSave={onUpdate} initialData={item} trigger={
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-blue-400"><Pencil className="h-4 w-4" /></Button>
                      } />
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-red-500" onClick={() => onDelete(item.id)}><Trash2 className="h-4 w-4" /></Button>
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