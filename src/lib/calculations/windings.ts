// TransCalc - Windings (Bobinas) Calculations Module
// Cálculos dos enrolamentos conforme ABNT NBR 5356

import type { TransformerInput, CalculoBobinas, CalculoEletrico, CalculoNucleo } from '../../types/transformer';
import { PHYSICS, CONDUCTOR_PROPERTIES } from '../constants/materials';

/**
 * Calcula o número de espiras do enrolamento
 * Lei de Faraday: N = V / (4.44 × f × Bm × Ae)
 *
 * @param tensaoFase_V Tensão de fase em V (V_linha / √3)
 * @param frequencia_Hz Frequência em Hz
 * @param inducaoMax_T Indução máxima em Tesla
 * @param secaoMagnetica_cm2 Seção magnética do núcleo em cm²
 * @returns Número de espiras (inteiro)
 */
export function calcularNumeroEspiras(
  tensaoFase_V: number,
  frequencia_Hz: number,
  inducaoMax_T: number,
  secaoMagnetica_cm2: number
): number {
  const Ae_m2 = secaoMagnetica_cm2 / 10000; // cm² para m²
  const N = tensaoFase_V / (4.44 * frequencia_Hz * inducaoMax_T * Ae_m2);
  return Math.ceil(N); // Arredonda para cima (número inteiro de espiras)
}

/**
 * Calcula a seção do condutor
 * S_cond = I / J
 *
 * @param correnteNominal_A Corrente nominal em A
 * @param densidadeCorrente Densidade de corrente em A/mm²
 * @returns Seção do condutor em mm²
 */
export function calcularSecaoCondutor(
  correnteNominal_A: number,
  densidadeCorrente: number
): number {
  return correnteNominal_A / densidadeCorrente;
}

/**
 * Determina a densidade de corrente adequada
 * Cobre: 2.5 a 3.5 A/mm²
 * Alumínio: 1.5 a 2.5 A/mm²
 *
 * @param tipoConductor Tipo do condutor
 * @param tipoRefrigeracao Tipo de refrigeração
 * @returns Densidade de corrente em A/mm²
 */
export function determinarDensidadeCorrente(
  tipoConductor: 'cobre' | 'aluminio',
  tipoRefrigeracao: 'ONAN' | 'ONAF' | 'OFAF'
): number {
  const props = CONDUCTOR_PROPERTIES[tipoConductor];

  // Fator de refrigeração
  let fator: number;
  switch (tipoRefrigeracao) {
    case 'ONAN':
      fator = 0; // Base
      break;
    case 'ONAF':
      fator = 0.15; // +15%
      break;
    case 'OFAF':
      fator = 0.25; // +25%
      break;
  }

  // Densidade média ajustada pela refrigeração
  const media = (props.densidadeCorrenteMin + props.densidadeCorrenteMax) / 2;
  return media * (1 + fator);
}

/**
 * Estima a altura do enrolamento
 * Baseada na altura da janela do núcleo com folgas de isolamento
 */
export function estimarAlturaEnrolamento(
  alturaJanela_mm: number,
  tensaoAT_kV: number
): number {
  // Folga superior e inferior para isolamento
  // Aumenta com a tensão
  const folgaIsolamento = 50 + tensaoAT_kV * 0.5; // mm por lado
  return alturaJanela_mm - 2 * folgaIsolamento;
}

/**
 * Calcula os diâmetros dos enrolamentos
 * BT fica mais interno (próximo ao núcleo)
 * AT fica mais externo
 */
export function calcularDiametrosEnrolamentos(
  diametroColuna_mm: number,
  secaoCondutorBT_mm2: number,
  secaoCondutorAT_mm2: number,
  espirasAT: number,
  espirasBT: number,
  alturaEnrolamento_mm: number
): {
  diametroInternoBT_mm: number;
  diametroExternoBT_mm: number;
  diametroInternoAT_mm: number;
  diametroExternoAT_mm: number;
} {
  // Folga entre núcleo e BT (canal de óleo)
  const folgaNucleoEnrolamento = 20; // mm

  // Diâmetro interno BT
  const diametroInternoBT = diametroColuna_mm + 2 * folgaNucleoEnrolamento;

  // Estima espessura do enrolamento BT
  // Espiras por camada e número de camadas
  const espirasPorCamadaBT = Math.ceil(alturaEnrolamento_mm / 8); // 8mm por espira típico
  const camadasBT = Math.ceil(espirasBT / espirasPorCamadaBT);
  const espessuraBT = camadasBT * Math.sqrt(secaoCondutorBT_mm2) * 1.2; // Fator de empacotamento

  // Diâmetro externo BT
  const diametroExternoBT = diametroInternoBT + 2 * espessuraBT;

  // Canal de óleo entre BT e AT
  const canalOleo = 15 + diametroColuna_mm * 0.03; // mm

  // Diâmetro interno AT
  const diametroInternoAT = diametroExternoBT + 2 * canalOleo;

  // Estima espessura do enrolamento AT
  const espirasPorCamadaAT = Math.ceil(alturaEnrolamento_mm / 6); // Espiras menores
  const camadasAT = Math.ceil(espirasAT / espirasPorCamadaAT);
  const espessuraAT = camadasAT * Math.sqrt(secaoCondutorAT_mm2) * 1.3;

  // Diâmetro externo AT
  const diametroExternoAT = diametroInternoAT + 2 * espessuraAT;

  return {
    diametroInternoBT_mm: Math.round(diametroInternoBT),
    diametroExternoBT_mm: Math.round(diametroExternoBT),
    diametroInternoAT_mm: Math.round(diametroInternoAT),
    diametroExternoAT_mm: Math.round(diametroExternoAT),
  };
}

