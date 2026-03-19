import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FollowUp, Temperatura, Expectativa, Status, DiaSemana, SemanaMes } from "@/types/follow-up";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PlusCircle } from "lucide-react";
import { showSuccess } from "@/utils/toast";

interface FollowUpFormProps {
  onSave: (followUp: FollowUp) => void;
  initialData?: FollowUp;
  trigger?: React.ReactNode;
}

const DEFAULT_FORM_STATE: Partial<FollowUp> = {
  dataAtualizacao: new Date().toISOString().split('T')[0],
  temperatura: 'Morna',
  expectativa: '30 dias',
  status: 'Em Andamento',
  diaSemana: 'Segunda',
  semanaMes: 'Semana 1',
  vendedor: "",
  numeroProposta: "",
  integrador: "",
  obra: "",
  valor: 0,
  cnpj: "",
  responsavel: "",
  cidade: "",
  email: "",
  telefone: "",
  comentarioAcao: "",
  acaoFutura: ""
};

export const FollowUpForm = ({ onSave, initialData, trigger }: FollowUpFormProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<FollowUp>>(DEFAULT_FORM_STATE);

  useEffect(() => {
    if (open) {
      setFormData(initialData ? { ...initialData } : { ...DEFAULT_FORM_STATE });
    }
  }, [open, initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const followUpToSave: FollowUp = {
      ...DEFAULT_FORM_STATE,
      ...formData,
      id: initialData?.id || Math.random().toString(36).substr(2, 9),
      valor: Number(formData.valor) || 0,
      dataAtualizacao: formData.dataAtualizacao || new Date().toISOString().split('T')[0]
    } as FollowUp;
    
    onSave(followUpToSave);
    showSuccess(initialData ? "Registro atualizado!" : "Follow-up registrado!");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="bg-red-600 hover:bg-red-700 text-white rounded-full px-6 shadow-lg shadow-red-900/20">
            <PlusCircle className="mr-2 h-4 w-4" /> Novo Follow-up
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto bg-zinc-900 border-zinc-800 text-white outline-none">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white">
            {initialData ? "Editar Follow-up" : "Registrar Novo Follow-up"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
          {/* Seção: Informações Básicas */}
          <div className="col-span-1 md:col-span-2 border-b border-zinc-800 pb-2 mb-2">
            <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider">Informações da Proposta</h3>
          </div>
          
          <div className="space-y-2">
            <Label className="text-zinc-400">Vendedor</Label>
            <Input required value={formData.vendedor || ""} className="bg-zinc-800 border-zinc-700 text-white" onChange={(e) => setFormData(prev => ({...prev, vendedor: e.target.value}))} />
          </div>
          <div className="space-y-2">
            <Label className="text-zinc-400">Data de Atualização</Label>
            <Input type="date" required value={formData.dataAtualizacao || ""} className="bg-zinc-800 border-zinc-700 text-white" onChange={(e) => setFormData(prev => ({...prev, dataAtualizacao: e.target.value}))} />
          </div>
          <div className="space-y-2">
            <Label className="text-zinc-400">Nº da Proposta</Label>
            <Input required value={formData.numeroProposta || ""} className="bg-zinc-800 border-zinc-700 text-white" onChange={(e) => setFormData(prev => ({...prev, numeroProposta: e.target.value}))} />
          </div>
          <div className="space-y-2">
            <Label className="text-zinc-400">Valor (R$)</Label>
            <Input type="number" step="0.01" required value={formData.valor ?? ""} className="bg-zinc-800 border-zinc-700 text-white" onChange={(e) => setFormData(prev => ({...prev, valor: e.target.value === "" ? undefined : Number(e.target.value)}))} />
          </div>
          <div className="space-y-2">
            <Label className="text-zinc-400">Integrador</Label>
            <Input required value={formData.integrador || ""} className="bg-zinc-800 border-zinc-700 text-white" onChange={(e) => setFormData(prev => ({...prev, integrador: e.target.value}))} />
          </div>
          <div className="space-y-2">
            <Label className="text-zinc-400">Obra</Label>
            <Input required value={formData.obra || ""} className="bg-zinc-800 border-zinc-700 text-white" onChange={(e) => setFormData(prev => ({...prev, obra: e.target.value}))} />
          </div>

          {/* Seção: Dados Cadastrais */}
          <div className="col-span-1 md:col-span-2 border-b border-zinc-800 pb-2 mt-4 mb-2">
            <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider">Dados Cadastrais</h3>
          </div>

          <div className="space-y-2">
            <Label className="text-zinc-400">CNPJ</Label>
            <Input value={formData.cnpj || ""} className="bg-zinc-800 border-zinc-700 text-white" onChange={(e) => setFormData(prev => ({...prev, cnpj: e.target.value}))} />
          </div>
          <div className="space-y-2">
            <Label className="text-zinc-400">Responsável</Label>
            <Input value={formData.responsavel || ""} className="bg-zinc-800 border-zinc-700 text-white" onChange={(e) => setFormData(prev => ({...prev, responsavel: e.target.value}))} />
          </div>
          <div className="space-y-2">
            <Label className="text-zinc-400">Cidade</Label>
            <Input value={formData.cidade || ""} className="bg-zinc-800 border-zinc-700 text-white" onChange={(e) => setFormData(prev => ({...prev, cidade: e.target.value}))} />
          </div>
          <div className="space-y-2">
            <Label className="text-zinc-400">Telefone</Label>
            <Input value={formData.telefone || ""} className="bg-zinc-800 border-zinc-700 text-white" onChange={(e) => setFormData(prev => ({...prev, telefone: e.target.value}))} />
          </div>
          <div className="col-span-1 md:col-span-2 space-y-2">
            <Label className="text-zinc-400">E-mail</Label>
            <Input type="email" value={formData.email || ""} className="bg-zinc-800 border-zinc-700 text-white" onChange={(e) => setFormData(prev => ({...prev, email: e.target.value}))} />
          </div>

          {/* Seção: Status e Planejamento */}
          <div className="col-span-1 md:col-span-2 border-b border-zinc-800 pb-2 mt-4 mb-2">
            <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider">Status e Planejamento</h3>
          </div>

          <div className="space-y-2">
            <Label className="text-zinc-400">Temperatura</Label>
            <Select onValueChange={(v: Temperatura) => setFormData(prev => ({...prev, temperatura: v}))} value={formData.temperatura || "Morna"}>
              <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white"><SelectValue placeholder="Selecione" /></SelectTrigger>
              <SelectContent className="bg-zinc-800 border-zinc-700 text-white">
                <SelectItem value="Quente">Quente</SelectItem>
                <SelectItem value="Morna">Morna</SelectItem>
                <SelectItem value="Fria">Fria</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-zinc-400">Status</Label>
            <Select onValueChange={(v: Status) => setFormData(prev => ({...prev, status: v}))} value={formData.status || "Em Andamento"}>
              <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white"><SelectValue placeholder="Selecione" /></SelectTrigger>
              <SelectContent className="bg-zinc-800 border-zinc-700 text-white">
                <SelectItem value="Ganha">Ganha</SelectItem>
                <SelectItem value="Perdida">Perdida</SelectItem>
                <SelectItem value="Cancelada">Cancelada</SelectItem>
                <SelectItem value="Em Andamento">Em Andamento</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="col-span-1 md:col-span-2 space-y-2">
            <Label className="text-zinc-400">Comentário da Última Ação</Label>
            <Textarea value={formData.comentarioAcao || ""} className="bg-zinc-800 border-zinc-700 text-white min-h-[80px]" onChange={(e) => setFormData(prev => ({...prev, comentarioAcao: e.target.value}))} />
          </div>
          <div className="col-span-1 md:col-span-2 space-y-2">
            <Label className="text-zinc-400">Próxima Ação Planejada</Label>
            <Input value={formData.acaoFutura || ""} className="bg-zinc-800 border-zinc-700 text-white" onChange={(e) => setFormData(prev => ({...prev, acaoFutura: e.target.value}))} />
          </div>

          <div className="col-span-1 md:col-span-2 pt-4">
            <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white">Salvar Registro</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};