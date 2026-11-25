import React, { useState } from 'react';
import {
  Shield,
  Settings,
  UserCheck,
  Plus,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Mail,
  Building2,
  DollarSign,
  Truck,
  X
} from '../ui/Icon';
import { useAdmin } from '../../context/AdminContext';
import { AdminRole, AdminUser } from '../../types/admin';

interface AdminSettingsAndUsersProps {
  view: 'usuarios' | 'configuracoes';
}

export const AdminSettingsAndUsers: React.FC<AdminSettingsAndUsersProps> = ({ view }) => {
  const {
    adminUsers,
    addAdminUser,
    toggleAdminUserStatus,
    currentAdmin,
    settings,
    updateSettings,
  } = useAdmin();

  // Modal Novo Administrador
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<AdminRole>('Operador de Logística');

  // Formulário de Configurações
  const [storeName, setStoreName] = useState(settings.storeName);
  const [cnpj, setCnpj] = useState(settings.cnpj);
  const [corporateEmail, setCorporateEmail] = useState(settings.corporateEmail);
  const [supportPhone, setSupportPhone] = useState(settings.supportPhone);
  const [minOrderB2B, setMinOrderB2B] = useState(settings.minOrderB2B);
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(settings.freeShippingThreshold);
  const [notifyLowStock, setNotifyLowStock] = useState(settings.notifyLowStock);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleAddAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    addAdminUser({
      name,
      email,
      role,
      status: 'Ativo',
      lastLogin: 'Recém cadastrado',
    });
    setName('');
    setEmail('');
    setIsModalOpen(false);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      storeName,
      cnpj,
      corporateEmail,
      supportPhone,
      minOrderB2B: Number(minOrderB2B),
      freeShippingThreshold: Number(freeShippingThreshold),
      notifyLowStock,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  if (view === 'usuarios') {
    return (
      <div className="space-y-6 pb-12 font-sans">
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#041B38] bg-slate-100 px-2.5 py-1 rounded-md">
              Controle de Acesso & Segurança
            </span>
            <h2 className="font-display font-black text-xl text-[#041B38] mt-2">
              Usuários e Administradores da Lothus
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Gerencie a equipe autorizada a acessar o painel de vendas e controle operacional
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#FB8C00] hover:bg-amber-600 text-white text-xs font-bold transition-colors shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Adicionar Administrador</span>
          </button>
        </div>

        <div className="bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden shadow-2xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3.5 px-5 font-extrabold">Nome do Administrador</th>
                <th className="py-3.5 px-4 font-extrabold">E-mail Corporativo</th>
                <th className="py-3.5 px-4 font-extrabold">Nível de Acesso (Cargo)</th>
                <th className="py-3.5 px-4 font-extrabold">Último Login</th>
                <th className="py-3.5 px-4 font-extrabold">Status</th>
                <th className="py-3.5 px-5 font-extrabold text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {adminUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/70">
                  <td className="py-4 px-5 font-bold text-[#041B38] flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-[#0F668E] text-white flex items-center justify-center font-bold text-xs shrink-0">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span>{user.name}</span>
                  </td>

                  <td className="py-4 px-4 text-slate-600">{user.email}</td>

                  <td className="py-4 px-4 whitespace-nowrap">
                    <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-md bg-slate-100 text-[#041B38] border border-slate-200">
                      {user.role}
                    </span>
                  </td>

                  <td className="py-4 px-4 text-slate-400 whitespace-nowrap text-[11px]">
                    {user.lastLogin || 'Nunca'}
                  </td>

                  <td className="py-4 px-4 whitespace-nowrap">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        user.status === 'Ativo'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>

                  <td className="py-4 px-5 text-right whitespace-nowrap">
                    {user.id !== currentAdmin?.id && (
                      <button
                        onClick={() => toggleAdminUserStatus(user.id)}
                        className={`text-xs font-bold hover:underline cursor-pointer ${
                          user.status === 'Ativo' ? 'text-rose-600' : 'text-emerald-600'
                        }`}
                      >
                        {user.status === 'Ativo' ? 'Desativar' : 'Ativar'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal Novo Admin */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-sans">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                <h3 className="font-display font-black text-base text-[#041B38]">
                  Cadastrar Administrador
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddAdmin} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nome Completo *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: João Silva"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-[#0F668E]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">E-mail Corporativo *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="joao@lothusdescartaveis.com.br"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-[#0F668E]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nível de Acesso *</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as AdminRole)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-[#0F668E] cursor-pointer"
                  >
                    <option value="Operador de Logística">Operador de Logística</option>
                    <option value="Gerente Comercial">Gerente Comercial</option>
                    <option value="Super Admin">Super Admin</option>
                  </select>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#0F668E] hover:bg-[#0B4F6E] text-white font-bold"
                  >
                    Confirmar Cadastro
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12 font-sans">
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-2xs">
        <h2 className="font-display font-black text-xl text-[#041B38]">
          Parâmetros Comerciais & Configurações da Loja
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Ajuste as regras de faturamento B2B, alertas operacionais e dados corporativos
        </p>
      </div>

      <form onSubmit={handleSaveSettings} className="bg-white border border-[#E2E8F0] rounded-2xl p-6 sm:p-8 shadow-2xs space-y-6 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Nome da Empresa / E-commerce</label>
            <input
              type="text"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl outline-none focus:border-[#0F668E]"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">CNPJ Oficial</label>
            <input
              type="text"
              value={cnpj}
              onChange={(e) => setCnpj(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl outline-none focus:border-[#0F668E]"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">E-mail Comercial & Faturamento</label>
            <input
              type="email"
              value={corporateEmail}
              onChange={(e) => setCorporateEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl outline-none focus:border-[#0F668E]"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Telefone / Central de Atendimento</label>
            <input
              type="text"
              value={supportPhone}
              onChange={(e) => setSupportPhone(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl outline-none focus:border-[#0F668E]"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Pedido Mínimo Faturado no Boleto (R$)</label>
            <input
              type="number"
              value={minOrderB2B}
              onChange={(e) => setMinOrderB2B(parseFloat(e.target.value) || 0)}
              className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl outline-none focus:border-[#0F668E]"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Frete Grátis Grande SP acima de (R$)</label>
            <input
              type="number"
              value={freeShippingThreshold}
              onChange={(e) => setFreeShippingThreshold(parseFloat(e.target.value) || 0)}
              className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl outline-none focus:border-[#0F668E]"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700">
            <input
              type="checkbox"
              checked={notifyLowStock}
              onChange={(e) => setNotifyLowStock(e.target.checked)}
              className="rounded text-[#0F668E] w-4 h-4"
            />
            <span>Ativar notificações de estoque crítico no painel administrativo</span>
          </label>

          <div className="flex items-center gap-3">
            {savedSuccess && (
              <span className="text-emerald-600 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                Configurações salvas!
              </span>
            )}
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#0F668E] hover:bg-[#0B4F6E] text-white font-bold shadow-md cursor-pointer"
            >
              Salvar Parâmetros
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
