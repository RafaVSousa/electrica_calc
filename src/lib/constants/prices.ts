// TransCalc - Reference Prices
// Preços de referência para estimativa de custos (valores em R$)
// Nota: Valores de referência - devem ser atualizados periodicamente

/**
 * Preços de referência para materiais principais
 * Valores médios de mercado - Janeiro 2025
 */
export const MATERIAL_PRICES = {
  // Condutores (R$/kg)
  cobre: {
    fioEsmaltado: 85,
    barraRetangular: 75,
    fitaCobre: 80,
    media: 70,
  },

  aluminio: {
    fioEsmaltado: 32,
    barraRetangular: 28,
    fitaAluminio: 30,
    media: 25,
  },

  // Aço silício (R$/kg)
  acoSilicio: {
    GO_M3: 28,
    GO_M4: 26,
    GO_M5: 24,
    HiB: 35,
    media: 25,
  },

  // Óleos isolantes (R$/litro)
  oleo: {
    mineral: 15,
    esterNatural: 45,
    esterSintetico: 55,
  },

  // Tanque e estruturas (R$/kg de aço)
  estruturas: {
    acoCarbonoChapa: 8,
    acoCarbonoPerfilado: 7,
    galvanizado: 12,
    inox: 25,
    media: 8,
  },

  // Isolantes sólidos (R$/kg)
  isolantes: {
    papelKraft: 15,
    papelCrepe: 20,
    pressboard: 25,
    madeiraTratada: 8,
    media: 12,
  },
};

/**
 * Preços de referência para buchas (R$/unidade)
 * Variação por tensão nominal e tipo
 */
export const BUSHING_PRICES: Record<string, Record<string, number>> = {
  porcelana: {
    '15kV': 2500,
    '36kV': 4500,
    '72.5kV': 12000,
    '145kV': 35000,
    '245kV': 85000,
  },
  polimero: {
    '15kV': 1800,
    '36kV': 3200,
    '72.5kV': 8500,
    '145kV': 25000,
    '245kV': 60000,
  },
  OIP: { // Oil Impregnated Paper
    '72.5kV': 18000,
    '145kV': 45000,
    '245kV': 110000,
  },
  RIP: { // Resin Impregnated Paper
    '72.5kV': 22000,
    '145kV': 55000,
    '245kV': 130000,
  },
};

/**
 * Obtém preço estimado de bucha
 */
export function getBushingPrice(
  tensaoKV: number,
  tipo: 'porcelana' | 'polimero' | 'OIP' | 'RIP'
): number {
  // Encontra a faixa de tensão mais próxima
  const tensoes = ['15kV', '36kV', '72.5kV', '145kV', '245kV'];
  const valores = [15, 36, 72.5, 145, 245];

  let faixa = '15kV';
  for (let i = 0; i < valores.length; i++) {
    if (tensaoKV <= valores[i]) {
      faixa = tensoes[i];
      break;
    }
    faixa = tensoes[valores.length - 1];
  }

  const priceTable = BUSHING_PRICES[tipo];
  if (priceTable && priceTable[faixa]) {
    return priceTable[faixa];
  }

  // Fallback para porcelana se tipo não disponível para a faixa
  return BUSHING_PRICES.porcelana[faixa] || 5000;
}

/**
 * Custos de mão de obra e serviços (R$/hora ou R$/kg)
 */
export const LABOR_COSTS = {
  // Custo médio de mão de obra por kg de transformador
  porKgTransformador: 15,

  // Custos por hora de trabalho especializado
  enroladeiroCobre: 85,
  montador: 65,
  soldador: 75,
  eletricista: 70,
  engenheiroSupervisor: 150,

  // Serviços terceirizados
  tratamentoOleo: 3000,      // Por lote
  ensaiosTipoParcial: 15000,
  ensaiosTipoCompleto: 45000,
  transporte: {
    porKm: 8,
    mobilizacao: 5000,
  },
};

/**
 * Fatores de markup e margens
 */
export const MARKUP_FACTORS = {
  // Margem sobre custo de materiais
  materiaisDiretos: 1.15,    // 15%

  // Custos indiretos sobre mão de obra
  encargos: 1.80,            // 80% (INSS, FGTS, etc)

  // Overhead geral de fábrica
  overheadFabrica: 1.25,     // 25%

  // Margem de lucro típica
  margemLucro: 1.20,         // 20%

  // Fator de contingência
  contingencia: 1.05,        // 5%
};

/**
 * Calcula custo estimado total de um transformador
 * @param custoMateriais Custo total de materiais em R$
 * @param pesoTotal Peso total em kg
 * @returns Custo total estimado com margens
 */
export function calcularCustoTotal(custoMateriais: number, pesoTotal: number): {
  materiais: number;
  maoDeObra: number;
  overhead: number;
  total: number;
} {
  const materiaisComMarkup = custoMateriais * MARKUP_FACTORS.materiaisDiretos;
  const maoDeObraBruta = pesoTotal * LABOR_COSTS.porKgTransformador;
  const maoDeObraComEncargos = maoDeObraBruta * MARKUP_FACTORS.encargos;
  const overhead = (materiaisComMarkup + maoDeObraComEncargos) * (MARKUP_FACTORS.overheadFabrica - 1);
  const subtotal = materiaisComMarkup + maoDeObraComEncargos + overhead;
  const total = subtotal * MARKUP_FACTORS.margemLucro * MARKUP_FACTORS.contingencia;

  return {
    materiais: Math.round(materiaisComMarkup),
    maoDeObra: Math.round(maoDeObraComEncargos),
    overhead: Math.round(overhead),
    total: Math.round(total),
  };
}

/**
 * Índice de reajuste baseado em data
 * Para manter histórico de variações de preço
 */
export const PRICE_INDEX = {
  baseDate: '2025-01-01',
  currentIndex: 1.0,

  // Histórico trimestral (exemplo)
  history: [
    { date: '2024-10-01', index: 0.97 },
    { date: '2024-07-01', index: 0.95 },
    { date: '2024-04-01', index: 0.93 },
    { date: '2024-01-01', index: 0.90 },
  ],
};

/**
 * Aplica reajuste de preço baseado em índice
 */
export function aplicarReajuste(valor: number, indice: number = PRICE_INDEX.currentIndex): number {
  return Math.round(valor * indice);
}
