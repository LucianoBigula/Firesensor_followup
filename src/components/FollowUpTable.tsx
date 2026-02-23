import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { FollowUp } from "@/types/follow-up";
import { format } from "date-fns";
import { User } from "lucide-react";

interface FollowUpTableProps {
  data: FollowUp[];
}

export const FollowUpTable = ({ data }: FollowUpTableProps) => {
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

  return (
    <div className="bg-zinc-900/50 rounded-xl shadow-2xl border border-zinc-800 overflow-hidden">
      <Table>
        <TableHeader className="bg-zinc-900">
          <TableRow className="border-zinc-800 hover:bg-transparent">
            <TableHead className="font-bold text-zinc-300">Vendedor</TableHead>
            <TableHead className="font-bold text-zinc-300">Data</TableHead>
            <TableHead className="font-bold text-zinc-300">Proposta</TableHead>
            <TableHead className="font-bold text-zinc-300">Integrador / Obra</TableHead>
            <TableHead className="font-bold text-zinc-300">Temperatura</TableHead>
            <TableHead className="font-bold text-zinc-300">Expectativa</TableHead>
            <TableHead className="font-bold text-right text-zinc-300">Valor</TableHead>
            <TableHead className="font-bold text-zinc-300">Status</TableHead>
            <TableHead className="font-bold text-zinc-300">Atualização</TableHead>
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
            data.map((item) => (
              <TableRow key={item.id} className="border-zinc-800 hover:bg-zinc-800/30 transition-colors">
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="bg-zinc-800 p-1.5 rounded-full">
                      <User className="h-3.5 w-3.5 text-zinc-400" />
                    </div>
                    <span className="font-medium text-sm text-zinc-200">{item.vendedor}</span>
                  </div>
                </TableCell>
                <TableCell className="whitespace-nowrap text-sm text-zinc-400">
                  {format(new Date(item.dataEnvio), 'dd/MM/yyyy')}
                </TableCell>
                <TableCell className="font-medium text-red-400">#{item.numeroProposta}</TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-semibold text-sm text-zinc-200">{item.integrador}</span>
                    <span className="text-[10px] text-zinc-500 uppercase tracking-wider">{item.obra}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={`${getTempColor(item.temperatura)} font-medium text-[10px]`}>
                    {item.temperatura}
                  </Badge>
                </TableCell>
                <TableCell className="text-xs text-zinc-400">{item.expectativa}</TableCell>
                <TableCell className="text-right font-bold text-sm text-white">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.valor)}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={`${getStatusColor(item.status)} font-medium text-[10px]`}>
                    {item.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="text-[10px]">
                    <p className="font-medium text-zinc-300">{item.diaSemana}</p>
                    <p className="text-zinc-500">{item.semanaMes}</p>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};