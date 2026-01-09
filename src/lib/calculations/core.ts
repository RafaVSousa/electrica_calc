// TransCalc - Core Calculations Module
// Cálculos do núcleo magnético conforme ABNT NBR 5356

import type { TransformerInput, CalculoNucleo, CalculoEletrico } from '../../types/transformer';
import { PHYSICS, STEEL_PROPERTIES } from '../constants/materials';

/**
 * Calcula a seção magnética necessária do núcleo
 * Ae = V_fase / (4.44 × f × N × Bm)
 * Derivada da Lei de Faraday: V = 4.44 × f × N × Bm × Ae
 *
 * @param tensaoFase_V Tensão de fase em V
 * @param frequencia_Hz Frequência em Hz
 * @param inducaoMax_T Indução máxima em Tesla
 * @param numEspiras Número de espiras (estimado inicialmente)
 * @returns Seção magnética em cm²
 */
export function calcularSecaoMagnetica(
  tensaoFase_V: number,
  frequencia_Hz: number,
  inducaoMax_T: number,
  numEspiras: number
): number {
  // Ae = V / (4.44 × f × N × Bm)
  // Resultado em m², convertido para cm²
  const Ae_m2 = tensaoFase_V / (4.44 * frequencia_Hz * numEspiras * inducaoMax_T);
  return Ae_m2 * 10000; // m² para cm²
}

/**
 * Estima a seção magnética baseada na potência
 * Fórmula empírica: Ae ≈ k × √(S / f)
 * onde k é um fator que depende do tipo de núcleo e qualidade do aço
 *
 * @param potenciaMVA Potência em MVA
 * @param frequencia_Hz Frequência em Hz
 * @param tipoNucleo Tipo de construção do núcleo
 * @returns Seção magnética estimada em cm²
 */
export function estimarSecaoMagnetica(
  potenciaMVA: number,
  frequencia_Hz: number,
  tipoNucleo: 'envolvido' | 'envolvente'
): number {
  // Fator empírico baseado em dados de transformadores comerciais
  // k ≈ 45 para núcleo envolvido, k ≈ 50 para envolvente
  const k = tipoNucleo === 'envolvido' ? 45 : 50;
  const potencia_kVA = potenciaMVA * 1000;

  // Ae em cm² = k × √(S_kVA / f)
  return k * Math.sqrt(potencia_kVA / frequencia_Hz);
}

/**
 * Calcula a seção geométrica do núcleo
 * Ag = Ae / Ke (fator de empilhamento)
 */
export function calcularSecaoGeometrica(secaoMagnetica_cm2: number): number {
  return secaoMagnetica_cm2 / STEEL_PROPERTIES.fatorEmpilhamento;
}

/**
 * Calcula o diâmetro da coluna do núcleo
 * Para núcleo circular escalonado:
 * d = √(4 × Ag / π) × Kc
 *
 * @param secaoGeometrica_cm2 Seção geométrica em cm²
 * @returns Diâmetro em mm
 */
export function calcularDiametroColuna(secaoGeometrica_cm2: number): number {
  const Ag_mm2 = secaoGeometrica_cm2 * 100; // cm² para mm²
  const dCirculo = Math.sqrt((4 * Ag_mm2) / PHYSICS.pi);
  // Fator de círculo circunscrito para núcleo escalonado
  return dCirculo * STEEL_PROPERTIES.fatorCirculoCircunscrito;
}

/**
 * Calcula o fluxo magnético
 * Φ = V_fase / (4.44 × f × N)
 * ou
 * Φ = Bm × Ae
 */
export function calcularFluxoMagnetico(inducao_T: number, secaoMagnetica_cm2: number): number {
  const Ae_m2 = secaoMagnetica_cm2 / 10000;
  return inducao_T * Ae_m2; // Weber
}

/**
 * Estima a altura da janela do núcleo
 * Baseada na potência e nas dimensões dos enrolamentos
 */
export function estimarAlturaJanela(
  potenciaMVA: number,
  diametroColuna_mm: number
): number {
  // Relação típica altura/diâmetro: 2.5 a 4 para potência
  const fatorRelacao = 2.5 + (potenciaMVA / 50) * 1.5; // Cresce com potência
  return diametroColuna_mm * fatorRelacao;
}

/**
 * Estima a largura da janela do núcleo
 * Deve acomodar os enrolamentos AT e BT com isolamentos
 */
export function estimarLarguraJanela(
  potenciaMVA: number,
  diametroColuna_mm: number
): number {
  // Fator empírico baseado na necessidade de espaço para enrolamentos
  // Largura tipicamente 0.8 a 1.2 do diâmetro da coluna
  const fatorBase = 0.8 + (potenciaMVA / 100);
  return diametroColuna_mm * Math.min(fatorBase, 1.4);
}

/**
 * Calcula o peso do núcleo
 * P = Volume × Densidade
 *
 * Volume estimado considerando:
 * - 3 colunas (trifásico)
 * - 2 culatas (superior e inferior)
 */
