// TransCalc - Transformer Calculation Types
// Conforme ABNT NBR 5356

// ============================================
// INPUT TYPES
// ============================================

export type TipoRefrigeracao = 'ONAN' | 'ONAF' | 'OFAF';
export type ClasseIsolamento = 'A' | 'E' | 'B' | 'F' | 'H';
export type TipoConductor = 'cobre' | 'aluminio';
export type TipoOleo = 'mineral' | 'ester_natural' | 'ester_sintetico';
export type TipoNucleo = 'envolvido' | 'envolvente';
export type TipoAco = 'GO_M3' | 'GO_M4' | 'GO_M5' | 'HiB';
export type TipoBucha = 'porcelana' | 'polimero' | 'OIP' | 'RIP';
export type TipoConservador = 'membrana' | 'bolsa' | 'colchao_gas';

export interface TransformerInput {
  // Identificação
  projectName: string;
  clientName: string;

  // Dados Elétricos
  potenciaMVA: number;          // 1 a 50 MVA
  tensaoAT_kV: number;          // Tensão primária (kV)
  tensaoBT_kV: number;          // Tensão secundária (kV)
  impedanciaPercent: number;    // >= 2.5%
  frequenciaHz: number;         // 60 Hz default

  // Configuração
  tipoRefrigeracao: TipoRefrigeracao;
  classeIsolamento: ClasseIsolamento;
  tipoConductor: TipoConductor;
  tipoOleo: TipoOleo;

  // Núcleo
  tipoNucleo: TipoNucleo;
  tipoAco: TipoAco;
  inducaoMaxT: number;          // Tesla (1.6 a 1.75 típico)
}

// ============================================
// CALCULATION RESULT TYPES
// ============================================

export interface CalculoEletrico {
  // Correntes nominais
  correnteAT_A: number;         // I = S / (√3 × V)
  correnteBT_A: number;

  // Relação de transformação
  relacaoTransformacao: number; // a = V1/V2

  // Perdas
  perdasCobre_kW: number;       // PCu
  perdasFerro_kW: number;       // PFe
  perdasTotais_kW: number;

  // Rendimento em diferentes cargas (%)
  rendimento25: number;
  rendimento50: number;
  rendimento75: number;
  rendimento100: number;

  // Regulação
  regulacaoTensao: number;      // %

  // Curto-circuito
  correnteCurtoAT_kA: number;
  correnteCurtoBT_kA: number;
  potenciaCurto_MVA: number;

  // Parâmetros adicionais
  resistenciaPercentual: number;
  reatanciaPercentual: number;
  fatorPotencia: number;
}

export interface CalculoBobinas {
  // Espiras
  espirasAT: number;
  espirasBT: number;

  // Condutor
  secaoCondutorAT_mm2: number;
  secaoCondutorBT_mm2: number;
  densidadeCorrenteAT: number;  // A/mm²
  densidadeCorrenteBT: number;

  // Pesos
  pesoCondutorAT_kg: number;
  pesoCondutorBT_kg: number;
  pesoTotalCondutores_kg: number;

  // Dimensões (mm)
  alturaEnrolamento_mm: number;
  diametroInternoAT_mm: number;
  diametroExternoAT_mm: number;
  diametroInternoBT_mm: number;
  diametroExternoBT_mm: number;

  // Comprimento médio de espira
  comprimentoMedioEspiraAT_m: number;
  comprimentoMedioEspiraBT_m: number;
}

export interface CalculoNucleo {
  // Dimensões (mm)
  diametroColuna_mm: number;
  alturaJanela_mm: number;
  larguraJanela_mm: number;

  // Seção
  secaoMagnetica_cm2: number;
  secaoGeometrica_cm2: number;
  fatorEmpilhamento: number;    // ~0.95

  // Magnéticos
  inducaoOperacao_T: number;
  fluxoMagnetico_Wb: number;

  // Peso
  pesoNucleo_kg: number;
  volumeNucleo_m3: number;

  // Perdas
  perdasEspecificas_W_kg: number;
  perdasNucleo_kW: number;

  // Dimensões gerais
  comprimentoNucleo_mm: number;
  alturaNucleo_mm: number;
  profundidadeNucleo_mm: number;
}

