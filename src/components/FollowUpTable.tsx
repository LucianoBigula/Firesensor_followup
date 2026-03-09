import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FollowUp } from "@/types/follow-up";
import { format, differenceInDays, parseISO } from "date-fns";
import { User, Trash2, Pencil, MapPin, Phone, MessageSquare, ArrowRightCircle, AlertCircle } from "lucide-react";
import { showSuccess } from "@/utils/toast";
import { FollowUpForm } from "./FollowUpForm";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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

  const handleDelete = (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir este registro?")) {
      onDelete(id);
      showSuccess("Registro removido com sucesso.");
    }
  };

  const formatDateCorrectly = (dateString: string) => {
    if (!dateString) return "";
    const [year, month, day] = dateString.split('-').map(Number);
    return format(new Date(year, month - 1, day), 'dd/MM/yyyy');
  };

  const isOverdue = (dateString: string, status: string) => {
    if (status !== 'Em Andamento') return false;
    const [year, month, day] = dateString.split('-').map(Number);
    const updateDate = new Date(year, month - 1, day);
    const days = differenceInDays(new Date(), updateDate);
    return days > 7;
  };

  return (
    <div className="bg-zinc-900/50 rounded-xl shadow-2xl border border-zinc-800 overflow-hidden">
      <Table>
        <TableHeader className="bg-zinc-900">
          <TableRow className="border-zinc-800 hover:bg-transparent">
            <TableHead className="font-bold text-zinc-300">Vendedor</TableHead>
            <TableHead className="font-bold text-zinc-300">Atualização</TableHead>
            <TableHead className="font-bold text-zinc-300">Proposta / CNPJ</TableHead>
            <TableHead className="font-bold text-zinc-300">Integrador / Obra / Ações</TableHead>
            <TableHead className="font-bold text-zinc-300">Contato / Cidade</TableHead>
            <TableHead className="font-bold text-zinc-300">Temperatura</TableHead>
            <TableHead className="font-bold text-right text-zinc-300">Valor</TableHead>
            <TableHead className="font-bold text-zinc-300">Status</TableHead>
            <TableHead className="font-bold text-center text-zinc-300">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow className="border-zinc-800">
              <TableCell colSpan={9} className="text-center py-12 text-zinc-500">
                Nenhum registro encontrado. Comece adicionando um novo follow-up.
              </TableCell>
            </TableRow>
          ) : (
            data.map((item) => {
              const overdue = isOverdue(item.dataAtualizacao, item.status);
              
              return (
                <TableRow key={item.id} className="border-zinc-800 hover:bg-zinc-800/30 transition-colors">
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="bg-zinc-800 p-1.5 rounded-full">
                        <User className="h-3.5 w-3.5 text-zinc-400" />
                      </div>
                      <span className="font-medium text-sm text-zinc-200">{item.vendedor}</span>
                    </div>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm ${overdue ? 'text-red-400 font-bold' : 'text-zinc-400'}`}>
                        {formatDateCorrectly(item.dataAtualizacao)}
                      </span>
                      {overdue && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <AlertCircle className="h-4 w-4 text-red-500 animate-pulse" />
                            </TooltipTrigger>
                            <TooltipContent className="bg-red-950 border-red-900 text-red-200">
                              <p>Sem atualização há mais de 7 dias!</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium text-red-400">#{item.numeroProposta}</span>
                      <span className="text-[10px] text-zinc-500">{item.cnpj || 'S/ CNPJ'}</span>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-[250px]">
                    <div className="flex flex-col gap-1">
                      <span className="font-semibold text-sm text-zinc-200">{item.integrador}</span>
                      <span className="text-[10px] text-zinc-500 uppercase tracking-wider">{item.obra}</span>
                      
                      {(item.comentarioAcao || item.acaoFutura) && (
                        <div className="mt-2 space-y-1 border-t border-zinc-800 pt-1">
                          {item.comentarioAcao && (
                            <div className="flex items-start gap-1.5 text-[10px] text-zinc-400 italic">
                              <MessageSquare className="h-2.5 w-2.5 mt-0.5 text-zinc-500 shrink-0" />
                              <span className="line-clamp-2">{item.comentarioAcao}</span>
                            </div>
                          )}
                          {item.acaoFutura && (
                            <div className="flex items-start gap-1.5 text-[10px] text-emerald-500/80 font-medium">
                              <ArrowRightCircle className="h-2.5 w-2.5 mt-0.5 shrink-0" />
                              <span className="line-clamp-2">{item.acaoFutura}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-xs font-medium text-zinc-300">{item.responsavel || 'N/A'}</span>
                      <div className="flex items-center gap-2 text-[10px] text-zinc-500">
                        {item.cidade && <span className="flex items-center gap-0.5"><MapPin className="h-2.5 w-2.5" /> {item.cidade}</span>}
                        {item.telefone && <span className="flex items-center gap-0.5"><Phone className="h-2.5 w-2.5" /> {item.telefone}</span>}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`${getTempColor(item.temperatura)} font-medium text-[10px]`}>
                      {item.temperatura}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-bold text-sm text-white">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.valor)}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`${getStatusColor(item.status)} font-medium text-[10px]`}>
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <FollowUpForm 
                        onSave={onUpdate} 
                        initialData={item}
                        trigger={
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-zinc-500 hover:text-blue-400 hover:bg-blue-500/10"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        }
                      />
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-zinc-500 hover:text-red-500 hover:bg-red-500/10"
                        onClick={() => handleDelete(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
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