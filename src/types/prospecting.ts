export type StatusProspeccao = 'Novo Lead' | 'Em Contato' | 'Qualificado' | 'Desqualificado' | 'Virou Proposta';
export type OrigemLead = 'Indicação' | 'Site/Google' | 'LinkedIn' | 'Cold Call' | 'Evento' | 'Outros';

export interface Prospecting {
  id: string;
  dataRegistro: string;
  vendedor: string;
  empresa: string;
  contato: string;
  telefone?: string;
  email?: string;
  origem: OrigemLead;
  status: StatusProspeccao;
  observacoes: string;
  proximoPasso: string;
}