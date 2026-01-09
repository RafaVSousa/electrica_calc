// TransCalc - Estimates Module
// Estimativas de peso e custo do transformador

import type {
  TransformerInput,
  Estimativas,
  CalculoNucleo,
  CalculoBobinas,
  CalculoTanque,
  CalculoBuchas,
} from '../../types/transformer';
import { CONDUCTOR_PROPERTIES, STEEL_PROPERTIES, OIL_PROPERTIES, REFERENCE_PRICES } from '../constants/materials';
import { getBushingPrice, calcularCustoTotal } from '../constants/prices';

/**
 * Estima o peso de isolantes sólidos
 * Inclui: papel isolante, pressboard, madeira tratada, etc.
 */
export function estimarPesoIsolantes(pesoCondutores_kg: number): number {
  // Isolantes representam aproximadamente 8-12% do peso dos condutores
  return pesoCondutores_kg * 0.10;
}

/**
 * Estima o peso de acessórios
 * Inclui: radiadores, válvulas, conexões, instrumentos, etc.
 */
export function estimarPesoAcessorios(
  potenciaMVA: number,
  pesoTanque_kg: number
): number {
  // Acessórios representam ~15-25% do peso do tanque
  // Maior para potências maiores (mais radiadores)
  const fatorPotencia = 0.15 + (potenciaMVA / 100);
  return pesoTanque_kg * Math.min(fatorPotencia, 0.30);
}

/**
 * Calcula o custo do núcleo
 */
export function calcularCustoNucleo(
  pesoNucleo_kg: number,
  tipoAco: keyof typeof STEEL_PROPERTIES.perdas
): number {
  // Preço base do aço silício
  let precoKg = STEEL_PROPERTIES.precoKg;

  // Ajuste por tipo de aço
  const ajusteTipo: Record<string, number> = {
    GO_M3: 1.10,
    GO_M4: 1.00,
    GO_M5: 0.95,
    HiB: 1.40,
  };

  precoKg *= ajusteTipo[tipoAco] || 1.0;

  return pesoNucleo_kg * precoKg;
}

/**
 * Calcula o custo dos condutores
 */
export function calcularCustoCondutores(
  pesoCondutores_kg: number,
  tipoConductor: 'cobre' | 'aluminio'
): number {
  const precoKg = CONDUCTOR_PROPERTIES[tipoConductor].precoKg;
  return pesoCondutores_kg * precoKg;
}

/**
 * Calcula o custo do óleo
 */
export function calcularCustoOleo(
  volumeOleo_L: number,
  tipoOleo: 'mineral' | 'ester_natural' | 'ester_sintetico'
): number {
  const precoLitro = OIL_PROPERTIES[tipoOleo].precoLitro;
  return volumeOleo_L * precoLitro;
}

/**
 * Calcula o custo do tanque
 */
export function calcularCustoTanque(pesoTanque_kg: number): number {
  // Custo de aço carbono fabricado e pintado
  const precoKg = 12; // R$/kg incluindo fabricação
  return pesoTanque_kg * precoKg;
}

/**
 * Calcula o custo das buchas
 */
export function calcularCustoBuchas(buchas: CalculoBuchas): number {
  let custoTotal = 0;

  // Bucha AT
  custoTotal += buchas.buchaAT.quantidade *
    getBushingPrice(buchas.buchaAT.tensaoNominal_kV, buchas.buchaAT.tipo);

  // Bucha BT
  custoTotal += buchas.buchaBT.quantidade *
    getBushingPrice(buchas.buchaBT.tensaoNominal_kV, buchas.buchaBT.tipo);

  // Bucha Neutro
  if (buchas.buchaNeutro) {
    custoTotal += buchas.buchaNeutro.quantidade *
      getBushingPrice(buchas.buchaNeutro.tensaoNominal_kV, buchas.buchaNeutro.tipo);
  }

  return custoTotal;
}

/**
 * Calcula o custo de isolantes
 */
export function calcularCustoIsolantes(pesoIsolantes_kg: number): number {
  return pesoIsolantes_kg * REFERENCE_PRICES.isolantesPerKg;
}

/**
 * Calcula o custo de mão de obra
 */
export function calcularCustoMaoDeObra(pesoTotal_kg: number): number {
  // Custo por kg de transformador fabricado
  return pesoTotal_kg * REFERENCE_PRICES.maoDeObraPerKg;
}

/**
 * Calcula breakdown percentual de pesos
 */
