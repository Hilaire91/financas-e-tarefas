const fs = require('fs');

const pt = {
  app_name: 'Finanças&Tarefas',
  tab_dashboard: 'Painel Geral',
  tab_expenses: 'Gastos & Banco',
  tab_tasks: 'Tarefas & Lembretes',
  tab_budgets: 'Orçamentos IA',
  tab_subscription: 'Assinatura PRO',
  login_title: 'Finanças&Tarefas',
  login_subtitle: 'Acesse sua conta para continuar',
  login_name_placeholder: 'Seu nome',
  login_email_placeholder: 'Seu email',
  login_password_placeholder: 'Sua senha',
  login_button: 'Entrar',
  login_scan_idle: 'Toque no sensor para autenticar',
  login_scanning: 'Verificando biometria...',
  login_scan_success: 'Autenticado com sucesso!',
  login_pin_hint: 'Dica: use 1234 para testar',
  login_pin_button: 'Confirmar PIN',
  login_secure_env: 'Ambiente local seguro simulado',
  logout: 'Sair',
  greeting: 'Olá',
  dashboard_overview: 'Visão Geral',
  total_balance: 'Saldo Total',
  total_expenses: 'Total Gasto',
  recent_transactions: 'Transações Recentes',
  expense_by_category: 'Gastos por Categoria',
  bank_sync_title: 'Sincronizador de Extrato',
  bank_sync_subtitle: 'Cole seu extrato e a IA categorizará e processará automaticamente.',
  bank_sync_placeholder: 'Ex: 01/07 MERCADO DA ESQUINA 45,90\\n02/07 UBER 15,20...',
  bank_sync_button: 'Processar com IA',
  bank_sync_processing: 'Processando IA...',
  bank_sync_pro_required: 'Recurso exclusivo do plano PRO',
  add_task_placeholder: 'Adicionar nova tarefa...',
  add_task_button: 'Adicionar',
  task_no_tasks: 'Nenhuma tarefa. Tudo certo!',
  add_reminder_placeholder: 'Novo lembrete de pagamento...',
  budget_title: 'Orçamentos e Limites',
  budget_limit: 'Limite:',
  budget_spent: 'Gasto:',
  budget_set_button: 'Definir Limite',
  ai_assistant_title: 'Painel Inteligente IA Finis',
  ai_insights: 'Insights da IA',
  ai_savings: 'Plano de Economia',
  value: 'Valor',
  date: 'Data',
  category: 'Categoria',
  description: 'Descrição',
  save: 'Salvar',
  cancel: 'Cancelar',
  delete: 'Excluir',
  edit: 'Editar',
  success: 'Sucesso',
  error: 'Erro',
  amount_placeholder: '0,00',
  currency_symbol: 'R$',
  task_checklist_placeholder: 'Item da lista...',
  task_checklist_add: 'Adicionar item à lista (ex: compras)'
};

function processFile(path) {
  let code = fs.readFileSync(path, 'utf-8');
  code = code.replace(/import \{ useTranslation \} from "react-i18next";\n?/g, '');
  code = code.replace(/const \{ t \} = useTranslation\(\);\n?/g, '');
  code = code.replace(/import i18n from ["']\.\.\/i18n["'];\n?/g, '');
  
  code = code.replace(/\{t\("([^"]+)"(?:, \{[^\}]+\})?\)\}/g, (match, p1) => {
    return pt[p1] || p1;
  });

  // handle literal strings like t("xyz")
  code = code.replace(/t\("([^"]+)"(?:, \{[^\}]+\})?\)/g, (match, p1) => {
    return `"${pt[p1] || p1}"`;
  });

  code = code.replace(/\{t\("([^"]+)", "([^"]+)"\)\}/g, (match, p1, p2) => {
    return pt[p1] ? pt[p1] : p2;
  });

  code = code.replace(/t\("([^"]+)", "([^"]+)"\)/g, (match, p1, p2) => {
    return `"${pt[p1] ? pt[p1] : p2}"`;
  });

  fs.writeFileSync(path, code);
}

const files = [
  'src/App.tsx',
  'src/components/AIAssistantPanel.tsx',
  'src/components/BankSyncPanel.tsx',
  'src/components/BudgetsPanel.tsx',
  'src/components/DashboardCharts.tsx',
  'src/components/LoginScreen.tsx',
  'src/components/SubscriptionPanel.tsx',
  'src/components/TaskChecklist.tsx'
];

files.forEach(processFile);

// Also remove i18n from main.tsx
let mainCode = fs.readFileSync('src/main.tsx', 'utf-8');
mainCode = mainCode.replace(/import '\.\/i18n';\n?/g, '');
fs.writeFileSync('src/main.tsx', mainCode);

