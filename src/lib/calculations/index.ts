// TransCalc - Main Calculation Orchestrator
// Executa todos os cálculos do transformador

import type { TransformerInput, TransformerOutput } from '../../types/transformer';
import { calcularEletrico } from './electrical';
import { calcularNucleo } from './core';
import { calcularBobinas } from './windings';
import { calcularTanque } from './tank';
import { calcularBuchas } from './bushings';
import { calcularEstimativas } from './estimates';

// Re-export all calculation modules
export * from './electrical';
export * from './core';
export * from './windings';
export * from './tank';
export * from './bushings';
export * from './estimates';

/**
 * Executa todos os cálculos do transformador
 *
 * Ordem de execução:
 * 1. Elétrico - correntes, perdas, rendimento
 * 2. Núcleo - seção magnética, dimensões, peso
 * 3. Bobinas - espiras, condutores, pesos
 * 4. Tanque - dimensões, volume de óleo
 * 5. Buchas - especificação e NBI
 * 6. Estimativas - pesos totais e custos
 *
 * @param input Dados de entrada do transformador
 * @returns Resultado completo dos cálculos
 */
export function calcularTransformador(input: TransformerInput): TransformerOutput {
  // 1. Cálculos elétricos
  const eletrico = calcularEletrico(input);

  // 2. Cálculos do núcleo
  const nucleo = calcularNucleo(input, eletrico);

  // 3. Cálculos das bobinas (depende de elétrico e núcleo)
  const bobinas = calcularBobinas(input, eletrico, nucleo);

  // 4. Cálculos do tanque (depende de núcleo e bobinas)
  const tanque = calcularTanque(input, nucleo, bobinas);

  // 5. Cálculos das buchas (depende de elétrico)
  const buchas = calcularBuchas(input, eletrico);

  // 6. Estimativas (depende de todos os anteriores)
  const estimativas = calcularEstimativas(input, nucleo, bobinas, tanque, buchas);

  // Resultado completo
  return {
    input,
    eletrico,
    nucleo,
    bobinas,
    tanque,
    buchas,
    estimativas,
    calculatedAt: new Date().toISOString(),
  };
}

/**
 * Valida se os inputs estão dentro dos limites do sistema
 * Retorna array de erros encontrados
 */
export function validarInputs(input: TransformerInput): string[] {
  const erros: string[] = [];

  // Validação de potência
  if (input.potenciaMVA < 1 || input.potenciaMVA > 50) {
    erros.push('Potência deve estar entre 1 e 50 MVA');
  }

  // Validação de tensões
  if (input.tensaoAT_kV < 10.4) {
    erros.push('Tensão AT deve ser maior ou igual a 10.4 kV');
  }

  if (input.tensaoBT_kV < 10.4) {
    erros.push('Tensão BT deve ser maior ou igual a 10.4 kV');
  }

  if (input.tensaoAT_kV <= input.tensaoBT_kV) {
    erros.push('Tensão AT deve ser maior que tensão BT');
  }

  // Validação de impedância
  if (input.impedanciaPercent < 2.5 || input.impedanciaPercent > 20) {
    erros.push('Impedância deve estar entre 2.5% e 20%');
  }

  // Validação de indução
  if (input.inducaoMaxT < 1.5 || input.inducaoMaxT > 1.8) {
    erros.push('Indução máxima deve estar entre 1.5 e 1.8 Tesla');
  }

  // Validação de frequência
  if (input.frequenciaHz !== 50 && input.frequenciaHz !== 60) {
    erros.push('Frequência deve ser 50 ou 60 Hz');
  }

  return erros;
}

/**
 * Gera um resumo textual dos resultados
 */
export function gerarResumo(output: TransformerOutput): string {
  const { input, eletrico, estimativas } = output;

  return `
RESUMO DO TRANSFORMADOR
=======================

ESPECIFICAÇÃO:
- Potência: ${input.potenciaMVA} MVA
- Tensão AT: ${input.tensaoAT_kV} kV
- Tensão BT: ${input.tensaoBT_kV} kV
- Impedância: ${input.impedanciaPercent}%

CORRENTES NOMINAIS:
- AT: ${eletrico.correnteAT_A.toFixed(1)} A
- BT: ${eletrico.correnteBT_A.toFixed(1)} A

PERDAS:
- Cobre: ${eletrico.perdasCobre_kW.toFixed(1)} kW
- Ferro: ${eletrico.perdasFerro_kW.toFixed(1)} kW
- Total: ${eletrico.perdasTotais_kW.toFixed(1)} kW

RENDIMENTO (100% carga): ${eletrico.rendimento100.toFixed(2)}%

PESO TOTAL: ${estimativas.pesoTotal.toLocaleString('pt-BR')} kg

CUSTO ESTIMADO: R$ ${estimativas.custoTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
`.trim();
}

/**
 * Calcula o ponto de máximo rendimento
 * O máximo ocorre quando perdas no cobre = perdas no ferro × k²
 * Portanto: k_max = √(PFe / PCu)
 */
export function calcularPontoMaximoRendimento(
  perdasCobre_kW: number,
  perdasFerro_kW: number
): { carregamento: number; rendimento: number } {
  const k_max = Math.sqrt(perdasFerro_kW / perdasCobre_kW);

  // Se k_max > 1, o ponto de máximo está além da carga nominal
  const carregamentoLimitado = Math.min(k_max, 1.0);

  return {
    carregamento: carregamentoLimitado,
    rendimento: 0, // Será calculado pela função de rendimento
  };
}
