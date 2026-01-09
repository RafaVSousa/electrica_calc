// TransCalc - Windings Results Tab

import type { CalculoBobinas, TransformerInput } from '../../types/transformer';
import { LABELS } from '../../lib/constants';

interface WindingsTabProps {
  data: CalculoBobinas;
  input: TransformerInput;
}

export function WindingsTab({ data, input }: WindingsTabProps) {
  return (
    <div className="space-y-8">
      {/* Espiras */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Numero de Espiras
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-600 font-medium">
              Enrolamento AT ({input.tensaoAT_kV} kV)
            </p>
            <p className="text-3xl font-bold text-blue-900 mt-1">
              {data.espirasAT.toLocaleString('pt-BR')}
            </p>
            <p className="text-sm text-blue-600 mt-1">espiras por fase</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-green-600 font-medium">
              Enrolamento BT ({input.tensaoBT_kV} kV)
            </p>
            <p className="text-3xl font-bold text-green-900 mt-1">
              {data.espirasBT.toLocaleString('pt-BR')}
            </p>
            <p className="text-sm text-green-600 mt-1">espiras por fase</p>
          </div>
        </div>
      </div>

      {/* Condutores */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Condutores ({LABELS.tipoConductor[input.tipoConductor]})
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                  Parametro
                </th>
                <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">
                  AT
                </th>
                <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">
                  BT
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="px-4 py-3 text-gray-700">Secao do Condutor</td>
                <td className="px-4 py-3 text-right font-medium text-gray-900">
                  {data.secaoCondutorAT_mm2.toFixed(2)} mm2
                </td>
                <td className="px-4 py-3 text-right font-medium text-gray-900">
                  {data.secaoCondutorBT_mm2.toFixed(2)} mm2
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-gray-700">Densidade de Corrente</td>
                <td className="px-4 py-3 text-right font-medium text-gray-900">
                  {data.densidadeCorrenteAT.toFixed(2)} A/mm2
                </td>
                <td className="px-4 py-3 text-right font-medium text-gray-900">
                  {data.densidadeCorrenteBT.toFixed(2)} A/mm2
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-gray-700">
                  Comprimento Medio de Espira
                </td>
                <td className="px-4 py-3 text-right font-medium text-gray-900">
                  {data.comprimentoMedioEspiraAT_m.toFixed(3)} m
                </td>
                <td className="px-4 py-3 text-right font-medium text-gray-900">
                  {data.comprimentoMedioEspiraBT_m.toFixed(3)} m
                </td>
              </tr>
              <tr className="bg-gray-50">
                <td className="px-4 py-3 text-gray-700 font-medium">
                  Peso Total (3 fases)
                </td>
                <td className="px-4 py-3 text-right font-bold text-gray-900">
                  {data.pesoCondutorAT_kg.toLocaleString('pt-BR')} kg
                </td>
                <td className="px-4 py-3 text-right font-bold text-gray-900">
                  {data.pesoCondutorBT_kg.toLocaleString('pt-BR')} kg
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-4 p-4 bg-primary-50 rounded-lg">
          <p className="text-sm text-primary-600 font-medium">
            Peso Total de Condutores
          </p>
          <p className="text-2xl font-bold text-primary-900">
            {data.pesoTotalCondutores_kg.toLocaleString('pt-BR')} kg
          </p>
        </div>
      </div>

      {/* Dimensoes */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Dimensoes dos Enrolamentos
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                  Dimensao
                </th>
                <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">
                  AT
                </th>
                <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">
                  BT
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="px-4 py-3 text-gray-700">Diametro Interno</td>
                <td className="px-4 py-3 text-right font-medium text-gray-900">
                  {data.diametroInternoAT_mm.toLocaleString('pt-BR')} mm
                </td>
                <td className="px-4 py-3 text-right font-medium text-gray-900">
                  {data.diametroInternoBT_mm.toLocaleString('pt-BR')} mm
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-gray-700">Diametro Externo</td>
                <td className="px-4 py-3 text-right font-medium text-gray-900">
                  {data.diametroExternoAT_mm.toLocaleString('pt-BR')} mm
                </td>
                <td className="px-4 py-3 text-right font-medium text-gray-900">
                  {data.diametroExternoBT_mm.toLocaleString('pt-BR')} mm
                </td>
              </tr>
              <tr className="bg-gray-50">
                <td className="px-4 py-3 text-gray-700">Altura do Enrolamento</td>
                <td className="px-4 py-3 text-right font-medium text-gray-900" colSpan={2}>
                  {data.alturaEnrolamento_mm.toLocaleString('pt-BR')} mm
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
