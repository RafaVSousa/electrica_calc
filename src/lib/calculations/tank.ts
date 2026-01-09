// TransCalc - Tank Calculations Module
// Cálculos do tanque e óleo conforme ABNT NBR 5356

import type { TransformerInput, CalculoTanque, CalculoNucleo, CalculoBobinas } from '../../types/transformer';
import {
  OIL_PROPERTIES,
  TANK_CLEARANCES,
  TANK_STEEL_DENSITY,
  TANK_REINFORCEMENT_FACTOR,
  getTankPlateThickness,
} from '../constants/materials';

/**
 * Calcula as dimensões da parte ativa (núcleo + enrolamentos)
 */
export function calcularDimensoesParteAtiva(
  nucleo: CalculoNucleo,
  bobinas: CalculoBobinas
): {
  comprimento_mm: number;
  largura_mm: number;
  altura_mm: number;
} {
  // Comprimento: largura total do núcleo
  const comprimento = nucleo.comprimentoNucleo_mm;

  // Largura: considera o diâmetro externo do enrolamento AT + folgas
  const largura = bobinas.diametroExternoAT_mm + 50; // folga lateral

  // Altura: altura do núcleo + terminais
  const altura = nucleo.alturaNucleo_mm;

  return {
    comprimento_mm: Math.round(comprimento),
    largura_mm: Math.round(largura),
    altura_mm: Math.round(altura),
  };
}

/**
 * Calcula as dimensões internas do tanque
 * Inclui folgas para circulação de óleo e acesso
 */
export function calcularDimensoesTanque(
  parteAtiva: { comprimento_mm: number; largura_mm: number; altura_mm: number }
): {
  comprimento_mm: number;
  largura_mm: number;
  altura_mm: number;
} {
  // Adiciona folgas típicas
  const comprimento = parteAtiva.comprimento_mm + 2 * TANK_CLEARANCES.lateral;
  const largura = parteAtiva.largura_mm + 2 * TANK_CLEARANCES.lateral;
  const altura = parteAtiva.altura_mm + TANK_CLEARANCES.superior + TANK_CLEARANCES.inferior;

  return {
    comprimento_mm: Math.round(comprimento),
    largura_mm: Math.round(largura),
    altura_mm: Math.round(altura),
  };
}

/**
 * Calcula o volume interno do tanque
 */
export function calcularVolumeTanque(
  comprimento_mm: number,
  largura_mm: number,
  altura_mm: number
): number {
  // Volume em litros (1 litro = 1.000.000 mm³)
  return (comprimento_mm * largura_mm * altura_mm) / 1_000_000;
}

/**
 * Calcula o volume da parte ativa (aproximado)
 */
export function calcularVolumeParteAtiva(
  nucleo: CalculoNucleo,
  bobinas: CalculoBobinas
): number {
  // Volume do núcleo + enrolamentos (aproximação cilíndrica para enrolamentos)
  const volumeNucleo_L = nucleo.volumeNucleo_m3 * 1000; // m³ para litros

  // Volume dos enrolamentos (aproximação)
  const raioExternoAT = bobinas.diametroExternoAT_mm / 2;
  const raioInternoColuna = nucleo.diametroColuna_mm / 2;
  const alturaEnr = bobinas.alturaEnrolamento_mm;

  // Volume aproximado dos 3 conjuntos de enrolamentos
  const volumeEnrolamentos_mm3 = 3 * Math.PI * (Math.pow(raioExternoAT, 2) - Math.pow(raioInternoColuna, 2)) * alturaEnr;
  const volumeEnrolamentos_L = volumeEnrolamentos_mm3 / 1_000_000;

  return volumeNucleo_L + volumeEnrolamentos_L;
}

/**
 * Calcula o volume de óleo necessário
 */
export function calcularVolumeOleo(
  volumeTanque_L: number,
  volumeParteAtiva_L: number
): number {
  // Volume de óleo = Volume do tanque - Volume da parte ativa
  // Acrescenta 15% para conservador e radiadores
  const volumeBaseOleo = volumeTanque_L - volumeParteAtiva_L;
  return volumeBaseOleo * 1.15;
}

/**
 * Calcula a área de superfície do tanque
 * Para estimativa do peso da chapa
 */
