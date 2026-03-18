import { useState, useEffect } from "react";
import { FollowUp, Temperatura, Status } from "@/types/follow-up";
import { Prospecting } from "@/types/prospecting";
import { FollowUpStats } from "@/components/FollowUpStats";
import { FollowUpTable } from "@/components/FollowUpTable";
import { FollowUpForm } from "@/components/FollowUpForm";
import { FollowUpActions } from "@/components/FollowUpActions";
import { FollowUpDashboard } from "@/components/FollowUpDashboard";
import { ProspectingTable } from "@/components/ProspectingTable";
import { ProspectingForm } from "@/components/ProspectingForm";
import { Search, LayoutDashboard, List, Save, CheckCircle2, Trash2, UserX, Filter, Target, Download, Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { showSuccess, showError } from "@/utils/toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Index = () => {
  // Follow-ups State
  const [followUps, setFollowUps] = useState<FollowUp[]>(() => {
    const saved = localStorage.getItem("firesensor_followups");
    if (!saved) return [];
    const parsed = JSON.parse(saved);
    return parsed.map((item: any) => ({
      ...item,
      dataAtualizacao: item.dataAtualizacao || item.dataEnvio || new Date().toISOString().split('T')[0]
    }));
  });

  // Prospecting State
  const [prospects, setProspects] = useState<Prospecting[]>(() => {
    const saved = localStorage.getItem("firesensor_prospecting");
    return saved ? JSON.parse(saved) : [];
  });
  
  const [searchTerm, setSearchTerm] = useState("");
  const [tempFilter, setTempFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [selectedVendedorToClear, setSelectedVendedorToClear] = useState<string>("");

  // Auto-save
  useEffect(() => {
    localStorage.setItem("firesensor_followups", JSON.stringify(followUps));
    localStorage.setItem("firesensor_prospecting", JSON.stringify(prospects));
    setLastSaved(new Date().toLocaleTimeString());
  }, [followUps, prospects]);

  // Handlers
  const handleAddFollowUp = (newFollowUp: FollowUp) => setFollowUps([newFollowUp, ...followUps]);
  const handleUpdateFollowUp = (updated: FollowUp) => setFollowUps(followUps.map(item => item.id === updated.id ? updated : item));
  const handleDeleteFollowUp = (id: string) => setFollowUps(followUps.filter(item => item.id !== id));

  const handleAddProspect = (newProspect: Prospecting) => setProspects([newProspect, ...prospects]);
  const handleUpdateProspect = (updated: Prospecting) => setProspects(prospects.map(item => item.id === updated.id ? updated : item));
  const handleDeleteProspect = (id: string) => setProspects(prospects.filter(item => item.id !== id));

  const handleClearAll = () => {
    setFollowUps([]);
    setProspects([]);
    showSuccess("Todos os registros foram removidos.");
  };

  const handleClearByVendedor = () => {
    if (!selectedVendedorToClear) return;
    setFollowUps(followUps.filter(f => f.vendedor !== selectedVendedorToClear));
    setProspects(prospects.filter(p => p.vendedor !== selectedVendedorToClear));
    showSuccess(`Registros do vendedor ${selectedVendedorToClear} removidos.`);
    setSelectedVendedorToClear("");
  };

  const handleImportData = (newData: FollowUp[]) => {
    setFollowUps([...newData, ...followUps]);
  };

  const handleManualSave = () => {
    localStorage.setItem("firesensor_followups", JSON.stringify(followUps));
    localStorage.setItem("firesensor_prospecting", JSON.stringify(prospects));
    setLastSaved(new Date().toLocaleTimeString());
    showSuccess("Dados salvos com sucesso!");
  };

  const filteredFollowUps = followUps.filter(item => {
    const matchesSearch = 
      item.integrador.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.obra.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.numeroProposta.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.vendedor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTemp = tempFilter === "all" || item.temperatura === tempFilter;
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    return matchesSearch && matchesTemp && matchesStatus;
  });

  const filteredProspects = prospects.filter(item => 
    item.empresa.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.vendedor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.contato.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const uniqueVendedores = Array.from(new Set([...followUps.map(f => f.vendedor), ...prospects.map(v => v.vendedor)])).sort();

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-white p-1.5 rounded-xl shadow-lg shadow-red-900/10">
              <img src="/Firesensor.png" alt="Firesensor Logo" className="h-12 w-auto object-contain" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Gestão Comercial</h1>
              <div className="flex items-center gap-2 text-zinc-500 text-xs">
                <span>Firesensor • Inteligência de Vendas</span>
                {lastSaved && (
                  <span className="flex items-center gap-1 text-emerald-500/70">
                    <CheckCircle2 className="h-3 w-3" /> Salvo às {lastSaved}
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
              <Input 
                placeholder="Buscar..." 
                className="pl-10 bg-zinc-900 border-zinc-800 text-white rounded-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <FollowUpActions data={followUps} onImport={handleImportData} />

            <Button onClick={handleManualSave} variant="outline" size="sm" className="bg-zinc-900 border-zinc-800 text-zinc-300">
              <Save className="mr-2 h-4 w-4" /> Salvar
            </Button>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm" className="bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-red-400">
                  <UserX className="mr-2 h-4 w-4" /> Limpar por Vendedor
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-zinc-900 border-zinc-800 text-white">
                <AlertDialogHeader>
                  <AlertDialogTitle>Excluir registros por vendedor</AlertDialogTitle>
                  <AlertDialogDescription className="text-zinc-400">Selecione um vendedor para remover todos os seus registros.</AlertDialogDescription>
                </AlertDialogHeader>
                <div className="py-4">
                  <Select onValueChange={setSelectedVendedorToClear} value={selectedVendedorToClear}>
                    <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                      <SelectValue placeholder="Selecione o vendedor" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-800 border-zinc-700 text-white">
                      {uniqueVendedores.map(v => (
                        <SelectItem key={v} value={v}>{v}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <AlertDialogFooter>
                  <AlertDialogCancel className="bg-zinc-800 text-white">Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={handleClearByVendedor} className="bg-red-600 text-white" disabled={!selectedVendedorToClear}>Excluir registros</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm" className="bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-red-400">
                  <Trash2 className="mr-2 h-4 w-4" /> Limpar Tudo
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-zinc-900 border-zinc-800 text-white">
                <AlertDialogHeader>
                  <AlertDialogTitle>Limpar todos os dados?</AlertDialogTitle>
                  <AlertDialogDescription className="text-zinc-400">Isso removerá prospecções e follow-ups permanentemente.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="bg-zinc-800 text-white">Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={handleClearAll} className="bg-red-600 text-white">Sim, excluir tudo</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        {/* Tabs Navigation */}
        <Tabs defaultValue="prospecting" className="space-y-6">
          <div className="flex items-center justify-between">
            <TabsList className="bg-zinc-900 border border-zinc-800 p-1">
              <TabsTrigger value="prospecting" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
                <Target className="mr-2 h-4 w-4" /> Prospecção
              </TabsTrigger>
              <TabsTrigger value="followup" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
                <List className="mr-2 h-4 w-4" /> Follow-up
              </TabsTrigger>
              <TabsTrigger value="dashboard" className="data-[state=active]:bg-zinc-700 data-[state=active]:text-white">
                <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
              </TabsTrigger>
            </TabsList>
            
            <div className="flex items-center gap-2">
              <TabsContent value="prospecting" className="m-0">
                <ProspectingForm onSave={handleAddProspect} />
              </TabsContent>
              <TabsContent value="followup" className="m-0">
                <div className="flex gap-2">
                  <Select value={tempFilter} onValueChange={setTempFilter}>
                    <SelectTrigger className="w-[140px] bg-zinc-900 border-zinc-800 text-xs h-9 rounded-full">
                      <SelectValue placeholder="Temperatura" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                      <SelectItem value="all">Todas Temps</SelectItem>
                      <SelectItem value="Quente">🔥 Quente</SelectItem>
                      <SelectItem value="Morna">⚖️ Morna</SelectItem>
                      <SelectItem value="Fria">❄️ Fria</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[140px] bg-zinc-900 border-zinc-800 text-xs h-9 rounded-full">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                      <SelectItem value="all">Todos Status</SelectItem>
                      <SelectItem value="Ganha">✅ Ganha</SelectItem>
                      <SelectItem value="Em Andamento">⏳ Em Andamento</SelectItem>
                      <SelectItem value="Perdida">❌ Perdida</SelectItem>
                      <SelectItem value="Cancelada">🚫 Cancelada</SelectItem>
                    </SelectContent>
                  </Select>
                  <FollowUpForm onSave={handleAddFollowUp} />
                </div>
              </TabsContent>
            </div>
          </div>

          <TabsContent value="prospecting" className="outline-none space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800">
                <p className="text-zinc-500 text-xs uppercase font-bold">Total de Leads</p>
                <p className="text-2xl font-bold text-white">{prospects.length}</p>
              </div>
              <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800">
                <p className="text-zinc-500 text-xs uppercase font-bold">Qualificados</p>
                <p className="text-2xl font-bold text-emerald-500">{prospects.filter(p => p.status === 'Qualificado').length}</p>
              </div>
              <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800">
                <p className="text-zinc-500 text-xs uppercase font-bold">Conversão (Proposta)</p>
                <p className="text-2xl font-bold text-purple-500">{prospects.filter(p => p.status === 'Virou Proposta').length}</p>
              </div>
            </div>
            <ProspectingTable data={filteredProspects} onDelete={handleDeleteProspect} onUpdate={handleUpdateProspect} />
          </TabsContent>

          <TabsContent value="followup" className="space-y-6 outline-none">
            {/* Agora passando filteredFollowUps para recalcular os cards */}
            <FollowUpStats data={filteredFollowUps} />
            <FollowUpTable data={filteredFollowUps} onDelete={handleDeleteFollowUp} onUpdate={handleUpdateFollowUp} />
          </TabsContent>

          <TabsContent value="dashboard" className="outline-none">
            {/* Agora passando filteredFollowUps para recalcular os gráficos */}
            <FollowUpDashboard data={filteredFollowUps} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;