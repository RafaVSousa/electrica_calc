// TransCalc - Material Properties
// Reference values for transformer calculations

import type { TipoAco, TipoConductor, TipoOleo } from '../../types/transformer';

export const CONDUCTOR_PROPERTIES: Record<TipoConductor, {
  densidade: number;        // kg/m³
  resistividade: number;    // Ω·mm²/m @ 20°C
  densidadeCorrenteMin: number;  // A/mm²
  densidadeCorrenteMax: number;  // A/mm²
  precoKg: number;         // R$/kg (referência)
}> = {
  cobre: {
    densidade: 8900,
    resistividade: 0.0172,
    densidadeCorrenteMin: 2.5,
    densidadeCorrenteMax: 3.5,
    precoKg: 70,
  },
  aluminio: {
    densidade: 2700,
    resistividade: 0.0282,
    densidadeCorrenteMin: 1.5,
    densidadeCorrenteMax: 2.5,
    precoKg: 25,
  },
};

export const STEEL_PROPERTIES = {
  densidade: 7650,  // kg/m³ (aço silício GO)
  precoKg: 25,      // R$/kg (referência)

  // Perdas específicas W/kg @ 1.7T, 60Hz
  perdas: {
    GO_M3: 0.9,
    GO_M4: 1.0,
    GO_M5: 1.1,
    HiB: 0.8,
  } as Record<TipoAco, number>,

  // Fator de empilhamento típico
  fatorEmpilhamento: 0.95,

  // Fator de círculo circunscrito para núcleo escalonado
  fatorCirculoCircunscrito: 1.05,
};

export const OIL_PROPERTIES: Record<TipoOleo, {
  densidade: number;    // kg/L
  precoLitro: number;   // R$/L (referência)
  pontoFulgor: number;  // °C
  pontoFluidez: number; // °C
}> = {
  mineral: {
    densidade: 0.87,
    precoLitro: 15,
    pontoFulgor: 145,
    pontoFluidez: -40,
  },
  ester_natural: {
    densidade: 0.92,
    precoLitro: 45,
    pontoFulgor: 330,
    pontoFluidez: -21,
  },
  ester_sintetico: {
    densidade: 0.97,
    precoLitro: 55,
    pontoFulgor: 275,
    pontoFluidez: -56,
  },
};

// Temperatura máxima por classe de isolamento (°C)
export const INSULATION_CLASS_TEMP = {
  A: 105,
  E: 120,
  B: 130,
  F: 155,
  H: 180,
};

// Elevação de temperatura permitida acima do ambiente (°C)
export const TEMPERATURE_RISE = {
  oleo: 60,       // Elevação do óleo no topo
  enrolamento: 65, // Elevação média do enrolamento
};

// Fatores de refrigeração (multiplicadores de potência)
export const COOLING_FACTORS = {
  ONAN: 1.0,      // Base natural
  ONAF: 1.33,     // Forçada 33% a mais
  OFAF: 1.67,     // Dirigida forçada 67% a mais
};

// Constantes físicas
export const PHYSICS = {
  raiz3: Math.sqrt(3),        // √3 ≈ 1.732
  pi: Math.PI,
  frequenciaPadrao: 60,       // Hz (Brasil)
  fatorPotenciaPadrao: 0.92,  // cos φ típico
};

// Espessuras de chapa típicas para tanque (mm)
export const TANK_PLATE_THICKNESS: Record<string, number> = {
  'ate_5MVA': 5,
  '5_15MVA': 6,
  '15_30MVA': 8,
  '30_50MVA': 10,
};

export function getTankPlateThickness(potenciaMVA: number): number {
  if (potenciaMVA <= 5) return TANK_PLATE_THICKNESS['ate_5MVA'];
  if (potenciaMVA <= 15) return TANK_PLATE_THICKNESS['5_15MVA'];
  if (potenciaMVA <= 30) return TANK_PLATE_THICKNESS['15_30MVA'];
  return TANK_PLATE_THICKNESS['30_50MVA'];
}

// Densidade do aço do tanque (kg/m³)
export const TANK_STEEL_DENSITY = 7850;

// Fator para reforços e acessórios do tanque
export const TANK_REINFORCEMENT_FACTOR = 1.3;

// Folgas típicas entre parte ativa e tanque (mm)
export const TANK_CLEARANCES = {
  lateral: 200,      // Folga lateral (cada lado)
  superior: 400,     // Folga superior
  inferior: 200,     // Folga inferior
};

// Preços de referência para mão de obra e outros itens
export const REFERENCE_PRICES = {
  maoDeObraPerKg: 15,     // R$/kg de peso total
  isolantesPerKg: 8,      // R$/kg de condutores
  acessoriosPerKg: 5,     // R$/kg de peso total
};
