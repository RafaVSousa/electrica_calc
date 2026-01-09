// TransCalc - Settings Page

import { useState } from 'react';
import { User, Mail, Building, Phone, Save } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardHeader, CardBody, CardFooter } from '../components/ui/Card';

export function Settings() {
  const [isSaving, setIsSaving] = useState(false);
  const [profile, setProfile] = useState({
    fullName: 'Usuario Exemplo',
    email: 'usuario@exemplo.com',
    company: 'Empresa ABC',
    phone: '(11) 99999-9999',
  });

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Simulate save
      await new Promise((resolve) => setTimeout(resolve, 1000));
      alert('Configuracoes salvas com sucesso!');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Configuracoes</h1>
        <p className="text-gray-500 mt-1">Gerencie seu perfil e preferencias</p>
      </div>

      {/* Profile Settings */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-gray-900">Perfil</h2>
        </CardHeader>
        <CardBody className="space-y-4">
          <Input
            label="Nome Completo"
            value={profile.fullName}
            onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
            leftAddon={<User className="w-4 h-4" />}
          />

          <Input
            label="Email"
            type="email"
            value={profile.email}
            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
            leftAddon={<Mail className="w-4 h-4" />}
            disabled
            hint="Email nao pode ser alterado"
          />

          <Input
            label="Empresa"
            value={profile.company}
            onChange={(e) => setProfile({ ...profile, company: e.target.value })}
            leftAddon={<Building className="w-4 h-4" />}
          />

          <Input
            label="Telefone"
            value={profile.phone}
            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
            leftAddon={<Phone className="w-4 h-4" />}
          />
        </CardBody>
        <CardFooter className="flex justify-end">
          <Button
            onClick={handleSave}
            isLoading={isSaving}
            leftIcon={<Save className="w-4 h-4" />}
          >
            Salvar Alteracoes
          </Button>
        </CardFooter>
      </Card>

      {/* Preferences */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-gray-900">Preferencias</h2>
        </CardHeader>
        <CardBody>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">
                  Notificacoes por Email
                </p>
                <p className="text-sm text-gray-500">
                  Receber atualizacoes sobre novos recursos
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">
                  Salvar Automaticamente
                </p>
                <p className="text-sm text-gray-500">
                  Salvar calculos automaticamente como rascunho
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Danger Zone */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-red-600">Zona de Perigo</h2>
        </CardHeader>
        <CardBody>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Excluir Conta</p>
              <p className="text-sm text-gray-500">
                Excluir permanentemente sua conta e todos os dados
              </p>
            </div>
            <Button variant="danger" size="sm">
              Excluir Conta
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
