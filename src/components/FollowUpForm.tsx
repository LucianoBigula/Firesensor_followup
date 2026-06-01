import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FollowUp, Temperatura, Expectativa, Status, DiaSemana, SemanaMes } from "@/types/follow-up";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PlusCircle, FileText, X, Paperclip, User, Phone, Mail } from "lucide-react";
import { showSuccess, showError } from "@/utils/toast";
import { fileToBase64, validatePdfFile } from "@/utils/file-utils";
import { normalizeText } from "@/lib/utils";

interface FollowUpFormProps {
  onSave: (followUp: FollowUp) => void;
  initialData?: FollowUp;
  trigger?: React.ReactNode;
  existingFollowUps?: FollowUp[];
}

const DEFAULT_FORM_STATE: Partial<FollowUp> = {
  dataAtualizacao: new Date().toISOString().split('T')[0],
  dataProximaAcao: new Date().toISOString().split('T')[0],
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
  acaoFutura: "",
  arquivoPdf: undefined,
  nomeArquivo: undefined
};

export const FollowUpForm = ({ onSave, initialData, trigger, existingFollowUps = [] }: FollowUpFormProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<FollowUp>>(DEFAULT_FORM_STATE);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setFormData(initialData ? { ...initialData } : { ...DEFAULT_FORM_STATE });
    }
  }, [open, initialData]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const error = validatePdfFile(file);
    if (error) {
      showError(error);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    try {
      const base64 = await fileToBase64(file);
      setFormData(prev => ({
        ...prev,
        arquivoPdf: base64,
        nomeArquivo: file.name
      }));
      showSuccess("PDF anexado com sucesso!");
    } catch (err) {
      showError("Erro ao processar o arquivo.");
    }
  };

  const removeFile = () => {
    setFormData(prev => ({
      ...prev,
      arquivoPdf: undefined,
      nomeArquivo: undefined
    }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const valorNumerico = Number(formData.valor);
    if (isNaN(valorNumerico)) {
      showError("Valor inválido.");
      return;
    }

    const cleanNewNumber = normalizeText(formData.numeroProposta || "").replace(/#/g, '');
    const isDuplicate = existingFollowUps.some(item => {
      if (initialData && item.id === initialData.id) return false;
      const cleanExistingNumber = normalizeText(item.numeroProposta || "").replace(/#/g, '');
      return cleanExistingNumber === cleanNewNumber;
    });

    if (isDuplicate) {
      showError(`Já existe uma proposta com o número #${cleanNewNumber}.`);
      return;
    }

    if (!formData.comentarioAcao?.trim()) {
      showError("O comentário da última ação é obrigatório.");
      return;
    }

    const followUpToSave: FollowUp = {
      ...DEFAULT_FORM_STATE,
      ...formData,
      id: initialData?.id || crypto.randomUUID(),
      valor: valorNumerico,
    } as FollowUp;
    
    onSave(followUpToSave);
    showSuccess(initialData ? "Registro atualizado!" : "Follow-up registrado!");
    setOpen(false);
  };

  const isEncerrado = formData.status === 'Ganha' || formData.status === 'Perdida' || formData.status === 'Cancelada';

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="bg-red-600 hover:bg-red-700 text-white rounded-full px-6 shadow-lg shadow-red-900/20">
            <PlusCircle className="mr-2 h-4 w-4" /> Novo Follow-up
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto bg-zinc-900 border-zinc-800 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white">
            {initialData ? "Editar Follow-up" : "Registrar Novo Follow-up"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
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
            <Input required value={formData.numeroProposta || ""} className="bg-zinc-800 border-zinc-700 text-white" placeholder="Ex: 1234" onChange={(e) => setFormData(prev => ({...prev, numeroProposta: e.target.value}))} />
          </div>
          <div className="space-y-2">
            <Label className="text-zinc-400">Valor (R$)</Label>
            <Input type="number" step="0.01" required value={formData.valor ?? ""} className="bg-zinc-800 border-zinc-700 text-white" onChange={(e) => setFormData(prev => ({...prev, valor: e.target.value === "" ? 0 : Number(e.target.value)}))} />
          </div>
          <div className="space-y-2">
            <Label className="text-zinc-400">Integrador</Label>
            <Input required value={formData.integrador || ""} className="bg-zinc-800 border-zinc-700 text-white" onChange={(e) => setFormData(prev => ({...prev, integrador: e.target.value}))} />
          </div>
          <div className="space-y-2">
            <Label className="text-zinc-400">Responsável</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
              <Input value={formData.responsavel || ""} className="pl-10 bg-zinc-800 border-zinc-700 text-white" placeholder="Nome do contato" onChange={(e) => setFormData(prev => ({...prev, responsavel: e.target.value}))} />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-zinc-400">Telefone</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
              <Input value={formData.telefone || ""} className="pl-10 bg-zinc-800 border-zinc-700 text-white" placeholder="(00) 00000-0000" onChange={(e) => setFormData(prev => ({...prev, telefone: e.target.value}))} />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-zinc-400">E-mail</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
              <Input type="email" value={formData.email || ""} className="pl-10 bg-zinc-800 border-zinc-700 text-white" placeholder="contato@empresa.com" onChange={(e) => setFormData(prev => ({...prev, email: e.target.value}))} />
            </div>
          </div>
          <div className="col-span-1 md:col-span-2 space-y-2">
            <Label className="text-zinc-400">Obra (Opcional)</Label>
            <Input value={formData.obra || ""} className="bg-zinc-800 border-zinc-700 text-white" placeholder="Nome ou local da obra" onChange={(e) => setFormData(prev => ({...prev, obra: e.target.value}))} />
          </div>

          <div className="col-span-1 md:col-span-2 border-b border-zinc-800 pb-2 mt-4 mb-2">
            <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider">Anexo de Proposta (PDF)</h3>
          </div>

          <div className="col-span-1 md:col-span-2 space-y-3">
            <div className="flex items-center gap-4">
              <Button 
                type="button" 
                variant="outline" 
                className="bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700"
                onClick={() => fileInputRef.current?.click()}
              >
                <Paperclip className="mr-2 h-4 w-4" /> {formData.arquivoPdf ? "Alterar PDF" : "Anexar PDF (Máx 1MB)"}
              </Button>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="application/pdf" 
                className="hidden" 
              />
              {formData.nomeArquivo && (
                <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-md">
                  <FileText className="h-4 w-4 text-emerald-500" />
                  <span className="text-xs text-emerald-400 truncate max-w-[200px]">{formData.nomeArquivo}</span>
                  <button type="button" onClick={removeFile} className="text-zinc-500 hover:text-red-500">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="col-span-1 md:col-span-2 border-b border-zinc-800 pb-2 mt-4 mb-2">
            <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider">Status e Temperatura</h3>
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

          {!isEncerrado && (
            <>
              <div className="col-span-1 md:col-span-2 border-b border-zinc-800 pb-2 mt-4 mb-2">
                <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider">Próxima Atividade</h3>
              </div>
              <div className="space-y-2">
                <Label className="text-zinc-400">Data da Próxima Ação</Label>
                <Input type="date" required value={formData.dataProximaAcao || ""} className="bg-zinc-800 border-zinc-700 text-white border-red-500/30" onChange={(e) => setFormData(prev => ({...prev, dataProximaAcao: e.target.value}))} />
              </div>
              <div className="space-y-2">
                <Label className="text-zinc-400">Ação Planejada</Label>
                <Input value={formData.acaoFutura || ""} className="bg-zinc-800 border-zinc-700 text-white" placeholder="Ex: Ligar para confirmar" onChange={(e) => setFormData(prev => ({...prev, acaoFutura: e.target.value}))} />
              </div>
            </>
          )}

          <div className="col-span-1 md:col-span-2 border-b border-zinc-800 pb-2 mt-4 mb-2">
            <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider">Histórico e Notas</h3>
          </div>

          <div className="col-span-1 md:col-span-2 space-y-2">
            <Label className="text-zinc-400">Comentário da Última Ação <span className="text-red-500">*</span></Label>
            <Textarea 
              required 
              value={formData.comentarioAcao || ""} 
              className="bg-zinc-800 border-zinc-700 text-white min-h-[80px]" 
              placeholder="Descreva o que foi conversado..."
              onChange={(e) => setFormData(prev => ({...prev, comentarioAcao: e.target.value}))} 
            />
          </div>

          <div className="col-span-1 md:col-span-2 pt-4">
            <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white">Salvar Registro</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};