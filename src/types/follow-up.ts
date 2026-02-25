export type Temperatura = 'Quente' | 'Morna' | 'Fria';
export type Expectativa = '30 dias' | '60 dias' | '90 dias' | '120 dias' | 'Sem previsão';
export type Status = 'Ganha' | 'Perdida' | 'Cancelada' | 'Em Andamento';
export type DiaSemana = 'Segunda' | 'Terça' | 'Quarta' | 'Quinta' | 'Sexta';
export type SemanaMes = 'Semana 1' | 'Semana 2' | 'Semana 3' | 'Semana 4' | 'Semana 5';

export interface FollowUp {
  id: string;
  dataAtualizacao: string;
  numeroProposta: string;
  vendedor: string;
  integrador: string;
  obra: string;
  temperatura: Temperatura;
  expectativa: Expectativa;
  valor: number;
  status: Status;
  diaSemana: DiaSemana;
  semanaMes: SemanaMes;
  cnpj?: string;
  responsavel?: string;
  cidade?: string;
  email?: string;
  telefone?: string;
  // Novos campos de histórico e planejamento
  comentarioAcao?: string;
  acaoFutura?: string;
}