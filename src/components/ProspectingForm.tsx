import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Prospecting, StatusProspeccao, OrigemLead } from "@/types/prospecting";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { UserPlus } from "lucide-react";
import { showSuccess } from "@/utils/toast";

interface ProspectingFormProps {
  onSave: (prospect: Prospecting) => void;
  initialData?: Prospecting;
  trigger?: React.ReactNode;
}

const DEFAULT_FORM_STATE: Partial<Prospecting> = {
  dataRegistro: new Date().toISOString().split('T')[0],
  status: 'Novo Lead',
  origem: 'Indicação',
  vendedor: "",
  empresa: "",
  contato: "",
  telefone: "",
  email: "",
  observacoes: "",
  proximoPasso: ""
};

export const ProspectingForm = ({ onSave, initialData, trigger }: ProspectingFormProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Prospecting>>(DEFAULT_FORM_STATE);

  useEffect(() => {
    if (open) {
      setFormData(initialData ? { ...initialData } : { ...DEFAULT_FORM_STATE });
    }
  }, [open, initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const prospectToSave: Prospecting = {
      ...DEFAULT_FORM_STATE,
      ...formData,
      id: initialData?.id || Math.random().toString(36).substr(2, 9),
    } as Prospecting;
    
    onSave(prospectToSave);
    showSuccess(initialData ? "Prospecção atualizada!" : "Nova prospecção registrada!");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full px-6 shadow-lg shadow-emerald-900/20">
            <UserPlus className="mr-2 h-4 w-4" /> Nova Prospecção
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] bg-zinc-900 border-zinc-800 text-white outline-none">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white">
            {initialData ? "Editar Prospecção" : "Registrar Nova Prospecção"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
          <div className="space-y-2">
            <Label className="text-zinc-400">Vendedor</Label>
            <Input required value={formData.vendedor || ""} className="bg-zinc-800 border-zinc-700 text-white" onChange={(e) => setFormData(prev => ({...prev, vendedor: e.target.value}))} />
          </div>
          <div className="space-y-2">
            <Label className="text-zinc-400">Data de Registro</Label>
            <Input type="date" required value={formData.dataRegistro || ""} className="bg-zinc-800 border-zinc-700 text-white" onChange={(e) => setFormData(prev => ({...prev, dataRegistro: e.target.value}))} />
          </div>
          <div className="space-y-2">
            <Label className="text-zinc-400">Empresa / Prospect</Label>
            <Input required value={formData.empresa || ""} className="bg-zinc-800 border-zinc-700 text-white" onChange={(e) => setFormData(prev => ({...prev, empresa: e.target.value}))} />
          </div>
          <div className="space-y-2">
            <Label className="text-zinc-400">Contato Principal</Label>
            <Input required value={formData.contato || ""} className="bg-zinc-800 border-zinc-700 text-white" onChange={(e) => setFormData(prev => ({...prev, contato: e.target.value}))} />
          </div>
          <div className="space-y-2">
            <Label className="text-zinc-400">Telefone</Label>
            <Input value={formData.telefone || ""} className="bg-zinc-800 border-zinc-700 text-white" onChange={(e) => setFormData(prev => ({...prev, telefone: e.target.value}))} />
          </div>
          <div className="space-y-2">
            <Label className="text-zinc-400">E-mail</Label>
            <Input type="email" value={formData.email || ""} className="bg-zinc-800 border-zinc-700 text-white" onChange={(e) => setFormData(prev => ({...prev, email: e.target.value}))} />
          </div>
          <div className="space-y-2">
            <Label className="text-zinc-400">Origem do Lead</Label>
            <Select 
              onValueChange={(v: OrigemLead) => setFormData(prev => ({...prev, origem: v}))} 
              value={formData.origem || "Indicação"}
            >
              <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                <SelectValue placeholder="Selecione a origem" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-800 border-zinc-700 text-white">
                <SelectItem value="Indicação">Indicação</SelectItem>
                <SelectItem value="Site/Google">Site/Google</SelectItem>
                <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                <SelectItem value="Cold Call">Cold Call</SelectItem>
                <SelectItem value="Evento">Evento</SelectItem>
                <SelectItem value="Outros">Outros</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-zinc-400">Status</Label>
            <Select 
              onValueChange={(v: StatusProspeccao) => setFormData(prev => ({...prev, status: v}))} 
              value={formData.status || "Novo Lead"}
            >
              <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-800 border-zinc-700 text-white">
                <SelectItem value="Novo Lead">Novo Lead</SelectItem>
                <SelectItem value="Em Contato">Em Contato</SelectItem>
                <SelectItem value="Qualificado">Qualificado</SelectItem>
                <SelectItem value="Desqualificado">Desqualificado</SelectItem>
                <SelectItem value="Virou Proposta">Virou Proposta</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="col-span-1 md:col-span-2 space-y-2">
            <Label className="text-zinc-400">Observações Iniciais</Label>
            <Textarea value={formData.observacoes || ""} className="bg-zinc-800 border-zinc-700 text-white min-h-[80px]" onChange={(e) => setFormData(prev => ({...prev, observacoes: e.target.value}))} />
          </div>
          <div className="col-span-1 md:col-span-2 space-y-2">
            <Label className="text-zinc-400">Próximo Passo Planejado</Label>
            <Input value={formData.proximoPasso || ""} className="bg-zinc-800 border-zinc-700 text-white" onChange={(e) => setFormData(prev => ({...prev, proximoPasso: e.target.value}))} />
          </div>
          <div className="col-span-1 md:col-span-2 pt-4">
            <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">Salvar Prospecção</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};