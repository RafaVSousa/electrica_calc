// TransCalc - Electrical Results Tab

import type { CalculoEletrico, TransformerInput } from '../../types/transformer';

interface ElectricalTabProps {
  data: CalculoEletrico;
  input: TransformerInput;
}

interface ResultRowProps {
  label: string;
  value: string | number;
  unit?: string;
  highlight?: boolean;
}

function ResultRow({ label, value, unit, highlight }: ResultRowProps) {
  return (
    <tr className={highlight ? 'bg-primary-50' : ''}>
      <td className="px-4 py-3 text-gray-700">{label}</td>
      <td className="px-4 py-3 text-right font-medium text-gray-900">
        {typeof value === 'number' ? value.toLocaleString('pt-BR') : value}
        {unit && <span className="text-gray-500 ml-1">{unit}</span>}
      </td>
    </tr>
  );
}

export function ElectricalTab({ data, input }: ElectricalTabProps) {
  const efficiencyData = [
    { carga: 25, rendimento: data.rendimento25 },
    { carga: 50, rendimento: data.rendimento50 },
    { carga: 75, rendimento: data.rendimento75 },
    { carga: 100, rendimento: data.rendimento100 },
  ];

  return (
    <div className="space-y-8">
      {/* Correntes Nominais */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Correntes Nominais
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <tbody className="divide-y divide-gray-200">
              <ResultRow
                label="Corrente Nominal AT"
                value={data.correnteAT_A.toFixed(2)}
                unit="A"
              />
              <ResultRow
                label="Corrente Nominal BT"
                value={data.correnteBT_A.toFixed(2)}
                unit="A"
              />
              <ResultRow
                label="Relacao de Transformacao"
                value={data.relacaoTransformacao.toFixed(4)}
              />
            </tbody>
          </table>
        </div>
      </div>

      {/* Perdas */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Perdas</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <tbody className="divide-y divide-gray-200">
              <ResultRow
                label="Perdas no Cobre (PCu)"
                value={data.perdasCobre_kW.toFixed(2)}
                unit="kW"
              />
              <ResultRow
                label="Perdas no Ferro (PFe)"
                value={data.perdasFerro_kW.toFixed(2)}
                unit="kW"
              />
              <ResultRow
                label="Perdas Totais"
                value={data.perdasTotais_kW.toFixed(2)}
                unit="kW"
                highlight
              />
            </tbody>
          </table>
        </div>
      </div>

      {/* Rendimento */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Rendimento vs Carregamento
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                    Carga
                  </th>
                  <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">
                    Rendimento
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {efficiencyData.map((item) => (
                  <tr key={item.carga} className={item.carga === 100 ? 'bg-primary-50' : ''}>
                    <td className="px-4 py-3 text-gray-700">{item.carga}%</td>
                    <td className="px-4 py-3 text-right font-medium text-gray-900">
                      {item.rendimento.toFixed(3)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Simple bar chart */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="space-y-3">
              {efficiencyData.map((item) => (
                <div key={item.carga} className="flex items-center gap-3">
                  <span className="w-12 text-sm text-gray-600">{item.carga}%</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-4">
                    <div
                      className="bg-primary-600 h-4 rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.max(0, (item.rendimento - 98) * 50)}%`,
                      }}
                    />
                  </div>
                  <span className="w-20 text-sm font-medium text-gray-900 text-right">
                    {item.rendimento.toFixed(2)}%
                  </span>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              * Escala ajustada para visualizacao (98-100%)
            </p>
          </div>
        </div>
      </div>

      {/* Regulacao e Curto-circuito */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Regulacao de Tensao
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <tbody className="divide-y divide-gray-200">
                <ResultRow
                  label="Resistencia Percentual"
                  value={data.resistenciaPercentual.toFixed(4)}
                  unit="%"
                />
                <ResultRow
                  label="Reatancia Percentual"
                  value={data.reatanciaPercentual.toFixed(4)}
                  unit="%"
                />
                <ResultRow
                  label="Regulacao de Tensao"
                  value={data.regulacaoTensao.toFixed(3)}
                  unit="%"
                  highlight
                />
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Curto-Circuito
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <tbody className="divide-y divide-gray-200">
                <ResultRow
                  label="Impedancia"
                  value={input.impedanciaPercent}
                  unit="%"
                />
                <ResultRow
                  label="Corrente de Curto AT"
                  value={data.correnteCurtoAT_kA.toFixed(2)}
                  unit="kA"
                />
                <ResultRow
                  label="Corrente de Curto BT"
                  value={data.correnteCurtoBT_kA.toFixed(2)}
                  unit="kA"
                />
                <ResultRow
                  label="Potencia de Curto"
                  value={data.potenciaCurto_MVA.toFixed(2)}
                  unit="MVA"
                  highlight
                />
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