export function calcularBreakdownPeso(
  pesoNucleo: number,
  pesoCondutores: number,
  pesoOleo: number,
  pesoTanque: number,
  pesoOutros: number
): {
  nucleo: number;
  condutores: number;
  oleo: number;
  tanque: number;
  outros: number;
} {
  const total = pesoNucleo + pesoCondutores + pesoOleo + pesoTanque + pesoOutros;

  if (total === 0) {
    return { nucleo: 0, condutores: 0, oleo: 0, tanque: 0, outros: 0 };
  }

  return {
    nucleo: round((pesoNucleo / total) * 100, 1),
    condutores: round((pesoCondutores / total) * 100, 1),
    oleo: round((pesoOleo / total) * 100, 1),
    tanque: round((pesoTanque / total) * 100, 1),
    outros: round((pesoOutros / total) * 100, 1),
  };
}

/**
 * Função principal: executa todas as estimativas
 */
export function calcularEstimativas(
  input: TransformerInput,
  nucleo: CalculoNucleo,
  bobinas: CalculoBobinas,
  tanque: CalculoTanque,
  buchas: CalculoBuchas
): Estimativas {
  // ============ PESOS ============

  const pesoNucleo = nucleo.pesoNucleo_kg;
  const pesoCondutores = bobinas.pesoTotalCondutores_kg;
  const pesoOleo = tanque.pesoOleo_kg;
  const pesoTanque = tanque.pesoTanqueVazio_kg;
  const pesoBuchas = buchas.pesoTotalBuchas_kg;
  const pesoIsolantes = estimarPesoIsolantes(pesoCondutores);
  const pesoAcessorios = estimarPesoAcessorios(input.potenciaMVA, pesoTanque);

  const pesoTotal = pesoNucleo + pesoCondutores + pesoOleo + pesoTanque +
                    pesoBuchas + pesoIsolantes + pesoAcessorios;

  // ============ CUSTOS ============

  const custoNucleo = calcularCustoNucleo(pesoNucleo, input.tipoAco);
  const custoCondutores = calcularCustoCondutores(pesoCondutores, input.tipoConductor);
  const custoOleo = calcularCustoOleo(tanque.volumeOleo_litros, input.tipoOleo);
  const custoTanque = calcularCustoTanque(pesoTanque);
  const custoBuchas = calcularCustoBuchas(buchas);
  const custoIsolantes = calcularCustoIsolantes(pesoIsolantes);

  const custoMateriais = custoNucleo + custoCondutores + custoOleo +
                         custoTanque + custoBuchas + custoIsolantes;

  const custoMaoDeObra = calcularCustoMaoDeObra(pesoTotal);

  // Custo total com margens e overheads
  const custoComMargens = calcularCustoTotal(custoMateriais, pesoTotal);

  // ============ BREAKDOWNS ============

  const breakdownPeso = calcularBreakdownPeso(
    pesoNucleo,
    pesoCondutores,
    pesoOleo,
    pesoTanque,
    pesoBuchas + pesoIsolantes + pesoAcessorios
  );

  const custoMaterialTotal = custoNucleo + custoCondutores + custoOleo +
                             custoTanque + custoBuchas + custoIsolantes;

  const breakdownCusto = {
    materiais: round((custoMaterialTotal / (custoMaterialTotal + custoMaoDeObra)) * 100, 1),
    maoDeObra: round((custoMaoDeObra / (custoMaterialTotal + custoMaoDeObra)) * 100, 1),
  };

  return {
    // Pesos
    pesoNucleo: round(pesoNucleo, 0),
    pesoCondutores: round(pesoCondutores, 0),
    pesoOleo: round(pesoOleo, 0),
    pesoTanque: round(pesoTanque, 0),
    pesoBuchas: round(pesoBuchas, 0),
    pesoIsolantes: round(pesoIsolantes, 0),
    pesoAcessorios: round(pesoAcessorios, 0),
    pesoTotal: round(pesoTotal, 0),

    // Custos
    custoNucleo: round(custoNucleo, 0),
    custoCondutores: round(custoCondutores, 0),
    custoOleo: round(custoOleo, 0),
    custoTanque: round(custoTanque, 0),
    custoBuchas: round(custoBuchas, 0),
    custoIsolantes: round(custoIsolantes, 0),
    custoMaoDeObra: round(custoComMargens.maoDeObra, 0),
    custoTotal: round(custoComMargens.total, 0),

    // Breakdowns
    breakdownPeso,
    breakdownCusto,
  };
}

/**
 * Função auxiliar para arredondamento
 */
function round(value: number, decimals: number): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}
