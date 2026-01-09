// TransCalc - Dashboard Page

import { Link } from 'react-router-dom';
import {
  Calculator,
  FolderOpen,
  Clock,
  Plus,
  ChevronRight,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardBody } from '../components/ui/Card';

// Mock data for demonstration (would come from Supabase in production)
const mockStats = {
  totalProjects: 12,
  calculationsThisMonth: 8,
  lastCalculation: '2 horas atras',
};

const mockRecentCalculations = [
  {
    id: '1',
    name: 'Transformador 35 MVA',
    project: 'Subestacao Industrial Norte',
    date: '09/01/2025',
    power: '35 MVA',
    voltage: '138/36 kV',
  },
  {
    id: '2',
    name: 'Transformador 25 MVA',
    project: 'Complexo Comercial Centro',
    date: '08/01/2025',
    power: '25 MVA',
    voltage: '69/13.8 kV',
  },
  {
    id: '3',
    name: 'Transformador 10 MVA',
    project: 'Fabrica ABC',
    date: '07/01/2025',
    power: '10 MVA',
    voltage: '34.5/13.8 kV',
  },
];

export function Dashboard() {
  return (
    <div className="space-y-8">
      {/* Welcome and Quick Action */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">
            Sistema de Calculo de Transformadores de Potencia
          </p>
        </div>
        <Link to="/new">
          <Button size="lg" leftIcon={<Plus className="w-5 h-5" />}>
            Novo Calculo
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardBody className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
              <FolderOpen className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total de Projetos</p>
              <p className="text-2xl font-bold text-gray-900">
                {mockStats.totalProjects}
              </p>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Calculator className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Calculos este Mes</p>
              <p className="text-2xl font-bold text-gray-900">
                {mockStats.calculationsThisMonth}
              </p>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Ultimo Calculo</p>
              <p className="text-2xl font-bold text-gray-900">
                {mockStats.lastCalculation}
              </p>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Recent Calculations */}
      <Card>
        <CardHeader
          action={
            <Link
              to="/history"
              className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
            >
              Ver todos
              <ChevronRight className="w-4 h-4" />
            </Link>
          }
        >
          <h2 className="text-lg font-semibold text-gray-900">
            Calculos Recentes
          </h2>
        </CardHeader>
        <CardBody className="p-0">
          <div className="divide-y divide-gray-200">
            {mockRecentCalculations.map((calc) => (
              <Link
                key={calc.id}
                to={`/calculation/${calc.id}`}
                className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{calc.name}</h3>
                  <p className="text-sm text-gray-500">{calc.project}</p>
                </div>
                <div className="text-right hidden sm:block">
                  <p className="font-medium text-gray-900">{calc.power}</p>
                  <p className="text-sm text-gray-500">{calc.voltage}</p>
                </div>
                <div className="text-right ml-4">
                  <p className="text-sm text-gray-400">{calc.date}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 ml-4" />
              </Link>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* Quick Guide */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-gray-900">Guia Rapido</h2>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex gap-4">
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-primary-600 font-bold">1</span>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Insira os Dados</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Preencha potencia, tensoes, impedancia e configuracao do
                  transformador.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-primary-600 font-bold">2</span>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Calcule</h3>
                <p className="text-sm text-gray-500 mt-1">
                  O sistema calcula correntes, perdas, rendimento, dimensoes e
                  custos.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-primary-600 font-bold">3</span>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Exporte</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Gere relatorio PDF tecnico conforme norma ABNT NBR 5356.
                </p>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
