// TransCalc - Core Results Tab

import type { CalculoNucleo, TransformerInput } from '../../types/transformer';
import { LABELS } from '../../lib/constants';

interface CoreTabProps {
  data: CalculoNucleo;
  input: TransformerInput;
}

export function CoreTab({ data, input }: CoreTabProps) {
  return (
    <div className="space-y-8">
      {/* Configuracao */}
      <div className="p-4 bg-gray-50 rounded-lg">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-gray-500">Tipo de Nucleo</p>
            <p className="font-medium text-gray-900">
              {LABELS.tipoNucleo[input.tipoNucleo]}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Tipo de Aco</p>
            <p className="font-medium text-gray-900">
              {LABELS.tipoAco[input.tipoAco]}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Inducao de Operacao</p>
            <p className="font-medium text-gray-900">
              {data.inducaoOperacao_T} T
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Fator de Empilhamento</p>
            <p className="font-medium text-gray-900">
              {(data.fatorEmpilhamento * 100).toFixed(1)}%
            </p>
          </div>
        </div>
      </div>

      {/* Secoes */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Secoes do Nucleo
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border border-gray-200 rounded-lg">
            <p className="text-sm text-gray-500">Secao Magnetica (Ae)</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {data.secaoMagnetica_cm2.toFixed(2)}
            </p>
            <p className="text-sm text-gray-500">cm2</p>
          </div>
          <div className="p-4 border border-gray-200 rounded-lg">
            <p className="text-sm text-gray-500">Secao Geometrica (Ag)</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {data.secaoGeometrica_cm2.toFixed(2)}
            </p>
            <p className="text-sm text-gray-500">cm2</p>
          </div>
          <div className="p-4 border border-gray-200 rounded-lg">
            <p className="text-sm text-gray-500">Fluxo Magnetico</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {(data.fluxoMagnetico_Wb * 1000).toFixed(3)}
            </p>
            <p className="text-sm text-gray-500">mWb</p>
          </div>
        </div>
      </div>

      {/* Dimensoes */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Dimensoes do Nucleo
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="px-4 py-3 text-gray-700">Diametro da Coluna</td>
                <td className="px-4 py-3 text-right font-medium text-gray-900">
                  {data.diametroColuna_mm.toLocaleString('pt-BR')} mm
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-gray-700">Altura da Janela</td>
                <td className="px-4 py-3 text-right font-medium text-gray-900">
                  {data.alturaJanela_mm.toLocaleString('pt-BR')} mm
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-gray-700">Largura da Janela</td>
                <td className="px-4 py-3 text-right font-medium text-gray-900">
                  {data.larguraJanela_mm.toLocaleString('pt-BR')} mm
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Dimensoes gerais */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500">Comprimento Total</p>
            <p className="text-xl font-bold text-gray-900">
              {data.comprimentoNucleo_mm.toLocaleString('pt-BR')} mm
            </p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500">Altura Total</p>
            <p className="text-xl font-bold text-gray-900">
              {data.alturaNucleo_mm.toLocaleString('pt-BR')} mm
            </p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500">Profundidade</p>
            <p className="text-xl font-bold text-gray-900">
              {data.profundidadeNucleo_mm.toLocaleString('pt-BR')} mm
            </p>
          </div>
        </div>
      </div>

      {/* Peso e Perdas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-primary-50 rounded-lg">
          <h3 className="text-lg font-semibold text-primary-900 mb-4">
            Peso do Nucleo
          </h3>
          <p className="text-4xl font-bold text-primary-900">
            {data.pesoNucleo_kg.toLocaleString('pt-BR')}
          </p>
          <p className="text-primary-600">kg</p>
          <p className="mt-2 text-sm text-primary-700">
            Volume: {(data.volumeNucleo_m3 * 1000).toFixed(2)} L
          </p>
        </div>

        <div className="p-6 bg-orange-50 rounded-lg">
          <h3 className="text-lg font-semibold text-orange-900 mb-4">
            Perdas no Nucleo
          </h3>
          <p className="text-4xl font-bold text-orange-900">
            {data.perdasNucleo_kW.toFixed(2)}
          </p>
          <p className="text-orange-600">kW</p>
          <p className="mt-2 text-sm text-orange-700">
            Perdas especificas: {data.perdasEspecificas_W_kg.toFixed(3)} W/kg
          </p>
        </div>
      </div>
    </div>
  );
}
