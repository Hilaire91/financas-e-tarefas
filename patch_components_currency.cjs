const fs = require('fs');

function replaceInFile(path, replacer) {
  let code = fs.readFileSync(path, 'utf-8');
  const newCode = replacer(code);
  if (code !== newCode) {
    fs.writeFileSync(path, newCode);
  }
}

// AIAssistantPanel
replaceInFile('src/components/AIAssistantPanel.tsx', (code) => {
  if (!code.includes('import { formatCurrency }')) {
    code = code.replace('import { motion } from "motion/react";', 'import { motion } from "motion/react";\nimport { formatCurrency } from "../utils/format";\nimport { useTranslation } from "react-i18next";');
  }
  
  if (!code.includes('const { t } = useTranslation()')) {
    code = code.replace(/export default function AIAssistantPanel.*\{/, (match) => match + '\n  const { t } = useTranslation();');
  }

  code = code.replace(/Economia est.: R\$ \{s\.estimatedSavings\.toFixed\(2\)\}/g, 'Economia est.: {formatCurrency(s.estimatedSavings)}');
  code = code.replace(/Econ. R\$ \{suggestion\.estimatedSavings\.toFixed\(2\)\}/g, 'Econ. {formatCurrency(suggestion.estimatedSavings)}');
  code = code.replace(/>Painel Inteligente IA Finis</, '>{t("ai_assistant_title")}<');
  code = code.replace(/>Insights da IA</, '>{t("ai_insights")}<');
  code = code.replace(/>Plano de Economia</, '>{t("ai_savings")}<');

  return code;
});

// BankSyncPanel
replaceInFile('src/components/BankSyncPanel.tsx', (code) => {
  if (!code.includes('import { formatCurrency }')) {
    code = code.replace('import { motion } from "motion/react";', 'import { motion } from "motion/react";\nimport { formatCurrency } from "../utils/format";\nimport { useTranslation } from "react-i18next";');
  }

  if (!code.includes('const { t } = useTranslation()')) {
    code = code.replace(/export default function BankSyncPanel.*\{/, (match) => match + '\n  const { t } = useTranslation();');
  }

  code = code.replace(/R\$ \{item\.amount\.toFixed\(2\)\}/g, '{formatCurrency(item.amount)}');
  code = code.replace(/>Sincronizador de Extrato</, '>{t("bank_sync_title")}<');
  code = code.replace(/>Cole seu extrato e a IA categorizará e processará automaticamente\.</, '>{t("bank_sync_subtitle")}<');
  code = code.replace(/placeholder="Ex: 01\/07 COMPRA NO MERCADO DA ESQUINA R\$ 45,90&#10;02\/07 UBER TRIP R\$ 15,20\.\.\."/, 'placeholder={t("bank_sync_placeholder")}');
  code = code.replace(/>Processar com IA</, '>{t("bank_sync_button")}<');
  code = code.replace(/>Processando IA\.\.\.</, '>{t("bank_sync_processing")}<');

  return code;
});

// BudgetsPanel
replaceInFile('src/components/BudgetsPanel.tsx', (code) => {
  if (!code.includes('import { formatCurrency }')) {
    code = code.replace('import { motion, AnimatePresence } from "motion/react";', 'import { motion, AnimatePresence } from "motion/react";\nimport { formatCurrency } from "../utils/format";\nimport { useTranslation } from "react-i18next";');
  }

  if (!code.includes('const { t } = useTranslation()')) {
    code = code.replace(/export default function BudgetsPanel.*\{/, (match) => match + '\n  const { t } = useTranslation();');
  }

  code = code.replace(/R\$ \$\{limitNum\.toFixed\(2\)\}/g, '${formatCurrency(limitNum)}');
  code = code.replace(/R\$ \$\{spent\.toFixed\(2\)\}/g, '${formatCurrency(spent)}');
  code = code.replace(/>Orçamentos e Limites</, '>{t("budget_title")}<');
  code = code.replace(/>Gasto: R\$ \{spent\.toFixed\(2\)\.replace\("\.", ","\)\} de R\$ \{budget\.limit\.toFixed\(2\)\.replace\("\.", ","\)\}</, '>{t("budget_spent")} {formatCurrency(spent)} / {formatCurrency(budget.limit)}<');
  code = code.replace(/placeholder="R\$"/, 'placeholder={t("currency_symbol")}');
  code = code.replace(/>Definir Limite</, '>{t("budget_set_button")}<');

  // notifications in BudgetsPanel
  code = code.replace(
    /\`Orçamento de \$\{category\} redefinido para R\$ \$\{limitNum\.toFixed\(2\)\}\.\`/,
    't("notif_budget_set", { category, limit: formatCurrency(limitNum) })'
  );

  code = code.replace(
    /\`Alerta: Gastos com \$\{category\} \(R\$ \$\{spent\.toFixed\(2\)\}\) ultrapassaram o novo limite de R\$ \$\{limitNum\.toFixed\(2\)\}!\`/,
    't("notif_budget_alert", { category, limit: formatCurrency(limitNum) })'
  );

  return code;
});

// SubscriptionPanel
replaceInFile('src/components/SubscriptionPanel.tsx', (code) => {
  if (!code.includes('import { formatCurrency }')) {
    code = code.replace('import { motion } from "motion/react";', 'import { motion } from "motion/react";\nimport { formatCurrency } from "../utils/format";\nimport { useTranslation } from "react-i18next";');
  }

  if (!code.includes('const { t } = useTranslation()')) {
    code = code.replace(/export default function SubscriptionPanel.*\{/, (match) => match + '\n  const { t } = useTranslation();');
  }

  code = code.replace(/>R\$ 0</, '>{formatCurrency(0)}<');
  code = code.replace(/>R\$ 9,90</, '>{formatCurrency(9.90)}<');

  return code;
});

// DashboardCharts
replaceInFile('src/components/DashboardCharts.tsx', (code) => {
  if (!code.includes('import { formatCurrency }')) {
    code = code.replace('import { motion } from "motion/react";', 'import { motion } from "motion/react";\nimport { formatCurrency } from "../utils/format";\nimport { useTranslation } from "react-i18next";');
  }

  if (!code.includes('const { t } = useTranslation()')) {
    code = code.replace(/export default function DashboardCharts.*\{/, (match) => match + '\n  const { t } = useTranslation();');
  }

  code = code.replace(/>Visão Geral</, '>{t("dashboard_overview")}<');
  code = code.replace(/>Total Gasto</, '>{t("total_expenses")}<');
  code = code.replace(/>Gastos por Categoria</, '>{t("expense_by_category")}<');

  code = code.replace(/R\$ \{totalExpenses\.toFixed\(2\)\}/g, '{formatCurrency(totalExpenses)}');

  return code;
});

