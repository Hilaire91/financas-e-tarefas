const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

code = code.replace('import { motion, AnimatePresence } from "motion/react";', 'import { motion, AnimatePresence } from "motion/react";\nimport { useTranslation } from "react-i18next";');

if (!code.includes('const { t, i18n } = useTranslation();')) {
  code = code.replace('export default function App() {\n', 'export default function App() {\n  const { t, i18n } = useTranslation();\n');
}

code = code.replace(/>Visão Geral</g, '>{t("tab_dashboard")}<');
code = code.replace(/>Tarefas</g, '>{t("tab_tasks")}<');
code = code.replace(/>Lembretes</g, '>{t("tab_reminders")}<');
code = code.replace(/>Orçamentos & IA</g, '>{t("tab_budgets")}<');
code = code.replace(/>Planos</g, '>{t("tab_subscription")}<');
code = code.replace(/>Olá, /g, '>{t("greeting")}, <');
code = code.replace(/>Sair</g, '>{t("logout")}<');
code = code.replace(/Finanças & Tarefas — SaaS de Controle Financeiro Inteligente/, '{t("app_name")} — SaaS de Controle Financeiro Inteligente');
code = code.replace(/Finanças & Tarefas/g, '{t("app_name")}');

fs.writeFileSync('src/App.tsx', code);
