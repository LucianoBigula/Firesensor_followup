import { Button as ShadcnButton } from "@/components/ui/button";
import { Download, Upload } from "lucide-react";
import { FollowUp } from "@/types/follow-up";
import { Prospecting } from "@/types/prospecting";
import { showSuccess, showError } from "@/utils/toast";
import { useRef } from "react";

interface FollowUpActionsProps {
  followUps: FollowUp[];
  prospects: Prospecting[];
  onImport: (followUps: FollowUp[], prospects: Prospecting[]) => void;
}

export const FollowUpActions = ({ followUps, prospects, onImport }: FollowUpActionsProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sanitizeData = (data: any[]) => {
    return data.map(item => ({
      ...item,
      status: typeof item.status === 'string' ? item.status.trim() : item.status,
      temperatura: typeof item.temperatura === 'string' ? item.temperatura.trim() : item.temperatura,
      valor: typeof item.valor === 'string' 
        ? parseFloat(item.valor.replace(/[^\d,.-]/g, '').replace(',', '.')) 
        : (item.valor || 0)
    }));
  };

  const handleExportJSON = () => {
    if (followUps.length === 0 && prospects.length === 0) {
      showError("Não há dados para exportar.");
      return;
    }

    const exportData = {
      followUps,
      prospects,
      exportDate: new Date().toISOString(),
      version: "2.1"
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `firesensor-comercial-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    showSuccess("Dados exportados!");
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string);
        let importedFollowUps: FollowUp[] = [];
        let importedProspects: Prospecting[] = [];

        if (Array.isArray(json)) {
          importedFollowUps = sanitizeData(json) as FollowUp[];
        } else {
          importedFollowUps = sanitizeData(json.followUps || []) as FollowUp[];
          importedProspects = sanitizeData(json.prospects || []) as Prospecting[];
        }

        onImport(importedFollowUps, importedProspects);
        showSuccess("Dados importados com sucesso!");
      } catch (err) {
        showError("Erro ao importar arquivo. Verifique o formato.");
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="flex items-center gap-2">
      <input type="file" accept=".json" onChange={handleImport} className="hidden" ref={fileInputRef} />
      <ShadcnButton variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} className="bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-zinc-800 hover:text-white">
        <Upload className="mr-2 h-4 w-4" /> Importar
      </ShadcnButton>
      <ShadcnButton variant="outline" size="sm" onClick={handleExportJSON} className="bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-zinc-800 hover:text-white">
        <Download className="mr-2 h-4 w-4" /> Exportar
      </ShadcnButton>
    </div>
  );
};