export function calcularPesoNucleo(
  secaoGeometrica_cm2: number,
  alturaJanela_mm: number,
  diametroColuna_mm: number,
  tipoNucleo: 'envolvido' | 'envolvente'
): { peso_kg: number; volume_m3: number } {
  const Ag_m2 = secaoGeometrica_cm2 / 10000;

  // Comprimento das colunas (3 colunas para trifásico)
  const comprimentoColunas_m = 3 * (alturaJanela_mm / 1000);

  // Comprimento das culatas (2 culatas)
  // Para núcleo envolvido: 2 × (2 × espaçamento entre colunas + diâmetro)
  const espacamento_m = (diametroColuna_mm * 2.5) / 1000; // Espaçamento típico
  const comprimentoCulatas_m = 2 * (2 * espacamento_m + (diametroColuna_mm / 1000));

  // Volume total
  let volumeTotal_m3: number;
  if (tipoNucleo === 'envolvido') {
    volumeTotal_m3 = Ag_m2 * (comprimentoColunas_m + comprimentoCulatas_m);
  } else {
    // Núcleo envolvente tem mais material
    volumeTotal_m3 = Ag_m2 * (comprimentoColunas_m + comprimentoCulatas_m) * 1.3;
  }

  // Peso = Volume × Densidade
  const peso_kg = volumeTotal_m3 * STEEL_PROPERTIES.densidade;

  return {
    peso_kg: Math.round(peso_kg),
    volume_m3: volumeTotal_m3,
  };
}

/**
 * Calcula as perdas no núcleo
 * P_fe = peso × perdas_específicas
 */
export function calcularPerdasNucleo(
  pesoNucleo_kg: number,
  tipoAco: keyof typeof STEEL_PROPERTIES.perdas,
  inducaoOperacao_T: number
): { perdasEspecificas_W_kg: number; perdasTotais_kW: number } {
  // Perdas específicas variam com B^1.6 a B^2
  const perdasBase = STEEL_PROPERTIES.perdas[tipoAco];
  const perdasAjustadas = perdasBase * Math.pow(inducaoOperacao_T / 1.7, 1.8);

  return {
    perdasEspecificas_W_kg: round(perdasAjustadas, 3),
    perdasTotais_kW: round((pesoNucleo_kg * perdasAjustadas) / 1000, 2),
  };
}

/**
 * Calcula as dimensões gerais do núcleo montado
 */
export function calcularDimensoesNucleo(
  diametroColuna_mm: number,
  alturaJanela_mm: number,
  larguraJanela_mm: number
): {
  comprimento_mm: number;
  altura_mm: number;
  profundidade_mm: number;
} {
  // Para núcleo trifásico envolvido:
  // Comprimento = 2 × largura da janela + 3 × diâmetro da coluna
  // Altura = altura da janela + 2 × diâmetro da coluna (culatas)
  // Profundidade ≈ diâmetro da coluna

  const comprimento = 2 * larguraJanela_mm + 3 * diametroColuna_mm;
  const altura = alturaJanela_mm + 2 * diametroColuna_mm;
  const profundidade = diametroColuna_mm;

  return {
    comprimento_mm: Math.round(comprimento),
    altura_mm: Math.round(altura),
    profundidade_mm: Math.round(profundidade),
  };
}

/**
 * Função principal: executa todos os cálculos do núcleo
 */
export function calcularNucleo(input: TransformerInput, _eletrico: CalculoEletrico): CalculoNucleo {
  // Seção magnética estimada pela potência
  const secaoMagnetica_cm2 = estimarSecaoMagnetica(
    input.potenciaMVA,
    input.frequenciaHz,
    input.tipoNucleo
  );

  // Seção geométrica
  const secaoGeometrica_cm2 = calcularSecaoGeometrica(secaoMagnetica_cm2);

  // Diâmetro da coluna
  const diametroColuna_mm = calcularDiametroColuna(secaoGeometrica_cm2);

  // Dimensões da janela
  const alturaJanela_mm = estimarAlturaJanela(input.potenciaMVA, diametroColuna_mm);
  const larguraJanela_mm = estimarLarguraJanela(input.potenciaMVA, diametroColuna_mm);

  // Fluxo magnético
  const fluxoMagnetico_Wb = calcularFluxoMagnetico(input.inducaoMaxT, secaoMagnetica_cm2);

  // Peso e volume
  const { peso_kg, volume_m3 } = calcularPesoNucleo(
    secaoGeometrica_cm2,
    alturaJanela_mm,
    diametroColuna_mm,
    input.tipoNucleo
  );

  // Perdas
  const { perdasEspecificas_W_kg, perdasTotais_kW } = calcularPerdasNucleo(
    peso_kg,
    input.tipoAco,
    input.inducaoMaxT
  );

  // Dimensões gerais
  const dimensoes = calcularDimensoesNucleo(
    diametroColuna_mm,
    alturaJanela_mm,
    larguraJanela_mm
  );

  return {
    diametroColuna_mm: round(diametroColuna_mm, 1),
    alturaJanela_mm: round(alturaJanela_mm, 1),
    larguraJanela_mm: round(larguraJanela_mm, 1),
    secaoMagnetica_cm2: round(secaoMagnetica_cm2, 2),
    secaoGeometrica_cm2: round(secaoGeometrica_cm2, 2),
    fatorEmpilhamento: STEEL_PROPERTIES.fatorEmpilhamento,
    inducaoOperacao_T: input.inducaoMaxT,
    fluxoMagnetico_Wb: round(fluxoMagnetico_Wb, 6),
    pesoNucleo_kg: peso_kg,
    volumeNucleo_m3: round(volume_m3, 4),
    perdasEspecificas_W_kg: perdasEspecificas_W_kg,
    perdasNucleo_kW: perdasTotais_kW,
    comprimentoNucleo_mm: dimensoes.comprimento_mm,
    alturaNucleo_mm: dimensoes.altura_mm,
    profundidadeNucleo_mm: dimensoes.profundidade_mm,
  };
}

/**
 * Função auxiliar para arredondamento
 */
function round(value: number, decimals: number): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}
