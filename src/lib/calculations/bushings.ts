// TransCalc - Bushings Calculations Module
// Cálculos de buchas conforme ABNT NBR 5356-3

import type { TransformerInput, CalculoBuchas, CalculoEletrico, BuchaSpec, TipoBucha } from '../../types/transformer';
import { getNBI, getTensaoNominalPadronizada } from '../constants/nbi-table';

/**
 * Determina o tipo de bucha adequado baseado na tensão e corrente
 */
export function determinarTipoBucha(
  tensaoKV: number,
  correnteA: number
): TipoBucha {
  // Para tensões muito altas, preferir OIP ou RIP
  if (tensaoKV >= 145) {
    return correnteA > 1500 ? 'RIP' : 'OIP';
  }

  // Para tensões médias, polímero ou porcelana
  if (tensaoKV >= 72.5) {
    return 'polimero';
  }

  // Para tensões menores
  if (tensaoKV >= 36) {
    return correnteA > 2000 ? 'polimero' : 'porcelana';
  }

  // Baixa tensão
  return 'porcelana';
}

/**
 * Estima o peso da bucha baseado na tensão e tipo
 * Valores típicos de mercado
 */
export function estimarPesoBucha(
  tensaoKV: number,
  tipo: TipoBucha
): number {
  // Peso base cresce com a tensão
  const tensaoNominal = getTensaoNominalPadronizada(tensaoKV);

  // Fatores de peso por tipo
  const fatoresTipo: Record<TipoBucha, number> = {
    porcelana: 1.2,
    polimero: 0.6,
    OIP: 1.0,
    RIP: 0.9,
  };

  // Função empírica para peso
  // P ≈ k × V^1.5 onde V em kV, P em kg
  const pesoBase = 0.5 * Math.pow(tensaoNominal, 1.3);

  return Math.round(pesoBase * fatoresTipo[tipo]);
}

/**
 * Seleciona a corrente nominal padronizada
 * As buchas são fabricadas em correntes padronizadas
 */
export function selecionarCorrenteNominal(correnteCalculada_A: number): number {
  // Correntes padronizadas típicas
  const correntesPadrao = [
    200, 400, 630, 800, 1000, 1250, 1600, 2000,
    2500, 3150, 4000, 5000, 6300, 8000, 10000,
  ];

  // Encontra a primeira corrente padrão >= corrente calculada
  for (const corrente of correntesPadrao) {
    if (corrente >= correnteCalculada_A) {
      return corrente;
    }
  }

  // Se maior que todas, retorna a calculada arredondada
  return Math.ceil(correnteCalculada_A / 1000) * 1000;
}

/**
 * Calcula especificação da bucha AT
 */
export function calcularBuchaAT(
  tensaoAT_kV: number,
  correnteAT_A: number
): BuchaSpec {
  const tensaoNominal = getTensaoNominalPadronizada(tensaoAT_kV);
  const nbi = getNBI(tensaoAT_kV);
  const tipo = determinarTipoBucha(tensaoAT_kV, correnteAT_A);
  const correnteNominal = selecionarCorrenteNominal(correnteAT_A);
  const peso = estimarPesoBucha(tensaoAT_kV, tipo);

  return {
    tensaoNominal_kV: tensaoNominal,
    correnteNominal_A: correnteNominal,
    nbi_kV: nbi.padrao,
    tipo,
    quantidade: 3, // Trifásico
    pesoUnitario_kg: peso,
  };
}

/**
 * Calcula especificação da bucha BT
 */
export function calcularBuchaBT(
  tensaoBT_kV: number,
  correnteBT_A: number
): BuchaSpec {
  const tensaoNominal = getTensaoNominalPadronizada(tensaoBT_kV);
  const nbi = getNBI(tensaoBT_kV);
  const tipo = determinarTipoBucha(tensaoBT_kV, correnteBT_A);
  const correnteNominal = selecionarCorrenteNominal(correnteBT_A);
  const peso = estimarPesoBucha(tensaoBT_kV, tipo);

  return {
    tensaoNominal_kV: tensaoNominal,
    correnteNominal_A: correnteNominal,
    nbi_kV: nbi.padrao,
    tipo,
    quantidade: 3, // Trifásico
    pesoUnitario_kg: peso,
  };
}

/**
 * Calcula especificação da bucha de neutro (se necessário)
 * Dimensionada para menor tensão e corrente de desequilíbrio
 */
export function calcularBuchaNeutro(
  tensaoBT_kV: number,
  correnteBT_A: number
): BuchaSpec | undefined {
  // Neutro só é necessário se tensão BT >= certo nível
  // e se for conexão estrela aterrada
  if (tensaoBT_kV < 15) {
    return undefined;
  }

  // Tensão do neutro: menor classe disponível compatível
  const tensaoNeutro = Math.min(15, tensaoBT_kV / 3);
  const correnteNeutro = correnteBT_A * 0.1; // Tipicamente 10% da corrente de fase

  const nbi = getNBI(tensaoNeutro);

  return {
    tensaoNominal_kV: 15, // Classe mínima típica
    correnteNominal_A: selecionarCorrenteNominal(correnteNeutro),
    nbi_kV: nbi.padrao,
    tipo: 'porcelana',
    quantidade: 1,
    pesoUnitario_kg: estimarPesoBucha(15, 'porcelana'),
  };
}

/**
 * Função principal: executa todos os cálculos das buchas
 */
export function calcularBuchas(
  input: TransformerInput,
  eletrico: CalculoEletrico
): CalculoBuchas {
  // Bucha AT
  const buchaAT = calcularBuchaAT(input.tensaoAT_kV, eletrico.correnteAT_A);

  // Bucha BT
  const buchaBT = calcularBuchaBT(input.tensaoBT_kV, eletrico.correnteBT_A);

  // Bucha Neutro (opcional)
  const buchaNeutro = calcularBuchaNeutro(input.tensaoBT_kV, eletrico.correnteBT_A);

  // Peso total
  let pesoTotal = buchaAT.quantidade * buchaAT.pesoUnitario_kg +
                  buchaBT.quantidade * buchaBT.pesoUnitario_kg;

  if (buchaNeutro) {
    pesoTotal += buchaNeutro.quantidade * buchaNeutro.pesoUnitario_kg;
  }

  return {
    buchaAT,
    buchaBT,
    buchaNeutro,
    pesoTotalBuchas_kg: pesoTotal,
  };
}