/**
 * Calcula o comprimento médio de espira
 * CME = π × diâmetro médio
 */
export function calcularComprimentoMedioEspira(
  diametroInterno_mm: number,
  diametroExterno_mm: number
): number {
  const diametroMedio = (diametroInterno_mm + diametroExterno_mm) / 2;
  return (PHYSICS.pi * diametroMedio) / 1000; // metros
}

/**
 * Calcula o peso do condutor
 * P = Volume × Densidade
 * Volume = CME × N × S_cond
 */
export function calcularPesoCondutor(
  comprimentoMedioEspira_m: number,
  numEspiras: number,
  secaoCondutor_mm2: number,
  tipoConductor: 'cobre' | 'aluminio'
): number {
  // Volume em m³
  const secaoCondutor_m2 = secaoCondutor_mm2 / 1_000_000;
  const volume_m3 = comprimentoMedioEspira_m * numEspiras * secaoCondutor_m2;

  // Peso = Volume × Densidade
  const densidade = CONDUCTOR_PROPERTIES[tipoConductor].densidade;
  return volume_m3 * densidade;
}

/**
 * Função principal: executa todos os cálculos das bobinas
 */
export function calcularBobinas(
  input: TransformerInput,
  eletrico: CalculoEletrico,
  nucleo: CalculoNucleo
): CalculoBobinas {
  // Tensao de fase (estrela)
  const tensaoFaseAT_V = (input.tensaoAT_kV * 1000) / PHYSICS.raiz3;

  // Número de espiras
  const espirasAT = calcularNumeroEspiras(
    tensaoFaseAT_V,
    input.frequenciaHz,
    input.inducaoMaxT,
    nucleo.secaoMagnetica_cm2
  );

  // Espiras BT calculadas pela relação de transformação
  const espirasBT = Math.ceil(espirasAT / eletrico.relacaoTransformacao);

  // Densidades de corrente
  const densidadeCorrenteAT = determinarDensidadeCorrente(
    input.tipoConductor,
    input.tipoRefrigeracao
  );
  const densidadeCorrenteBT = determinarDensidadeCorrente(
    input.tipoConductor,
    input.tipoRefrigeracao
  );

  // Seções dos condutores
  const secaoCondutorAT_mm2 = calcularSecaoCondutor(eletrico.correnteAT_A, densidadeCorrenteAT);
  const secaoCondutorBT_mm2 = calcularSecaoCondutor(eletrico.correnteBT_A, densidadeCorrenteBT);

  // Altura do enrolamento
  const alturaEnrolamento_mm = estimarAlturaEnrolamento(
    nucleo.alturaJanela_mm,
    input.tensaoAT_kV
  );

  // Diâmetros
  const diametros = calcularDiametrosEnrolamentos(
    nucleo.diametroColuna_mm,
    secaoCondutorBT_mm2,
    secaoCondutorAT_mm2,
    espirasAT,
    espirasBT,
    alturaEnrolamento_mm
  );

  // Comprimentos médios de espira
  const comprimentoMedioEspiraAT_m = calcularComprimentoMedioEspira(
    diametros.diametroInternoAT_mm,
    diametros.diametroExternoAT_mm
  );
  const comprimentoMedioEspiraBT_m = calcularComprimentoMedioEspira(
    diametros.diametroInternoBT_mm,
    diametros.diametroExternoBT_mm
  );

  // Pesos dos condutores
  const pesoCondutorAT_kg = calcularPesoCondutor(
    comprimentoMedioEspiraAT_m,
    espirasAT,
    secaoCondutorAT_mm2,
    input.tipoConductor
  );
  const pesoCondutorBT_kg = calcularPesoCondutor(
    comprimentoMedioEspiraBT_m,
    espirasBT,
    secaoCondutorBT_mm2,
    input.tipoConductor
  );

  // Para trifásico: 3 fases
  const pesoTotalCondutores_kg = 3 * (pesoCondutorAT_kg + pesoCondutorBT_kg);

  return {
    espirasAT,
    espirasBT,
    secaoCondutorAT_mm2: round(secaoCondutorAT_mm2, 2),
    secaoCondutorBT_mm2: round(secaoCondutorBT_mm2, 2),
    densidadeCorrenteAT: round(densidadeCorrenteAT, 2),
    densidadeCorrenteBT: round(densidadeCorrenteBT, 2),
    pesoCondutorAT_kg: round(pesoCondutorAT_kg * 3, 1), // 3 fases
    pesoCondutorBT_kg: round(pesoCondutorBT_kg * 3, 1), // 3 fases
    pesoTotalCondutores_kg: round(pesoTotalCondutores_kg, 1),
    alturaEnrolamento_mm: round(alturaEnrolamento_mm, 1),
    diametroInternoAT_mm: diametros.diametroInternoAT_mm,
    diametroExternoAT_mm: diametros.diametroExternoAT_mm,
    diametroInternoBT_mm: diametros.diametroInternoBT_mm,
    diametroExternoBT_mm: diametros.diametroExternoBT_mm,
    comprimentoMedioEspiraAT_m: round(comprimentoMedioEspiraAT_m, 3),
    comprimentoMedioEspiraBT_m: round(comprimentoMedioEspiraBT_m, 3),
  };
}

/**
 * Função auxiliar para arredondamento
 */
function round(value: number, decimals: number): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}