export interface CalculoTanque {
  // Dimensões internas (mm)
  comprimento_mm: number;
  largura_mm: number;
  altura_mm: number;

  // Óleo
  volumeOleo_litros: number;
  pesoOleo_kg: number;

  // Tanque
  pesoTanqueVazio_kg: number;
  espessuraChapa_mm: number;
  areaSuperificie_m2: number;

  // Acessórios
  tipoConservador: TipoConservador;
  volumeConservador_litros: number;
}

export interface BuchaSpec {
  tensaoNominal_kV: number;
  correnteNominal_A: number;
  nbi_kV: number;              // Nível Básico de Isolamento
  tipo: TipoBucha;
  quantidade: number;
  pesoUnitario_kg: number;
}

export interface CalculoBuchas {
  buchaAT: BuchaSpec;
  buchaBT: BuchaSpec;
  buchaNeutro?: BuchaSpec;
  pesoTotalBuchas_kg: number;
}

export interface Estimativas {
  // Pesos (kg)
  pesoNucleo: number;
  pesoCondutores: number;
  pesoOleo: number;
  pesoTanque: number;
  pesoBuchas: number;
  pesoAcessorios: number;
  pesoIsolantes: number;
  pesoTotal: number;

  // Custos (R$)
  custoNucleo: number;
  custoCondutores: number;
  custoOleo: number;
  custoTanque: number;
  custoBuchas: number;
  custoIsolantes: number;
  custoMaoDeObra: number;
  custoTotal: number;

  // Breakdown percentual
  breakdownPeso: {
    nucleo: number;
    condutores: number;
    oleo: number;
    tanque: number;
    outros: number;
  };

  breakdownCusto: {
    materiais: number;
    maoDeObra: number;
  };
}

// ============================================
// COMPLETE CALCULATION OUTPUT
// ============================================

export interface TransformerOutput {
  input: TransformerInput;
  eletrico: CalculoEletrico;
  bobinas: CalculoBobinas;
  nucleo: CalculoNucleo;
  tanque: CalculoTanque;
  buchas: CalculoBuchas;
  estimativas: Estimativas;
  calculatedAt: string;
}

// ============================================
// DATABASE TYPES
// ============================================

export type ProjectStatus = 'active' | 'completed' | 'archived';
export type CalculationStatus = 'draft' | 'calculated' | 'approved';

export interface Profile {
  id: string;
  full_name: string | null;
  company: string | null;
  phone: string | null;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  user_id: string;
  name: string;
  client_name: string | null;
  description: string | null;
  status: ProjectStatus;
  created_at: string;
  updated_at: string;
}

export interface Calculation {
  id: string;
  project_id: string;
  name: string;
  input_data: TransformerInput;
  output_data: TransformerOutput | null;
  status: CalculationStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface PDFReport {
  id: string;
  calculation_id: string;
  file_name: string;
  file_url: string | null;
  generated_at: string;
}

// ============================================
// NBI TABLE TYPE
// ============================================

export interface NBIEntry {
  tensaoNominal: number;
  nbiPadrao: number;
  nbiElevado: number;
}

// ============================================
// MATERIAL PROPERTIES TYPE
// ============================================

export interface MaterialConductor {
  densidade: number;        // kg/m³
  resistividade: number;    // Ω·mm²/m @ 20°C
  densidadeCorrenteMax: number;  // A/mm²
  precoKg: number;         // R$/kg
}

export interface MaterialAco {
  densidade: number;       // kg/m³
  precoKg: number;        // R$/kg
  perdas: Record<TipoAco, number>;  // W/kg @ 1.7T, 60Hz
}

export interface MaterialOleo {
  densidade: number;      // kg/L
  precoLitro: number;    // R$/L
}

// ============================================
// FORM STATE TYPES
// ============================================

export interface CalculationFormState {
  isLoading: boolean;
  isCalculating: boolean;
  isSaving: boolean;
  error: string | null;
}

// ============================================
// CHART DATA TYPES
// ============================================

export interface EfficiencyDataPoint {
  carga: number;
  rendimento: number;
}

export interface LossesDataPoint {
  tipo: string;
  valor: number;
}