export function calcularAreaSuperficie(
  comprimento_mm: number,
  largura_mm: number,
  altura_mm: number
): number {
  // Área em m²
  const c = comprimento_mm / 1000;
  const l = largura_mm / 1000;
  const h = altura_mm / 1000;

  // 2 × (frente + lado + fundo/topo)
  return 2 * (c * l + c * h + l * h);
}

/**
 * Calcula o peso do tanque vazio
 */
export function calcularPesoTanque(
  areaSuperficie_m2: number,
  espessuraChapa_mm: number
): number {
  // Volume de aço em m³
  const espessura_m = espessuraChapa_mm / 1000;
  const volumeAco = areaSuperficie_m2 * espessura_m;

  // Peso base
  const pesoBase = volumeAco * TANK_STEEL_DENSITY;

  // Adiciona fator para reforços, suportes, acessórios
  return pesoBase * TANK_REINFORCEMENT_FACTOR;
}

/**
 * Calcula o volume do conservador
 * Tipicamente 10-15% do volume total de óleo
 */
export function calcularVolumeConservador(volumeOleo_L: number): number {
  // 12% do volume de óleo como padrão
  return volumeOleo_L * 0.12;
}

/**
 * Determina o tipo de conservador baseado na potência e tensão
 */
export function determinarTipoConservador(
  potenciaMVA: number,
  tensaoAT_kV: number
): 'membrana' | 'bolsa' | 'colchao_gas' {
  // Para alta tensão e potência, prefer bolsa ou colchão de gás
  if (tensaoAT_kV >= 145 || potenciaMVA >= 30) {
    return 'bolsa';
  } else if (tensaoAT_kV >= 72.5 || potenciaMVA >= 15) {
    return 'membrana';
  }
  return 'membrana';
}

/**
 * Função principal: executa todos os cálculos do tanque
 */
export function calcularTanque(
  input: TransformerInput,
  nucleo: CalculoNucleo,
  bobinas: CalculoBobinas
): CalculoTanque {
  // Dimensões do tanque conforme especificação:
  // - Altura: altura do núcleo + 150mm
  // - Comprimento: comprimento do núcleo + diâmetro da bobina externa
  // - Largura: diâmetro da bobina externa + 250mm
  const dimensoesTanque = {
    altura_mm: nucleo.alturaNucleo_mm + 150,
    comprimento_mm: nucleo.comprimentoNucleo_mm + bobinas.diametroExternoAT_mm,
    largura_mm: bobinas.diametroExternoAT_mm + 250,
  };

  // Volumes
  const volumeTanque_L = calcularVolumeTanque(
    dimensoesTanque.comprimento_mm,
    dimensoesTanque.largura_mm,
    dimensoesTanque.altura_mm
  );
  const volumeParteAtiva_L = calcularVolumeParteAtiva(nucleo, bobinas);
  const volumeOleo_L = calcularVolumeOleo(volumeTanque_L, volumeParteAtiva_L);

  // Peso do óleo
  const densidadeOleo = OIL_PROPERTIES[input.tipoOleo].densidade;
  const pesoOleo_kg = volumeOleo_L * densidadeOleo;

  // Espessura da chapa
  const espessuraChapa_mm = getTankPlateThickness(input.potenciaMVA);

  // Área de superfície e peso do tanque
  const areaSuperficie_m2 = calcularAreaSuperficie(
    dimensoesTanque.comprimento_mm,
    dimensoesTanque.largura_mm,
    dimensoesTanque.altura_mm
  );
  const pesoTanque_kg = calcularPesoTanque(areaSuperficie_m2, espessuraChapa_mm);

  // Conservador
  const tipoConservador = determinarTipoConservador(input.potenciaMVA, input.tensaoAT_kV);
  const volumeConservador_L = calcularVolumeConservador(volumeOleo_L);

  return {
    comprimento_mm: dimensoesTanque.comprimento_mm,
    largura_mm: dimensoesTanque.largura_mm,
    altura_mm: dimensoesTanque.altura_mm,
    volumeOleo_litros: round(volumeOleo_L, 0),
    pesoOleo_kg: round(pesoOleo_kg, 0),
    pesoTanqueVazio_kg: round(pesoTanque_kg, 0),
    espessuraChapa_mm,
    areaSuperificie_m2: round(areaSuperficie_m2, 2),
    tipoConservador,
    volumeConservador_litros: round(volumeConservador_L, 0),
  };
}

/**
 * Função auxiliar para arredondamento
 */
function round(value: number, decimals: number): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}
