import { Button } from "@/components/ui/input";
import { Button as ShadcnButton } from "@/components/ui/button";
import { Download, Upload } from "lucide-react";
import { FollowUp } from "@/types/follow-up";
import { showSuccess, showError } from "@/utils/toast";
import { useRef } from "react";

interface FollowUpActionsProps {
  data: FollowUp[];
  onImport: (data: FollowUp[]) => void;
}

export const FollowUpActions = ({ data, onImport }: FollowUpActionsProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    if (data.length === 0) {
      showError("Não há dados para exportar.");
      return;
    }

    const dataStr = JSON.stringify(data, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `follow-up-firesensor-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    showSuccess("Dados exportados com sucesso!");
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string);
        if (Array.isArray(json)) {
          onImport(json);
          showSuccess("Dados importados com sucesso!");
        } else {
          throw new Error("Formato de arquivo inválido");
        }
      } catch (err) {
        showError("Erro ao importar arquivo. Verifique se o formato é válido.");
      }
    };
    reader.readAsText(file);
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex items-center gap-2">
      <input
        type="file"
        accept=".json"
        onChange={handleImport}
        className="hidden"
        ref={fileInputRef}
      />
      <ShadcnButton 
        variant="outline" 
        size="sm"
        onClick={() => fileInputRef.current?.click()}
        className="bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-zinc-800 hover:text-white"
      >
        <Upload className="mr-2 h-4 w-4" /> Importar
      </ShadcnButton>
      <ShadcnButton 
        variant="outline" 
        size="sm"
        onClick={handleExport}
        className="bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-zinc-800 hover:text-white"
      >
        <Download className="mr-2 h-4 w-4" /> Exportar
      </ShadcnButton>
    </div>
  );
};