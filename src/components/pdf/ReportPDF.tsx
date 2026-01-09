// TransCalc - PDF Report Component
// Generates technical PDF reports using @react-pdf/renderer

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from '@react-pdf/renderer';
import type { TransformerOutput } from '../../types/transformer';
import { LABELS } from '../../lib/constants';

// Register fonts (optional - use system fonts by default)
Font.register({
  family: 'Helvetica',
  fonts: [
    { src: 'Helvetica' },
    { src: 'Helvetica-Bold', fontWeight: 'bold' },
  ],
});

// Styles
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#2563eb',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e3a8a',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    color: '#64748b',
  },
  headerInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  headerInfoItem: {
    fontSize: 9,
    color: '#475569',
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1e40af',
    marginBottom: 8,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  table: {
    width: '100%',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    minHeight: 22,
    alignItems: 'center',
  },
  tableRowHighlight: {
    backgroundColor: '#eff6ff',
  },
  tableCell: {
    flex: 1,
    padding: 4,
  },
  tableCellLabel: {
    flex: 2,
    padding: 4,
    color: '#475569',
  },
  tableCellValue: {
    flex: 1,
    padding: 4,
    textAlign: 'right',
    fontWeight: 'bold',
  },
  tableCellUnit: {
    width: 40,
    padding: 4,
    color: '#64748b',
  },
  twoColumn: {
    flexDirection: 'row',
    gap: 20,
  },
  column: {
    flex: 1,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingTop: 10,
    fontSize: 8,
    color: '#94a3b8',
  },
  summary: {
    backgroundColor: '#f8fafc',
    padding: 12,
    marginBottom: 15,
    borderRadius: 4,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  summaryItem: {
    width: '25%',
    padding: 4,
  },
  summaryLabel: {
    fontSize: 8,
    color: '#64748b',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1e293b',
  },
});

interface TableRowProps {
  label: string;
  value: string | number;
  unit?: string;
  highlight?: boolean;
}

function TableRow({ label, value, unit, highlight }: TableRowProps) {
  return (
    <View style={highlight ? [styles.tableRow, styles.tableRowHighlight] : styles.tableRow}>
      <Text style={styles.tableCellLabel}>{label}</Text>
      <Text style={styles.tableCellValue}>
        {typeof value === 'number' ? value.toLocaleString('pt-BR') : value}
      </Text>
      {unit && <Text style={styles.tableCellUnit}>{unit}</Text>}
    </View>
  );
}

interface ReportPDFProps {
  output: TransformerOutput;
}

