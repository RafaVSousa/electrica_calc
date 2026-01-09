// TransCalc - Login Page

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Zap, Mail, Lock } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardBody } from '../components/ui/Card';

const loginSchema = z.object({
  email: z.string().email('Email invalido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
});

type LoginForm = z.infer<typeof loginSchema>;

interface LoginProps {
  onLogin?: (user: { email: string }) => void;
}

export function Login({ onLogin }: LoginProps) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate login (replace with actual Supabase auth)
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Call onLogin callback
      onLogin?.({ email: data.email });

      // Navigate to dashboard
      navigate('/');
    } catch (err) {
      setError('Email ou senha incorretos');
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
          TransCalc
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Sistema de Calculo de Transformadores
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
                label="Email"
                type="email"
                placeholder="seu@email.com"
                leftAddon={<Mail className="w-4 h-4" />}
                error={errors.email?.message}
                {...register('email')}
              />

              <Input
                label="Senha"
                type="password"
                placeholder="********"
                leftAddon={<Lock className="w-4 h-4" />}
                error={errors.password?.message}
                {...register('password')}
              />

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-600">Lembrar-me</span>
                </label>
                <Link
                  to="/forgot-password"
                  className="text-sm text-primary-600 hover:text-primary-500"
                >
                  Esqueceu a senha?
                </Link>
              </div>

              <Button type="submit" isLoading={isLoading} className="w-full">
                Entrar
              </Button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    Nao tem uma conta?
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <Link to="/register">
                  <Button variant="secondary" className="w-full">
                    Criar Conta
                  </Button>
                </Link>
              </div>
            </div>
          </CardBody>
        </Card>

        <p className="mt-8 text-center text-xs text-gray-500">
          Conforme ABNT NBR 5356 | TransCalc v1.0.0
        </p>
      </div>
    </div>
  );
}
