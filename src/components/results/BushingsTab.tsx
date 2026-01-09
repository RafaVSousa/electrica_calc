// TransCalc - Bushings Results Tab

import type { CalculoBuchas, BuchaSpec } from '../../types/transformer';
import { LABELS } from '../../lib/constants';

interface BushingsTabProps {
  data: CalculoBuchas;
}

interface BushingCardProps {
  title: string;
  bucha: BuchaSpec;
  colorClass: string;
}

function BushingCard({ title, bucha, colorClass }: BushingCardProps) {
  return (
    <div className={`p-6 ${colorClass} rounded-lg`}>
      <h3 className="text-lg font-semibold mb-4">{title}</h3>

      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-sm opacity-80">Tensao Nominal</span>
          <span className="font-bold">{bucha.tensaoNominal_kV} kV</span>
        </div>

        <div className="flex justify-between">
          <span className="text-sm opacity-80">NBI</span>
          <span className="font-bold">{bucha.nbi_kV} kV</span>
        </div>

        <div className="flex justify-between">
          <span className="text-sm opacity-80">Corrente Nominal</span>
          <span className="font-bold">{bucha.correnteNominal_A.toLocaleString('pt-BR')} A</span>
        </div>

        <div className="flex justify-between">
          <span className="text-sm opacity-80">Tipo</span>
          <span className="font-bold">{LABELS.tipoBucha[bucha.tipo]}</span>
        </div>

        <hr className="opacity-30" />

        <div className="flex justify-between">
          <span className="text-sm opacity-80">Quantidade</span>
          <span className="font-bold">{bucha.quantidade} unidades</span>
        </div>

        <div className="flex justify-between">
          <span className="text-sm opacity-80">Peso Unitario</span>
          <span className="font-bold">{bucha.pesoUnitario_kg} kg</span>
        </div>

        <div className="flex justify-between pt-2 border-t border-current opacity-30">
          <span className="text-sm font-medium">Peso Total</span>
          <span className="font-bold">
            {(bucha.quantidade * bucha.pesoUnitario_kg).toLocaleString('pt-BR')} kg
          </span>
        </div>
      </div>
    </div>
  );
}

export function BushingsTab({ data }: BushingsTabProps) {
  return (
    <div className="space-y-8">
      {/* Cards das Buchas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <BushingCard
          title="Buchas AT (Alta Tensao)"
          bucha={data.buchaAT}
          colorClass="bg-blue-50 text-blue-900"
        />

        <BushingCard
          title="Buchas BT (Baixa Tensao)"
          bucha={data.buchaBT}
          colorClass="bg-green-50 text-green-900"
        />

        {data.buchaNeutro && (
          <BushingCard
            title="Bucha de Neutro"
            bucha={data.buchaNeutro}
            colorClass="bg-gray-100 text-gray-900"
          />
        )}
      </div>

      {/* Peso Total */}
      <div className="p-6 bg-primary-50 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-primary-900">
              Peso Total das Buchas
            </h3>
            <p className="text-sm text-primary-600 mt-1">
              Todas as buchas AT, BT{data.buchaNeutro ? ' e Neutro' : ''}
            </p>
          </div>
          <div className="text-right">
            <p className="text-4xl font-bold text-primary-900">
              {data.pesoTotalBuchas_kg.toLocaleString('pt-BR')}
            </p>
            <p className="text-primary-600">kg</p>
          </div>
        </div>
      </div>

      {/* Tabela NBI de Referencia */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Referencia: NBI por Tensao (NBR 5356-3)
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-4 py-2 text-left font-medium text-gray-500">
                  Tensao Nominal (kV)
                </th>
                <th className="px-4 py-2 text-right font-medium text-gray-500">
                  NBI Padrao (kV)
                </th>
                <th className="px-4 py-2 text-right font-medium text-gray-500">
                  NBI Elevado (kV)
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {[
                { tensao: 15, padrao: 95, elevado: 110 },
                { tensao: 24.2, padrao: 125, elevado: 150 },
                { tensao: 36.2, padrao: 170, elevado: 200 },
                { tensao: 72.5, padrao: 325, elevado: 350 },
                { tensao: 145, padrao: 550, elevado: 650 },
                { tensao: 245, padrao: 950, elevado: 1050 },
              ].map((row) => (
                <tr key={row.tensao}>
                  <td className="px-4 py-2 text-gray-700">{row.tensao}</td>
                  <td className="px-4 py-2 text-right font-medium text-gray-900">
                    {row.padrao}
                  </td>
                  <td className="px-4 py-2 text-right font-medium text-gray-900">
                    {row.elevado}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Notas */}
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h4 className="font-medium text-yellow-800 mb-2">Notas Importantes</h4>
        <ul className="text-sm text-yellow-700 space-y-1 list-disc list-inside">
          <li>NBI = Nivel Basico de Isolamento (impulso atmosferico)</li>
          <li>Buchas de porcelana sao recomendadas para ambientes internos</li>
          <li>Buchas polimericas oferecem melhor resistencia a vandalismo</li>
          <li>OIP e RIP sao indicadas para tensoes muito elevadas (&gt;72.5 kV)</li>
        </ul>
      </div>
    </div>
  );
}
