// TransCalc - Estimates Results Tab

import type { Estimativas } from '../../types/transformer';

interface EstimatesTabProps {
  data: Estimativas;
}

interface WeightBarProps {
  label: string;
  value: number;
  total: number;
  color: string;
}

function WeightBar({ label, value, total, color }: WeightBarProps) {
  const percentage = total > 0 ? (value / total) * 100 : 0;

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="text-gray-600">{label}</span>
        <span className="font-medium text-gray-900">
          {value.toLocaleString('pt-BR')} kg ({percentage.toFixed(1)}%)
        </span>
      </div>
      <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full ${color} rounded-full transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

export function EstimatesTab({ data }: EstimatesTabProps) {
  const weightItems = [
    { label: 'Nucleo', value: data.pesoNucleo, color: 'bg-blue-500' },
    { label: 'Condutores', value: data.pesoCondutores, color: 'bg-green-500' },
    { label: 'Oleo', value: data.pesoOleo, color: 'bg-amber-500' },
    { label: 'Tanque', value: data.pesoTanque, color: 'bg-gray-500' },
    { label: 'Buchas', value: data.pesoBuchas, color: 'bg-purple-500' },
    { label: 'Isolantes', value: data.pesoIsolantes, color: 'bg-pink-500' },
    { label: 'Acessorios', value: data.pesoAcessorios, color: 'bg-cyan-500' },
  ];

  const costItems = [
    { label: 'Nucleo', value: data.custoNucleo },
    { label: 'Condutores', value: data.custoCondutores },
    { label: 'Oleo', value: data.custoOleo },
    { label: 'Tanque', value: data.custoTanque },
    { label: 'Buchas', value: data.custoBuchas },
    { label: 'Isolantes', value: data.custoIsolantes },
    { label: 'Mao de Obra', value: data.custoMaoDeObra },
  ];

  return (
    <div className="space-y-8">
      {/* Totais em destaque */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-primary-600 text-white rounded-xl">
          <h3 className="text-lg font-semibold opacity-90">Peso Total</h3>
          <p className="text-5xl font-bold mt-2">
            {data.pesoTotal.toLocaleString('pt-BR')}
          </p>
          <p className="text-primary-200 mt-1">quilogramas</p>
        </div>
        <div className="p-6 bg-green-600 text-white rounded-xl">
          <h3 className="text-lg font-semibold opacity-90">Custo Estimado</h3>
          <p className="text-5xl font-bold mt-2">
            {formatCurrency(data.custoTotal)}
          </p>
          <p className="text-green-200 mt-1">
            {formatCurrency(data.custoTotal / data.pesoTotal)}/kg
          </p>
        </div>
      </div>

      {/* Breakdown de Pesos */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Composicao de Peso
        </h3>
        <div className="space-y-4">
          {weightItems.map((item) => (
            <WeightBar
              key={item.label}
              label={item.label}
              value={item.value}
              total={data.pesoTotal}
              color={item.color}
            />
          ))}
        </div>
      </div>

      {/* Breakdown de Custos */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Composicao de Custos
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                  Item
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">
                  Valor
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">
                  %
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {costItems.map((item) => (
                <tr key={item.label}>
                  <td className="px-4 py-3 text-gray-700">{item.label}</td>
                  <td className="px-4 py-3 text-right font-medium text-gray-900">
                    {formatCurrency(item.value)}
                  </td>
                  <td className="px-4 py-3 text-right text-gray-500">
                    {((item.value / data.custoTotal) * 100).toFixed(1)}%
                  </td>
                </tr>
              ))}
              <tr className="bg-green-50 font-bold">
                <td className="px-4 py-3 text-green-900">TOTAL</td>
                <td className="px-4 py-3 text-right text-green-900">
                  {formatCurrency(data.custoTotal)}
                </td>
                <td className="px-4 py-3 text-right text-green-900">100%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Grafico de Pizza Simplificado */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 mb-4">
            Distribuicao de Peso
          </h4>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500 rounded" />
              <span className="text-sm text-gray-600">
                Nucleo: {data.breakdownPeso.nucleo}%
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded" />
              <span className="text-sm text-gray-600">
                Condutores: {data.breakdownPeso.condutores}%
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-amber-500 rounded" />
              <span className="text-sm text-gray-600">
                Oleo: {data.breakdownPeso.oleo}%
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-500 rounded" />
              <span className="text-sm text-gray-600">
                Tanque: {data.breakdownPeso.tanque}%
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-purple-500 rounded" />
              <span className="text-sm text-gray-600">
                Outros: {data.breakdownPeso.outros}%
              </span>
            </div>
          </div>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 mb-4">
            Distribuicao de Custo
          </h4>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded" />
              <span className="text-sm text-gray-600">
                Materiais: {data.breakdownCusto.materiais}%
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500 rounded" />
              <span className="text-sm text-gray-600">
                Mao de Obra: {data.breakdownCusto.maoDeObra}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h4 className="font-medium text-yellow-800 mb-2">Observacoes</h4>
        <ul className="text-sm text-yellow-700 space-y-1 list-disc list-inside">
          <li>
            Os valores apresentados sao estimativas baseadas em precos de
            referencia e podem variar conforme condicoes de mercado.
          </li>
          <li>
            Custos de transporte, instalacao e comissionamento nao estao
            incluidos.
          </li>
          <li>Para orcamentos precisos, consulte fabricantes especializados.</li>
          <li>Precos de referencia atualizados em Janeiro/2025.</li>
        </ul>
      </div>
    </div>
  );
}
