// TransCalc - Constants Index
// Re-exports all constants for convenient importing

export * from './materials';
export * from './nbi-table';
export * from './prices';

// System limits
export const SYSTEM_LIMITS = {
  potenciaMin: 1,      // MVA
  potenciaMax: 50,     // MVA
  tensaoMin: 10.4,     // kV (AT e BT)
  impedanciaMin: 2.5,  // %
  impedanciaMax: 20,   // %
  inducaoMin: 1.5,     // Tesla
  inducaoMax: 1.8,     // Tesla
  frequenciaPadrao: 60, // Hz
};

// Default values for form
export const DEFAULT_VALUES = {
  frequenciaHz: 60,
  tipoRefrigeracao: 'ONAN' as const,
  classeIsolamento: 'A' as const,
  tipoConductor: 'cobre' as const,
  tipoOleo: 'mineral' as const,
  tipoNucleo: 'envolvido' as const,
  tipoAco: 'GO_M4' as const,
  inducaoMaxT: 1.7,
};

// Labels for UI display
export const LABELS = {
  tipoRefrigeracao: {
    ONAN: 'ONAN - Óleo Natural / Ar Natural',
    ONAF: 'ONAF - Óleo Natural / Ar Forçado',
    OFAF: 'OFAF - Óleo Forçado / Ar Forçado',
  },
  classeIsolamento: {
    A: 'Classe A (105°C)',
    E: 'Classe E (120°C)',
    B: 'Classe B (130°C)',
    F: 'Classe F (155°C)',
    H: 'Classe H (180°C)',
  },
  tipoConductor: {
    cobre: 'Cobre',
    aluminio: 'Alumínio',
  },
  tipoOleo: {
    mineral: 'Óleo Mineral',
    ester_natural: 'Éster Natural',
    ester_sintetico: 'Éster Sintético',
  },
  tipoNucleo: {
    envolvido: 'Envolvido (Core Type)',
    envolvente: 'Envolvente (Shell Type)',
  },
  tipoAco: {
    GO_M3: 'GO M3 (0.23mm)',
    GO_M4: 'GO M4 (0.27mm)',
    GO_M5: 'GO M5 (0.30mm)',
    HiB: 'HiB (Alta Permeabilidade)',
  },
  tipoBucha: {
    porcelana: 'Porcelana',
    polimero: 'Polímero',
    OIP: 'OIP (Papel Impregnado em Óleo)',
    RIP: 'RIP (Papel Impregnado em Resina)',
  },
};

// Unit labels
export const UNITS = {
  potencia: 'MVA',
  tensao: 'kV',
  corrente: 'A',
  correnteCurto: 'kA',
  impedancia: '%',
  frequencia: 'Hz',
  inducao: 'T',
  fluxo: 'Wb',
  perdas: 'kW',
  peso: 'kg',
  volume: 'L',
  dimensao: 'mm',
  secao: 'mm²',
  secaoMag: 'cm²',
  densidadeCorrente: 'A/mm²',
  preco: 'R$',
};

// Tooltips for form fields
export const TOOLTIPS = {
  potenciaMVA: 'Potência aparente nominal do transformador em MVA (Mega Volt-Ampère)',
  tensaoAT_kV: 'Tensão nominal do enrolamento de alta tensão em kV',
  tensaoBT_kV: 'Tensão nominal do enrolamento de baixa tensão em kV',
  impedanciaPercent: 'Impedância percentual de curto-circuito. Valores típicos: 5-8% para distribuição, 10-15% para potência',
  frequenciaHz: 'Frequência do sistema elétrico. Padrão Brasil: 60 Hz',
  tipoRefrigeracao: 'Sistema de refrigeração conforme IEC 60076-2',
  classeIsolamento: 'Classe térmica do isolamento conforme IEC 60085',
  tipoConductor: 'Material do condutor dos enrolamentos. Cobre tem maior condutividade, alumínio é mais leve e econômico',
  tipoOleo: 'Tipo de fluido isolante. Ésteres oferecem maior ponto de fulgor e biodegradabilidade',
  tipoNucleo: 'Envolvido (core type): núcleo envolve os enrolamentos. Envolvente (shell type): enrolamentos envolvem o núcleo',
  tipoAco: 'Tipo de aço silício de grãos orientados. HiB oferece menores perdas',
  inducaoMaxT: 'Indução magnética máxima de projeto. Valores típicos: 1.6 a 1.75 T',
};
