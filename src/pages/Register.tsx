// TransCalc - Register Page

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Zap, User, Mail, Lock, Building } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardBody } from '../components/ui/Card';

const registerSchema = z
  .object({
    fullName: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
    email: z.string().email('Email invalido'),
    company: z.string().optional(),
    password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Senhas nao conferem',
    path: ['confirmPassword'],
  });

type RegisterForm = z.infer<typeof registerSchema>;

interface RegisterProps {
  onRegister?: (user: { email: string; name: string }) => void;
}

export function Register({ onRegister }: RegisterProps) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate registration (replace with actual Supabase auth)
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Call onRegister callback
      onRegister?.({ email: data.email, name: data.fullName });

      // Navigate to dashboard
      navigate('/');
    } catch (err) {
      setError('Erro ao criar conta. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Logo */}
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-primary-600 rounded-xl flex items-center justify-center">
            <Zap className="w-10 h-10 text-white" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
          Criar Conta
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Comece a usar o TransCalc gratuitamente
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card>
          <CardBody className="py-8 px-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                  {error}
                </div>
              )}

              <Input
                label="Nome Completo *"
                placeholder="Seu nome"
                leftAddon={<User className="w-4 h-4" />}
                error={errors.fullName?.message}
                {...register('fullName')}
              />

              <Input
                label="Email *"
                type="email"
                placeholder="seu@email.com"
                leftAddon={<Mail className="w-4 h-4" />}
                error={errors.email?.message}
                {...register('email')}
              />

              <Input
                label="Empresa"
                placeholder="Nome da empresa (opcional)"
                leftAddon={<Building className="w-4 h-4" />}
                error={errors.company?.message}
                {...register('company')}
              />

              <Input
                label="Senha *"
                type="password"
                placeholder="Minimo 6 caracteres"
                leftAddon={<Lock className="w-4 h-4" />}
                error={errors.password?.message}
                {...register('password')}
              />

              <Input
                label="Confirmar Senha *"
                type="password"
                placeholder="Repita a senha"
                leftAddon={<Lock className="w-4 h-4" />}
                error={errors.confirmPassword?.message}
                {...register('confirmPassword')}
              />

              <div className="flex items-start">
                <input
                  type="checkbox"
                  required
                  className="h-4 w-4 mt-1 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-600">
                  Concordo com os{' '}
                  <a href="#" className="text-primary-600 hover:text-primary-500">
                    Termos de Uso
                  </a>{' '}
                  e{' '}
                  <a href="#" className="text-primary-600 hover:text-primary-500">
                    Politica de Privacidade
                  </a>
                </span>
              </div>

              <Button type="submit" isLoading={isLoading} className="w-full">
                Criar Conta
              </Button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    Ja tem uma conta?
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <Link to="/login">
                  <Button variant="secondary" className="w-full">
                    Entrar
                  </Button>
                </Link>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
