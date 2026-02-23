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
      case 'Quente': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'Morna': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Fria': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return '';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Ganha': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Perdida': return 'bg-rose-100 text-rose-700 border-rose-200';
      case 'Cancelada': return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'Em Andamento': return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      default: return '';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
      <Table>
        <TableHeader className="bg-gray-50">
          <TableRow>
            <TableHead className="font-bold">Vendedor</TableHead>
            <TableHead className="font-bold">Data</TableHead>
            <TableHead className="font-bold">Proposta</TableHead>
            <TableHead className="font-bold">Integrador / Obra</TableHead>
            <TableHead className="font-bold">Temperatura</TableHead>
            <TableHead className="font-bold">Expectativa</TableHead>
            <TableHead className="font-bold text-right">Valor</TableHead>
            <TableHead className="font-bold">Status</TableHead>
            <TableHead className="font-bold">Atualização</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center py-12 text-muted-foreground">
                Nenhum registro encontrado. Comece adicionando um novo follow-up.
              </TableCell>
            </TableRow>
          ) : (
            data.map((item) => (
              <TableRow key={item.id} className="hover:bg-gray-50/50 transition-colors">
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="bg-slate-100 p-1.5 rounded-full">
                      <User className="h-3.5 w-3.5 text-slate-600" />
                    </div>
                    <span className="font-medium text-sm">{item.vendedor}</span>
                  </div>
                </TableCell>
                <TableCell className="whitespace-nowrap text-sm">
                  {format(new Date(item.dataEnvio), 'dd/MM/yyyy')}
                </TableCell>
                <TableCell className="font-medium text-indigo-900">#{item.numeroProposta}</TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-semibold text-sm">{item.integrador}</span>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{item.obra}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={`${getTempColor(item.temperatura)} font-medium text-[10px]`}>
                    {item.temperatura}
                  </Badge>
                </TableCell>
                <TableCell className="text-xs">{item.expectativa}</TableCell>
                <TableCell className="text-right font-bold text-sm">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.valor)}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={`${getStatusColor(item.status)} font-medium text-[10px]`}>
                    {item.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="text-[10px]">
                    <p className="font-medium">{item.diaSemana}</p>
                    <p className="text-muted-foreground">{item.semanaMes}</p>
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