// TransCalc - New Calculation Page

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardBody } from '../components/ui/Card';
import { TransformerForm } from '../components/forms/TransformerForm';
import { ResultsView } from '../components/results/ResultsView';
import { calcularTransformador } from '../lib/calculations';
import type { TransformerInputForm } from '../lib/validations/transformer';
import type { TransformerOutput, TransformerInput } from '../types/transformer';

export function NewCalculation() {
  const navigate = useNavigate();
  const [isCalculating, setIsCalculating] = useState(false);
  const [result, setResult] = useState<TransformerOutput | null>(null);
  const [showForm, setShowForm] = useState(true);

  const handleCalculate = async (formData: TransformerInputForm) => {
    setIsCalculating(true);

    try {
      // Simulate a small delay for UX
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Convert form data to TransformerInput
      const input: TransformerInput = {
        ...formData,
      };

      // Execute calculations
      const output = calcularTransformador(input);
      setResult(output);
      setShowForm(false);
    } catch (error) {
      console.error('Calculation error:', error);
      alert('Erro ao calcular. Por favor, verifique os dados e tente novamente.');
    } finally {
      setIsCalculating(false);
    }
  };

  const handleEdit = () => {
    setShowForm(true);
  };

  const handleNewCalculation = () => {
    setResult(null);
    setShowForm(true);
  };

  const handleExportPDF = () => {
    // PDF export will be implemented in the PDF component
    alert('Gerando PDF... (funcionalidade em desenvolvimento)');
  };

  const handleSave = () => {
    // Save to Supabase would go here
    alert('Calculo salvo com sucesso! (funcionalidade em desenvolvimento)');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
        >
          Voltar
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {showForm ? 'Novo Calculo' : 'Resultados'}
          </h1>
          <p className="text-gray-500">
            {showForm
              ? 'Preencha os dados do transformador para calcular'
              : 'Analise os resultados do calculo'}
          </p>
        </div>
      </div>

      {/* Form or Results */}
      {showForm ? (
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-900">
              Dados do Transformador
            </h2>
          </CardHeader>
          <CardBody>
            <TransformerForm
              onCalculate={handleCalculate}
              isCalculating={isCalculating}
              initialData={result?.input as any}
            />
          </CardBody>
        </Card>
      ) : result ? (
        <ResultsView
          output={result}
          onExportPDF={handleExportPDF}
          onEdit={handleEdit}
          onNewCalculation={handleNewCalculation}
          onSave={handleSave}
        />
      ) : null}
    </div>
  );
}
