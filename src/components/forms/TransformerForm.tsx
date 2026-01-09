// TransCalc - Transformer Form Component

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Calculator, Save, RotateCcw, ChevronDown, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Card, CardBody } from '../ui/Card';
import {
  transformerInputSchema,
  defaultFormValues,
  type TransformerInputForm,
} from '../../lib/validations/transformer';
import { LABELS, TOOLTIPS } from '../../lib/constants';

interface TransformerFormProps {
  onCalculate: (data: TransformerInputForm) => void;
  onSaveDraft?: (data: Partial<TransformerInputForm>) => void;
  initialData?: Partial<TransformerInputForm>;
  isCalculating?: boolean;
  isSaving?: boolean;
}

interface CollapsibleSectionProps {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

function CollapsibleSection({ title, defaultOpen = true, children }: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <button
        type="button"
        className="w-full px-4 py-3 bg-gray-50 flex items-center justify-between text-left font-medium text-gray-700 hover:bg-gray-100 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{title}</span>
        {isOpen ? (
          <ChevronDown className="w-5 h-5 text-gray-400" />
        ) : (
          <ChevronRight className="w-5 h-5 text-gray-400" />
        )}
      </button>
      {isOpen && <div className="p-4 bg-white">{children}</div>}
    </div>
  );
}

export function TransformerForm({
  onCalculate,
  onSaveDraft,
  initialData,
  isCalculating = false,
  isSaving = false,
}: TransformerFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(transformerInputSchema) as any,
    defaultValues: { ...defaultFormValues, ...initialData } as any,
  });

  const handleReset = () => {
    reset(defaultFormValues);
  };

  const handleSaveDraft = () => {
    const values = getValues();
    onSaveDraft?.(values);
  };

  return (
    <form onSubmit={handleSubmit(onCalculate)} className="space-y-6">
      {/* Identificacao */}
      <CollapsibleSection title="Identificacao do Projeto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Nome do Projeto *"
            placeholder="Ex: Subestacao Industrial Norte"
            error={errors.projectName?.message as string | undefined}
            {...register('projectName')}
          />
          <Input
            label="Nome do Cliente"
            placeholder="Ex: Industria ABC Ltda"
            error={errors.clientName?.message as string | undefined}
            {...register('clientName')}
          />
        </div>
      </CollapsibleSection>

      {/* Dados Eletricos */}
      <CollapsibleSection title="Dados Eletricos Principais">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Input
            label="Potencia *"
            type="number"
            step="0.1"
            min="1"
            max="50"
            placeholder="Ex: 35"
            rightAddon="MVA"
            tooltip={TOOLTIPS.potenciaMVA}
            error={errors.potenciaMVA?.message as string | undefined}
            {...register('potenciaMVA', { valueAsNumber: true })}
          />
          <Input
            label="Tensao AT *"
            type="number"
            step="0.1"
            min="10.4"
            placeholder="Ex: 138"
            rightAddon="kV"
            tooltip={TOOLTIPS.tensaoAT_kV}
            error={errors.tensaoAT_kV?.message as string | undefined}
            {...register('tensaoAT_kV', { valueAsNumber: true })}
          />
          <Input
            label="Tensao BT *"
            type="number"
            step="0.1"
            min="10.4"
            placeholder="Ex: 36"
            rightAddon="kV"
            tooltip={TOOLTIPS.tensaoBT_kV}
            error={errors.tensaoBT_kV?.message as string | undefined}
            {...register('tensaoBT_kV', { valueAsNumber: true })}
          />
          <Input
            label="Impedancia *"
            type="number"
            step="0.1"
            min="2.5"
            max="20"
            placeholder="Ex: 12.5"
            rightAddon="%"
            tooltip={TOOLTIPS.impedanciaPercent}
            error={errors.impedanciaPercent?.message as string | undefined}
            {...register('impedanciaPercent', { valueAsNumber: true })}
          />
          <Input
            label="Frequencia"
            type="number"
            min="50"
            max="60"
            step="10"
            rightAddon="Hz"
            tooltip={TOOLTIPS.frequenciaHz}
            error={errors.frequenciaHz?.message as string | undefined}
            {...register('frequenciaHz', { valueAsNumber: true })}
          />
        </div>
      </CollapsibleSection>

      {/* Configuracao */}
      <CollapsibleSection title="Configuracao">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Tipo de Refrigeracao"
            tooltip={TOOLTIPS.tipoRefrigeracao}
            error={errors.tipoRefrigeracao?.message as string | undefined}
            options={Object.entries(LABELS.tipoRefrigeracao).map(([value, label]) => ({
              value,
              label,
            }))}
            {...register('tipoRefrigeracao')}
          />
          <Select
            label="Classe de Isolamento"
            tooltip={TOOLTIPS.classeIsolamento}
            error={errors.classeIsolamento?.message as string | undefined}
            options={Object.entries(LABELS.classeIsolamento).map(([value, label]) => ({
              value,
              label,
            }))}
            {...register('classeIsolamento')}
          />
          <Select
            label="Tipo de Condutor"
            tooltip={TOOLTIPS.tipoConductor}
            error={errors.tipoConductor?.message as string | undefined}
            options={Object.entries(LABELS.tipoConductor).map(([value, label]) => ({
              value,
              label,
            }))}
            {...register('tipoConductor')}
          />
          <Select
            label="Tipo de Oleo"
            tooltip={TOOLTIPS.tipoOleo}
            error={errors.tipoOleo?.message as string | undefined}
            options={Object.entries(LABELS.tipoOleo).map(([value, label]) => ({
              value,
              label,
            }))}
            {...register('tipoOleo')}
          />
        </div>
      </CollapsibleSection>

      {/* Nucleo */}
      <CollapsibleSection title="Nucleo Magnetico">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Select
            label="Tipo de Nucleo"
            tooltip={TOOLTIPS.tipoNucleo}
            error={errors.tipoNucleo?.message as string | undefined}
            options={Object.entries(LABELS.tipoNucleo).map(([value, label]) => ({
              value,
              label,
            }))}
            {...register('tipoNucleo')}
          />
          <Select
            label="Tipo de Aco"
            tooltip={TOOLTIPS.tipoAco}
            error={errors.tipoAco?.message as string | undefined}
            options={Object.entries(LABELS.tipoAco).map(([value, label]) => ({
              value,
              label,
            }))}
            {...register('tipoAco')}
          />
          <Input
            label="Inducao Maxima"
            type="number"
            step="0.01"
            min="1.5"
            max="1.8"
            rightAddon="T"
            tooltip={TOOLTIPS.inducaoMaxT}
            error={errors.inducaoMaxT?.message as string | undefined}
            {...register('inducaoMaxT', { valueAsNumber: true })}
          />
        </div>
      </CollapsibleSection>

      {/* Actions */}
      <Card>
        <CardBody className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={handleReset}
              leftIcon={<RotateCcw className="w-4 h-4" />}
            >
              Limpar
            </Button>
            {onSaveDraft && (
              <Button
                type="button"
                variant="secondary"
                onClick={handleSaveDraft}
                isLoading={isSaving}
                leftIcon={<Save className="w-4 h-4" />}
              >
                Salvar Rascunho
              </Button>
            )}
          </div>
          <Button
            type="submit"
            isLoading={isCalculating}
            leftIcon={<Calculator className="w-4 h-4" />}
            size="lg"
          >
            Calcular Transformador
          </Button>
        </CardBody>
      </Card>
    </form>
  );
}
