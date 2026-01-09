// TransCalc - Electrical Calculations Module
// Cálculos elétricos do transformador conforme ABNT NBR 5356

import type { TransformerInput, CalculoEletrico } from '../../types/transformer';
import { PHYSICS, STEEL_PROPERTIES } from '../constants/materials';

/**
 * Calcula a corrente nominal
 * I = S / (√3 × V)
 * @param potenciaMVA Potência em MVA
 * @param tensaoKV Tensão em kV
 * @returns Corrente em A
 */
export function calcularCorrenteNominal(potenciaMVA: number, tensaoKV: number): number {
  return (potenciaMVA * 1000) / (PHYSICS.raiz3 * tensaoKV);
}

/**
 * Calcula a relação de transformação
 * a = V_AT / V_BT
 */
export function calcularRelacaoTransformacao(tensaoAT_kV: number, tensaoBT_kV: number): number {
  return tensaoAT_kV / tensaoBT_kV;
}

/**
 * Calcula perdas no cobre (estimativa)
 * PCu ≈ 0.5% a 1% da potência nominal
 * Fórmula mais precisa considera resistência e corrente
 */
export function calcularPerdasCobre(
  potenciaMVA: number,
  tipoConductor: 'cobre' | 'aluminio'
): number {
  // Fator base: cobre tem menores perdas que alumínio
  const fatorMaterial = tipoConductor === 'cobre' ? 0.005 : 0.007;
  return potenciaMVA * 1000 * fatorMaterial;
}

/**
 * Calcula perdas no ferro (núcleo)
 * PFe = peso_nucleo × perdas_especificas
 * Estimativa inicial baseada na potência
 */
export function calcularPerdasFerro(
  potenciaMVA: number,
  tipoAco: keyof typeof STEEL_PROPERTIES.perdas
): number {
  // Estimativa: ~0.15% a 0.25% da potência para aços modernos
  const perdasEspecificas = STEEL_PROPERTIES.perdas[tipoAco];
  const fatorBase = 0.002 * (perdasEspecificas / 1.0); // Normalizado para M4
  return potenciaMVA * 1000 * fatorBase;
}

/**
 * Calcula o rendimento do transformador
 * η = (S × k × cosφ) / (S × k × cosφ + PCu × k² + PFe) × 100
 * @param potenciaMVA Potência nominal em MVA
 * @param perdasCobre_kW Perdas no cobre em kW
 * @param perdasFerro_kW Perdas no ferro em kW
 * @param carregamento Fator de carregamento (0 a 1)
 * @param fatorPotencia Fator de potência da carga
 * @returns Rendimento em %
 */
export function calcularRendimento(
  potenciaMVA: number,
  perdasCobre_kW: number,
  perdasFerro_kW: number,
  carregamento: number,
  fatorPotencia: number = PHYSICS.fatorPotenciaPadrao
): number {
  const potenciaUtil_kW = potenciaMVA * 1000 * carregamento * fatorPotencia;
  const perdasTotais_kW = perdasCobre_kW * Math.pow(carregamento, 2) + perdasFerro_kW;
  const potenciaAbsorvida_kW = potenciaUtil_kW + perdasTotais_kW;

  if (potenciaAbsorvida_kW === 0) return 0;

  return (potenciaUtil_kW / potenciaAbsorvida_kW) * 100;
}

/**
 * Calcula a resistência percentual
 * εr = (PCu / S) × 100
 */
export function calcularResistenciaPercentual(perdasCobre_kW: number, potenciaMVA: number): number {
  return (perdasCobre_kW / (potenciaMVA * 1000)) * 100;
}

/**
 * Calcula a reatância percentual
 * εx ≈ √(Z²% - εr²)
 * Para grandes transformadores, εx ≈ Z%
 */
export function calcularReatanciaPercentual(impedanciaPercent: number, resistenciaPercent: number): number {
  if (impedanciaPercent <= resistenciaPercent) {
    return impedanciaPercent; // Aproximação para casos limites
  }
  return Math.sqrt(Math.pow(impedanciaPercent, 2) - Math.pow(resistenciaPercent, 2));
}

/**
 * Calcula a regulação de tensão
 * ΔV% = εr × cosφ + εx × senφ
 * Para carga indutiva típica
 */
