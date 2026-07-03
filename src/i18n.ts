import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  pt: {
    translation: {
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
      bank_sync_placeholder: 'Ex: 01/07 MERCADO DA ESQUINA 45,90\n02/07 UBER 15,20...',
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
      notif_budget_exceeded: 'Estouro de Orçamento! Gastos em {{category}} superaram o limite de {{limit}}',
      notif_expense_added: 'Despesa de {{amount}} em {{category}} registrada!',
      notif_budget_alert: 'Alerta de Gasto: Orçamento de {{category}} estourado! Limite: {{limit}}',
      notif_budget_set: 'Orçamento de {{category}} redefinido para {{limit}}.',
      task_checklist_placeholder: 'Item da lista...',
      task_checklist_add: 'Adicionar item à lista (ex: compras)'
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'pt',
    fallbackLng: 'pt',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
