// TransCalc - Results View Component

import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/Tabs';
import { Card, CardHeader, CardBody } from '../ui/Card';
import { Button } from '../ui/Button';
import { FileDown, Edit, Plus, Save } from 'lucide-react';
import type { TransformerOutput } from '../../types/transformer';
import { ElectricalTab } from './ElectricalTab';
import { WindingsTab } from './WindingsTab';
import { CoreTab } from './CoreTab';
import { TankTab } from './TankTab';
import { BushingsTab } from './BushingsTab';
import { EstimatesTab } from './EstimatesTab';

interface ResultsViewProps {
  output: TransformerOutput;
  onExportPDF?: () => void;
  onEdit?: () => void;
  onNewCalculation?: () => void;
  onSave?: () => void;
  isExporting?: boolean;
  isSaving?: boolean;
}

export function ResultsView({
  output,
  onExportPDF,
  onEdit,
  onNewCalculation,
  onSave,
  isExporting = false,
  isSaving = false,
}: ResultsViewProps) {
  const { input } = output;

  return (
    <div className="space-y-6">
      {/* Header with summary */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-bold text-gray-900">
            Resultados do Calculo
          </h2>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="p-4 bg-primary-50 rounded-lg">
              <p className="text-sm text-primary-600 font-medium">Potencia</p>
              <p className="text-2xl font-bold text-primary-900">
                {input.potenciaMVA} MVA
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 font-medium">Tensao AT</p>
              <p className="text-2xl font-bold text-gray-900">
                {input.tensaoAT_kV} kV
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 font-medium">Tensao BT</p>
              <p className="text-2xl font-bold text-gray-900">
                {input.tensaoBT_kV} kV
              </p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-green-600 font-medium">Rendimento</p>
              <p className="text-2xl font-bold text-green-900">
                {output.eletrico.rendimento100.toFixed(2)}%
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-3">
            {onExportPDF && (
              <Button
                onClick={onExportPDF}
                isLoading={isExporting}
                leftIcon={<FileDown className="w-4 h-4" />}
              >
                Exportar PDF
              </Button>
            )}
            {onSave && (
              <Button
                variant="secondary"
                onClick={onSave}
                isLoading={isSaving}
                leftIcon={<Save className="w-4 h-4" />}
              >
                Salvar
              </Button>
            )}
            {onEdit && (
              <Button
                variant="secondary"
                onClick={onEdit}
                leftIcon={<Edit className="w-4 h-4" />}
              >
                Editar Inputs
              </Button>
            )}
            {onNewCalculation && (
              <Button
                variant="ghost"
                onClick={onNewCalculation}
                leftIcon={<Plus className="w-4 h-4" />}
              >
                Novo Calculo
              </Button>
            )}
          </div>
        </CardBody>
      </Card>

      {/* Tabs with results */}
      <Card>
        <CardBody className="p-0">
          <Tabs defaultValue="eletrico">
            <TabsList className="px-6">
              <TabsTrigger value="eletrico">Eletrico</TabsTrigger>
              <TabsTrigger value="bobinas">Bobinas</TabsTrigger>
              <TabsTrigger value="nucleo">Nucleo</TabsTrigger>
              <TabsTrigger value="tanque">Tanque</TabsTrigger>
              <TabsTrigger value="buchas">Buchas</TabsTrigger>
              <TabsTrigger value="estimativas">Estimativas</TabsTrigger>
            </TabsList>

            <div className="px-6 pb-6">
              <TabsContent value="eletrico">
                <ElectricalTab data={output.eletrico} input={input} />
              </TabsContent>

              <TabsContent value="bobinas">
                <WindingsTab data={output.bobinas} input={input} />
              </TabsContent>

              <TabsContent value="nucleo">
                <CoreTab data={output.nucleo} input={input} />
              </TabsContent>

              <TabsContent value="tanque">
                <TankTab data={output.tanque} input={input} />
              </TabsContent>

              <TabsContent value="buchas">
                <BushingsTab data={output.buchas} />
              </TabsContent>

              <TabsContent value="estimativas">
                <EstimatesTab data={output.estimativas} />
              </TabsContent>
            </div>
          </Tabs>
        </CardBody>
      </Card>
    </div>
  );
}