export function calcularRegulacaoTensao(
  resistenciaPercent: number,
  reatanciaPercent: number,
  fatorPotencia: number = PHYSICS.fatorPotenciaPadrao
): number {
  const senPhi = Math.sqrt(1 - Math.pow(fatorPotencia, 2));
  return resistenciaPercent * fatorPotencia + reatanciaPercent * senPhi;
}

/**
 * Calcula a corrente de curto-circuito
 * Icc = In / (Z% / 100)
 */
export function calcularCorrenteCurtoCircuito(correnteNominal_A: number, impedanciaPercent: number): number {
  return correnteNominal_A / (impedanciaPercent / 100);
}

/**
 * Calcula a potência de curto-circuito
 * Scc = S / (Z% / 100)
 */
export function calcularPotenciaCurtoCircuito(potenciaMVA: number, impedanciaPercent: number): number {
  return potenciaMVA / (impedanciaPercent / 100);
}

/**
 * Função principal: executa todos os cálculos elétricos
 */
export function calcularEletrico(input: TransformerInput): CalculoEletrico {
  // Correntes nominais
  const correnteAT_A = calcularCorrenteNominal(input.potenciaMVA, input.tensaoAT_kV);
  const correnteBT_A = calcularCorrenteNominal(input.potenciaMVA, input.tensaoBT_kV);

  // Relação de transformação
  const relacaoTransformacao = calcularRelacaoTransformacao(input.tensaoAT_kV, input.tensaoBT_kV);

  // Perdas
  const perdasCobre_kW = calcularPerdasCobre(input.potenciaMVA, input.tipoConductor);
  const perdasFerro_kW = calcularPerdasFerro(input.potenciaMVA, input.tipoAco);
  const perdasTotais_kW = perdasCobre_kW + perdasFerro_kW;

  // Rendimento em diferentes níveis de carga
  const fatorPotencia = PHYSICS.fatorPotenciaPadrao;
  const rendimento25 = calcularRendimento(input.potenciaMVA, perdasCobre_kW, perdasFerro_kW, 0.25, fatorPotencia);
  const rendimento50 = calcularRendimento(input.potenciaMVA, perdasCobre_kW, perdasFerro_kW, 0.50, fatorPotencia);
  const rendimento75 = calcularRendimento(input.potenciaMVA, perdasCobre_kW, perdasFerro_kW, 0.75, fatorPotencia);
  const rendimento100 = calcularRendimento(input.potenciaMVA, perdasCobre_kW, perdasFerro_kW, 1.00, fatorPotencia);

  // Parâmetros para regulação
  const resistenciaPercentual = calcularResistenciaPercentual(perdasCobre_kW, input.potenciaMVA);
  const reatanciaPercentual = calcularReatanciaPercentual(input.impedanciaPercent, resistenciaPercentual);

  // Regulação de tensão
  const regulacaoTensao = calcularRegulacaoTensao(resistenciaPercentual, reatanciaPercentual, fatorPotencia);

  // Curto-circuito
  const correnteCurtoAT_kA = calcularCorrenteCurtoCircuito(correnteAT_A, input.impedanciaPercent) / 1000;
  const correnteCurtoBT_kA = calcularCorrenteCurtoCircuito(correnteBT_A, input.impedanciaPercent) / 1000;
  const potenciaCurto_MVA = calcularPotenciaCurtoCircuito(input.potenciaMVA, input.impedanciaPercent);

  return {
    correnteAT_A: round(correnteAT_A, 2),
    correnteBT_A: round(correnteBT_A, 2),
    relacaoTransformacao: round(relacaoTransformacao, 4),
    perdasCobre_kW: round(perdasCobre_kW, 2),
    perdasFerro_kW: round(perdasFerro_kW, 2),
    perdasTotais_kW: round(perdasTotais_kW, 2),
    rendimento25: round(rendimento25, 3),
    rendimento50: round(rendimento50, 3),
    rendimento75: round(rendimento75, 3),
    rendimento100: round(rendimento100, 3),
    regulacaoTensao: round(regulacaoTensao, 3),
    correnteCurtoAT_kA: round(correnteCurtoAT_kA, 2),
    correnteCurtoBT_kA: round(correnteCurtoBT_kA, 2),
    potenciaCurto_MVA: round(potenciaCurto_MVA, 2),
    resistenciaPercentual: round(resistenciaPercentual, 4),
    reatanciaPercentual: round(reatanciaPercentual, 4),
    fatorPotencia: fatorPotencia,
  };
}

/**
 * Função auxiliar para arredondamento
 */
function round(value: number, decimals: number): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}
