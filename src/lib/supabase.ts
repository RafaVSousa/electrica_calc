// TransCalc - Supabase Client
// Configuração do cliente Supabase para persistência de dados

import { createClient } from '@supabase/supabase-js';
import type { Profile, Project, Calculation, PDFReport } from '../types/transformer';

// Variáveis de ambiente para Supabase
// Em produção, essas devem ser configuradas via .env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Criar cliente Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ============================================
// Tipos do banco de dados
// ============================================

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Profile, 'id' | 'created_at'>>;
      };
      projects: {
        Row: Project;
        Insert: Omit<Project, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Project, 'id' | 'user_id' | 'created_at'>>;
      };
      calculations: {
        Row: Calculation;
        Insert: Omit<Calculation, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Calculation, 'id' | 'project_id' | 'created_at'>>;
      };
      pdf_reports: {
        Row: PDFReport;
        Insert: Omit<PDFReport, 'id' | 'generated_at'>;
        Update: Partial<Omit<PDFReport, 'id' | 'calculation_id'>>;
      };
    };
  };
}

// ============================================
// Funções de autenticação
// ============================================

export async function signUp(email: string, password: string, fullName: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });

  if (error) throw error;
  return data;
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function getSession() {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}

// ============================================
// Funções de perfil
// ============================================

export async function getProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching profile:', error);
    return null;
  }
  return data;
}

export async function updateProfile(userId: string, updates: Partial<Profile>) {
  const { data, error } = await supabase
    .from('profiles')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ============================================
// Funções de projetos
// ============================================

export async function getProjects(userId: string): Promise<Project[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function getProject(projectId: string): Promise<Project | null> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', projectId)
    .single();

  if (error) throw error;
  return data;
}

export async function createProject(project: Omit<Project, 'id' | 'created_at' | 'updated_at'>): Promise<Project> {
  const { data, error } = await supabase
    .from('projects')
    .insert(project)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateProject(projectId: string, updates: Partial<Project>) {
  const { data, error } = await supabase
    .from('projects')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', projectId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteProject(projectId: string) {
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', projectId);

  if (error) throw error;
}

// ============================================
// Funções de cálculos
// ============================================

export async function getCalculations(projectId: string): Promise<Calculation[]> {
  const { data, error } = await supabase
    .from('calculations')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function getAllCalculations(userId: string): Promise<(Calculation & { project: Project })[]> {
  const { data, error } = await supabase
    .from('calculations')
    .select(`
      *,
      project:projects!inner(*)
    `)
    .eq('projects.user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function getCalculation(calculationId: string): Promise<Calculation | null> {
  const { data, error } = await supabase
    .from('calculations')
    .select('*')
    .eq('id', calculationId)
    .single();

  if (error) throw error;
  return data;
}

export async function createCalculation(calculation: Omit<Calculation, 'id' | 'created_at' | 'updated_at'>): Promise<Calculation> {
  const { data, error } = await supabase
    .from('calculations')
    .insert(calculation)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateCalculation(calculationId: string, updates: Partial<Calculation>) {
  const { data, error } = await supabase
    .from('calculations')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', calculationId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteCalculation(calculationId: string) {
  const { error } = await supabase
    .from('calculations')
    .delete()
    .eq('id', calculationId);

  if (error) throw error;
}

// ============================================
// Funções de relatórios PDF
// ============================================

export async function savePDFReport(report: Omit<PDFReport, 'id' | 'generated_at'>): Promise<PDFReport> {
  const { data, error } = await supabase
    .from('pdf_reports')
    .insert(report)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getPDFReports(calculationId: string): Promise<PDFReport[]> {
  const { data, error } = await supabase
    .from('pdf_reports')
    .select('*')
    .eq('calculation_id', calculationId)
    .order('generated_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

// ============================================
// Estatísticas
// ============================================

export async function getStatistics(userId: string) {
  // Total de projetos
  const { count: projectCount } = await supabase
    .from('projects')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId);

  // Cálculos do mês atual
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const { count: monthCalculations } = await supabase
    .from('calculations')
    .select('*, projects!inner(*)', { count: 'exact', head: true })
    .eq('projects.user_id', userId)
    .gte('created_at', startOfMonth.toISOString());

  return {
    totalProjects: projectCount || 0,
    calculationsThisMonth: monthCalculations || 0,
  };
}

// ============================================
// Verificação de conexão
// ============================================

export function isSupabaseConfigured(): boolean {
  return Boolean(supabaseUrl && supabaseAnonKey);
}
