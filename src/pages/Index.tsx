import { useState, useEffect } from "react";
import { FollowUp } from "@/types/follow-up";
import { FollowUpStats } from "@/components/FollowUpStats";
import { FollowUpTable } from "@/components/FollowUpTable";
import { FollowUpForm } from "@/components/FollowUpForm";
import { FollowUpActions } from "@/components/FollowUpActions";
import { FollowUpDashboard } from "@/components/FollowUpDashboard";
import { Search, LayoutDashboard, List, Save, CheckCircle2, Trash2, UserX } from "lucide-react";
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
  // Carregar dados iniciais do localStorage com migração de campo
  const [followUps, setFollowUps] = useState<FollowUp[]>(() => {
    const saved = localStorage.getItem("firesensor_followups");
    if (!saved) return [];
    
    const parsed = JSON.parse(saved);
    // Migração: se houver dataEnvio mas não dataAtualizacao, renomeia
    return parsed.map((item: any) => ({
      ...item,
      dataAtualizacao: item.dataAtualizacao || item.dataEnvio || new Date().toISOString().split('T')[0]
    }));
  });
  
  const [searchTerm, setSearchTerm] = useState("");
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [selectedVendedorToClear, setSelectedVendedorToClear] = useState<string>("");

  // Salvar no localStorage sempre que houver mudanças
  useEffect(() => {
    localStorage.setItem("firesensor_followups", JSON.stringify(followUps));
    setLastSaved(new Date().toLocaleTimeString());
  }, [followUps]);

  const handleAddFollowUp = (newFollowUp: FollowUp) => {
    setFollowUps([newFollowUp, ...followUps]);
  };

  const handleUpdateFollowUp = (updatedFollowUp: FollowUp) => {
    setFollowUps(followUps.map(item => 
      item.id === updatedFollowUp.id ? updatedFollowUp : item
    ));
  };

  const handleDeleteFollowUp = (id: string) => {
    setFollowUps(followUps.filter(item => item.id !== id));
  };

  const handleClearAll = () => {
    setFollowUps([]);
    showSuccess("Todos os registros foram removidos.");
  };

  const handleClearByVendedor = () => {
    if (!selectedVendedorToClear) {
      showError("Selecione um vendedor para excluir.");
      return;
    }
    const countBefore = followUps.length;
    const newFollowUps = followUps.filter(item => item.vendedor !== selectedVendedorToClear);
    const countRemoved = countBefore - newFollowUps.length;
    
    setFollowUps(newFollowUps);
    showSuccess(`${countRemoved} registros do vendedor ${selectedVendedorToClear} foram removidos.`);
    setSelectedVendedorToClear("");
  };

  const handleImportData = (newData: FollowUp[]) => {
    // Filtra os novos dados para não adicionar IDs que já existem
    const existingIds = new Set(followUps.map(item => item.id));
    
    // Garante que dados importados também usem o novo campo
    const normalizedNewData = newData.map((item: any) => ({
      ...item,
      dataAtualizacao: item.dataAtualizacao || item.dataEnvio || new Date().toISOString().split('T')[0]
    }));

    const uniqueNewData = normalizedNewData.filter(item => !existingIds.has(item.id));
    
    if (uniqueNewData.length === 0 && newData.length > 0) {
      showSuccess("Todos os registros deste arquivo já existem no sistema.");
      return;
    }

    setFollowUps([...uniqueNewData, ...followUps]);
    showSuccess(`${uniqueNewData.length} novos registros adicionados com sucesso!`);
  };

  const handleManualSave = () => {
    localStorage.setItem("firesensor_followups", JSON.stringify(followUps));
    setLastSaved(new Date().toLocaleTimeString());
    showSuccess("Todos os dados foram salvos com sucesso no navegador!");
  };

  const filteredData = followUps.filter(item => 
    item.integrador.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.obra.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.numeroProposta.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.vendedor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Obter lista única de vendedores para o filtro de exclusão
  const uniqueVendedores = Array.from(new Set(followUps.map(item => item.vendedor))).sort();

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-white p-1.5 rounded-xl shadow-lg shadow-red-900/10">
              <img 
                src="/Firesensor.png" 
                alt="Firesensor Logo" 
                className="h-12 w-auto object-contain"
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Follow-up de Vendas</h1>
              <div className="flex items-center gap-2 text-zinc-500 text-xs">
                <span>Firesensor • Gestão Estratégica</span>
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
                className="pl-10 bg-zinc-900 border-zinc-800 text-white rounded-full focus:ring-red-600"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="outline"
                  size="sm"
                  className="bg-zinc-900 border-zinc-800 text-zinc-500 hover:bg-red-950 hover:text-red-400 hover:border-red-900"
                >
                  <UserX className="mr-2 h-4 w-4" /> Limpar por Vendedor
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-zinc-900 border-zinc-800 text-white">
                <AlertDialogHeader>
                  <AlertDialogTitle>Excluir registros por vendedor</AlertDialogTitle>
                  <AlertDialogDescription className="text-zinc-400">
                    Selecione um vendedor para remover todos os seus registros permanentemente.
                  </AlertDialogDescription>
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
                  <AlertDialogCancel className="bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700">Cancelar</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleClearByVendedor} 
                    className="bg-red-600 text-white hover:bg-red-700"
                    disabled={!selectedVendedorToClear}
                  >
                    Excluir registros
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="outline"
                  size="sm"
                  className="bg-zinc-900 border-zinc-800 text-zinc-500 hover:bg-red-950 hover:text-red-400 hover:border-red-900"
                >
                  <Trash2 className="mr-2 h-4 w-4" /> Limpar Tudo
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-zinc-900 border-zinc-800 text-white">
                <AlertDialogHeader>
                  <AlertDialogTitle>Tem certeza absoluta?</AlertDialogTitle>
                  <AlertDialogDescription className="text-zinc-400">
                    Esta ação não pode ser desfeita. Isso excluirá permanentemente todos os registros de follow-up salvos neste navegador.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700">Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={handleClearAll} className="bg-red-600 text-white hover:bg-red-700">
                    Sim, excluir tudo
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <Button 
              onClick={handleManualSave}
              variant="outline"
              size="sm"
              className="bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-zinc-800 hover:text-white"
            >
              <Save className="mr-2 h-4 w-4" /> Salvar
            </Button>
            <FollowUpActions data={followUps} onImport={handleImportData} />
            <FollowUpForm onSave={handleAddFollowUp} />
          </div>
        </div>

        {/* Stats */}
        <FollowUpStats data={followUps} />

        {/* Tabs Navigation */}
        <Tabs defaultValue="list" className="space-y-6">
          <div className="flex items-center justify-between">
            <TabsList className="bg-zinc-900 border border-zinc-800 p-1">
              <TabsTrigger value="list" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
                <List className="mr-2 h-4 w-4" /> Lista
              </TabsTrigger>
              <TabsTrigger value="dashboard" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
                <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
              </TabsTrigger>
            </TabsList>
            <span className="text-sm text-zinc-500 hidden md:inline">{filteredData.length} registros encontrados</span>
          </div>

          <TabsContent value="list" className="space-y-4 outline-none">
            <FollowUpTable 
              data={filteredData} 
              onDelete={handleDeleteFollowUp} 
              onUpdate={handleUpdateFollowUp}
            />
          </TabsContent>

          <TabsContent value="dashboard" className="outline-none">
            <FollowUpDashboard data={filteredData} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;