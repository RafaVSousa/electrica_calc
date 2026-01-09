// TransCalc - NBI Table (Nível Básico de Isolamento)
// Conforme ABNT NBR 5356-3

import type { NBIEntry } from '../../types/transformer';

/**
 * Tabela de NBI conforme NBR 5356
 * Tensão Nominal (kV) | NBI Padrão (kV) | NBI Elevado (kV)
 */
export const NBI_TABLE: NBIEntry[] = [
  { tensaoNominal: 1.2, nbiPadrao: 30, nbiElevado: 45 },
  { tensaoNominal: 3.6, nbiPadrao: 40, nbiElevado: 60 },
  { tensaoNominal: 7.2, nbiPadrao: 60, nbiElevado: 75 },
  { tensaoNominal: 12, nbiPadrao: 75, nbiElevado: 95 },
  { tensaoNominal: 15, nbiPadrao: 95, nbiElevado: 110 },
  { tensaoNominal: 24.2, nbiPadrao: 125, nbiElevado: 150 },
  { tensaoNominal: 36.2, nbiPadrao: 170, nbiElevado: 200 },
  { tensaoNominal: 52, nbiPadrao: 250, nbiElevado: 290 },
  { tensaoNominal: 72.5, nbiPadrao: 325, nbiElevado: 350 },
  { tensaoNominal: 92, nbiPadrao: 380, nbiElevado: 450 },
  { tensaoNominal: 123, nbiPadrao: 450, nbiElevado: 550 },
  { tensaoNominal: 145, nbiPadrao: 550, nbiElevado: 650 },
  { tensaoNominal: 170, nbiPadrao: 650, nbiElevado: 750 },
  { tensaoNominal: 245, nbiPadrao: 950, nbiElevado: 1050 },
  { tensaoNominal: 300, nbiPadrao: 1050, nbiElevado: 1175 },
  { tensaoNominal: 362, nbiPadrao: 1175, nbiElevado: 1300 },
  { tensaoNominal: 420, nbiPadrao: 1300, nbiElevado: 1425 },
  { tensaoNominal: 525, nbiPadrao: 1425, nbiElevado: 1550 },
];

/**
 * Obtém o NBI para uma determinada tensão nominal
 * @param tensaoKV Tensão nominal em kV
 * @returns Objeto com NBI padrão e elevado em kV
 */
export function getNBI(tensaoKV: number): { padrao: number; elevado: number } {
  // Encontra a primeira entrada onde a tensão nominal é >= tensão fornecida
  const entry = NBI_TABLE.find(e => tensaoKV <= e.tensaoNominal);

  if (entry) {
    return { padrao: entry.nbiPadrao, elevado: entry.nbiElevado };
  }

  // Fallback para tensões muito altas (acima de 525 kV)
  return { padrao: 1550, elevado: 1800 };
}

/**
 * Obtém a tensão nominal padronizada para uma tensão operacional
 * @param tensaoKV Tensão operacional em kV
 * @returns Tensão nominal padronizada mais próxima
 */
export function getTensaoNominalPadronizada(tensaoKV: number): number {
  const entry = NBI_TABLE.find(e => tensaoKV <= e.tensaoNominal);
  return entry ? entry.tensaoNominal : NBI_TABLE[NBI_TABLE.length - 1].tensaoNominal;
}

/**
 * Obtém todos os níveis de tensão disponíveis
 * @returns Array de tensões nominais
 */
export function getTensoesDisponiveis(): number[] {
  return NBI_TABLE.map(e => e.tensaoNominal);
}

/**
 * Verifica se uma tensão está dentro dos limites da norma
 * @param tensaoKV Tensão em kV
 * @returns true se a tensão está dentro dos limites
 */
export function isTensaoValida(tensaoKV: number): boolean {
  return tensaoKV >= 1.2 && tensaoKV <= 525;
}

/**
 * Calcula a tensão de ensaio aplicada (AC) baseada no NBI
 * Regra geral: Tensão AC ≈ NBI × 0.57 (para 1 minuto)
 * @param nbiKV NBI em kV
 * @returns Tensão de ensaio AC em kV
 */
export function getTensaoEnsaioAC(nbiKV: number): number {
  return Math.round(nbiKV * 0.57);
}