export function ReportPDF({ output }: ReportPDFProps) {
  const { input, eletrico, bobinas, nucleo, tanque, buchas, estimativas } = output;
  const date = new Date().toLocaleDateString('pt-BR');

  return (
    <Document>
      {/* Page 1: Overview and Electrical */}
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>RELATORIO TECNICO</Text>
          <Text style={styles.subtitle}>TRANSFORMADOR DE POTENCIA TRIFASICO</Text>
          <View style={styles.headerInfo}>
            <Text style={styles.headerInfoItem}>Cliente: {input.clientName || 'N/A'}</Text>
            <Text style={styles.headerInfoItem}>Projeto: {input.projectName}</Text>
            <Text style={styles.headerInfoItem}>Data: {date}</Text>
          </View>
        </View>

        {/* Summary */}
        <View style={styles.summary}>
          <View style={styles.summaryGrid}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Potencia</Text>
              <Text style={styles.summaryValue}>{input.potenciaMVA} MVA</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Tensao AT</Text>
              <Text style={styles.summaryValue}>{input.tensaoAT_kV} kV</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Tensao BT</Text>
              <Text style={styles.summaryValue}>{input.tensaoBT_kV} kV</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Rendimento</Text>
              <Text style={styles.summaryValue}>{eletrico.rendimento100.toFixed(2)}%</Text>
            </View>
          </View>
        </View>

        {/* Section 1: Input Data */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. DADOS DE ENTRADA</Text>
          <View style={styles.table}>
            <TableRow label="Potencia Nominal" value={input.potenciaMVA} unit="MVA" />
            <TableRow label="Tensao Primaria (AT)" value={input.tensaoAT_kV} unit="kV" />
            <TableRow label="Tensao Secundaria (BT)" value={input.tensaoBT_kV} unit="kV" />
            <TableRow label="Impedancia" value={input.impedanciaPercent} unit="%" />
            <TableRow label="Frequencia" value={input.frequenciaHz} unit="Hz" />
            <TableRow label="Refrigeracao" value={LABELS.tipoRefrigeracao[input.tipoRefrigeracao]} />
            <TableRow label="Condutor" value={LABELS.tipoConductor[input.tipoConductor]} />
            <TableRow label="Oleo Isolante" value={LABELS.tipoOleo[input.tipoOleo]} />
          </View>
        </View>

        {/* Section 2: Electrical Results */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. RESULTADOS ELETRICOS</Text>
          <View style={styles.twoColumn}>
            <View style={styles.column}>
              <View style={styles.table}>
                <TableRow label="Corrente Nominal AT" value={eletrico.correnteAT_A.toFixed(2)} unit="A" />
                <TableRow label="Corrente Nominal BT" value={eletrico.correnteBT_A.toFixed(2)} unit="A" />
                <TableRow label="Relacao de Transformacao" value={eletrico.relacaoTransformacao.toFixed(4)} />
                <TableRow label="Regulacao de Tensao" value={eletrico.regulacaoTensao.toFixed(3)} unit="%" />
              </View>
            </View>
            <View style={styles.column}>
              <View style={styles.table}>
                <TableRow label="Perdas no Cobre" value={eletrico.perdasCobre_kW.toFixed(2)} unit="kW" />
                <TableRow label="Perdas no Ferro" value={eletrico.perdasFerro_kW.toFixed(2)} unit="kW" />
                <TableRow label="Perdas Totais" value={eletrico.perdasTotais_kW.toFixed(2)} unit="kW" highlight />
              </View>
            </View>
          </View>
        </View>

        {/* Efficiency Table */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2.1 RENDIMENTO vs CARREGAMENTO</Text>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <Text style={styles.tableCellLabel}>Carregamento</Text>
              <Text style={styles.tableCellValue}>25%</Text>
              <Text style={styles.tableCellValue}>50%</Text>
              <Text style={styles.tableCellValue}>75%</Text>
              <Text style={styles.tableCellValue}>100%</Text>
            </View>
            <View style={[styles.tableRow, styles.tableRowHighlight]}>
              <Text style={styles.tableCellLabel}>Rendimento (%)</Text>
              <Text style={styles.tableCellValue}>{eletrico.rendimento25.toFixed(2)}</Text>
              <Text style={styles.tableCellValue}>{eletrico.rendimento50.toFixed(2)}</Text>
              <Text style={styles.tableCellValue}>{eletrico.rendimento75.toFixed(2)}</Text>
              <Text style={styles.tableCellValue}>{eletrico.rendimento100.toFixed(2)}</Text>
            </View>
          </View>
        </View>

        {/* Short Circuit */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2.2 CURTO-CIRCUITO</Text>
          <View style={styles.table}>
            <TableRow label="Impedancia de Curto-Circuito" value={input.impedanciaPercent} unit="%" />
            <TableRow label="Corrente de Curto AT" value={eletrico.correnteCurtoAT_kA.toFixed(2)} unit="kA" />
            <TableRow label="Corrente de Curto BT" value={eletrico.correnteCurtoBT_kA.toFixed(2)} unit="kA" />
            <TableRow label="Potencia de Curto" value={eletrico.potenciaCurto_MVA.toFixed(2)} unit="MVA" highlight />
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>TransCalc - Sistema de Calculo de Transformadores</Text>
          <Text>Conforme ABNT NBR 5356</Text>
          <Text>Pagina 1 de 2</Text>
        </View>
      </Page>

      {/* Page 2: Physical Data and Estimates */}
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>RELATORIO TECNICO (cont.)</Text>
          <Text style={styles.subtitle}>{input.projectName}</Text>
        </View>

        {/* Section 3: Windings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. ENROLAMENTOS</Text>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <Text style={styles.tableCellLabel}>Parametro</Text>
              <Text style={styles.tableCellValue}>AT</Text>
              <Text style={styles.tableCellValue}>BT</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCellLabel}>Numero de Espiras</Text>
              <Text style={styles.tableCellValue}>{bobinas.espirasAT}</Text>
              <Text style={styles.tableCellValue}>{bobinas.espirasBT}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCellLabel}>Secao do Condutor (mm2)</Text>
              <Text style={styles.tableCellValue}>{bobinas.secaoCondutorAT_mm2.toFixed(2)}</Text>
              <Text style={styles.tableCellValue}>{bobinas.secaoCondutorBT_mm2.toFixed(2)}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCellLabel}>Peso dos Condutores (kg)</Text>
              <Text style={styles.tableCellValue}>{bobinas.pesoCondutorAT_kg.toLocaleString('pt-BR')}</Text>
              <Text style={styles.tableCellValue}>{bobinas.pesoCondutorBT_kg.toLocaleString('pt-BR')}</Text>
            </View>
          </View>
        </View>

        {/* Section 4: Core */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. NUCLEO MAGNETICO</Text>
          <View style={styles.twoColumn}>
            <View style={styles.column}>
              <View style={styles.table}>
                <TableRow label="Tipo de Nucleo" value={LABELS.tipoNucleo[input.tipoNucleo]} />
                <TableRow label="Tipo de Aco" value={LABELS.tipoAco[input.tipoAco]} />
                <TableRow label="Inducao de Operacao" value={nucleo.inducaoOperacao_T} unit="T" />
                <TableRow label="Secao Magnetica" value={nucleo.secaoMagnetica_cm2.toFixed(2)} unit="cm2" />
              </View>
            </View>
            <View style={styles.column}>
              <View style={styles.table}>
                <TableRow label="Diametro da Coluna" value={nucleo.diametroColuna_mm.toFixed(1)} unit="mm" />
                <TableRow label="Altura da Janela" value={nucleo.alturaJanela_mm.toFixed(1)} unit="mm" />
                <TableRow label="Peso do Nucleo" value={nucleo.pesoNucleo_kg.toLocaleString('pt-BR')} unit="kg" highlight />
                <TableRow label="Perdas no Nucleo" value={nucleo.perdasNucleo_kW.toFixed(2)} unit="kW" />
              </View>
            </View>
          </View>
        </View>

        {/* Section 5: Tank */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>5. TANQUE E OLEO</Text>
          <View style={styles.twoColumn}>
            <View style={styles.column}>
              <View style={styles.table}>
                <TableRow label="Comprimento" value={tanque.comprimento_mm.toLocaleString('pt-BR')} unit="mm" />
                <TableRow label="Largura" value={tanque.largura_mm.toLocaleString('pt-BR')} unit="mm" />
                <TableRow label="Altura" value={tanque.altura_mm.toLocaleString('pt-BR')} unit="mm" />
              </View>
            </View>
            <View style={styles.column}>
              <View style={styles.table}>
                <TableRow label="Volume de Oleo" value={tanque.volumeOleo_litros.toLocaleString('pt-BR')} unit="L" />
                <TableRow label="Peso do Oleo" value={tanque.pesoOleo_kg.toLocaleString('pt-BR')} unit="kg" />
                <TableRow label="Peso do Tanque" value={tanque.pesoTanqueVazio_kg.toLocaleString('pt-BR')} unit="kg" />
              </View>
            </View>
          </View>
        </View>

        {/* Section 6: Bushings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>6. BUCHAS</Text>
          <View style={styles.twoColumn}>
            <View style={styles.column}>
              <View style={styles.table}>
                <TableRow label="Bucha AT - Tensao" value={buchas.buchaAT.tensaoNominal_kV} unit="kV" />
                <TableRow label="Bucha AT - NBI" value={buchas.buchaAT.nbi_kV} unit="kV" />
                <TableRow label="Bucha AT - Corrente" value={buchas.buchaAT.correnteNominal_A.toLocaleString('pt-BR')} unit="A" />
              </View>
            </View>
            <View style={styles.column}>
              <View style={styles.table}>
                <TableRow label="Bucha BT - Tensao" value={buchas.buchaBT.tensaoNominal_kV} unit="kV" />
                <TableRow label="Bucha BT - NBI" value={buchas.buchaBT.nbi_kV} unit="kV" />
                <TableRow label="Bucha BT - Corrente" value={buchas.buchaBT.correnteNominal_A.toLocaleString('pt-BR')} unit="A" />
              </View>
            </View>
          </View>
        </View>

        {/* Section 7: Weight Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>7. ESTIMATIVA DE PESOS</Text>
          <View style={styles.table}>
            <TableRow label="Nucleo" value={estimativas.pesoNucleo.toLocaleString('pt-BR')} unit="kg" />
            <TableRow label="Condutores" value={estimativas.pesoCondutores.toLocaleString('pt-BR')} unit="kg" />
            <TableRow label="Oleo" value={estimativas.pesoOleo.toLocaleString('pt-BR')} unit="kg" />
            <TableRow label="Tanque" value={estimativas.pesoTanque.toLocaleString('pt-BR')} unit="kg" />
            <TableRow label="Buchas e Acessorios" value={(estimativas.pesoBuchas + estimativas.pesoAcessorios).toLocaleString('pt-BR')} unit="kg" />
            <TableRow label="PESO TOTAL" value={estimativas.pesoTotal.toLocaleString('pt-BR')} unit="kg" highlight />
          </View>
        </View>

        {/* Section 8: Cost Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>8. ESTIMATIVA DE CUSTO</Text>
          <View style={styles.table}>
            <TableRow label="Materiais" value={`R$ ${(estimativas.custoTotal - estimativas.custoMaoDeObra).toLocaleString('pt-BR')}`} />
            <TableRow label="Mao de Obra" value={`R$ ${estimativas.custoMaoDeObra.toLocaleString('pt-BR')}`} />
            <TableRow label="CUSTO TOTAL ESTIMADO" value={`R$ ${estimativas.custoTotal.toLocaleString('pt-BR')}`} highlight />
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>TransCalc - Sistema de Calculo de Transformadores</Text>
          <Text>Conforme ABNT NBR 5356</Text>
          <Text>Pagina 2 de 2</Text>
        </View>
      </Page>
    </Document>
  );
}
