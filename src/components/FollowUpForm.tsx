import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FollowUp, Temperatura, Expectativa, Status, DiaSemana, SemanaMes } from "@/types/follow-up";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PlusCircle } from "lucide-react";
import { showSuccess } from "@/utils/toast";

interface FollowUpFormProps {
  onAdd: (followUp: FollowUp) => void;
}

export const FollowUpForm = ({ onAdd }: FollowUpFormProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<FollowUp>>({
    dataEnvio: new Date().toISOString().split('T')[0],
    temperatura: 'Morna',
    expectativa: '30 dias',
    status: 'Em Andamento',
    diaSemana: 'Segunda',
    semanaMes: 'Semana 1'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newFollowUp: FollowUp = {
      ...formData as FollowUp,
      id: Math.random().toString(36).substr(2, 9),
      valor: Number(formData.valor) || 0
    };
    onAdd(newFollowUp);
    showSuccess("Follow-up registrado com sucesso!");
    setOpen(false);
    setFormData({
      dataEnvio: new Date().toISOString().split('T')[0],
      temperatura: 'Morna',
      expectativa: '30 dias',
      status: 'Em Andamento',
      diaSemana: 'Segunda',
      semanaMes: 'Semana 1'
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-6">
          <PlusCircle className="mr-2 h-4 w-4" /> Novo Follow-up
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-indigo-900">Registrar Novo Follow-up</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="dataEnvio">Data de Envio</Label>
            <Input 
              id="dataEnvio" 
              type="date" 
              required
              value={formData.dataEnvio}
              onChange={(e) => setFormData({...formData, dataEnvio: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="proposta">Nº da Proposta</Label>
            <Input 
              id="proposta" 
              placeholder="Ex: 2024-001" 
              required
              onChange={(e) => setFormData({...formData, numeroProposta: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="integrador">Integrador</Label>
            <Input 
              id="integrador" 
              placeholder="Nome do integrador" 
              required
              onChange={(e) => setFormData({...formData, integrador: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="obra">Obra</Label>
            <Input 
              id="obra" 
              placeholder="Nome da obra" 
              required
              onChange={(e) => setFormData({...formData, obra: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <Label>Temperatura</Label>
            <Select onValueChange={(v: Temperatura) => setFormData({...formData, temperatura: v})} defaultValue="Morna">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Quente">🔥 Quente</SelectItem>
                <SelectItem value="Morna">⚖️ Morna</SelectItem>
                <SelectItem value="Fria">❄️ Fria</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Expectativa</Label>
            <Select onValueChange={(v: Expectativa) => setFormData({...formData, expectativa: v})} defaultValue="30 dias">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30 dias">30 dias</SelectItem>
                <SelectItem value="60 dias">60 dias</SelectItem>
                <SelectItem value="90 dias">90 dias</SelectItem>
                <SelectItem value="120 dias">120 dias</SelectItem>
                <SelectItem value="Sem previsão">Sem previsão</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="valor">Valor (R$)</Label>
            <Input 
              id="valor" 
              type="number" 
              step="0.01" 
              placeholder="0,00" 
              required
              onChange={(e) => setFormData({...formData, valor: Number(e.target.value)})}
            />
          </div>
          <div className="space-y-2">
            <Label>Status</Label>
            <Select onValueChange={(v: Status) => setFormData({...formData, status: v})} defaultValue="Em Andamento">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Ganha">✅ Ganha</SelectItem>
                <SelectItem value="Perdida">❌ Perdida</SelectItem>
                <SelectItem value="Cancelada">🚫 Cancelada</SelectItem>
                <SelectItem value="Em Andamento">⏳ Em Andamento</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Dia da Semana</Label>
            <Select onValueChange={(v: DiaSemana) => setFormData({...formData, diaSemana: v})} defaultValue="Segunda">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Segunda">Segunda-feira</SelectItem>
                <SelectItem value="Terça">Terça-feira</SelectItem>
                <SelectItem value="Quarta">Quarta-feira</SelectItem>
                <SelectItem value="Quinta">Quinta-feira</SelectItem>
                <SelectItem value="Sexta">Sexta-feira</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Semana do Mês</Label>
            <Select onValueChange={(v: SemanaMes) => setFormData({...formData, semanaMes: v})} defaultValue="Semana 1">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Semana 1">Semana 1</SelectItem>
                <SelectItem value="Semana 2">Semana 2</SelectItem>
                <SelectItem value="Semana 3">Semana 3</SelectItem>
                <SelectItem value="Semana 4">Semana 4</SelectItem>
                <SelectItem value="Semana 5">Semana 5</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="col-span-2 pt-4">
            <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700">Salvar Registro</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};