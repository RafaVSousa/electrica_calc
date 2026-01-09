// TransCalc - Tank Results Tab

import type { CalculoTanque, TransformerInput } from '../../types/transformer';
import { LABELS } from '../../lib/constants';

interface TankTabProps {
  data: CalculoTanque;
  input: TransformerInput;
}

export function TankTab({ data, input }: TankTabProps) {
  const tipoConservadorLabels = {
    membrana: 'Conservador com Membrana',
    bolsa: 'Conservador com Bolsa',
    colchao_gas: 'Colchao de Gas',
  };

  return (
    <div className="space-y-8">
      {/* Tipo de Oleo */}
      <div className="p-4 bg-amber-50 rounded-lg flex items-center justify-between">
        <div>
          <p className="text-sm text-amber-600 font-medium">Tipo de Oleo</p>
          <p className="text-lg font-bold text-amber-900">
            {LABELS.tipoOleo[input.tipoOleo]}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-amber-600 font-medium">Conservador</p>
          <p className="text-lg font-bold text-amber-900">
            {tipoConservadorLabels[data.tipoConservador]}
          </p>
        </div>
      </div>

      {/* Dimensoes do Tanque */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Dimensoes Internas do Tanque
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border border-gray-200 rounded-lg text-center">
            <p className="text-sm text-gray-500">Comprimento</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {data.comprimento_mm.toLocaleString('pt-BR')}
            </p>
            <p className="text-sm text-gray-500">mm</p>
          </div>
          <div className="p-4 border border-gray-200 rounded-lg text-center">
            <p className="text-sm text-gray-500">Largura</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {data.largura_mm.toLocaleString('pt-BR')}
            </p>
            <p className="text-sm text-gray-500">mm</p>
          </div>
          <div className="p-4 border border-gray-200 rounded-lg text-center">
            <p className="text-sm text-gray-500">Altura</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {data.altura_mm.toLocaleString('pt-BR')}
            </p>
            <p className="text-sm text-gray-500">mm</p>
          </div>
        </div>

        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Espessura da Chapa</p>
              <p className="font-bold text-gray-900">{data.espessuraChapa_mm} mm</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Area de Superficie</p>
              <p className="font-bold text-gray-900">
                {data.areaSuperificie_m2.toFixed(2)} m2
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Oleo */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Volume de Oleo
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-amber-50 rounded-lg">
            <p className="text-sm text-amber-600 font-medium">Volume Principal</p>
            <p className="text-4xl font-bold text-amber-900 mt-2">
              {data.volumeOleo_litros.toLocaleString('pt-BR')}
            </p>
            <p className="text-amber-600">litros</p>
            <p className="mt-2 text-sm text-amber-700">
              Peso: {data.pesoOleo_kg.toLocaleString('pt-BR')} kg
            </p>
          </div>
          <div className="p-6 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500 font-medium">Volume do Conservador</p>
            <p className="text-4xl font-bold text-gray-900 mt-2">
              {data.volumeConservador_litros.toLocaleString('pt-BR')}
            </p>
            <p className="text-gray-500">litros</p>
            <p className="mt-2 text-sm text-gray-600">
              (~12% do volume total)
            </p>
          </div>
        </div>
      </div>

      {/* Peso do Tanque */}
      <div className="p-6 bg-primary-50 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-primary-900">
              Peso do Tanque Vazio
            </h3>
            <p className="text-sm text-primary-600 mt-1">
              Inclui reforcos e acessorios basicos
            </p>
          </div>
          <div className="text-right">
            <p className="text-4xl font-bold text-primary-900">
              {data.pesoTanqueVazio_kg.toLocaleString('pt-BR')}
            </p>
            <p className="text-primary-600">kg</p>
          </div>
        </div>
      </div>

      {/* Resumo Visual */}
      <div className="p-4 bg-gray-100 rounded-lg">
        <h4 className="text-sm font-medium text-gray-700 mb-3">
          Proporcoes do Tanque
        </h4>
        <div className="relative h-32 bg-gray-200 rounded-lg overflow-hidden">
          {/* Simple visualization */}
          <div
            className="absolute bottom-0 left-1/4 right-1/4 bg-amber-400 opacity-70 rounded-t"
            style={{
              height: `${Math.min(80, (data.volumeOleo_litros / (data.comprimento_mm * data.largura_mm * data.altura_mm / 1000000)) * 100)}%`,
            }}
          />
          <div className="absolute inset-0 border-4 border-gray-400 rounded-lg" />
          <div className="absolute bottom-2 left-2 text-xs text-gray-600 bg-white px-2 py-1 rounded">
            Oleo Isolante
          </div>
        </div>
      </div>
    </div>
  );
}
