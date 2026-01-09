// TransCalc - History Page

import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Filter,
  Download,
  Trash2,
  Copy,
  Eye,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardBody } from '../components/ui/Card';

// Mock data
const mockCalculations = [
  {
    id: '1',
    name: 'Transformador 35 MVA',
    project: 'Subestacao Industrial Norte',
    client: 'Industria ABC',
    date: '09/01/2025',
    power: 35,
    voltageAT: 138,
    voltageBT: 36,
    status: 'calculated',
  },
  {
    id: '2',
    name: 'Transformador 25 MVA',
    project: 'Complexo Comercial Centro',
    client: 'Shopping XYZ',
    date: '08/01/2025',
    power: 25,
    voltageAT: 69,
    voltageBT: 13.8,
    status: 'approved',
  },
  {
    id: '3',
    name: 'Transformador 10 MVA',
    project: 'Fabrica ABC',
    client: 'Fabrica ABC',
    date: '07/01/2025',
    power: 10,
    voltageAT: 34.5,
    voltageBT: 13.8,
    status: 'draft',
  },
  {
    id: '4',
    name: 'Transformador 50 MVA',
    project: 'Usina Solar',
    client: 'Energia Verde SA',
    date: '05/01/2025',
    power: 50,
    voltageAT: 230,
    voltageBT: 34.5,
    status: 'calculated',
  },
];

type SortField = 'name' | 'date' | 'power' | 'client';
type SortDirection = 'asc' | 'desc';

export function History() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? (
      <ChevronUp className="w-4 h-4" />
    ) : (
      <ChevronDown className="w-4 h-4" />
    );
  };

  const filteredCalculations = mockCalculations.filter(
    (calc) =>
      calc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      calc.project.toLowerCase().includes(searchTerm.toLowerCase()) ||
      calc.client.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    const styles = {
      draft: 'bg-gray-100 text-gray-700',
      calculated: 'bg-blue-100 text-blue-700',
      approved: 'bg-green-100 text-green-700',
    };
    const labels = {
      draft: 'Rascunho',
      calculated: 'Calculado',
      approved: 'Aprovado',
    };
    return (
      <span
        className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status as keyof typeof styles]}`}
      >
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Historico</h1>
          <p className="text-gray-500 mt-1">
            Todos os calculos realizados
          </p>
        </div>
        <div className="flex gap-2">
          <Link to="/new">
            <Button>Novo Calculo</Button>
          </Link>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardBody className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Buscar por nome, projeto ou cliente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              leftAddon={<Search className="w-4 h-4 text-gray-400" />}
            />
          </div>
          <Button variant="secondary" leftIcon={<Filter className="w-4 h-4" />}>
            Filtros
          </Button>
        </CardBody>
      </Card>

      {/* Table */}
      <Card>
        <CardBody className="p-0 overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center gap-1">
                    Nome / Projeto
                    <SortIcon field="name" />
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('client')}
                >
                  <div className="flex items-center gap-1">
                    Cliente
                    <SortIcon field="client" />
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('power')}
                >
                  <div className="flex items-center gap-1">
                    Potencia
                    <SortIcon field="power" />
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tensoes
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('date')}
                >
                  <div className="flex items-center gap-1">
                    Data
                    <SortIcon field="date" />
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acoes
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredCalculations.map((calc) => (
                <tr key={calc.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900">{calc.name}</p>
                      <p className="text-sm text-gray-500">{calc.project}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-700">{calc.client}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {calc.power} MVA
                  </td>
                  <td className="px-6 py-4 text-gray-700">
                    {calc.voltageAT}/{calc.voltageBT} kV
                  </td>
                  <td className="px-6 py-4 text-gray-500">{calc.date}</td>
                  <td className="px-6 py-4">{getStatusBadge(calc.status)}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link to={`/calculation/${calc.id}`}>
                        <button
                          className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                          title="Ver"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </Link>
                      <button
                        className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                        title="Duplicar"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button
                        className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                        title="Exportar PDF"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                        title="Excluir"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredCalculations.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">
                Nenhum calculo encontrado com os filtros aplicados.
              </p>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
