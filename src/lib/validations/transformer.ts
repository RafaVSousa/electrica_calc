// TransCalc - Zod Validation Schema
// Validacao de entrada para calculos de transformadores

import { z } from 'zod';

/**
 * Schema principal para entrada de dados do transformador
 */
export const transformerInputSchema = z.object({
  // Identificacao
  projectName: z.string()
    .min(3, 'Nome do projeto deve ter pelo menos 3 caracteres')
    .max(100, 'Nome do projeto muito longo'),

  clientName: z.string()
    .max(100, 'Nome do cliente muito longo')
    .optional()
    .default(''),

  // Dados Eletricos Principais
  potenciaMVA: z.number()
    .min(1, 'Potencia minima: 1 MVA')
    .max(50, 'Potencia maxima: 50 MVA'),

  tensaoAT_kV: z.number()
    .min(10.4, 'Tensao AT minima: 10.4 kV')
    .max(525, 'Tensao AT maxima: 525 kV'),

  tensaoBT_kV: z.number()
    .min(10.4, 'Tensao BT minima: 10.4 kV')
    .max(245, 'Tensao BT maxima: 245 kV'),

  impedanciaPercent: z.number()
    .min(2.5, 'Impedancia minima: 2.5%')
    .max(20, 'Impedancia maxima: 20%'),

  frequenciaHz: z.number().default(60),

  // Configuracao
  tipoRefrigeracao: z.enum(['ONAN', 'ONAF', 'OFAF']),

  classeIsolamento: z.enum(['A', 'E', 'B', 'F', 'H']),

  tipoConductor: z.enum(['cobre', 'aluminio']),

  tipoOleo: z.enum(['mineral', 'ester_natural', 'ester_sintetico']),

  // Nucleo
  tipoNucleo: z.enum(['envolvido', 'envolvente']),

  tipoAco: z.enum(['GO_M3', 'GO_M4', 'GO_M5', 'HiB']),

  inducaoMaxT: z.number()
    .min(1.5, 'Inducao minima: 1.5 T')
    .max(1.8, 'Inducao maxima: 1.8 T')
    .default(1.7),

}).refine(
  (data) => data.tensaoAT_kV > data.tensaoBT_kV,
  {
    message: 'Tensao AT deve ser maior que tensao BT',
    path: ['tensaoAT_kV'],
  }
);

/**
 * Tipo inferido do schema
 */
export type TransformerInputForm = z.infer<typeof transformerInputSchema>;

/**
 * Valores padrao para o formulario
 */
export const defaultFormValues: Partial<TransformerInputForm> = {
  projectName: '',
  clientName: '',
  frequenciaHz: 60,
  tipoRefrigeracao: 'ONAN',
  classeIsolamento: 'A',
  tipoConductor: 'cobre',
  tipoOleo: 'mineral',
  tipoNucleo: 'envolvido',
  tipoAco: 'GO_M4',
  inducaoMaxT: 1.7,
};

/**
 * Schema para projeto
 */
export const projectSchema = z.object({
  name: z.string().min(3, 'Nome do projeto e obrigatorio'),
  client_name: z.string().optional(),
  description: z.string().optional(),
  status: z.enum(['active', 'completed', 'archived']).default('active'),
});

export type ProjectForm = z.infer<typeof projectSchema>;

/**
 * Schema para notas do calculo
 */
export const calculationNotesSchema = z.object({
  notes: z.string().max(2000, 'Notas muito longas').optional(),
});

/**
 * Funcao para validar inputs parciais (rascunho)
 */
export function validatePartial(data: Partial<TransformerInputForm>): {
  valid: boolean;
  errors: string[];
} {
  try {
    transformerInputSchema.partial().parse(data);
    return { valid: true, errors: [] };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        valid: false,
        errors: error.issues.map((e: z.ZodIssue) => `${e.path.join('.')}: ${e.message}`),
      };
    }
    return { valid: false, errors: ['Erro de validacao desconhecido'] };
  }
}

/**
 * Funcao para validar inputs completos
 */
export function validateComplete(data: unknown): {
  valid: boolean;
  data?: TransformerInputForm;
  errors: string[];
} {
  try {
    const parsed = transformerInputSchema.parse(data);
    return { valid: true, data: parsed, errors: [] };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        valid: false,
        errors: error.issues.map((e: z.ZodIssue) => `${e.path.join('.')}: ${e.message}`),
      };
    }
    return { valid: false, errors: ['Erro de validacao desconhecido'] };
  }
}
