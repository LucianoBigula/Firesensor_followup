import { useState } from "react";
import { FollowUp } from "@/types/follow-up";
import { FollowUpStats } from "@/components/FollowUpStats";
import { FollowUpTable } from "@/components/FollowUpTable";
import { FollowUpForm } from "@/components/FollowUpForm";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { LayoutDashboard, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const Index = () => {
  const [followUps, setFollowUps] = useState<FollowUp[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const handleAddFollowUp = (newFollowUp: FollowUp) => {
    setFollowUps([newFollowUp, ...followUps]);
  };

  const filteredData = followUps.filter(item => 
    item.integrador.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.obra.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.numeroProposta.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.vendedor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-red-600 p-2 rounded-lg shadow-lg shadow-red-900/20">
              <LayoutDashboard className="text-white h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Follow-up de Vendas</h1>
              <p className="text-zinc-400 text-sm">Acompanhamento estratégico de propostas</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
              <Input 
                placeholder="Buscar vendedor, proposta, obra..." 
                className="pl-10 bg-zinc-900 border-zinc-800 text-white rounded-full focus:ring-red-600"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <FollowUpForm onAdd={handleAddFollowUp} />
          </div>
        </div>

        {/* Stats */}
        <FollowUpStats data={followUps} />

        {/* Main Content */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-zinc-200">Registros Recentes</h2>
            <span className="text-sm text-zinc-500">{filteredData.length} registros encontrados</span>
          </div>
          <FollowUpTable data={filteredData} />
        </div>

        <footer className="mt-12 opacity-50">
          <MadeWithDyad />
        </footer>
      </div>
    </div>
  );
};

export default Index;